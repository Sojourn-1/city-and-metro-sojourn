# 原版「口岸 / 城市连接（cityLink）」功能整理

> 依据：原版 3.0 源码（`upstream3/city-and-metro-main`）。口岸在本作里叫**接驳口（gate）**，属于「城市连接 cityLink」机制，v2.7 加入。

## 一、它解决什么问题

相邻的两张地图**各算各的**，但在边境设「接驳口」。接通后：

1. 过境旅客可以坐地铁进出（计入客流）；
2. 可以单独设**跨境附加费**（元/人次），计入票款并单列账目；
3. 可以**切换到对岸**（只切换同一模式的存档：经营挑战↔经营挑战、自由建造↔自由建造）；
4. 地图上半透明显示**对岸最新存档的线网**（只读，不参与模拟）。

## 二、数据写法（每个城市自己声明）

在 `js/data_<城市>.js` 的 `traits` 里加一条 `cityLink`（示例：深圳，`data_sz.js`）：

```js
{ use: 'cityLink', icon: 'bridge', label: '深港连接', map: 'hk', name: '香港',
  ach: '深港一线', region: 'hk',
  gates: [
    { id: 'sz_gate_lw', n: '罗湖接驳口', to: '香港 · 罗湖', at: ll(22.5318, 114.1122),
      dir: 'S', y: [2003, 8], pax: [[2003.6, 1], [2010, 2], [2019, 2.5]],
      title: '内地居民赴港个人游开放', desc: '…', tag: '史实', note: '…' },
    // 福田、深圳湾…
  ],
  why: '罗湖、福田都有铁路与香港相接；两张图各算各的，时间也不同步。' }
```

对岸（香港）也必须有一条 `map: 'sz'` 的 `cityLink` 指回来。

### 字段

| 字段 | 含义 |
| --- | --- |
| `map` | 对岸地图 id |
| `name` | 对岸名称（界面显示） |
| `region` | 对岸城市**在本图内**的片区 id：接通后点击该片区可进入对岸 |
| `ach` | 可选：接通时解锁的成就 |
| `gates[]` | 一个或多个接驳口 |
| `gates[].id / n` | 设施 id / 名称 |
| `gates[].to` | 去向文字（"香港 · 罗湖"） |
| `gates[].at` | 位置 `ll(纬度, 经度)`，应贴地图边缘 |
| `gates[].dir` | 地图边：`N/S/E/W` |
| `gates[].y` | 开放年月 `[年, 月]` |
| `gates[].pax` | 客流曲线 `[[年, 万人/日], …]` |
| `gates[].title/desc/tag` | 可选：开放时自动生成一条事件（写进纪事/年表） |
| `gates[].note` | 可选：设施说明 |

## 三、编译与校验

- `traits.js` 的 `cityLink.build()`：把每个接驳口塞进 `D.facilities`，形如
  `{ id, n, t:'rail', gate:true, ext:[dir, 0], to, at, y0:y, pax, note }`；
  然后写 `D.cityLink = { map, name, gates:[ids], ach, region }`；有 `title` 的生成 `eventAt`。
- 校验（`Traits.validate`）：
  - 对岸地图必须存在，且对岸的 `cityLink.map` 必须指回本图（**双向声明**）；
  - 每个 gate 必须有 `at`、`pax`、`to`，`y` 在合理年份范围；
  - `region` 必须是本图已存在的片区 id。

## 四、运行时：怎样算「接通」

`js/facility.js`

| 函数 | 作用 |
| --- | --- |
| `Fac.portal(f)` | 接驳口「门」的位置：取地图边界外 0.1 格，带法向 `v` |
| `Fac.isPortalStation(st, f)` | 车站距接驳口 < 1 格（250 m）即算接驳口车站；v2.7.1 起，普通车站紧贴接驳口也算 |
| `Fac.extLink(f, g)` | 找最近的**已运营**车站（接驳口站优先，距离 0），结果缓存在 `C._ext`；未接通返回 `null` |
| `Fac.gateStations(f, C)` | 接驳口可接驳的运营车站，按距离排序，供客流分配 |
| `Fac.active(f, yr, city)` | 接驳口是否已开放（未到 `y0` 不接通） |

所以玩法是：**把线路修到接驳口 250 m 内并在接驳口上建站 → 确认建设 → 口岸「已接通」**。

## 五、客流与收费

- `sim.js`
  - 每个接驳口作为一个额外引力点（`Z + k` 号「特殊小区」），把口岸客流分配到最近车站；
  - 步行/换乘时间 = `1 + crossMin(f)`；
  - `Model.crossMin(f)`：跨境附加费 > 0 时，按费用折算成额外分钟，影响方式选择（收费越高，越少人走这条口岸）。
- `economy.js`
  - `Economy.cross = { [facilityId]: 元/人次 }` 保存跨境附加费；
  - 日结时 `cross × 客流` 计入票款，并单列 `crossFee`（账目里显示"其中跨境附加费"）。
- `game.js`：每帧/每次结算把 `econ.cross` 传给 `model.crossFee`。

## 六、切换对岸与线网叠加（`js/citylink.js`）

| 函数 | 作用 |
| --- | --- |
| `latest(mode)` | 找对岸**同模式**的最新存档（备份存档不算） |
| `switchTo(ui)` | 先保存当前进度 → 加载对岸同模式存档；没有就打开对岸的选图页 |
| `at / hoverTip / offer` | 接通后，鼠标移到本图内的对岸片区会提示「进入 XX」，点击弹确认框后切换 |
| `refresh / tick` | 读取对岸最新存档线网（`Save.linePreview`），按经纬度换算到本图，只保留落在地图范围内的部分 |
| `draw` | 以约 55% 透明度叠加对岸线网（轨道 + 车站），可用 `localStorage['cm1.linkOverlay']` 关闭 |

对岸线网**只读**：不参与本图模拟，也不写入本图存档。

## 七、界面

| 位置 | 内容 |
| --- | --- |
| `render.js` | `drawPortals`：接驳口车站在图边画成双向箭头；`drawExtFacility`：口岸图标、外环、标签（「已接通 / 未接通」）；`gateGeom`：口岸几何与朝向 |
| `tools.js` | 鼠标悬停接驳口时的提示；可在接驳口建站并连线；点对岸片区进入对岸（`CityLink.offer`） |
| `pages.js` | 设施详情页：口岸状态、接驳指引、「250 米内建站」提示、跨境附加费入口 |
| `opsapp.js` | 新增「**口岸管理**」页（`navs.gates`）：只列已开放的口岸，显示接通数与客流 |
| `sim.js` / `economy.js` | 见上 |

## 八、限制与注意

1. **必须双向声明**，否则 `Traits.validate` 直接报错（地图不能加载）；
2. 只切换**同模式**存档，备份存档不参与；
3. 口岸本质是 `t:'rail'` 的设施，会出现在设施列表、任务与统计里；
4. 口岸开放前不能接通；接通判定只看 250 m 内的运营车站，**不需要有道路**；
5. 没有 `cityLink` 的地图完全不受影响（`CM.CityLink` 空转）。

## 九、给苏锡常加口岸的最小改动

不用改引擎，只要在数据里写 `cityLink`：

1. `data_wx.js` 加一条 `map:'su'` 的 `cityLink`，`gates` 放在无锡东/硕放一侧；
2. `data_su.js` 加一条 `map:'wx'` 的 `cityLink` 指回来（`region` 可填苏州图里的「无锡新吴区（硕放）」片区）；
3. 两边 `gates` 的 `at` 用 `ll(lat, lon)` 贴各自地图边缘，`y` 写开放年月，`pax` 写客流曲线；
4. 跑 `node scripts/build.mjs`，`Traits.validate` 会检查互指与字段完整性。
