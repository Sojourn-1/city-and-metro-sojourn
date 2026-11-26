'use strict';
// 苏州 · 2010 场景。地理来自 OpenStreetMap（geo_su.js，现代数据），本文件补充 2010 年起的区域开放（按街道与区划分）、
// 跨运河与跨湖桥隧、快速路通车年份、人口就业中心、地标、重要设施、历史事件、本地任务与人民币经营参数。坐标单位为格（250 m）。
// 本文件的经纬度按 OSM 的 WGS-84 填写（不套 GCJ-02 换算），用 ll(纬度, 经度) 投影。
// 真实性：吴江撤市设区、苏州工业园区与高新区、沪宁城际与京沪高铁、沪苏通铁路、沪苏湖高铁、苏州轨道交通各线通车年份、
// 地标落成年份为史实参考；2010 年人口与就业分布、增长曲线、造价、票价与拨款为估算；2020 年之后为模拟。
(function (CM) {
  const G = CM.GEOS && CM.GEOS.su; if (!G) return;
  const P = G.proj;
  // 纯投影：本文件所有经纬度都是 OSM 使用的 WGS-84
  const ll = function (lat, lon) { return [+((lon - P.lon0) * P.kx).toFixed(2), +((P.lat0 - lat) * P.ky).toFixed(2)]; };
  const at = function (lat, lon, o) { const p = ll(lat, lon); return Object.assign({ x: p[0], y: p[1] }, o); };
  const poly = function (pts) { return pts.map(function (p) { return ll(p[0], p[1]); }); };
  const anchor = function (name, lat, lon, r) { const p = ll(lat, lon); return { name: name, x: p[0], y: p[1], r: r }; };

  // 风景区范围（不能开发，只能地下穿过或绕行）：太湖东西山、石湖与上方山、阳澄湖
  const taihu = poly([[31.0000, 120.3300], [31.0000, 120.4400], [31.1600, 120.4400], [31.1600, 120.3300]]);
  const shihu = poly([[31.2380, 120.5820], [31.2380, 120.6120], [31.2740, 120.6120], [31.2740, 120.5820]]);
  const yangcheng = poly([[31.3700, 120.7200], [31.3700, 120.8400], [31.4600, 120.8400], [31.4600, 120.7200]]);
  // 老城中心（镜头与标注用）
  const CAM0 = ll(31.3050, 120.6350);

  const data = {
    // 城市特色（traits.js）：新条目加在末尾，已触发事件按序号记录
    traits: [
      { use: 'crossing', star: true, icon: 'bridge', label: '运河、娄江与太湖', text: '京杭运河、娄江、吴淞江与太湖把城区分成几片，跨河跨湖段造价明显更高', why: '苏州因运河而生，老城被运河与护城河环抱，园区、新区与吴江之间又隔着金鸡湖、独墅湖与太湖，跨水通道一直是建设的重点。' },
      { use: 'scenic', star: true, icon: 'wave', label: '太湖与石湖', text: '太湖、石湖与阳澄湖不能开发，跨湖段只能走地下，还要另付环境费', why: '太湖是国家重点风景名胜区，石湖与上方山、阳澄湖是环湖生态与风景岸线，开发强度长期受限。' },
      { use: 'foresight', level: 'mid', star: true, icon: 'chart', label: '园区提前布局', text: '园区新一轮开发前就通地铁，能得到开发商出资，片区也长得更快', id: 'su-sip', pos: ll(31.3150, 120.6850), ym: [2015, 1], before: 2013, r: 7, region: 'yuanqu', title: '苏州工业园区进入新一轮开发',
        hit: '园区新一轮开发启动，早已通车的{st}站让这里一下子有了人气。', miss: '园区新一轮开发启动，可这里还没有地铁，通勤只能靠现代大道与公交。',
        why: '1994 年动工的中新合作苏州工业园区在 2000 年代中后期由金鸡湖西转向湖东与独墅湖，是苏州增长最快的片区。' },
      { use: 'transition', level: 'light', label: '新区老工业用地转型', region: 'xinqu', close: { y: 2013, m: 6, title: '新区「退二进三」，老厂区搬迁', desc: '6 月，狮山与枫桥一带的纺织、机械与电子老厂陆续搬迁，老厂区改作居住与商业用地。' }, replan: [{ year: 2015, region: 'xinqu', plan: 'mix' }], why: '2010 年代苏州高新区推进「退二进三」，狮山片区的工业用地逐步转为居住与服务业用地。' },
      { use: 'guard', level: 'light', label: '古典园林', guards: ['su_zhuozheng', 'su_liuyuan', 'su_shizilin', 'su_wangshiyuan', 'su_panmen'], why: '拙政园、留园、狮子林、网师园与盘门是苏州的古典园林与世界遗产，周边只能走地下。' },
      { use: 'finance', flavor: 'cn' },
      { use: 'cityLink', icon: 'bridge', label: '苏锡口岸', map: 'wx', name: '无锡', region: 'xinwu',
        gates: [
          { id: 'su_gate_sf', n: '硕放接驳口', to: '无锡 · 硕放机场', at: ll(31.5042, 120.4271), dir: 'W', y: [2010, 7], pax: [[2010.5, 0.5], [2018, 1.2], [2030, 1.8]], free: true, note: '硕放机场一侧，接无锡地铁。' },
          { id: 'su_gate_eh', n: '鹅湖接驳口', to: '无锡 · 鹅湖', at: ll(31.5301, 120.5452), dir: 'W', y: [2015, 1], pax: [[2015.5, 0.4], [2025, 0.9]], free: true, note: '相城与无锡鹅湖之间。' },
        ],
        why: '苏州与无锡之间在硕放、鹅湖各设一处口岸，接通后可乘地铁过境、切换到无锡，不另收跨境附加费。' },

    ],
    city: '苏州', terrainRevision: 1, riverName: '京杭运河', hsrYear: 2010,
    stages: [[2013, '古城与园区'], [2017, '地铁网络'], [2021, '市域一体化']], stageLast: '沪苏同城',
    // 历史发展阶段（eras.js）：summary 中「史实」可查证，「估算」为模型设定的发展倾向
    eras: [
      { id: 'su-e1', from: 2010, name: '古城与园区', tag: '史实',
        summary: '史实：2010 年沪宁城际通车、苏州园区站启用，园区由金鸡湖西转向湖东与独墅湖；2012 年 4 月轨道交通 1 号线通车，2012 年 9 月吴江撤市设区，2013 年 12 月 2 号线通车。估算：园区与新区是新增居住与就业的主要去处，古城人口趋于饱和，吴江、昆山、常熟、张家港与太仓仍是各自独立的县级市，开局时尚无地铁。',
        grow: { pop: { yuanqu: 1.7, xinqu: 1.4, wujiang: 1.35, xiangcheng: 1.2, guanqian: 0.7 }, jobs: { yuanqu: 1.8, xinqu: 1.5, guanqian: 1.0, kunshan: 1.25, wujiang: 1.25 } },
        demand: { sc: 1.05, decayHW: 1.05, hub: 1.1 },
        corridors: [{ a: 'yuanqu', b: 'guanqian', f: 1.2 }, { a: 'xinqu', b: 'guanqian', f: 1.15 }],
        goals: [{ id: 'su-g1', type: 'connect', months: 48, reward: 50000, title: '湖东的上班路', desc: '园区的写字楼与工厂都往湖东集中，员工多住在古城与吴中。用地铁连接湖东、湖西与观前。', anchors: [anchor('园区湖东', 31.3170, 120.7080, 4), anchor('观前街', 31.3100, 120.6209, 3)] },
          { id: 'su-g2', type: 'regionCov', regions: ['yuanqu'], areaName: '苏州工业园区', target: 0.2, months: 60, reward: 50000, title: '园区的覆盖', desc: '园区的集成电路、生物医药与服务业企业越来越多，让园区两成居民步行就能到地铁站。' }] },
      { id: 'su-e2', from: 2014, name: '地铁网络', tag: '史实',
        summary: '史实：2017 年 4 号线及支线通车，把吴江与古城连起来；2019 年 8 月江苏自贸区苏州片区在园区挂牌，2019 年 12 月 3 号线通车。估算：吴江、相城与高铁新城成为新的增长点，园区湖东 CBD 成形，跨湖与跨市通勤增加。',
        grow: { pop: { wujiang: 1.6, yuanqu: 1.5, xiangcheng: 1.4, gaotie: 1.5, wuzhong: 1.3, guanqian: 0.6 }, jobs: { yuanqu: 1.6, xinqu: 1.4, wujiang: 1.4, kunshan: 1.4, guanqian: 0.9 } },
        relocate: { jobs: { guanqian: 0.0005 } },
        demand: { sh: 1.05, lz: 1.08, decayHW: 1.15, hub: 1.1 },
        corridors: [{ a: 'wujiang', b: 'guanqian', f: 1.25 }, { a: 'yuanqu', b: 'wujiang', f: 1.15 }, { a: 'kunshan', b: 'yuanqu', f: 1.1 }],
        goals: [{ id: 'su-g3', type: 'connect', months: 48, reward: 50000, title: '吴江进城的路', desc: '吴江撤市设区后，松陵与太湖新城的居民大批到古城与园区上班，只能走苏震桃公路。用地铁把吴江接进老城。', anchors: [anchor('吴江松陵', 31.1550, 120.6400, 5), anchor('南门', 31.2950, 120.6180, 3)] },
          { id: 'su-g4', type: 'regionCov', regions: ['wujiang'], areaName: '吴江', target: 0.2, months: 60, reward: 50000, title: '吴江的覆盖', desc: '太湖新城与松陵的住宅成片入住，让吴江两成居民步行就能到地铁站。' }] },
      { id: 'su-e3', from: 2019, name: '市域一体化', tag: '史实',
        summary: '史实：2020 年 7 月沪苏通铁路通车，常熟、张家港与太仓同时进入铁路时代；2021 年 6 月 5 号线通车；2023 年 6 月 11 号线通车，昆山与上海 11 号线在花桥衔接。估算：就业继续向园区、昆山与太仓扩散，县市之间与往上海的跨市通勤成为日常。',
        grow: { pop: { kunshan: 1.5, changshu: 1.35, taicang: 1.4, wujiang: 1.35, yuanqu: 1.3, guanqian: 0.7 }, jobs: { yuanqu: 1.4, kunshan: 1.4, wujiang: 1.3, taicang: 1.25, guanqian: 0.8 } },
        relocate: { jobs: { guanqian: 0.0004 } },
        demand: { lz: 1.1, decayHW: 1.15, hub: 1.05 },
        corridors: [{ a: 'kunshan', b: 'yuanqu', f: 1.2 }, { a: 'huaqiao', b: 'yuanqu', f: 1.2 }, { a: 'taicang', b: 'kunshan', f: 1.15 }],
        goals: [{ id: 'su-g5', type: 'connect', months: 48, reward: 55000, title: '昆山接上海', desc: '11 号线通车后，昆山城区、花桥与上海 11 号线连成一条走廊。用地铁把昆山城区与花桥连起来。', anchors: [anchor('昆山城区', 31.3850, 120.9800, 5), anchor('花桥', 31.3100, 121.1000, 4)] },
          { id: 'su-g6', type: 'regionCov', regions: ['kunshan'], areaName: '昆山', target: 0.2, months: 60, reward: 55000, title: '昆山的覆盖', desc: '昆山与花桥的通勤人口越来越多，让昆山两成居民步行就能到地铁站。' }] },
      { id: 'su-e4', from: 2024, name: '沪苏同城', tag: '模拟',
        summary: '史实：2023 年 6 月苏州地铁 11 号线开通，昆山花桥与苏州工业园区直连；2024 年 6 号线、8 号线与 7 号线先后通车，2024 年 12 月沪苏湖高铁与苏州南站启用。估算：就业向园区、昆山与太仓继续扩散，苏州与上海之间的跨市通勤成为日常，古城保持稳定。',
        grow: { pop: { taicang: 1.4, kunshan: 1.35, changshu: 1.25, zhangjiagang: 1.2, wujiang: 1.3, yuanqu: 1.25, guanqian: 0.7 }, jobs: { yuanqu: 1.35, kunshan: 1.35, taicang: 1.3, wujiang: 1.25, guanqian: 0.8 } },
        relocate: { jobs: { guanqian: 0.0004 } },
        demand: { lz: 1.1, decayHW: 1.15 },
        corridors: [{ a: 'kunshan', b: 'yuanqu', f: 1.2 }, { a: 'taicang', b: 'kunshan', f: 1.15 }],
        goals: [{ id: 'su-g7', type: 'connect', months: 48, reward: 60000, title: '太仓与昆山之间', desc: '太仓城区与昆山城区之间的通勤越来越多，市域一体化要求把两座城连成一张网。用地铁连接太仓城区与昆山城区。', anchors: [anchor('太仓城区', 31.4520, 121.0950, 5), anchor('昆山城区', 31.3850, 120.9800, 5)] },
          { id: 'su-g8', type: 'regionCov', regions: ['taicang'], areaName: '太仓', target: 0.15, months: 72, reward: 55000, title: '太仓的覆盖', desc: '太仓城区与港区的通勤人口增加，让太仓一成半居民步行就能到地铁站。' }] },
    ],
    briefing: {
      lead: '2010 年的苏州还没有地铁。城市沿京杭运河与干将路展开，观前街与石路是最热闹的地方，园区已经跨过金鸡湖长到湖东与独墅湖，新区在狮山一带集聚了电子与机械企业，吴江、昆山、常熟、张家港与太仓仍是各自独立的县级市。公交、自行车与电动车是主要出行方式。',
      modes: [
        ['metro', '地铁', '尚无地铁。现实中 1 号线 2012 年 4 月才通车，本局由你规划，真实线路不会自动出现。'],
        ['bus', '公交与自行车', '人民路与干将路的公交高峰期十分拥挤，自行车与电动车仍是通勤主力。'],
        ['bridge', '过河与跨湖', '运河、娄江把古城分成几片，跨太湖、石湖与阳澄湖只有几条通道，绕行很远。'],
        ['rail', '铁路', '苏州站、苏州园区站与昆山南站承担对外铁路交通。列车本身不参与模拟，车站会产生市内接驳出行，地面铁路会阻隔步行。'],
      ],
    },
    airport: null,
    runways: [],
    regions: [
      // 风景区：太湖东西山、石湖与上方山、阳澄湖不能开发
      { id: 'taihu', name: '太湖（东山·西山）', scenic: true, open: null, poly: taihu, relief: 60, lockNote: '太湖风景名胜区与东西山，只能地下穿过，不能设站开发' },
      { id: 'shihu', name: '石湖·上方山', scenic: true, open: null, poly: shihu, relief: 80, lockNote: '石湖与上方山森林公园，只能地下穿过，不能设站开发' },
      { id: 'yangcheng', name: '阳澄湖', scenic: true, open: null, poly: yangcheng, relief: 0, lockNote: '阳澄湖水面与环湖生态区，只能地下穿过，不能设站开发' },
      // 片区人口门槛 pop：全图人口达到该值时提前 3 年开放，按 2010 年约 1046 万的口径取 1100 万（开局即开放的片区不受影响）
      // 古城：姑苏区（2012 年平江、沧浪、金阊三区合并为姑苏区）
      { id: 'guanqian', name: '观前·平江（古城中心）', district: ['姑苏区'], seed: ll(31.3160, 120.6260), seedW: 1.2, seedIn: ['姑苏区'], streets: ['平江街道', '苏锦街道', '观前街道'], open: 2010, plan: 'oldmix', note: '观前街、玄妙观与平江路一带是苏州的传统商业中心（史实）' },
      { id: 'panmen', name: '沧浪·双塔（盘门·南门）', district: ['姑苏区'], seed: ll(31.2965, 120.6180), seedW: 1.15, seedIn: ['姑苏区'], streets: ['沧浪街道', '双塔街道', '吴门桥街道', '友新街道'], open: 2010, plan: 'res', note: '盘门、沧浪亭与南门一带是古城的南半部（史实）' },
      { id: 'jinchang', name: '金阊·石路（留园·山塘）', district: ['姑苏区'], seed: ll(31.3230, 120.5975), seedW: 1.15, seedIn: ['姑苏区'], streets: ['金阊街道', '虎丘街道', '白洋湾街道'], open: 2010, plan: 'res', note: '石路、山塘街与留园一带是古城的西北半部（史实）' },
      // 虎丘区（苏州新区·高新区）
      { id: 'xinqu', name: '新区（狮山·枫桥）', district: ['虎丘区'], seed: ll(31.2980, 120.5610), seedW: 1.3, seedIn: ['虎丘区'], streets: ['狮山街道', '枫桥街道', '横塘街道', '浒墅关镇', '通安镇', '东渚街道', '镇湖街道'], open: 2010, plan: 'ind', growK: [1.4, 1.3], note: '1992 年设立的苏州高新区，2010 年代狮山与枫桥的电子、机械企业集中（史实）' },
      // 苏州工业园区
      { id: 'yuanqu', name: '苏州工业园区（金鸡湖·独墅湖）', district: ['苏州工业园区'], seed: ll(31.3150, 120.6800), seedW: 1.3, seedIn: ['苏州工业园区'], open: 2010, plan: 'newtown', pop: 1.10e7, note: '1994 年动工的中新合作园区，2010 年代由湖西转向湖东与独墅湖（史实）' },
      // 相城区
      { id: 'xiangcheng', name: '相城（元和·黄埭）', district: ['相城区'], seed: ll(31.3750, 120.6350), seedW: 1.4, seedIn: ['相城区'], streets: ['元和街道', '黄桥街道', '太平街道', '北桥街道', '漕湖街道'], open: 2010, plan: 'resind', note: '2001 年吴县市撤市设区，设吴中区与相城区（史实）' },
      { id: 'gaotie', name: '高铁新城（苏州北站）', district: ['相城区'], seed: ll(31.4180, 120.6390), seedW: 1.1, seedIn: ['相城区'], streets: ['北河泾街道'], open: 2010, plan: 'newtown', pop: 1.10e7, note: '2011 年京沪高铁通车、苏州北站启用，周边自 2010 年起启动高铁新城（史实）' },
      // 吴中区
      { id: 'wuzhong', name: '吴中（长桥·越溪）', district: ['吴中区'], seed: ll(31.2550, 120.6050), seedW: 1.3, seedIn: ['吴中区'], streets: ['长桥街道', '越溪街道', '郭巷街道', '城南街道', '香山街道', '横泾街道'], open: 2010, plan: 'res', note: '2001 年吴县市撤市设区，吴中区沿太湖东岸展开（史实）' },
      { id: 'mudu', name: '木渎·光福（太湖东岸）', district: ['吴中区'], seed: ll(31.2450, 120.5350), seedW: 1.3, seedIn: ['吴中区'], streets: ['木渎镇', '胥口镇', '光福镇', '东山镇', '金庭镇', '临湖镇'], open: 2010, plan: 'resind', note: '木渎是江南古镇，光福与东山沿太湖东岸（史实）' },
      { id: 'luzhi', name: '甪直·车坊（水乡东部）', district: ['吴中区'], seed: ll(31.2650, 120.8550), seedW: 1.2, seedIn: ['吴中区'], streets: ['甪直镇'], open: 2010, plan: 'res', note: '甪直古镇与澄湖一带的水乡（史实）' },
      // 吴江区
      { id: 'wujiang', name: '吴江（松陵·太湖新城）', district: ['吴江区'], seed: ll(31.1500, 120.6450), seedW: 1.3, seedIn: ['吴江区'], streets: ['松陵街道', '横扇街道', '八坼街道', '江陵街道'], open: 2012, plan: 'mix', pop: 1.10e7, note: '2012 年吴江撤市设区，松陵与太湖新城连片建设（史实）' },
      { id: 'tongli', name: '同里·黎里（水乡古镇）', district: ['吴江区'], seed: ll(31.1530, 120.7170), seedW: 1.3, seedIn: ['吴江区'], streets: ['同里镇', '黎里镇'], open: 2013, plan: 'res', note: '同里、黎里是太湖流域的水乡古镇（史实）' },
      { id: 'shengze', name: '盛泽·震泽（丝绸与省界）', district: ['吴江区'], seed: ll(30.9600, 120.6700), seedW: 1.5, seedIn: ['吴江区'], streets: ['盛泽镇', '震泽镇', '平望镇', '桃源镇', '七都镇'], open: 2014, plan: 'resind', note: '盛泽是绸都，震泽沿頔塘与浙江接壤（史实）' },
      // 昆山市
      { id: 'kunshan', name: '昆山城区（玉山·开发区）', district: ['昆山市'], seed: ll(31.3850, 120.9800), seedW: 1.5, seedIn: ['昆山市'], streets: ['玉山镇', '周市镇', '陆家镇', '张浦镇'], open: 2013, plan: 'ind', growK: [1.4, 1.4], note: '1990 年代以来台资电子企业大量进驻昆山开发区（史实）' },
      { id: 'huaqiao', name: '花桥（对接上海）', district: ['昆山市'], seed: ll(31.3100, 121.1000), seedW: 1.2, seedIn: ['昆山市'], streets: ['花桥镇'], open: 2013, plan: 'newtown', pop: 1.10e7, note: '2006 年花桥国际商务城启动，2013 年上海 11 号线通到花桥（史实）' },
      { id: 'zhouzhuang', name: '周庄·锦溪·淀山湖', district: ['昆山市'], seed: ll(31.1450, 120.8600), seedW: 1.4, seedIn: ['昆山市'], streets: ['周庄镇', '锦溪镇', '淀山湖镇', '巴城镇', '千灯镇'], open: 2014, plan: 'res', note: '周庄、锦溪古镇与淀山湖一带的旅游与水乡（史实）' },
      // 常熟市
      { id: 'changshu', name: '常熟城区（虞山·尚湖）', district: ['常熟市'], seed: ll(31.6530, 120.7480), seedW: 1.4, seedIn: ['常熟市'], streets: ['虞山街道', '琴川街道', '常福街道', '莫城街道', '尚湖镇', '辛庄镇'], open: 2017, plan: 'mix', note: '常熟城区夹在虞山与尚湖之间，纺织与服装业发达（史实）' },
      { id: 'changshu_n', name: '常熟北部（海虞·梅李·沿江）', district: ['常熟市'], seed: ll(31.7300, 120.8300), seedW: 1.5, seedIn: ['常熟市'], streets: ['海虞镇', '梅李镇', '碧溪街道', '董浜镇', '古里镇', '支塘镇', '沙家浜镇'], open: 2018, plan: 'resind', note: '沿长江的港口与乡镇企业带，沙家浜在东南（史实）' },
      // 张家港市
      { id: 'zhangjiagang', name: '张家港城区（杨舍·塘桥）', district: ['张家港市'], seed: ll(31.8700, 120.5550), seedW: 1.4, seedIn: ['张家港市'], streets: ['杨舍镇', '塘桥镇', '凤凰镇'], open: 2019, plan: 'resind', note: '张家港城区（杨舍）是苏南的乡镇工业强市（史实）' },
      { id: 'zjg_port', name: '张家港沿江（金港·锦丰）', district: ['张家港市'], seed: ll(31.9350, 120.5200), seedW: 1.4, seedIn: ['张家港市'], streets: ['金港镇', '锦丰镇', '乐余镇', '南丰镇', '大新镇'], open: 2019, plan: 'port', note: '长江南岸的张家港港与保税区，沿江重型产业带（史实）' },
      // 太仓市
      { id: 'taicang', name: '太仓城区（城厢·娄东）', district: ['太仓市'], seed: ll(31.4520, 121.0950), seedW: 1.35, seedIn: ['太仓市'], streets: ['城厢镇', '娄东街道', '陆渡街道', '双凤镇', '沙溪镇'], open: 2020, plan: 'resind', note: '太仓城区是郑和下西洋的起锚地，德资企业集中（史实）' },
      { id: 'taicang_port', name: '太仓港（浏河·浮桥）', district: ['太仓市'], seed: ll(31.6000, 121.2000), seedW: 1.4, seedIn: ['太仓市'], streets: ['浏河镇', '浮桥镇', '璜泾镇'], open: 2022, plan: 'port', note: '长江口的太仓港与浏河镇（史实）' },
      // 图内的邻市范围：线路可以穿过，不能设站
      { id: 'xinwu', name: '无锡新吴区（硕放·鹅湖）', district: ['新吴区'], streets: ['鹅湖镇', '东港镇'], open: 2020, plan: 'ind', note: '无锡新吴区、鹅湖一带位于本图范围内，2020 年开放，可接驳苏南硕放机场（示意）' },
      { id: 'wuxi', name: '无锡（境外）', district: ['梁溪区', '锡山区', '惠山区', '滨湖区', '江阴市', '宜兴市'], open: null, passOnly: true, lockNote: '无锡市，不属于苏州的建设范围：线路可以穿过，不能设站' },
      { id: 'shanghai', name: '上海（境外）', district: ['嘉定区', '宝山区', '青浦区', '松江区'], open: null, passOnly: true, lockNote: '上海市，不属于苏州的建设范围：线路可以穿过，不能设站' },
      { id: 'jiaxing', name: '嘉兴（境外）', district: ['南湖区', '秀洲区', '嘉善县', '平湖市', '桐乡市', '海盐县', '海宁市'], open: null, passOnly: true, lockNote: '嘉兴市，不属于苏州的建设范围：线路可以穿过，不能设站' },
      { id: 'nantong', name: '南通（境外）', district: ['崇川区', '通州区', '海门区', '如皋市', '启东市', '如东县', '靖江市', '泰兴市'], open: null, passOnly: true, lockNote: '长江北岸的南通与泰州，不属于苏州的建设范围：线路可以穿过，不能设站' },
      { id: 'outside', name: '周边县市（境外）', district: ['吴兴区', '南浔区', '长兴县', '安吉县', '德清县', '广陵区', '邗江区', '丹阳市', '金坛区', '溧阳市'], open: null, passOnly: true, lockNote: '苏州以外的周边县市，不属于本图建设范围：线路可以穿过，不能设站' },
    ],
    defaultRegion: { id: 'outer', name: '外围地区', open: 2012, plan: 'res', pop: 1.10e7 },
    plans: CM.DATA.plans,
    // 片区设施（商业中心、区域医院、文体公园）出现门槛的人口基准：按 2010 年大市口径（约 1046 万）
    facPopRef: 1.046e7,
    // 2010 年人口与就业中心（估算，人/km²；r 约为影响半径 km）
    centers: [
      at(31.3100, 120.6210, { pop: 40000, jobs: 42000, r: 1.2 }),   // 观前街、玄妙观
      at(31.3185, 120.5930, { pop: 26000, jobs: 18000, r: 1.1 }),   // 石路、山塘
      at(31.3266, 120.6080, { pop: 22000, jobs: 16000, r: 1.0 }),   // 苏州站、北寺塔
      at(31.2950, 120.6180, { pop: 30000, jobs: 14000, r: 1.1 }),   // 南门、盘门
      at(31.3160, 120.6330, { pop: 28000, jobs: 12000, r: 1.1 }),   // 平江路、双塔
      at(31.3050, 120.6700, { pop: 16000, jobs: 22000, r: 1.4 }),   // 园区湖西、中央公园
      at(31.3170, 120.7080, { pop: 12000, jobs: 26000, r: 1.5 }),   // 园区湖东 CBD
      at(31.2750, 120.7350, { pop: 8000, jobs: 9000, r: 1.3 }),     // 独墅湖高教区
      at(31.2950, 120.5590, { pop: 14000, jobs: 20000, r: 1.5 }),   // 新区狮山
      at(31.3400, 120.5400, { pop: 9000, jobs: 12000, r: 1.5 }),    // 枫桥、浒墅关
      at(31.2650, 120.6050, { pop: 12000, jobs: 8000, r: 1.3 }),    // 吴中长桥
      at(31.2570, 120.5170, { pop: 8000, jobs: 6000, r: 1.3 }),     // 木渎
      at(31.3700, 120.6300, { pop: 8000, jobs: 6000, r: 1.5 }),     // 相城元和
      at(31.4187, 120.6385, { pop: 2500, jobs: 2500, r: 1.2 }),     // 苏州北站、高铁新城（2011 前为郊野）
      at(31.1550, 120.6400, { pop: 18000, jobs: 15000, r: 1.5 }),   // 吴江松陵
      at(31.1530, 120.6900, { pop: 5000, jobs: 8000, r: 1.3 }),     // 吴江开发区、同里
      at(30.9020, 120.6580, { pop: 9000, jobs: 11000, r: 1.3 }),    // 盛泽
      at(31.3850, 120.9800, { pop: 26000, jobs: 28000, r: 1.8 }),   // 昆山玉山
      at(31.3100, 121.1000, { pop: 5000, jobs: 6000, r: 1.5 }),     // 花桥
      at(31.6530, 120.7480, { pop: 22000, jobs: 20000, r: 1.8 }),   // 常熟虞山
      at(31.8700, 120.5550, { pop: 16000, jobs: 15000, r: 1.6 }),   // 张家港杨舍
      at(31.4520, 121.0950, { pop: 12000, jobs: 10000, r: 1.5 }),   // 太仓城厢
    ],
    rural: { pop: 550, jobs: 140 },
    // 铁路通车年份（线路名或前缀 → 年份，或 [通车, 停运]）
    railYears: { '京沪线': 1908, '沪宁线': 1908, '京沪高速线': 2011, '京沪高铁': 2011, '沪宁城际线': 2010, '沪宁城际': 2010, '沪苏通线': 2020, '沪苏通铁路': 2020, '南沿江高速线': 2023, '沪宁沿江高速线': 2023, '沪苏湖高速线': 2024, '沪苏湖高铁': 2024, '通苏嘉甬高速线': 2027, '通苏嘉甬铁路': 2027 },
    // 道路通车年份（名称完全相同或前缀匹配；未列出的道路随所在片区开放）
    roadYears: {
      '人民路': 1950, '观前街': 1950, '十全街': 1950, '凤凰街': 1950, '干将东路': 1994, '干将西路': 1994, '干将路': 1994,
      '三香路': 1980, '竹辉路': 1985, '道前街': 1950, '景德路': 1950, '东环路': 1995, '西环路': 1995, '南环路': 1998,
      '北环路': 1998, '内环高架': 2003, '南环快速路': 2003, '中环快速路': 2015, '友新路': 2002, '吴中大道': 2004,
      '星湖街': 1998, '现代大道': 1996, '中新大道': 2001, '金鸡湖大道': 2000, '独墅湖大道': 2005, '苏州大道': 2007,
      '太湖大道': 2003, '相城大道': 2002, '阳澄湖大道': 2008, '苏震桃公路': 2006, '沪宁高速': 1996, '苏嘉杭高速': 2002,
      '绕城高速': 2004, '沿江高速': 2004, '沪常高速': 2010, '常嘉高速': 2018, '苏虹路': 2003, '唯新路': 2004,
    },
    bridgeYears: {
      '宝带桥': 816, '枫桥': 1865, '觅渡桥': 1300, '吴门桥': 1080, '万年桥': 1952, '人民桥': 1951, '平门桥': 1986,
      '齐门桥': 1987, '娄门桥': 1979, '相门桥': 1980, '竹辉桥': 1988, '新市桥': 1990, '团结桥': 1995, '太湖大桥': 1994,
      '金鸡湖大桥': 2003, '独墅湖隧道': 2007, '阳澄湖大桥': 2007, '沪苏通长江大桥': 2020,
    },
    bridgeDefaultYear: 1985,
    linkRoadYears: true,
    simRoads: [],
    regionOpenRevision: 1,   // 片区开放年份修订号：读档时据此关闭「数据里改晚、且还没有车站」的片区
    landmarks: [
      Object.assign(at(31.3265, 120.6247), { id: 'su_zhuozheng', name: '拙政园', w: 320, d: 240, year: 1509, kind: 'traditional' }),
      Object.assign(at(31.3182, 120.5855), { id: 'su_liuyuan', name: '留园', w: 260, d: 200, year: 1593, kind: 'traditional' }),
      Object.assign(at(31.3387, 120.5762), { id: 'su_huqiu', name: '虎丘（云岩寺塔）', w: 420, d: 360, year: 961, kind: 'pagoda', h: 47 }),
      Object.assign(at(31.3125, 120.5644), { id: 'su_hanshansi', name: '寒山寺', w: 260, d: 200, year: 502, kind: 'temple' }),
      Object.assign(at(31.3254, 120.6235), { id: 'su_bowuguan', name: '苏州博物馆', w: 220, d: 180, year: 2006, kind: 'box' }),
      Object.assign(at(31.3193, 120.6760), { id: 'su_dongfang', name: '东方之门', w: 180, d: 140, year: 2015, kind: 'tower', h: 302 }),
      Object.assign(at(31.3136, 120.6954), { id: 'su_jinjihu', name: '金鸡湖', w: 1600, d: 1400, year: 1998, kind: 'open' }),
      Object.assign(at(31.3004, 120.6298), { id: 'su_wangshiyuan', name: '网师园', w: 200, d: 160, year: 1174, kind: 'traditional' }),
      Object.assign(at(31.3234, 120.6247), { id: 'su_shizilin', name: '狮子林', w: 200, d: 170, year: 1342, kind: 'traditional' }),
      Object.assign(at(31.2896, 120.6120), { id: 'su_panmen', name: '盘门', w: 320, d: 240, year: 1351, kind: 'traditional' }),
      Object.assign(at(31.2968, 120.6216), { id: 'su_canglang', name: '沧浪亭', w: 200, d: 160, year: 1044, kind: 'traditional' }),
      Object.assign(at(31.3218, 120.5978), { id: 'su_shantang', name: '山塘街', w: 700, d: 260, rot: -25, year: 825, kind: 'traditional' }),
      Object.assign(at(31.3149, 120.6297), { id: 'su_pingjiang', name: '平江路', w: 700, d: 240, rot: 8, year: 1200, kind: 'traditional' }),
      Object.assign(at(31.1530, 120.7170), { id: 'su_tongli', name: '同里古镇', w: 900, d: 700, year: 1000, kind: 'traditional' }),
      Object.assign(at(31.1145, 120.8440), { id: 'su_zhouzhuang', name: '周庄古镇', w: 900, d: 700, year: 1086, kind: 'traditional' }),
      Object.assign(at(31.2717, 120.8691), { id: 'su_luzhi', name: '甪直古镇', w: 700, d: 600, year: 1000, kind: 'traditional' }),
      Object.assign(at(31.0810, 120.4320), { id: 'su_dongshan', name: '太湖东山', w: 1600, d: 1200, year: 1900, kind: 'open' }),
      Object.assign(at(31.1350, 120.3650), { id: 'su_xishan', name: '太湖西山（金庭）', w: 1400, d: 1100, year: 1900, kind: 'open' }),
      Object.assign(at(31.3319, 120.6067), { id: 'su_station', name: '苏州站', w: 620, d: 260, year: 1908, kind: 'rail' }),
      Object.assign(at(31.4237, 120.6389), { id: 'su_north', name: '苏州北站', w: 700, d: 380, rot: 10, year: 2011, kind: 'rail' }),
      Object.assign(at(31.3432, 120.7064), { id: 'su_yuanqu_st', name: '苏州园区站', w: 520, d: 260, rot: 15, year: 2010, kind: 'rail' }),
      Object.assign(at(31.3551, 120.9465), { id: 'su_kunshan_s', name: '昆山南站', w: 560, d: 280, rot: 8, year: 2010, kind: 'rail' }),
      Object.assign(at(31.6992, 120.7761), { id: 'su_changshu_st', name: '常熟站', w: 560, d: 280, year: 2020, kind: 'rail' }),
      Object.assign(at(31.8472, 120.5388), { id: 'su_zjg_st', name: '张家港站', w: 560, d: 280, year: 2020, kind: 'rail' }),
      Object.assign(at(31.4680, 121.0830), { id: 'su_taicang_st', name: '太仓站', w: 560, d: 280, year: 2020, kind: 'rail' }),
      Object.assign(at(31.0656, 120.7949), { id: 'su_nan_st', name: '苏州南站', w: 600, d: 320, year: 2024, kind: 'rail' }),
      Object.assign(at(31.3106, 120.7401), { id: 'su_aoti', name: '苏州奥体中心', w: 500, d: 420, year: 2018, kind: 'stadium' }),
      Object.assign(at(31.3232, 120.6982), { id: 'su_wenhua', name: '苏州文化艺术中心', w: 300, d: 220, year: 2007, kind: 'opera', h: 40 }),
      Object.assign(at(31.3071, 120.6359), { id: 'su_suzhou_univ', name: '苏州大学', w: 900, d: 700, year: 1900, kind: 'campus' }),
      Object.assign(at(31.2756, 120.7358), { id: 'su_xjtlu', name: '西交利物浦大学', w: 1000, d: 800, year: 2006, kind: 'campus' }),
      Object.assign(at(31.2784, 120.5655), { id: 'su_usts', name: '苏州科技大学', w: 800, d: 600, year: 2001, kind: 'campus' }),
    ],
    // 重要设施（facility.js）：位置与启用/停用年份为史实参考（位置近似）；规模均为估算
    facilities: [
      { id: 'su_rail', n: '苏州站', t: 'rail', lm: 'su_station', pax: [[2000, 3.0], [2010, 5.5], [2019, 7], [2030, 7.5]] },
      { id: 'su_north_f', n: '苏州北站', t: 'rail', lm: 'su_north', y0: [2011, 6], pax: [[2011.5, 2], [2015, 4], [2030, 5]], note: '2011 年 6 月京沪高铁通车，苏州北站同时启用。' },
      { id: 'su_yuanqu_f', n: '苏州园区站', t: 'rail', lm: 'su_yuanqu_st', y0: [2010, 7], pax: [[2010.6, 0.8], [2015, 1.6], [2030, 2.2]], note: '2010 年 7 月沪宁城际通车，苏州园区站启用。' },
      { id: 'su_kunshan_f', n: '昆山南站', t: 'rail', lm: 'su_kunshan_s', y0: [2010, 7], pax: [[2010.6, 1.2], [2015, 2.4], [2030, 3.0]] },
      { id: 'su_changshu_f', n: '常熟站', t: 'rail', lm: 'su_changshu_st', y0: [2020, 7], pax: [[2020.6, 0.8], [2030, 1.6]], note: '2020 年 7 月沪苏通铁路通车，常熟站启用。' },
      { id: 'su_zjg_f', n: '张家港站', t: 'rail', lm: 'su_zjg_st', y0: [2020, 7], pax: [[2020.6, 0.8], [2030, 1.5]] },
      { id: 'su_taicang_f', n: '太仓站', t: 'rail', lm: 'su_taicang_st', y0: [2020, 7], pax: [[2020.6, 0.6], [2030, 1.2]] },
      { id: 'su_nan_f', n: '苏州南站', t: 'rail', lm: 'su_nan_st', y0: [2024, 12], pax: [[2025, 0.8], [2030, 1.6]], note: '2024 年 12 月沪苏湖高铁通车，苏州南站在吴江启用。' },
      { id: 'su_szdx_u', n: '苏州大学', t: 'uni', lm: 'su_suzhou_univ', w: 0.03 },
      { id: 'su_xjtlu_u', n: '西交利物浦大学', t: 'uni', lm: 'su_xjtlu', y0: 2006, w: 0.022 },
      { id: 'su_usts_u', n: '苏州科技大学', t: 'uni', lm: 'su_usts', y0: 2001, w: 0.016 },
      { id: 'su_csit_u', n: '常熟理工学院', t: 'uni', at: ll(31.6350, 120.7600), y0: 1958, w: 0.012 },
      { id: 'su_dku_u', n: '昆山杜克大学', t: 'uni', at: ll(31.4194, 120.8915), y0: 2013, w: 0.008 },
      { id: 'su_fyy', n: '苏州大学附属第一医院', t: 'hosp', at: ll(31.3464, 120.6035), w: 0.05 },
      { id: 'su_sl', n: '苏州市立医院', t: 'hosp', at: ll(31.3043, 120.6170), w: 0.045 },
      { id: 'su_tcm', n: '苏州市中医医院', t: 'hosp', at: ll(31.2711, 120.5939), w: 0.03 },
      { id: 'su_kshosp', n: '昆山市第一人民医院', t: 'hosp', at: ll(31.3880, 121.0222), w: 0.03 },
      { id: 'su_gq_shop', n: '观前街商圈', t: 'shop', at: ll(31.3100, 120.6209), r: 1.4, w: [[2000, 0.06], [2010, 0.08], [2020, 0.07]] },
      { id: 'su_sl_shop', n: '石路商圈', t: 'shop', at: ll(31.3185, 120.5925), w: 0.035 },
      { id: 'su_yr_shop', n: '圆融时代广场', t: 'shop', at: ll(31.3213, 120.7090), y0: [2008, 10], w: [[2008.8, 0.012], [2016, 0.03]] },
      { id: 'su_ks_shop', n: '昆山亭林路商圈', t: 'shop', at: ll(31.3820, 120.9700), w: 0.025 },
      { id: 'su_hudong_cbd', n: '园区湖东商务区', t: 'cbd', at: ll(31.3170, 120.7120), y0: [2008, 1], w: [[2008, 0.002], [2014, 0.012], [2020, 0.03]] },
      { id: 'su_shishan_cbd', n: '狮山商务区', t: 'cbd', at: ll(31.2950, 120.5590), y0: 2005, w: [[2005, 0.004], [2015, 0.018], [2030, 0.025]] },
      { id: 'su_wj_cbd', n: '吴江太湖新城商务区', t: 'cbd', at: ll(31.1350, 120.6250), y0: 2013, w: [[2013, 0.002], [2020, 0.012]] },
      { id: 'su_zzy_f', n: '拙政园', t: 'scenic', lm: 'su_zhuozheng', tour: true, w: 0.03 },
      { id: 'su_hq_f', n: '虎丘', t: 'scenic', lm: 'su_huqiu', tour: true, w: 0.025 },
      { id: 'su_hss_f', n: '寒山寺', t: 'scenic', lm: 'su_hanshansi', tour: true, w: 0.018 },
      { id: 'su_tl_f', n: '同里', t: 'scenic', lm: 'su_tongli', tour: true, w: 0.02 },
      { id: 'su_zz_f', n: '周庄', t: 'scenic', lm: 'su_zhouzhuang', tour: true, w: 0.022 },
      { id: 'su_lz_f', n: '甪直', t: 'scenic', lm: 'su_luzhi', tour: true, w: 0.012 },
      { id: 'su_ds_f', n: '太湖东山', t: 'scenic', lm: 'su_dongshan', tour: true, w: 0.02 },
      { id: 'su_bwg_f', n: '苏州博物馆', t: 'scenic', lm: 'su_bowuguan', tour: true, w: 0.018 },
      { id: 'su_jjh_p', n: '金鸡湖', t: 'park', lm: 'su_jinjihu', w: 0.02 },
      { id: 'su_sh_p', n: '石湖', t: 'park', at: ll(31.2420, 120.5950), w: 0.016 },
      { id: 'su_sss_p', n: '上方山森林公园', t: 'park', at: ll(31.2560, 120.5920), w: 0.01 },
      { id: 'su_szgy_p', n: '苏州公园', t: 'park', at: ll(31.3071, 120.6236), w: 0.008 },
      { id: 'su_aoti_f', n: '苏州奥体中心', t: 'stadium', lm: 'su_aoti', w: 0.016 },
      { id: 'su_whys_f', n: '苏州文化艺术中心', t: 'venue', lm: 'su_wenhua', w: 0.014 },
      { id: 'su_iec_f', n: '苏州国际博览中心', t: 'venue', at: ll(31.3253, 120.7035), y0: 2009, w: 0.012 },
    ],
    // 区名标注：用街道/镇一级的质心定位，避免用整个区（质心常落在湖面或乡野）
    districtLabels: [['观前', ['平江街道']], ['平江', ['苏锦街道']], ['金阊', ['金阊街道']], ['沧浪', ['沧浪街道']], ['双塔', ['双塔街道']], ['吴门', ['吴门桥街道']], ['新区', ['虎丘区']], ['园区', ['苏州工业园区']], ['吴中', ['吴中区']], ['相城', ['相城区']], ['吴江', ['吴江区']], ['昆山', ['昆山市']], ['常熟', ['常熟市']], ['张家港', ['张家港市']], ['太仓', ['太仓市']], ['木渎', ['木渎镇']], ['同里', ['同里镇']], ['周庄', ['周庄镇']]],
    // 纪事（只能在末尾追加：已发生记录按序号保存）
    events: [
      { y: 2010, m: 1, tag: '史实', title: '2010 年的苏州', desc: '全市常住人口约 1046 万，地区生产总值约 9229 亿元；城市沿京杭运河与干将路展开，观前街与石路是商业中心，园区已跨过金鸡湖长成湖东 CBD，吴江、昆山、常熟、张家港与太仓仍是县级市，尚无地铁。' },
      { y: 2010, m: 7, tag: '史实', title: '沪宁城际通车，苏州园区站启用', desc: '沪宁城际铁路通车，园区站与新区站同时启用，园区与上海之间的通勤时间大幅缩短。', fx: { grow: { region: ['yuanqu', 'xinqu'], pop: 1.3, jobs: 1.3, years: 8 } }, task: { id: 'su-t2', type: 'facShare', fac: 'su_yuanqu_f', target: 0.15, months: 48, rewardMonths: 1, title: '园区站的接驳', desc: '沪宁城际通车，苏州园区站每天到发大量旅客。让到发旅客坐地铁接驳的比例达到 15%。' } },
      { y: 2011, m: 6, tag: '史实', title: '京沪高铁通车，苏州北站启用', desc: '京沪高铁开通，苏州北站启用，相城北部从郊野变成门户。', fx: { grow: { region: 'gaotie', pop: 1.6, jobs: 1.5, years: 8 } }, task: { id: 'su-t3', type: 'facShare', fac: 'su_north_f', target: 0.15, months: 48, rewardMonths: 1, title: '苏州北站的接驳', desc: '京沪高铁通车，苏州北站每天到发大量旅客。让到发旅客坐地铁接驳的比例达到 15%。' } },
      { y: 2012, m: 4, tag: '史实', title: '史实背景：苏州轨道交通 1 号线通车', desc: '现实中 1 号线于 2012 年 4 月开通，2 号线于 2013 年 12 月开通。本局的地铁由你规划，真实线路不会自动出现。', fx: { demand: { lz: 1.1, months: 12 }, sat: { v: 1.5, months: 6 } } },
      { y: 2012, m: 9, tag: '史实', title: '吴江撤市设区', desc: '吴江市撤销，设立吴江区，苏州中心城区与吴江连成一片。', fx: { grow: { region: ['wujiang', 'shengze'], pop: 1.4, jobs: 1.3, years: 8 } } },
      { y: 2013, m: 12, tag: '史实', title: '史实背景：2 号线通车', desc: '现实中 2 号线于 2013 年 12 月开通，把相城、苏州站与南门南北连起来。本局线路由你规划。', fx: { demand: { lz: 1.05, months: 12 } } },
      { y: 2017, m: 4, tag: '史实', title: '史实背景：4 号线通车', desc: '现实中 4 号线及支线于 2017 年 4 月开通，把吴江与古城连起来。本局线路由你规划。', fx: { grow: { region: ['wujiang', 'tongli'], pop: 1.2, jobs: 1.2, years: 6 } } },
      { y: 2019, m: 8, tag: '史实', title: '江苏自贸区苏州片区设立', desc: '中国（江苏）自由贸易试验区苏州片区在园区挂牌，生物医药与集成电路企业加快集聚。', fx: { grow: { region: 'yuanqu', pop: 1.15, jobs: 1.25, years: 8 } } },
      { y: 2019, m: 12, tag: '史实', title: '史实背景：3 号线通车', desc: '现实中 3 号线于 2019 年 12 月开通，2021 年 6 月 5 号线开通，构成古城外围的环状走廊。本局线路由你规划。', fx: { demand: { lz: 1.08, months: 12 } } },
      { y: 2020, m: 4, tag: '史实', title: '「姑苏八点半」夜间经济', desc: '苏州推出夜间经济品牌，观前街、山塘街与金鸡湖畔的夜间客流明显增加。', fx: { demand: { lz: 1.12, months: 24 }, sat: { v: 1, months: 12 } } },
      { y: 2020, m: 7, tag: '史实', title: '沪苏通铁路通车，常熟、张家港、太仓站启用', desc: '沪苏通铁路与长江大桥通车，常熟、张家港、太仓同时进入铁路时代。', fx: { grow: { region: ['changshu', 'zhangjiagang', 'taicang'], pop: 1.3, jobs: 1.3, years: 8 } } },
      { y: 2021, m: 6, tag: '史实', title: '史实背景：5 号线通车', desc: '现实中 5 号线于 2021 年 6 月开通，沿古城西侧与南侧补上一条西南—东北向的走廊。本局线路由你规划。', fx: { demand: { lz: 1.05, months: 12 } } },
      { y: 2023, m: 6, tag: '史实', title: '11 号线通车，与上海 11 号线在花桥衔接', desc: '苏州轨道交通 11 号线通车，西起苏州工业园区唯亭、东至昆山花桥，昆山与苏州工业园区直连，在花桥与上海 11 号线换乘。', fx: { grow: { region: ['kunshan', 'huaqiao'], pop: 1.25, jobs: 1.3, years: 8 } } },
      { y: 2024, m: 6, tag: '史实', title: '史实背景：6 号线通车', desc: '现实中 6 号线于 2024 年 6 月开通，穿过古城北部并连接园区。本局线路由你规划。', fx: { demand: { lz: 1.04, months: 12 } } },
      { y: 2024, m: 9, tag: '史实', title: '史实背景：8 号线通车', desc: '现实中 8 号线于 2024 年 9 月开通，沿园区与相城之间的南北向走廊运行。本局线路由你规划。', fx: { demand: { lz: 1.04, months: 12 } } },
      { y: 2024, m: 12, tag: '史实', title: '史实背景：7 号线通车', desc: '现实中 7 号线于 2024 年 12 月开通，与 6 号线、8 号线一起让苏州轨道交通进入九线联运的网络。本局线路由你规划。', fx: { demand: { lz: 1.04, months: 12 } } },
      { y: 2024, m: 12, tag: '史实', title: '沪苏湖高铁通车，苏州南站启用', desc: '沪苏湖高铁开通，苏州南站在吴江汾湖启用，吴江与上海、湖州之间的通勤时间大幅缩短。', fx: { grow: { region: ['wujiang', 'shengze'], pop: 1.2, jobs: 1.2, years: 8 } } },
      { y: 2025, m: 1, tag: '模拟', title: '园区与太湖新城继续成长', desc: '城市东部与南部继续集聚人口与岗位，跨湖与跨市通勤增加。', fx: { grow: { region: ['yuanqu', 'wujiang', 'kunshan'], pop: 1.15, jobs: 1.15, years: 6 } } },
    ],
    // 本地历史主题任务：参考苏州的发展需求，不要求复刻真实线路走向（奖励单位：万元，2000 年价格）
    histTasks: [
      { id: 'su1', appear: [2010, 1], deadline: [2018, 12], type: 'connect', reward: 170000, title: '参考 1 号线（2012 年通车）', desc: '建设一条沿干将路贯穿古城、东西向的线路，把木渎、观前与园区湖东连起来。', anchors: [anchor('木渎一带', 31.2570, 120.5170, 4), anchor('观前街一带', 31.3100, 120.6209, 4), anchor('园区湖东一带', 31.3170, 120.7080, 5)] },
      { id: 'su4', appear: [2010, 1], deadline: [2018, 12], type: 'connect', reward: 180000, title: '园区湖东的上班路', desc: '园区的写字楼与工厂都往湖东集中，员工多住在古城与吴中。用地铁把湖东接进古城。', anchors: [anchor('园区湖东', 31.3170, 120.7080, 4), anchor('观前街', 31.3100, 120.6209, 4)] },
      { id: 'su2', appear: [2011, 1], deadline: [2019, 12], type: 'connect', reward: 170000, title: '参考 2 号线（2013 年通车）', desc: '建设一条南北向的线路，把相城元和、苏州站与南门连起来。', anchors: [anchor('相城元和一带', 31.3700, 120.6300, 4), anchor('苏州站', 31.3266, 120.6066, 3), anchor('南门一带', 31.2950, 120.6180, 3)] },
      { id: 'su3', appear: [2011, 6], deadline: [2020, 12], type: 'connect', reward: 180000, title: '连接苏州北站', desc: '京沪高铁通车后，苏州北站成为城市的北门户。在车站附近设站并接入线网。', anchors: [anchor('苏州北站', 31.4187, 120.6385, 2.4), anchor('相城一带', 31.3700, 120.6300, 4)] },
      { id: 'su5', appear: [2012, 1], deadline: [2024, 12], type: 'coverage', target: 0.22, reward: 220000, title: '地铁覆盖两成二人口', desc: '步行 15 分钟可到达地铁站的人口不低于全市人口的 22%。' },
      { id: 'su6', appear: [2013, 1], deadline: [2025, 12], type: 'regionCov', regions: ['yuanqu'], areaName: '苏州工业园区', target: 0.25, months: 72, reward: 200000, title: '园区的覆盖', desc: '园区是苏州增长最快的片区，让这里四分之一的居民步行就能到地铁站。' },
      { id: 'su7', appear: [2016, 1], deadline: [2028, 12], type: 'connect', reward: 200000, title: '昆山接上海', desc: '昆山与花桥的通勤人口越来越多，规划中的 11 号线将在花桥与上海 11 号线衔接。用地铁连起昆山城区与花桥。', anchors: [anchor('昆山城区', 31.3850, 120.9800, 5), anchor('花桥', 31.3100, 121.1000, 4)] },
    ],
    dynTasks: [
      { id: 'sud1', from: [2011, 1], to: [2023, 12], type: 'connect', months: 36, reward: 42000, title: '古城到新区的通勤', desc: '新区的电子与机械企业雇了大量工人，他们多住在古城与吴中。连接狮山、石路与观前。', anchors: [anchor('新区狮山', 31.2950, 120.5590, 4), anchor('石路', 31.3185, 120.5925, 3), anchor('观前街', 31.3100, 120.6209, 3)] },
      { id: 'sud2', from: [2012, 1], to: [2026, 12], type: 'connect', months: 36, reward: 42000, title: '园区湖东的早高峰', desc: '园区的写字楼陆续入驻，湖东与独墅湖一带的上班族只能挤公交。连接湖东、独墅湖与古城。', anchors: [anchor('园区湖东', 31.3170, 120.7080, 4), anchor('独墅湖', 31.2750, 120.7350, 4), anchor('观前街', 31.3100, 120.6209, 3)] },
      { id: 'sud3', from: [2014, 1], to: [2028, 12], type: 'connect', months: 36, reward: 45000, title: '吴江进城的居民', desc: '吴江撤市设区后，松陵与太湖新城的入住率越来越高。连接吴江松陵、南门与观前。', anchors: [anchor('吴江松陵', 31.1550, 120.6400, 5), anchor('南门', 31.2950, 120.6180, 3), anchor('观前街', 31.3100, 120.6209, 3)] },
    ],
    taskNote: '历史主题任务参考苏州 2010 年起的发展需求（古城东西与南北主轴、园区、苏州北站、吴江、昆山与花桥），不要求按真实线路走向建设，只需满足目标描述。',
    // 城市策略难题（可选挑战）
    scenarios: [
      { id: 'su-sc1', theme: '苏州：古城与园区', title: '在古城与园区之间画一条线', type: 'budgetConnect', from: [2010, 1], to: [2022, 12], months: 60, rewardMonths: 3, budgetX: 1.2,
        anchors: [anchor('观前街', 31.3100, 120.6209, 3), anchor('园区湖东', 31.3170, 120.7080, 4), anchor('石湖', 31.2420, 120.5950, 3)],
        desc: '古城到园区是全城最繁忙的走廊，中间要跨护城河、娄江与金鸡湖，两头街巷密集、园林与河道多，拆迁和地下施工都贵。预算只比一条笔直的地下线多一点，要在走向、站数和形式之间取舍。',
        tips: ['走向尽量直，少绕行就少花钱', '站点只放在客流最大的地方，少而精', '园区一侧的空地可以考虑高架'] },
      { id: 'su-sc2', theme: '苏州：太湖与古城', title: '跨过石湖与运河进吴中', type: 'regionCov', from: [2011, 1], to: [2029, 12], months: 60, rewardMonths: 4,
        regions: ['wuzhong'], areaName: '吴中', target: 0.3,
        desc: '吴中是古城向南的延伸，可中间隔着石湖与上方山风景区，跨湖段贵、站也不能随便设。让吴中三成居民步行就能到地铁站。',
        tips: ['先找出石湖最窄的断面', '风景区范围里只能走地下，站点放在风景区外缘', '古城一侧用换乘接入既有走廊'] },
    ],
    dataNote: [
      ['真实地理', 'hist', '京杭运河、娄江、吴淞江、阳澄湖与太湖水系、长江南岸、道路与桥隧、铁路、园林与风景区、街道与区界、地名均来自 OpenStreetMap（© OpenStreetMap 贡献者，ODbL），为现代数据，按 250 m 网格投影。'],
      ['史实参考', 'hist', '吴江撤市设区、苏州工业园区与高新区、沪宁城际与苏州园区站、京沪高铁与苏州北站、沪苏通铁路与常熟／张家港／太仓站、沪苏湖高铁与苏州南站、苏州轨道交通 1／2／3／4／5／6／7／8／11 号线通车年份、地标落成年份。'],
      ['估算', 'est', '2010 年人口与就业分布、人口增长曲线、出行率、时间价值、造价、票价、运营费用与拨款、地图范围 GDP。'],
      ['模拟', 'sim', '2020 年之后的发展、居民出行选择、道路拥堵、客流与财政结果。普通铁路与高速铁路不参与乘客出行与运营模拟，只模拟车站的市内接驳出行；地面铁路按真实线位阻隔步行与小路；真实的苏州轨道交通线路不会自动出现。'],
      ['', '', '模拟结果不得作为真实苏州交通规划预测。'],
    ],
    // 线路配色参考苏州轨道交通 1 号线红、2 号线蓝，其余为自拟
    lineColorsNice: ['#e60012', '#0063b0', '#00a651', '#f39800', '#8e44ad', '#00a0e9', '#c2185b', '#5c6bc0', '#7cb342', '#8d6e63', '#26a69a', '#fdd835'],
    stationNameCorrections: {},
    places: (G.places || []).map(function (p) { return [p[0], p[1], p[2], p[3]]; }),
  };
  // 位置校正：与 OSM 地铁站/火车站同名的设施与任务锚点，改用车站位置（相距 12 格以内时）
  const ST = {}; for (const p of G.places || []) if ((p[3] === 0 || p[3] === 1) && !ST[p[0]]) ST[p[0]] = p;
  const nearSt = function (name, x, y) { const p = ST[name.replace(/（.*?）/g, '')]; return p && Math.hypot(p[1] - x, p[2] - y) < 12 ? p : null; };
  for (const f of data.facilities) if (f.at) { const p = nearSt(f.n, f.at[0], f.at[1]); if (p) f.at = [p[1], p[2]]; }
  for (const t of data.histTasks.concat(data.dynTasks)) for (const a of t.anchors || []) { const p = nearSt(a.name, a.x, a.y); if (p) { a.x = p[1]; a.y = p[2]; } }

  (CM.MAP_LIST = CM.MAP_LIST || []).push({
    id: 'su', name: '苏州', title: '苏州 · 2010', sub: '真实地理 · 2010 年起 · 人民币',
    desc: '从 2010 年尚无地铁的苏州大市开始：京杭运河与古城墙围出老城，园区已跨过金鸡湖长成湖东 CBD，新区在狮山一带集聚电子与机械企业，吴江、昆山、常熟、张家港、太仓各自成城。跨湖段只能走地下，园林与风景区不能开发；此后十年，1 号线通车、吴江设区，4 号线与 3 号线成网，11 号线把昆山花桥与上海接起来。',
    facts: [['范围', '136 km × 144 km'], ['起始', '2010 年'], ['人口', '约 1046 万'], ['货币', '人民币（元）'], ['模式', '经营挑战 / 自由建造']],
    modes: ['challenge', 'free'], kind: 'real', mapVersion: 1, scenario: 'su-2010',
    region: '中国内地', tagline: '古城、园区与太湖之间的苏州大市', difficulty: 3, tags: ['无地铁开局', '跨湖', '市域线', '古城保护'],
    intro: '2010 年的苏州还没有地铁。古城被护城河与园林包围，东面的园区已经跨过金鸡湖长到湖东与独墅湖，西面的新区在狮山与枫桥铺开，南面的吴江、东面的昆山与北面的常熟、张家港、太仓还各自成城。接下来十五年，1 号线通车、吴江撤市设区，4 号线与 3 号线连成网络，沪宁城际、京沪高铁与沪苏通相继通车，11 号线又把昆山花桥与上海接起来。你要在古城与园区之间找到线路的走法，也可以先修市域快线把大市连起来。',
    features: [['wave', '太湖与石湖', '风景区不能开发，跨湖只能走地下，跨湖段还要另付环境费'], ['map', '五座县级市在图内', '昆山、常熟、张家港、太仓与吴江都在图内，可修市域线'], ['flag', '7 项历史任务', '参考苏州轨道交通的发展需求，不要求复刻真实线路']],
    highlights: [[2010, '沪宁城际与苏州园区站'], [2012, '1 号线通车、吴江设区'], [2017, '4 号线通车'], [2021, '5 号线通车'], [2023, '11 号线接通上海'], [2024, '6／7／8 号线成网']],
    geo: G, data: data,
    econ: { devOffset: 0, money: 1 },   // 苏州 2010 年沿用广州样本同年代的出行选择曲线，人民币计价
    cfg: {
      W: 544, H: 576, ZONE: 16, START: { y: 2010, m: 1, d: 1, minute: 360 },
      growth: Object.assign({}, CM.CFG.growth, {
        popCurve: [[2000, 5.80e6], [2010, 10.46e6], [2015, 10.60e6], [2020, 12.75e6], [2030, 14.00e6], [2050, 15.00e6], [2300, 15.50e6]],
        histEnd: 2020,
        jobsRatio: [[2010, 0.60], [2015, 0.61], [2020, 0.62], [2040, 0.63]],
      }),
      money: { code: 'CNY', unit: '元', wan: '万元', yi: '亿元', sym: '¥' },
      econBase: 2000,
      // 造价（万元，2000 年价格；估算，参考苏州轨道交通 1 号线约 4 亿元/km 的量级）：跨运河与跨湖段附加较高
      cost: Object.assign({}, CM.CFG.cost, {
        trackPerKm: { underground: 43000, surface: 7500, elevated: 15000 },
        riverPerKm: { underground: 25000, surface: 17000, elevated: 17000 },
        hillPerKm: 6000, protectedPerKm: 8000,
        station: { underground: { S: 17000, M: 29000, L: 46000 }, elevated: { S: 8500, M: 13500, L: 21000 }, surface: { S: 5800, M: 9200, L: 13500 } },
        demolishPerCell: 42000,
      }),
      ops: Object.assign({}, CM.CFG.ops, { carKmCost: 0.0011, stationDaily: { S: 1.9, M: 3.2, L: 5.6 } }),
      fareDefault: { mode: 'flat', flat: 2 }, fareRange: { min: 0, max: 10, step: 0.1, scale: true },
      economy: Object.assign({}, CM.CFG.economy, { startFunds: 420000, grantBase: [[2000, 24000], [2005, 40000], [2010, 72000], [2015, 108000], [2020, 132000], [2050, 190000]], debtLimit: -280000, rewardScale: 1.35 }),
      // 城市经济（macro.js）：gdp0 是开局年的地图范围 GDP，按 2010 年约 9229 亿元计（估算：苏州大市 2010 年 GDP 约 9229 亿元）
      macro: {
        area: '地图范围（姑苏、虎丘、吴中、相城、吴江与昆山、常熟、张家港、太仓）', region: '中国内地',
        gdp0: 92289100, revRatio: [[2010, 0.17], [2020, 0.18], [2040, 0.17]], revElastic: 1.5,
        prod: [[2010, 0.064], [2011, 0.060], [2015, 0.048], [2020, 0.038], [2030, 0.025], [2050, 0.016], [2080, 0.012]],
        infl: 'cn', longRun: { infl: 0.02 }, histEnd: 2020, ref: 'cn',
        struct: { trade: 0.75, fin: 0.28, ind: 0.85, tour: 0.5, prop: 0.55 },
        events: [
          { id: 'quake2011', y: 2011, m: 3, scale: 0.5, desc: '东日本大地震冲击电子元器件与汽车零部件的供应，苏州的电子与机械企业短期减产。' },
          { id: 'cnstock2015', y: 2015, m: 6 },
          { id: 'trade2018', y: 2018, m: 7, scale: 0.7 },
          { id: 'covid2020', y: 2020, m: 1, scale: 0.5, desc: '疫情使一季度的生产与消费大幅收缩，之后逐步恢复。' },
        ],
      },
    },
    cam: { cx: Math.round(CAM0[0]), cy: Math.round(CAM0[1]), zoom: 12 },
  });
})(window.CM);
