# 部署「城市与地铁 · 无锡社区版」到网站

本目录是社区修改版：在原版 v2.9.6 的基础上新增了**无锡大市（`wx`，含江阴、宜兴，2000 年开局）**地图，另加入 160 km/h 线路速度等级与市域 C 型车，其余内容与原版一致。

## 当前线上地址（已部署到 Cloudflare Pages）

- 生产地址：**https://city-and-metro-sojourn.pages.dev**
- 项目名：`city-and-metro-sojourn`（Cloudflare Pages，生产分支 `main`）

更新线上内容：

```powershell
cd city-and-metro-sojourn-main
node scripts/build.mjs
npx wrangler pages deploy dist --project-name=city-and-metro-sojourn --branch=main --commit-dirty=true
```

> 首次部署时 wrangler 需要 `wrangler login`（浏览器授权）。若本机没有全局 wrangler，可先 `npm i -g wrangler`，或用本文档末尾的本地安装方式。

许可证要求（务必保留）：

- 原作者：[VinsonFung](https://github.com/VinsonFung)
- 原版网站：[城市与地铁](https://city-and-metro.pages.dev)
- 原始仓库：[VinsonFung/city-and-metro](https://github.com/VinsonFung/city-and-metro)
- **严禁商业使用**：不得收费、出售、投放广告或接受商业赞助；站点醒目位置需标明「社区修改版」。游戏开始界面底部已加入该声明。

## 一、生成发布产物

```powershell
cd city-and-metro-sojourn-main
node scripts/build.mjs
```

产物在 `city-and-metro-sojourn-main/dist/`（约 45 MB、117 个文件），是一个**纯静态站点**，没有任何服务端依赖，也不需要构建环境。`dist/` 里已经包含：

- `index.html`、`css/`、`img/`、`js/`（含 `js/geo_wx.js`、`js/data_wx.js`）
- `404.html`、`_headers`（Cloudflare Pages / Netlify 会用到的缓存与安全头）
- `game-manifest.json`（版本、地图清单与全部文件哈希）

本地预览：

```powershell
node tools/serve.mjs 8123
# 浏览器打开 http://127.0.0.1:8123
```

> 直接双击 `dist/index.html` 也能玩（`file://`），但按需加载的地图脚本在部分浏览器下会被拦截，正式体验请用上面的服务器或部署到网站。

## 二、方案 A：Cloudflare Pages（推荐，仓库已附 `wrangler.jsonc`）

### A1. 命令行部署（Wrangler）

```powershell
npm install -g wrangler          # 或 npx wrangler
wrangler login                   # 浏览器授权
cd city-and-metro-sojourn-main
wrangler pages deploy dist --project-name=city-and-metro-sojourn
```

首次部署会创建项目，随后输出形如 `https://city-and-metro-sojourn.pages.dev` 的网址。后续更新只需重跑 `node scripts/build.mjs` 与最后一条 `wrangler pages deploy`。

### A2. 网页上传（无需命令行）

1. 打开 <https://dash.cloudflare.com/> → **Workers & Pages** → **Create** → **Pages** → **Upload assets**。
2. 项目名例如 `city-and-metro-sojourn`，把 `dist` 目录里的**全部文件**拖进去（注意是 `dist` 里的内容，不是 `dist` 这层文件夹）。
3. 点 **Deploy**，几十秒后得到 `https://<项目名>.pages.dev`。

可选：给项目绑定自定义域名（Pages → Custom domains），并在 DNS 里加 CNAME。

## 三、方案 B：其他静态托管

| 平台 | 做法 | 备注 |
| --- | --- | --- |
| Netlify | 把 `dist` 拖到 <https://app.netlify.com/drop> | 免费额度足够，国内访问一般 |
| Vercel | `vercel --prod dist` 或在面板导入仓库 | 需 `vercel` CLI 与账号 |
| GitHub Pages | 把 `dist` 内容推到 `gh-pages` 分支，仓库设置里选该分支为 Pages 源 | 国内访问不稳定 |
| 阿里云 OSS / 腾讯云 COS | 上传 `dist` 全部文件，开启静态网站托管，首页设为 `index.html` | 国内访问快，需备案域名 |
| 自己的服务器 | 把 `dist` 放到 Nginx 的站点根目录 | 见下方 Nginx 片段 |

Nginx 片段：

```nginx
server {
  listen 80;
  server_name metro.example.com;
  root /var/www/city-metro/dist;
  index index.html;
  location / { try_files $uri $uri/ =404; }
  location ~* \.(js|css|png|webp)$ { add_header Cache-Control "public, max-age=0, must-revalidate"; }
}
```

## 四、部署后自检

1. 打开站点，主菜单底部应显示「社区修改版 · 新增无锡地图」。
2. 「开始游戏 → 选择地图」里能找到**无锡**（中国内地 / 2000 年代，难度 2，与武汉同档）。
3. 进入无锡：太湖、京杭运河、蠡湖与城区路网应正常显示；`经营挑战` 下可用人民币建线、建站。
4. 设置里切到 English，城市名应显示 **Wuxi**。
5. 打开浏览器控制台不应有红色报错；网络面板里 `js/geo_wx.js` 应返回 200。

## 五、常见问题

- **地图列表里没有无锡**：`index.html` 里的两行脚本被删了或顺序错了。必须包含
  `<script src="js/geo_wx.js" type="application/city-metro-geo"></script>`（属性顺序、`type` 逐字固定）与
  `<script src="js/data_wx.js"></script>`，且都在 `js/traits.js`、`js/maps.js` 之前。
- **进入无锡提示「地图数据载入失败」**：`js/geo-index.js` 与 `js/geo_wx.js` 不匹配（改过地理数据却忘了重新构建）。重跑 `node scripts/build.mjs`。
- **改了代码后站点没变化**：`dist` 没重建。`build.mjs` 会重写 `js/legal.js`、`js/geo-index.js`、`js/sim-stamp.js`、`game-manifest.json` 并校验全部资源哈希。
- **想改无锡地图内容**：城市数据在 `js/data_wx.js`（片区、地标、设施、事件、任务、造价与人口曲线），地理数据由 `tools/build-geo.mjs` 从 `tools/osm-cache/wx/` 的 OSM 原始数据生成。

## 六、本次部署的实际执行方式（备查）

本机没有全局 Node/npm，wrangler 装在 `city-and-metro/deploy-tool/`：

```powershell
# 1) 安装（使用工作区自带的 Node 与 pnpm）
cd city-and-metro\deploy-tool
node C:\Users\ASUS\.dsh\dsh-runtimes\dsh-primary-runtime\dependencies\pnpm\bin\pnpm.cjs add wrangler

# 2) 登录（浏览器授权，回调 localhost:8976）
node node_modules\wrangler\wrangler-dist\cli.js login

# 3) 创建项目（仅第一次）
node node_modules\wrangler\wrangler-dist\cli.js pages project create city-and-metro-sojourn --production-branch=main

# 4) 上传发布产物
node node_modules\wrangler\wrangler-dist\cli.js pages deploy ..\city-and-metro-sojourn-main\dist --project-name=city-and-metro-sojourn --branch=main --commit-dirty=true
```

注意：wrangler 会启动 esbuild 子进程，在 DSH 沙箱内会报 `spawn EPERM`，需要在放宽文件/进程权限的模式下执行；`bin\wrangler.js` 包装脚本也会 spawn 子进程，可直接调用 `wrangler-dist\cli.js`。
