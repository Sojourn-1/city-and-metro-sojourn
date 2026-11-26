'use strict';
// 无锡 · 2010 场景。地理来自 OpenStreetMap（geo_wx.js，现代数据），本文件补充 2010 年起的区域开放（按街道与区划分）、
// 跨运河与跨湖桥隧、快速路通车年份、人口就业中心、地标、重要设施、历史事件、本地任务与人民币经营参数。坐标单位为格（250 m）。
// 本文件的经纬度按 OSM 的 WGS-84 填写（不套 GCJ-02 换算），用 ll(纬度, 经度) 投影。
// 真实性：区划调整、硕放机场民航开通、太湖蓝藻事件、沪宁城际与无锡东站、京沪高铁、宁杭高铁、南沿江高铁、
// 太湖新城与蠡湖新城开发、无锡地铁各线通车年份（1、2 号线 2014 年，1 号线南延线 2019 年，3 号线 2020 年，
// 4 号线 2021 年，S1 线 2024 年）、地标落成年份为史实参考；2010 年人口与就业分布、增长曲线、造价、票价与拨款为估算；2020 年之后为模拟。
(function (CM) {
  const G = CM.GEOS && CM.GEOS.wx; if (!G) return;
  const P = G.proj;
  // 纯投影：本文件所有经纬度都是 OSM 使用的 WGS-84
  const ll = function (lat, lon) { return [+((lon - P.lon0) * P.kx).toFixed(2), +((P.lat0 - lat) * P.ky).toFixed(2)]; };
  const at = function (lat, lon, o) { const p = ll(lat, lon); return Object.assign({ x: p[0], y: p[1] }, o); };
  const poly = function (pts) { return pts.map(function (p) { return ll(p[0], p[1]); }); };
  const anchor = function (name, lat, lon, r) { const p = ll(lat, lon); return { name: name, x: p[0], y: p[1], r: r }; };

  // 风景区范围（不能开发，只能地下穿过或绕行）：锡惠（惠山与锡山）、马山半岛（灵山）
  const xihui = poly([[31.5660, 120.2560], [31.5660, 120.2860], [31.6060, 120.2860], [31.6060, 120.2560]]);
  const mashan = poly([[31.4130, 120.0720], [31.4130, 120.1380], [31.4431, 120.1380], [31.4431, 120.0720]]);   // 北界南移 500 m，口岸一带可以设站
  // 硕放机场跑道（民用 2004 年 2 月开通，跑道 02/20）
  const rw1a = ll(31.4792, 120.4238), rw1b = ll(31.5096, 120.4342);

  const data = {
    // 城市特色（traits.js）：新条目加在末尾，已触发事件按序号记录
    traits: [
      { use: 'crossing', star: true, icon: 'bridge', label: '运河与梁溪河', text: '京杭运河、梁溪河与太湖把城区分成几片，跨河跨湖段造价明显更高', why: '无锡因运河而生，老城、惠山、新区与太湖新城被运河及梁溪河分隔，跨河通道一直是建设的重点。' },
      { use: 'scenic', star: true, icon: 'wave', label: '太湖与蠡湖', text: '太湖、蠡湖与锡惠风景区不能开发，跨湖段只能走地下，还要另付环境费', why: '太湖是国家重点风景名胜区，蠡湖与十八湾一带是环湖生态与风景岸线，开发强度长期受限。' },
      { use: 'foresight', level: 'mid', star: true, icon: 'chart', label: '太湖新城提前布局', text: '太湖新城成规模前就通地铁，能得到开发商出资，片区也长得更快', id: 'wx-thxc', pos: ll(31.4900, 120.3130), ym: [2016, 3], before: 2014, r: 7, region: 'taihu', title: '太湖新城进入建设高峰',
        hit: '太湖新城进入建设高峰，早已通车的{st}站让这里一下子有了人气。', miss: '太湖新城进入建设高峰，可这里还没有地铁，通勤只能靠太湖大道。',
        why: '2007 年无锡提出「城市南进」，太湖新城成为新的城市中心；2010 年市民中心启用，此后住宅与写字楼集中入住。' },
      { use: 'transition', level: 'light', label: '北塘老工业区转型', region: 'beitang', close: { y: 2012, m: 6, title: '北塘老工业区企业退城进园', desc: '6 月，北塘一带的纺织、机械企业陆续搬迁，老厂区改作居住与商业用地。' }, replan: [{ year: 2013, region: 'beitang', plan: 'mix' }], why: '2010 年前后无锡推进「退城进园」，北塘、南长的老工业用地逐步转为居住与服务业用地。' },
      { use: 'disaster', level: 'light', label: '太湖蓝藻', on: { y: 2012, m: 7, title: '太湖蓝藻再度暴发', desc: '7 月起太湖蓝藻再次大规模暴发，市区加密水质监测、加强供水保障，太湖治理与生态保护投入继续加大。' }, why: '2007 年 5 月太湖蓝藻暴发，无锡市区一度出现供水危机；此后蓝藻水华在夏季仍反复出现，太湖治理成为长期任务。' },
      { use: 'guard', level: 'light', label: '运河古建', guards: ['wx_qingming', 'wx_huishan', 'wx_jichang', 'wx_nanchansi'], why: '清名桥历史街区、惠山古镇、寄畅园与南禅寺是无锡的历史名胜，周边只能走地下。' },
      { use: 'finance', flavor: 'cn' },
      { use: 'cityLink', icon: 'bridge', label: '苏锡口岸', map: 'su', name: '苏州', region: 'xiangcheng',
        gates: [
          { id: 'wx_gate_sf', n: '硕放机场接驳口', to: '苏州 · 新吴—硕放', at: ll(31.5042, 120.4271), dir: 'E', y: [2010, 7], pax: [[2010.5, 0.5], [2018, 1.2], [2030, 1.8]], free: true, note: '苏南硕放机场旁，接苏州方向的地铁。' },
          { id: 'wx_gate_eh', n: '鹅湖接驳口', to: '苏州 · 相城—鹅湖', at: ll(31.5301, 120.5452), dir: 'E', y: [2015, 1], pax: [[2015.5, 0.4], [2025, 0.9]], free: true, note: '锡山区鹅湖镇一带，与苏州相城相接。' },
        ],
        why: '无锡与苏州之间在硕放机场、鹅湖各设一处口岸，接通后可乘地铁过境、切换到苏州，不另收跨境附加费。' },
      { use: 'cityLink', icon: 'bridge', label: '锡常口岸', map: 'cz', name: '常州', region: 'changzhou',
        gates: [
          { id: 'wx_gate_ms', n: '马山接驳口', to: '常州 · 雪堰—马山', at: ll(31.4476, 120.1020), dir: 'W', y: [2016, 1], pax: [[2016.5, 0.3], [2026, 0.7]], free: true, note: '马山半岛一带，与常州雪堰相接。' },
          { id: 'wx_gate_xy', n: '雪堰接驳口', to: '常州 · 雪堰', at: ll(31.5299, 120.0462), dir: 'W', y: [2018, 1], pax: [[2018.5, 0.3], [2028, 0.6]], free: true, note: '雪堰镇一带，2018 年随宜兴城区开放。' },
        ],
        why: '无锡与常州之间在马山、雪堰各设一处口岸，接通后可乘地铁过境、切换到常州，不另收跨境附加费。' },

    ],
    city: '无锡', terrainRevision: 1, riverName: '京杭运河', hsrYear: 2010,
    stages: [[2014, '运河时代'], [2018, '蠡湖与太湖新城'], [2024, '网络化时期']], stageLast: '市域时代',
    // 历史发展阶段（eras.js）：summary 中「史实」可查证，「估算」为模型设定的发展倾向
    eras: [
      { id: 'wx-e1', from: 2010, name: '运河时代', tag: '史实',
        summary: '史实：城市沿京杭运河与中山路展开，崇安寺、南长街是商业中心，锡山与惠山的乡镇工业密集；2010 年无锡还没有地铁，1 号线要到 2014 年才通车。估算：老城人口趋于饱和，新增居住落在北塘、南长与新区。',
        grow: { pop: { chongan: 0.7, nanchang: 1.1, beitang: 1.2, xinqu: 1.3 }, jobs: { chongan: 1.2, xinqu: 1.4, xishan: 1.2 } },
        demand: { decayHW: 0.9 }, corridors: [{ a: 'chongan', b: 'xinqu', f: 1.1 }],
        goals: [{ id: 'wx-g1', type: 'connect', months: 48, reward: 40000, title: '老城与新区', desc: '新区的电子与机械企业带来大量岗位，老城到新区只有几条公交线路。用地铁连接崇安寺与新区一带。', anchors: [anchor('崇安寺', 31.5795, 120.2990, 4), anchor('无锡新区', 31.5450, 120.3650, 5)] }] },
      { id: 'wx-e2', from: 2014, name: '蠡湖与太湖新城', tag: '史实',
        summary: '史实：2010 年 7 月沪宁城际通车、无锡东站启用，2011 年 6 月京沪高铁开通；2014 年 7 月与 12 月地铁 1、2 号线相继通车；蠡湖新城与太湖新城沿太湖大道集中建设。估算：滨湖、蠡湖与太湖新城成为主要的新增居住地与就业地，跨湖通勤开始出现。',
        grow: { pop: { binhu: 1.5, lihu: 1.5, taihu: 1.6, chongan: 0.7 }, jobs: { taihu: 1.6, xinqu: 1.7, chongan: 1.1, binhu: 1.2 } },
        relocate: { jobs: { chongan: 0.0004 } },
        demand: { sc: 1.05, decayHW: 1.05 },
        corridors: [{ a: 'chongan', b: 'binhu', f: 1.15 }, { a: 'chongan', b: 'taihu', f: 1.15 }, { a: 'xinqu', b: 'chongan', f: 1.1 }],
        goals: [{ id: 'wx-g2', type: 'connect', months: 48, reward: 45000, title: '蠡湖新城的通勤', desc: '蠡湖新城与太湖大道两侧住进大量居民，进城要绕湖走。用地铁连接蠡湖一带与老城。', anchors: [anchor('蠡湖', 31.5250, 120.2480, 4), anchor('三阳广场', 31.5775, 120.2985, 3)] },
          { id: 'wx-g3', type: 'connect', months: 48, reward: 45000, title: '太湖新城的上班路', desc: '市民中心、金融街与新的写字楼都在太湖新城，居民从老城过去要换两趟公交。用地铁把太湖新城接进老城。', anchors: [anchor('太湖新城', 31.4900, 120.3130, 5), anchor('三阳广场', 31.5775, 120.2985, 3)] }] },
      { id: 'wx-e3', from: 2018, name: '太湖新城与产业', tag: '史实',
        summary: '史实：2019 年 9 月 1 号线南延线通车，2020 年 10 月 3 号线通车，2021 年 12 月 4 号线一期通车，2023 年 9 月南沿江高铁通车、江阴站启用；太湖新城与新区继续吸纳产业与就业。估算：就业向太湖新城、新区与锡东新城扩散，长距离跨区通勤增加。',
        grow: { pop: { taihu: 1.8, xinqu: 1.5, xidong: 1.4, chongan: 0.6 }, jobs: { taihu: 2.0, xinqu: 1.6, chongan: 0.9 } },
        relocate: { jobs: { chongan: 0.0005 } },
        demand: { sh: 1.05, lz: 1.08, decayHW: 1.15, hub: 1.1 },
        corridors: [{ a: 'taihu', b: 'chongan', f: 1.25 }, { a: 'xinqu', b: 'taihu', f: 1.15 }, { a: 'lihu', b: 'taihu', f: 1.15 }],
        goals: [{ id: 'wx-g4', type: 'regionCov', regions: ['xinqu'], areaName: '无锡新区', target: 0.2, months: 60, reward: 45000, title: '新区的覆盖', desc: '新区的集成电路与外资企业越来越多，让新区两成居民步行就能到地铁站。' },
          { id: 'wx-g5', type: 'regionCov', regions: ['xidong'], areaName: '锡东新城', target: 0.2, months: 60, reward: 45000, title: '锡东新城的覆盖', desc: '高铁新城与东部的居住区连成一片，让锡东新城两成居民步行就能到地铁站。' }] },
      { id: 'wx-e4', from: 2024, name: '市域时代', tag: '模拟',
        summary: '史实：2024 年 1 月无锡地铁 S1 线开通，江阴城区接入无锡地铁网，锡澄之间可以坐地铁直达。估算：此后的发展按模型推演，不代表真实历史；就业继续向太湖新城、锡东新城与江阴城区扩散，跨市通勤增加。',
        grow: { pop: { taihu: 1.4, xidong: 1.5, jiangyin: 1.5, yixing: 1.3, chongan: 0.7 }, jobs: { taihu: 1.5, jiangyin: 1.4, xidong: 1.3, chongan: 0.8 } },
        relocate: { jobs: { chongan: 0.0004 } },
        demand: { lz: 1.1, decayHW: 1.15 },
        corridors: [{ a: 'jiangyin', b: 'chongan', f: 1.2 }, { a: 'taihu', b: 'binhu', f: 1.15 }],
        goals: [{ id: 'wx-g6', type: 'connect', months: 60, reward: 60000, title: '市域线接入江阴', desc: 'S1 线把江阴城区接进无锡地铁网，锡澄之间的通勤开始转向地铁。修建连接江阴城区、堰桥与老城的市域线。', anchors: [anchor('江阴城区', 31.9210, 120.2860, 5), anchor('堰桥', 31.6800, 120.2900, 4), anchor('三阳广场', 31.5775, 120.2985, 3)] }] },
    ],
    briefing: {
      lead: '2010 年的无锡还没有地铁。城市沿京杭运河与中山路展开，崇安寺与南长街是最热闹的地方，新区的集成电路与外资企业已成规模，蠡湖与太湖之间正在长出一座太湖新城；江阴与宜兴还各自成片，只有公路相连。公交与自行车是主要出行方式。',
      modes: [
        ['metro', '地铁', '尚无地铁。现实中 1 号线 2014 年才通车，本局由你规划，真实线路不会自动出现。'],
        ['bus', '公交与自行车', '中山路与运河两岸的公交高峰期十分拥挤，自行车仍是通勤主力。'],
        ['bridge', '过河与跨湖', '运河、梁溪河把城区分成几片，跨湖只有太湖大道等少数通道，绕行很远。'],
        ['rail', '铁路', '无锡站与无锡东站（2010 年 7 月沪宁城际通车时启用）承担对外铁路交通。列车本身不参与模拟，车站会产生市内接驳出行，地面铁路会阻隔步行。'],
      ],
    },
    airport: null,
    runways: [{ a: rw1a, b: rw1b, from: 2004.2 }],
    regions: [
      // 风景区：锡惠与马山不能开发
      { id: 'xihui', name: '锡惠风景区（惠山·锡山）', scenic: true, open: null, poly: xihui, relief: 120, lockNote: '锡惠公园与惠山森林公园，只能地下穿过，不能设站开发' },
      { id: 'mashan', name: '马山（灵山）', scenic: true, open: null, poly: mashan, relief: 200, lockNote: '马山半岛与灵山景区，只保留风景与宗教用地，不能开发' },
      // 硕放机场：照常运营，用地不开发，范围内只能地下设站与地下穿越
      { id: 'airport', name: '苏南硕放国际机场', poly: poly([[31.4680, 120.4050], [31.4680, 120.4570], [31.5160, 120.4570], [31.5160, 120.4050]]), open: null, hub: true, empty: true, lockNote: '民用机场照常运营，用地不开发', note: '2004 年开通民航；重要交通枢纽：范围内可以地下设站与地下穿越' },
      // 老城：梁溪区（2010 年时为崇安、南长、北塘三区）
      { id: 'chongan', name: '崇安（老城中心）', district: ['梁溪区'], seed: ll(31.5790, 120.2985), seedW: 1.4, seedIn: ['梁溪区'], streets: ['崇安寺街道', '学前街街道', '上马墩街道', '广瑞路街道', '通江街道', '江海街道', '广益街道', '金匮街道'], open: 2010, plan: 'oldmix', note: '崇安寺、中山路一带是无锡的传统商业中心（史实）' },
      { id: 'nanchang', name: '南长（清名桥·太湖广场）', district: ['梁溪区'], seed: ll(31.5620, 120.3050), seedW: 1.3, seedIn: ['梁溪区'], streets: ['清名桥街道', '南禅寺街道', '扬名街道', '迎龙桥街道', '金星街道'], open: 2010, plan: 'res', note: '清名桥历史街区沿古运河展开（史实）' },
      { id: 'beitang', name: '北塘（惠山·黄巷）', district: ['梁溪区'], seed: ll(31.5980, 120.2820), seedW: 1.3, seedIn: ['梁溪区'], streets: ['北大街街道', '惠山街道', '黄巷街道', '山北街道', '蓉湖街道'], open: 2010, plan: 'resind', note: '北塘一带是纺织与机械老工业区，2010 年代退城进园（史实）' },
      // 滨湖区
      { id: 'binhu', name: '滨湖（河埒·荣巷）', district: ['滨湖区'], seed: ll(31.5500, 120.2620), seedW: 1.3, seedIn: ['滨湖区'], streets: ['河埒街道', '荣巷街道', '蠡园街道', '雪浪街道', '胡埭镇', '马山街道'], open: 2010, plan: 'res' },
      { id: 'lihu', name: '蠡湖新城', district: ['滨湖区'], seed: ll(31.5250, 120.2480), seedW: 1.2, seedIn: ['滨湖区'], streets: ['蠡湖街道'], open: 2010, plan: 'newtown', pop: 3.4e6, note: '2006 年起蠡湖新城沿太湖大道集中建设（史实）' },
      { id: 'taihu', name: '太湖新城', district: ['滨湖区'], seed: ll(31.4900, 120.3130), seedW: 1.4, seedIn: ['滨湖区'], streets: ['太湖街道', '华庄街道'], open: 2010, plan: 'cbd', pop: 3.8e6, note: '2007 年无锡「城市南进」，太湖新城成为新的城市中心（史实）' },
      // 新吴区（无锡新区）
      { id: 'xinqu', name: '无锡新区（高新区·旺庄）', district: ['新吴区'], seed: ll(31.5450, 120.3650), seedW: 1.4, seedIn: ['新吴区'], streets: ['旺庄街道', '江溪街道', '新安街道'], open: 2010, plan: 'ind', growK: [1.5, 1.3], note: '1992 年设立的无锡高新区，外资与集成电路企业集中（史实）' },
      { id: 'shuofang', name: '硕放（空港·梅村）', district: ['新吴区'], seed: ll(31.5500, 120.5050), seedW: 1.4, seedIn: ['新吴区'], streets: ['硕放街道', '梅村街道', '鸿山街道'], open: 2010, plan: 'resind', pop: 3.0e6, note: '2004 年硕放机场开通民航，空港产业园与梅村一带陆续开发（史实）' },
      // 锡山区
      { id: 'xishan', name: '锡山（东亭·锡北）', district: ['锡山区'], seed: ll(31.6300, 120.3700), seedW: 1.6, seedIn: ['锡山区'], streets: ['东亭街道', '东北塘街道', '云林街道', '锡北镇', '东港镇'], open: 2010, plan: 'resind', growK: [1.3, 1], note: '2001 年锡山市撤市设区（史实）' },
      { id: 'xidong', name: '锡东新城（安镇·羊尖）', district: ['锡山区'], seed: ll(31.6000, 120.4200), seedW: 1.4, seedIn: ['锡山区'], streets: ['安镇街道', '羊尖镇', '厚桥街道', '鹅湖镇'], open: 2010, plan: 'newtown', pop: 3.2e6, note: '2010 年沪宁城际无锡东站启用，锡东新城启动（史实）' },
      // 惠山区
      { id: 'huishan', name: '惠山（堰桥·洛社）', district: ['惠山区'], seed: ll(31.6600, 120.2800), seedW: 1.8, seedIn: ['惠山区'], streets: ['堰桥街道', '长安街道', '前洲街道', '玉祁街道', '洛社镇', '钱桥街道', '阳山镇'], open: 2010, plan: 'resind', growK: [1.3, 1.1], note: '2001 年锡山市北部改设惠山区（史实）；堰桥、洛社与前洲一带的产业与居住区陆续建成' },
      // 江阴市（县级市，图内北部，可建设）
      { id: 'jiangyin', name: '江阴城区（澄江·城东）', seed: ll(31.9210, 120.2860), seedW: 1.5, seedIn: ['江阴市'], streets: ['澄江街道', '城东街道', '夏港街道', '南闸街道', '云亭街道'], open: 2015, plan: 'mix', note: '江阴城区沿长江南岸展开，乡镇工业与临江产业发达（史实）' },
      { id: 'jiangyin_n', name: '江阴沿江（申港·利港·璜土）', seed: ll(31.9450, 120.1300), seedW: 1.6, seedIn: ['江阴市'], streets: ['申港街道', '利港街道', '璜土镇'], open: 2018, plan: 'port', note: '长江岸线的港口与临江产业带（史实）' },
      { id: 'jiangyin_e', name: '江阴东部（华士·周庄·长泾）', seed: ll(31.8700, 120.4300), seedW: 1.6, seedIn: ['江阴市'], streets: ['华士镇', '周庄镇', '长泾镇', '顾山镇', '新桥镇'], open: 2022, plan: 'resind', note: '华士、周庄一带的乡镇工业与华西村（史实）' },
      { id: 'jiangyin_s', name: '江阴南部（青阳·徐霞客）', seed: ll(31.7600, 120.2600), seedW: 1.6, seedIn: ['江阴市'], streets: ['青阳镇', '徐霞客镇', '月城镇', '祝塘镇'], open: 2015, plan: 'resind' },
      // 宜兴市（县级市，图内南部与西南，可建设）
      { id: 'yixing', name: '宜兴城区（宜城·环科园）', seed: ll(31.3570, 119.8230), seedW: 1.5, seedIn: ['宜兴市'], streets: ['宜城街道', '屺亭街道', '新庄街道', '芳桥街道'], open: 2018, plan: 'mix', note: '宜兴城区沿团氿、东氿展开，环保与陶瓷产业集中（史实）' },
      { id: 'yixing_d', name: '丁蜀（陶都）', seed: ll(31.3000, 119.8480), seedW: 1.4, seedIn: ['宜兴市'], streets: ['丁蜀镇', '湖㳇镇'], open: 2022, plan: 'ind', note: '丁蜀是紫砂陶都，陶瓷产业与蜀山古南街（史实）' },
      { id: 'yixing_w', name: '宜兴西部（官林·徐舍）', seed: ll(31.4200, 119.6800), seedW: 1.7, seedIn: ['宜兴市'], streets: ['官林镇', '徐舍镇', '杨巷镇', '新建镇', '高塍镇'], open: 2024, plan: 'resind' },
      { id: 'yixing_s', name: '宜兴南部（张渚·竹海·太华）', seed: ll(31.2300, 119.6800), seedW: 1.9, seedIn: ['宜兴市'], streets: ['张渚镇', '太华镇', '西渚镇'], open: 2022, plan: 'res', relief: 220, note: '宜南山区，竹海与善卷洞等风景区（史实）' },
      { id: 'yixing_e', name: '宜兴东部（周铁·和桥）', seed: ll(31.4200, 119.9200), seedW: 1.6, seedIn: ['宜兴市'], streets: ['周铁镇', '和桥镇', '万石镇'], open: 2018, plan: 'resind' },
      { id: 'xueyan', name: '雪堰（太湖湾）', streets: ['雪堰镇'], open: 2018, plan: 'res', note: '常州武进雪堰镇一带在本图范围内，2018 年与宜兴城区同步开放（示意）' },
      // 图内的邻市范围：线路可以穿过，不能设站（与武汉图内的孝感相同处理）
      { id: 'changshu', name: '常熟市·张家港（境外）', district: ['常熟市'], open: null, passOnly: true, lockNote: '常熟市，不属于无锡的建设范围：线路可以穿过，不能设站' },
      { id: 'xiangcheng', name: '苏州相城区（境外）', district: ['相城区'], open: null, passOnly: true, lockNote: '苏州市相城区，不属于无锡的建设范围：线路可以穿过，不能设站' },
      { id: 'changzhou', name: '常州（境外）', district: ['武进区', '天宁区'], open: null, passOnly: true, lockNote: '常州市武进、天宁一带，不属于无锡的建设范围：线路可以穿过，不能设站' },
      // 图内其余周边县市（镇江、泰州、苏州、湖州与常州其他区县）：只可穿越
      { id: 'outside', name: '周边县市（境外）', district: ['丹阳市', '新北区', '钟楼区', '金坛区', '溧阳市', '靖江市', '张家港市', '虎丘区', '姑苏区', '吴中区', '吴江区', '长兴县', '太仓市', '昆山市'], open: null, passOnly: true, lockNote: '无锡以外的周边县市，不属于本图建设范围：线路可以穿过，不能设站' },
    ],
    defaultRegion: { id: 'outer', name: '外围地区', open: 2012, plan: 'res', pop: 5.5e6 },
    plans: CM.DATA.plans,
    // 片区设施（商业中心、区域医院、文体公园）出现门槛的人口基准：按 2010 年大市口径（约 637 万）
    facPopRef: 6.37e6,
    // 2010 年人口与就业中心（估算，人/km²；r 约为影响半径 km）
    centers: [
      at(31.5790, 120.2985, { pop: 42000, jobs: 46000, r: 1.2 }),   // 三阳广场、崇安寺
      at(31.5895, 120.3005, { pop: 20000, jobs: 16000, r: 1.0 }),   // 无锡站、北大街
      at(31.5650, 120.3040, { pop: 34000, jobs: 14000, r: 1.2 }),   // 南禅寺、清名桥
      at(31.5950, 120.2820, { pop: 26000, jobs: 11000, r: 1.2 }),   // 北塘、惠山
      at(31.5500, 120.2620, { pop: 20000, jobs: 9000, r: 1.2 }),    // 河埒口、蠡桥
      at(31.5700, 120.3150, { pop: 14000, jobs: 9000, r: 1.1 }),    // 太湖广场、清扬路
      at(31.5450, 120.3650, { pop: 12000, jobs: 21000, r: 1.6 }),   // 新区、旺庄
      at(31.4900, 120.4400, { pop: 6000, jobs: 5000, r: 1.2 }),     // 硕放
      at(31.6250, 120.3700, { pop: 10000, jobs: 7000, r: 1.4 }),    // 东亭
      at(31.6050, 120.4000, { pop: 4000, jobs: 3000, r: 1.2 }),     // 安镇
      at(31.6800, 120.2900, { pop: 7000, jobs: 5000, r: 1.3 }),     // 堰桥
      at(31.6550, 120.2100, { pop: 6000, jobs: 4000, r: 1.2 }),     // 洛社
      at(31.5100, 120.3100, { pop: 3000, jobs: 2000, r: 1.4 }),     // 华庄、太湖新城
      at(31.4400, 120.1000, { pop: 2500, jobs: 2500, r: 1.2 }),     // 马山、灵山
      at(31.5500, 120.5100, { pop: 4000, jobs: 2500, r: 2.0 }),     // 梅村、鸿山
      // 江阴（2010 年估算）
      at(31.9210, 120.2860, { pop: 38000, jobs: 34000, r: 1.8 }),   // 澄江、江阴城区
      at(31.9000, 120.3200, { pop: 12000, jobs: 14000, r: 1.5 }),   // 城东、高新区
      at(31.9450, 120.1600, { pop: 8000, jobs: 11000, r: 1.6 }),    // 申港、利港（沿江）
      at(31.8700, 120.4200, { pop: 14000, jobs: 16000, r: 1.8 }),   // 华士、周庄
      at(31.7600, 120.2400, { pop: 7000, jobs: 5000, r: 1.5 }),     // 青阳
      at(31.8100, 120.5000, { pop: 6000, jobs: 4000, r: 1.5 }),     // 长泾、顾山
      // 宜兴（2010 年估算）
      at(31.3570, 119.8230, { pop: 32000, jobs: 26000, r: 1.8 }),   // 宜城
      at(31.3000, 119.8480, { pop: 18000, jobs: 15000, r: 1.6 }),   // 丁蜀
      at(31.4400, 119.6800, { pop: 7000, jobs: 6000, r: 1.5 }),     // 官林、徐舍
      at(31.2700, 119.6400, { pop: 5000, jobs: 3000, r: 1.5 }),     // 张渚
      at(31.4300, 119.9200, { pop: 6000, jobs: 4000, r: 1.5 }),     // 和桥、周铁
    ],
    rural: { pop: 600, jobs: 150 },
    // 铁路通车年份（线路名或前缀 → 年份，或 [通车, 停运]）
    railYears: { '京沪线': 1968, '沪宁线': 1908, '新长线': 2005, '京沪高铁': 2011, '沪宁城际线': 2010, '沪宁高速线': 2010, '沪宁沿江高速线': 2023, '京沪高速线': 2011, '宁杭高速线': 2013, '宁杭高铁': 2013, '盐宜高速线': 2026 },
    // 道路通车年份（名称完全相同或前缀匹配；未列出的道路随所在片区开放）
    roadYears: {
      '中山路': 1950, '人民路': 1950, '解放路': 1950, '复兴路': 1950, '县前街': 1950, '学前街': 1960, '崇宁路': 1950,
      '太湖大道': 1995, '运河东路': 1990, '运河西路': 1995, '梁溪路': 1985, '梁清路': 1988, '清扬路': 1988,
      '锡澄路': 1980, '通惠路': 1978, '兴源路': 1992, '金城路': 2000, '金城东路': 2008, '长江路': 1993,
      '旺庄路': 1996, '锡兴路': 2002, '高浪路': 2003, '菱湖大道': 2006, '蠡湖大道': 2005, '环湖路': 2004,
      '锡东大道': 2010, '凤翔路': 2007, '机场路': 2002, '沪宁高速': 1996, '锡宜高速': 2003, '锡澄高速': 1999,
      '环太湖高速': 2008, '锡太路': 2007, '具区路': 2007, '新华路': 2003, '梅园路': 1980, '惠山大道': 2002,
      '广石路': 2001, '江海路': 1998, '兴昌北路': 2006, '盛岸路': 1985, '震泽路': 2009, '吴都路': 2010,
    },
    bridgeYears: {
      '吴桥': 1916, '莲蓉桥': 1952, '清宁桥': 1955, '跨塘桥': 1958, '大公桥': 1958, '梁溪大桥': 1983, '蠡桥': 1985,
      '金城大桥': 1997, '锡山大桥': 1990, '蠡湖大桥': 2004, '宝界桥': 1934, '犊山大桥': 1995, '十八湾大桥': 2005,
      '太湖大道隧道': 1995, '蠡湖隧道': 2010, '具区路隧道': 2012, '华清大桥': 2003, '蓉湖大桥': 1998,
    },
    bridgeDefaultYear: 1995,
    linkRoadYears: true,
    simRoads: [],
    regionOpenRevision: 1,   // 片区开放年份修订号：读档时据此关闭「数据里改晚、且还没有车站」的片区
    // 风景区内允许设站的圆形范围（v2.10 社区版）：中心与半径（米）
    stationAllow: [{ at: ll(31.423076, 120.101753), r: 200, name: '灵山大佛' }],
    landmarks: [
      Object.assign(at(31.5799, 120.2966), { id: 'wx_chongan', name: '崇安寺', w: 160, d: 120, year: 1900, kind: 'temple' }),
      Object.assign(at(31.5686, 120.3040), { id: 'wx_nanchansi', name: '南禅寺', w: 180, d: 150, year: 548, kind: 'temple' }),
      Object.assign(at(31.5597, 120.3126), { id: 'wx_qingming', name: '清名桥历史街区', w: 700, d: 300, rot: -30, year: 1600, kind: 'traditional' }),
      Object.assign(at(31.5839, 120.2696), { id: 'wx_huishan', name: '惠山古镇', w: 600, d: 400, rot: 15, year: 1500, kind: 'traditional' }),
      Object.assign(at(31.5825, 120.2664), { id: 'wx_jichang', name: '寄畅园', w: 260, d: 220, year: 1527, kind: 'traditional' }),
      Object.assign(at(31.5805, 120.2709), { id: 'wx_longguang', name: '锡山龙光塔', w: 80, d: 80, year: 1584, kind: 'pagoda', h: 40 }),
      Object.assign(at(31.5246, 120.2100), { id: 'wx_yuantouzhu', name: '鼋头渚', w: 1200, d: 800, year: 1918, kind: 'open' }),
      Object.assign(at(31.5192, 120.2547), { id: 'wx_liyuan', name: '蠡园', w: 300, d: 220, year: 1927, kind: 'traditional' }),
      Object.assign(at(31.5568, 120.2199), { id: 'wx_meiyuan', name: '梅园', w: 400, d: 300, year: 1912, kind: 'open' }),
      Object.assign(at(31.4321, 120.0915), { id: 'wx_lingshan', name: '灵山大佛', w: 200, d: 200, year: 1997, kind: 'memorial', h: 88 }),
      Object.assign(at(31.5909, 120.3018), { id: 'wx_station', name: '无锡站', w: 620, d: 260, year: 1906, kind: 'rail' }),
      Object.assign(at(31.5989, 120.4554), { id: 'wx_east', name: '无锡东站', w: 700, d: 380, rot: 20, year: 2010, kind: 'rail' }),
      Object.assign(at(31.4854, 120.2655), { id: 'wx_jiangnan', name: '江南大学', w: 1300, d: 900, rot: 10, year: 1958, kind: 'campus' }),
      Object.assign(at(31.5515, 120.3016), { id: 'wx_museum', name: '无锡博物院', w: 300, d: 220, year: 2008, kind: 'box' }),
      Object.assign(at(31.5530, 120.3010), { id: 'wx_taihusq', name: '太湖广场', w: 400, d: 380, year: 2000, kind: 'open' }),
      Object.assign(at(31.4930, 120.3077), { id: 'wx_civic', name: '无锡市民中心', w: 340, d: 240, year: 2010, kind: 'hall' }),
      Object.assign(at(31.5171, 120.2746), { id: 'wx_grand', name: '无锡大剧院', w: 300, d: 200, year: 2012, kind: 'opera', h: 40 }),
      Object.assign(at(31.5460, 120.2617), { id: 'wx_sports', name: '无锡体育中心', w: 400, d: 350, year: 1996, kind: 'stadium' }),
      Object.assign(at(31.4802, 120.3183), { id: 'wx_expo', name: '无锡太湖国际博览中心', w: 600, d: 400, year: 2009, kind: 'expo' }),
      Object.assign(at(31.5208, 120.2609), { id: 'wx_wheel', name: '蠡湖摩天轮', w: 120, d: 120, year: 2008, kind: 'wheel', h: 115 }),
      Object.assign(at(31.4863, 120.2317), { id: 'wx_sanguo', name: '央视无锡影视基地', w: 900, d: 700, year: 1987, kind: 'open' }),
      Object.assign(at(31.5250, 120.2100), { id: 'wx_18wan', name: '十八湾湿地', w: 900, d: 500, year: 2005, kind: 'open' }),
      // 江阴
      Object.assign(at(31.9045, 120.2607), { id: 'wx_jy_xingguo', name: '兴国塔', w: 90, d: 90, year: 1047, kind: 'pagoda', h: 42 }),
      Object.assign(at(31.8299, 120.4343), { id: 'wx_huaxi', name: '华西村', w: 700, d: 500, year: 1996, kind: 'tower', h: 98 }),
      Object.assign(at(31.9464, 120.2691), { id: 'wx_jy_bridge', name: '江阴长江大桥', w: 3000, d: 90, rot: 70, year: 1999, kind: 'open' }),
      Object.assign(at(31.8642, 120.2745), { id: 'wx_jy_station', name: '江阴站', w: 500, d: 240, rot: 12, year: 2023, kind: 'rail' }),
      // 宜兴
      Object.assign(at(31.3021, 119.6641), { id: 'wx_shanjuan', name: '善卷洞', w: 500, d: 400, year: 1982, kind: 'open' }),
      Object.assign(at(31.1626, 119.6920), { id: 'wx_zhuhai', name: '宜兴竹海', w: 1400, d: 900, year: 1995, kind: 'open' }),
      Object.assign(at(31.3260, 119.8069), { id: 'wx_longbeishan', name: '龙背山森林公园', w: 900, d: 700, year: 1998, kind: 'open' }),
      Object.assign(at(31.2617, 119.8258), { id: 'wx_yx_museum', name: '宜兴陶瓷博物馆', w: 260, d: 200, year: 1983, kind: 'box' }),
      Object.assign(at(31.3139, 119.8087), { id: 'wx_yx_station', name: '宜兴站', w: 460, d: 220, rot: -18, year: 2013, kind: 'rail' }),
      Object.assign(at(31.2700, 119.8586), { id: 'wx_shushan', name: '蜀山古南街', w: 500, d: 260, rot: 20, year: 1600, kind: 'traditional' }),
    ],
    // 重要设施（facility.js）：位置与启用/停用年份为史实参考（位置近似）；规模均为估算
    facilities: [
      { id: 'wx_rail', n: '无锡站', t: 'rail', lm: 'wx_station', pax: [[2000, 3.2], [2010, 5], [2019, 6], [2030, 6.5]] },
      { id: 'wx_east_f', n: '无锡东站', t: 'rail', lm: 'wx_east', y0: [2010, 7], pax: [[2010.6, 1.5], [2015, 3], [2030, 4]], note: '2010 年 7 月沪宁城际通车，无锡东站同时启用。' },
      { id: 'wx_xinqu_f', n: '无锡新区站', t: 'rail', at: ll(31.5445, 120.3655), y0: [2010, 7], pax: [[2010.6, 0.6], [2015, 1.2], [2030, 1.6]] },
      { id: 'wx_huishan_f', n: '惠山站', t: 'rail', at: ll(31.6900, 120.2200), y0: [2010, 7], pax: [[2010.6, 0.4], [2015, 0.9], [2030, 1.2]] },
      { id: 'wx_air', n: '苏南硕放国际机场', t: 'air', at: ll(31.4988, 120.4304), y0: [2004, 2], rw: [rw1a, rw1b],
        pax: [[2004.2, 0.35], [2010, 1.5], [2019, 3.2], [2030, 4.2]], note: '苏南硕放国际机场 2004 年 2 月开通民用航班（史实）；需求点设在航站楼。' },
      { id: 'wx_port', n: '清名桥古运河码头', t: 'port', at: ll(31.5585, 120.3055), y0: [2008, 10], pax: [[2008.8, 0.12], [2015, 0.25], [2030, 0.3]], note: '古运河水上巴士与游船码头（估算）。' },
      { id: 'wx_jiangnan_u', n: '江南大学', t: 'uni', lm: 'wx_jiangnan', w: 0.03 },
      { id: 'wx_taihu_u', n: '无锡太湖学院', t: 'uni', at: ll(31.5761, 120.2232), y0: 2002, w: 0.014 },
      { id: 'wx_voc', n: '无锡职业技术学院', t: 'uni', at: ll(31.5430, 120.2901), y0: 1978, w: 0.01 },
      { id: 'wx_ist', n: '无锡科技职业学院', t: 'uni', at: ll(31.5213, 120.3851), y0: 2003, w: 0.008 },
      { id: 'wx_rm', n: '无锡市人民医院', t: 'hosp', at: ll(31.5424, 120.3188), w: 0.05 },
      { id: 'wx_2h', n: '无锡市第二人民医院', t: 'hosp', at: ll(31.5711, 120.3011), w: 0.035 },
      { id: 'wx_tcm', n: '无锡市中医医院', t: 'hosp', at: ll(31.5407, 120.2774), w: 0.03 },
      { id: 'wx_4h', n: '江南大学附属医院', t: 'hosp', at: ll(31.4808, 120.2758), w: 0.03 },
      { id: 'wx_zs_shop', n: '中山路商圈', t: 'shop', at: ll(31.5790, 120.2960), r: 1.4, w: [[2000, 0.06], [2010, 0.08], [2020, 0.07]] },
      { id: 'wx_ca_shop', n: '崇安寺商圈', t: 'shop', at: ll(31.5795, 120.2995), w: 0.04 },
      { id: 'wx_qm_shop', n: '清名桥古运河商圈', t: 'shop', at: ll(31.5585, 120.3055), r: 1.2, y0: [2008, 10], w: [[2008.8, 0.012], [2015, 0.025]] },
      { id: 'wx_xq_shop', n: '新区宝龙商圈', t: 'shop', at: ll(31.5450, 120.3600), y0: 2008, w: [[2008, 0.01], [2016, 0.03]] },
      { id: 'wx_taihu_cbd', n: '太湖新城商务区', t: 'cbd', at: ll(31.4930, 120.3130), y0: [2008, 1], w: [[2008, 0.002], [2014, 0.012], [2020, 0.03]] },
      { id: 'wx_xq_cbd', n: '无锡新区商务区', t: 'cbd', at: ll(31.5420, 120.3680), y0: 2005, w: [[2005, 0.004], [2015, 0.018], [2030, 0.025]] },
      { id: 'wx_lihu_cbd', n: '蠡湖新城商务区', t: 'cbd', at: ll(31.5250, 120.2520), y0: 2008, w: [[2008, 0.002], [2018, 0.012]] },
      { id: 'wx_yuantouzhu_f', n: '鼋头渚', t: 'scenic', lm: 'wx_yuantouzhu', tour: true, w: 0.03 },
      { id: 'wx_lingshan_s', n: '灵山大佛', t: 'scenic', lm: 'wx_lingshan', tour: true, w: 0.022 },
      { id: 'wx_huishan_s', n: '惠山古镇', t: 'scenic', lm: 'wx_huishan', y0: [2008, 1], tour: true, w: [[2008, 0.008], [2015, 0.018]] },
      { id: 'wx_nanchansi_s', n: '南禅寺', t: 'scenic', lm: 'wx_nanchansi', tour: true, w: 0.012 },
      { id: 'wx_xihui_p', n: '锡惠公园', t: 'park', at: ll(31.5795, 120.2663), w: 0.02 },
      { id: 'wx_liyuan_p', n: '蠡园', t: 'park', lm: 'wx_liyuan', w: 0.012 },
      { id: 'wx_meiyuan_p', n: '梅园', t: 'park', lm: 'wx_meiyuan', w: 0.01 },
      { id: 'wx_18wan', n: '十八湾湿地', t: 'park', lm: 'wx_18wan', y0: 2005, w: 0.008 },
      { id: 'wx_sanguo_f', n: '央视无锡影视基地', t: 'scenic', lm: 'wx_sanguo', tour: true, w: 0.015 },
      { id: 'wx_sports_f', n: '无锡体育中心', t: 'stadium', lm: 'wx_sports', w: 0.014 },
      { id: 'wx_expo_f', n: '无锡太湖国际博览中心', t: 'venue', lm: 'wx_expo', w: 0.012 },
      { id: 'wx_ist_venue', n: '无锡新区会展中心', t: 'venue', at: ll(31.5380, 120.3720), y0: 2002, w: 0.008 },
      // 江阴
      { id: 'wx_jy_rail', n: '江阴站', t: 'rail', lm: 'wx_jy_station', y0: [2023, 9], pax: [[2023.7, 0.6], [2030, 1.4]], note: '2023 年 9 月南沿江高铁通车，江阴站启用（史实）。' },
      { id: 'wx_huaxi_f', n: '华西村', t: 'scenic', lm: 'wx_huaxi', tour: true, w: 0.014 },
      { id: 'wx_jy_hosp', n: '江阴市人民医院', t: 'hosp', at: ll(31.9112, 120.2703), w: 0.03 },
      { id: 'wx_jy_park', n: '黄山湖公园', t: 'park', at: ll(31.9281, 120.2722), w: 0.008 },
      // 宜兴
      { id: 'wx_yx_rail', n: '宜兴站', t: 'rail', lm: 'wx_yx_station', y0: [2013, 7], pax: [[2013.6, 0.8], [2019, 1.5], [2030, 2]], note: '2013 年 7 月宁杭高铁通车，宜兴站启用（史实）。' },
      { id: 'wx_shanjuan_f', n: '善卷洞', t: 'scenic', lm: 'wx_shanjuan', tour: true, w: 0.014 },
      { id: 'wx_zhuhai_f', n: '宜兴竹海', t: 'scenic', lm: 'wx_zhuhai', tour: true, w: 0.016 },
      { id: 'wx_longbeishan_f', n: '龙背山森林公园', t: 'park', lm: 'wx_longbeishan', w: 0.012 },
      { id: 'wx_yx_museum_f', n: '宜兴陶瓷博物馆', t: 'venue', lm: 'wx_yx_museum', tour: true, w: 0.008 },
      { id: 'wx_yx_hosp', n: '宜兴市人民医院', t: 'hosp', at: ll(31.3364, 119.7928), w: 0.028 },
      { id: 'wx_yx_uni', n: '无锡工艺职业技术学院', t: 'uni', at: ll(31.3414, 119.8329), y0: 2002, w: 0.012 },
    ],
    // 区名标注：用街道/镇一级的质心定位，避免用整个区（质心常落在湖面或乡野）
    districtLabels: [['崇安', ['崇安寺街道']], ['南长', ['清名桥街道']], ['北塘', ['北大街街道']], ['滨湖', ['河埒街道']], ['新区', ['旺庄街道']], ['锡山', ['东亭街道']], ['惠山', ['堰桥街道']], ['蠡湖', ['蠡湖街道']], ['太湖新城', ['太湖街道']], ['江阴', ['澄江街道']], ['宜兴', ['宜城街道']], ['丁蜀', ['丁蜀镇']]],
    // 纪事（只能在末尾追加：已发生记录按序号保存）
    events: [
      { y: 2010, m: 1, tag: '史实', title: '2010 年的无锡', desc: '全市常住人口约 637 万，城市沿京杭运河与中山路展开；崇安寺与南长街是商业中心，新区的集成电路与外资企业已成规模，蠡湖与太湖之间正在长出一座新城，尚无地铁。' },
      { y: 2010, m: 3, tag: '史实', title: '太湖治理与环湖生态', desc: '史实：2008 年无锡获联合国人居奖，太湖治理、蠡湖整治与保障房建设受到表彰。2010 年蠡湖、十八湾一带的湿地与公园已是市民周末的去处，鼋头渚与蠡湖的游客逐年增加。', task: { id: 'wx-e1', type: 'facShare', fac: 'wx_yuantouzhu_f', target: 0.1, months: 48, rewardMonths: 1, title: '坐地铁去看太湖', desc: '环湖路在节假日寸步难行，来鼋头渚与蠡湖的游客越来越多。让到鼋头渚的游客里有一成坐地铁。' } },
      { y: 2010, m: 7, tag: '史实', title: '沪宁城际通车，无锡东站启用', desc: '沪宁城际铁路通车，无锡东站、新区站与惠山站同时启用，锡东新城启动建设，城东成为新的门户。', fx: { grow: { region: 'xidong', pop: 1.4, jobs: 1.5, years: 8 } }, task: { id: 'wx-e2', type: 'facShare', fac: 'wx_east_f', target: 0.15, months: 48, rewardMonths: 1, title: '无锡东站的接驳', desc: '沪宁城际通车，无锡东站每天到发大量旅客。让到发旅客坐地铁接驳的比例达到 15%。' } },
      { y: 2011, m: 6, tag: '史实', title: '京沪高铁开通，无锡东站成为高铁枢纽', desc: '京沪高铁开通，无锡东站成为京沪高铁与沪宁城际的交汇车站，城东与锡东新城的往来明显增加。', fx: { grow: { region: ['xidong', 'xishan'], pop: 1.25, jobs: 1.25, years: 6 } } },
      { y: 2012, m: 6, tag: '史实', title: '北塘老工业区企业退城进园', desc: '北塘一带的纺织与机械企业陆续搬迁，老厂区改作居住与商业用地。' },
      { y: 2012, m: 7, tag: '史实', title: '太湖蓝藻再度暴发', desc: '7 月起太湖蓝藻再次大规模暴发，市区加密水质监测、加强供水保障，太湖治理与生态保护投入继续加大。' },
      { y: 2013, m: 7, tag: '史实', title: '宁杭高铁通车，宜兴站启用', desc: '宁杭高铁开通，宜兴进入高铁时代，宜兴站成为宜南的门户。', fx: { grow: { region: ['yixing', 'yixing_d'], pop: 1.3, jobs: 1.4, years: 8 } } },
      { y: 2014, m: 7, tag: '史实', title: '史实背景：无锡地铁 1 号线通车', desc: '现实中 1 号线于 2014 年 7 月开通，2 号线于同年 12 月开通。本局的地铁由你规划，真实线路不会自动出现。', fx: { demand: { lz: 1.1, months: 12 }, sat: { v: 1.5, months: 6 } } },
      { y: 2014, m: 12, tag: '史实', title: '史实背景：无锡地铁 2 号线通车', desc: '2 号线连接梅园与安镇，与 1 号线在三阳广场换乘，无锡地铁形成最初的十字骨架。本局的地铁由你规划，真实线路不会自动出现。' },
      { y: 2019, m: 9, tag: '史实', title: '史实背景：地铁 1 号线南延线通车', desc: '1 号线南延线开通，线路南端延伸到雪浪、葛埭桥与南方泉，太湖新城北部开始有地铁覆盖。本局的地铁由你规划，真实线路不会自动出现。' },
      { y: 2020, m: 10, tag: '史实', title: '史实背景：无锡地铁 3 号线通车', desc: '3 号线一期（苏庙—硕放机场）开通，无锡地铁线网由「十」字变成「米」字，机场与城北第一次被地铁连起来。本局的地铁由你规划，真实线路不会自动出现。' },
      { y: 2021, m: 1, tag: '模拟', title: '进入模拟发展阶段', desc: '此后人口、道路和区域变化按模拟规则推演，不代表真实历史。' },
      { y: 2021, m: 12, tag: '史实', title: '史实背景：无锡地铁 4 号线一期通车', desc: '4 号线一期开通，无锡地铁进入网络化运营阶段，运营里程超过 110 km。本局的地铁由你规划，真实线路不会自动出现。', fx: { demand: { lz: 1.05, months: 12 } } },
      { y: 2023, m: 9, tag: '史实', title: '南沿江高铁通车，江阴站启用', desc: '南沿江高铁开通，江阴站启用，江阴与南京、上海之间的通勤时间大幅缩短。', fx: { grow: { region: ['jiangyin', 'jiangyin_e'], pop: 1.25, jobs: 1.3, years: 8 } } },
      { y: 2024, m: 1, tag: '史实', title: 'S1 线开通，江阴接入地铁网', desc: '2024 年 1 月无锡地铁 S1 线开通，江阴城区接入无锡地铁网：锡澄之间可以坐地铁直达，江阴城区与无锡主城的通勤第一次有轨道交通可用。', fx: { grow: { region: ['jiangyin', 'jiangyin_e'], pop: 1.2, jobs: 1.2, years: 8 } } },
    ],
    // 本地历史主题任务：参考无锡的发展需求，不要求复刻真实线路走向（奖励单位：万元，2010 年价格）
    histTasks: [
      { id: 'wx1', appear: [2011, 1], deadline: [2020, 12], type: 'connect', reward: 160000, title: '参考 1 号线（2014 年通车）', desc: '建设连接老城、南长与太湖新城方向的南北向线路，为老城提供第一条轨道交通。', anchors: [anchor('三阳广场一带', 31.5775, 120.2985, 4), anchor('清名桥一带', 31.5585, 120.3055, 4), anchor('太湖新城一带', 31.4900, 120.3130, 5)] },
      { id: 'wx2', appear: [2012, 1], deadline: [2021, 12], type: 'connect', reward: 160000, title: '参考 2 号线（2014 年通车）', desc: '建设连接北塘、崇安与新区的东西向线路。', anchors: [anchor('北塘一带', 31.5985, 120.2895, 4), anchor('中山路一带', 31.5790, 120.2960, 4), anchor('新区一带', 31.5450, 120.3650, 5)] },
      { id: 'wx3', appear: [2011, 1], deadline: [2022, 12], type: 'connect', reward: 180000, title: '连接无锡东站', desc: '沪宁城际通车后，无锡东站成为城东门户。在车站附近设站并接入线网。', anchors: [anchor('无锡东站', 31.5987, 120.4750, 2.4), anchor('锡东新城', 31.6050, 120.4000, 4)] },
      { id: 'wx4', appear: [2012, 1], deadline: [2023, 12], type: 'connect', reward: 180000, title: '机场接驳', desc: '苏南硕放机场的旅客只能坐大巴进城。用地铁连接机场与新区、老城。', anchors: [anchor('硕放机场', 31.4980, 120.4320, 2.4), anchor('新区一带', 31.5450, 120.3650, 5)] },
      { id: 'wx5', appear: [2013, 1], deadline: [2027, 12], type: 'coverage', target: 0.22, reward: 220000, title: '地铁覆盖两成二人口', desc: '步行 15 分钟可到达地铁站的人口不低于全市人口的 22%。' },
      { id: 'wx6', appear: [2016, 1], deadline: [2029, 12], type: 'regionCov', regions: ['taihu'], areaName: '太湖新城', target: 0.25, months: 72, reward: 200000, title: '太湖新城的覆盖', desc: '太湖新城是城市南进的重点，让这里四分之一的居民步行就能到地铁站。' },
      { id: 'wx7', appear: [2020, 1], deadline: [2034, 12], type: 'connect', reward: 260000, title: '参考 S1 线（2024 年开通）', desc: 'S1 线把江阴城区接入无锡地铁网。修建连接江阴城区、堰桥与老城的市域线，让锡澄之间可以坐地铁通勤。', anchors: [anchor('江阴城区', 31.9210, 120.2860, 5), anchor('堰桥', 31.6800, 120.2900, 4), anchor('三阳广场', 31.5775, 120.2985, 3)] },
    ],
    dynTasks: [
      { id: 'wxd1', from: [2012, 1], to: [2026, 12], type: 'connect', months: 36, reward: 40000, title: '蠡湖新城的早高峰', desc: '蠡湖新城与河埒一带住进大量居民，早高峰进城要绕湖走。连接蠡湖、河埒与三阳广场。', anchors: [anchor('蠡湖', 31.5250, 120.2480, 4), anchor('河埒', 31.5500, 120.2620, 3), anchor('三阳广场', 31.5775, 120.2985, 3)] },
      { id: 'wxd2', from: [2013, 1], to: [2027, 12], type: 'connect', months: 36, reward: 40000, title: '新区到老城的通勤', desc: '新区的集成电路与外资企业雇了大量工人，他们多住在老城与南长。连接新区、南长与老城。', anchors: [anchor('无锡新区', 31.5450, 120.3650, 4), anchor('清名桥', 31.5585, 120.3055, 3), anchor('三阳广场', 31.5775, 120.2985, 3)] },
      { id: 'wxd3', from: [2015, 1], to: [2028, 12], type: 'connect', months: 36, reward: 45000, title: '锡东新城的居民', desc: '无锡东站一带的新城入住率越来越高。连接无锡东站、锡东新城与老城。', anchors: [anchor('无锡东站', 31.5987, 120.4750, 4), anchor('锡东新城', 31.6050, 120.4000, 4), anchor('三阳广场', 31.5775, 120.2985, 3)] },
    ],
    taskNote: '历史主题任务参考无锡 2010 年起的发展需求（老城线网、新区、无锡东站、硕放机场、太湖新城、江阴市域线），不要求按真实线路走向建设，只需满足目标描述。',
    // 城市策略难题（可选挑战）
    scenarios: [
      { id: 'wx-sc1', theme: '无锡：运河与太湖之间', title: '用有限预算串起老城与新区', type: 'budgetConnect', from: [2012, 1], to: [2024, 12], months: 60, rewardMonths: 3, budgetX: 1.2,
        anchors: [['三阳广场', 3], ['无锡新区', 4], ['清名桥', 3]],
        desc: '老城到新区是全城最繁忙的走廊，中间要跨运河与梁溪河，两头街巷密集、拆迁和地下施工都贵。预算只比一条笔直的地下线多一点，要在走向、站数和形式之间取舍。',
        tips: ['走向尽量直，少绕行就少花钱', '站点只放在客流最大的地方，少而精', '新区一侧的空地可以考虑高架'] },
      { id: 'wx-sc2', theme: '无锡：太湖与蠡湖', title: '跨湖进太湖新城，但别碰风景区', type: 'regionCov', from: [2014, 1], to: [2028, 12], months: 60, rewardMonths: 4,
        regions: ['taihu'], areaName: '太湖新城', target: 0.3,
        desc: '太湖新城是城市南进的重点，可它与老城之间隔着蠡湖与一片风景区，跨湖段贵、站也不能随便设。让太湖新城三成居民步行就能到地铁站。',
        tips: ['先找出最窄的跨湖断面', '风景区范围里只能走地下，站点放在风景区外缘', '老城一侧用换乘接入既有走廊'] },
    ],
    dataNote: [
      ['真实地理', 'hist', '京杭运河、梁溪河、太湖水系、长江江阴段、宜兴山区水系、道路与桥隧、铁路、公园与风景区、街道与区界、地名均来自 OpenStreetMap（© OpenStreetMap 贡献者，ODbL），为现代数据，按 250 m 网格投影。'],
      ['史实参考', 'hist', '区划调整、硕放机场民航开通、太湖蓝藻事件、沪宁城际与无锡东站、京沪高铁、宁杭高铁与宜兴站、南沿江高铁与江阴站、太湖新城与蠡湖新城开发、地标落成年份、无锡地铁各线通车年份（1、2 号线 2014 年，1 号线南延线 2019 年，3 号线 2020 年，4 号线 2021 年，S1 线 2024 年）。'],
      ['估算', 'est', '2010 年人口与就业分布、人口增长曲线、出行率、时间价值、造价、票价、运营费用与拨款、地图范围 GDP。'],
      ['模拟', 'sim', '2020 年之后的发展、居民出行选择、道路拥堵、客流与财政结果。普通铁路与高速铁路不参与乘客出行与运营模拟，只模拟车站的市内接驳出行；地面铁路按真实线位阻隔步行与小路；真实的无锡地铁与 S1 线不会自动出现。'],
      ['', '', '模拟结果不得作为真实无锡交通规划预测。'],
    ],
    // 线路配色参考无锡地铁 1 号线绿、2 号线蓝，其余为自拟
    lineColorsNice: ['#00a651', '#0063b0', '#e60012', '#f39800', '#8fc31f', '#8e44ad', '#00a0e9', '#c2185b', '#5c6bc0', '#7cb342', '#8d6e63', '#26a69a'],
    stationNameCorrections: {},
    places: (G.places || []).map(function (p) { return [p[0], p[1], p[2], p[3]]; }),
  };
  // 位置校正：与 OSM 地铁站/火车站同名的设施与任务锚点，改用车站位置（相距 12 格以内时）
  const ST = {}; for (const p of G.places || []) if ((p[3] === 0 || p[3] === 1) && !ST[p[0]]) ST[p[0]] = p;
  const nearSt = function (name, x, y) { const p = ST[name.replace(/（.*?）/g, '')]; return p && Math.hypot(p[1] - x, p[2] - y) < 12 ? p : null; };
  for (const f of data.facilities) if (f.at) { const p = nearSt(f.n, f.at[0], f.at[1]); if (p) f.at = [p[1], p[2]]; }
  for (const t of data.histTasks.concat(data.dynTasks)) for (const a of t.anchors || []) { const p = nearSt(a.name, a.x, a.y); if (p) { a.x = p[1]; a.y = p[2]; } }

  (CM.MAP_LIST = CM.MAP_LIST || []).push({
    id: 'wx', name: '无锡', title: '无锡 · 2010', sub: '真实地理 · 2010 年起 · 人民币',
    desc: '从 2010 年尚无地铁的无锡大市开始：京杭运河穿城而过，太湖与蠡湖在城南，江阴沿长江、宜兴靠山区，三片城区之间只有公路相连。跨湖段只能走地下，风景区不能开发，太湖新城与锡东新城正在城南城东长出来，2024 年 S1 线还要把江阴接进地铁网。',
    facts: [['范围', '96 km × 93 km'], ['起始', '2010 年'], ['人口', '约 637 万'], ['货币', '人民币（元）'], ['模式', '经营挑战 / 自由建造']],
    modes: ['challenge', 'free'], kind: 'real', mapVersion: 2, scenario: 'wx-2010',
    extent: [{ from: 1, dx: 180, dy: 84, oldW: 184, oldH: 160, newW: 384, newH: 372, note: '地图扩大到江阴与宜兴，覆盖无锡大市（含长江江阴段与宜南山区）',
      oldRegionIds: ['xihui', 'mashan', 'airport', 'chongan', 'nanchang', 'beitang', 'binhu', 'lihu', 'taihu', 'xinqu', 'shuofang', 'xishan', 'xidong', 'huishan', 'jiangyin', 'changshu', 'xiangcheng', 'changzhou', 'outer'],
      oldLandmarkIds: ['wx_chongan', 'wx_nanchansi', 'wx_qingming', 'wx_huishan', 'wx_jichang', 'wx_longguang', 'wx_yuantouzhu', 'wx_liyuan', 'wx_meiyuan', 'wx_lingshan', 'wx_station', 'wx_east', 'wx_jiangnan', 'wx_museum', 'wx_taihusq', 'wx_civic', 'wx_grand', 'wx_sports', 'wx_expo', 'wx_wheel', 'wx_sanguo'] }],
    region: '中国内地', tagline: '运河、太湖、长江与宜南山区的无锡大市', difficulty: 2, tags: ['无地铁开局', '跨湖', '市域线'],
    intro: '2010 年的无锡沿京杭运河与中山路生长，还没有地铁；北面江阴的乡镇工业沿长江铺开，南面宜兴的陶都与山区自成一片。接下来十几年，太湖新城与锡东新城相继成形，2014 年地铁 1、2 号线通车，2024 年 S1 线把江阴城区接进地铁网。你要在三片城区之间找到线路的走法，也可以先修市域快线把大市连起来。',
    features: [['wave', '太湖与蠡湖', '风景区不能开发，跨湖只能走地下，跨湖段还要另付环境费'], ['map', '江阴与宜兴', '长江江阴段、宜南山区与两座县级市都在图内，可修市域线'], ['flag', '7 项历史任务', '参考无锡地铁的发展需求，不要求复刻真实线路']],
    highlights: [[2010, '沪宁城际与无锡东站'], [2014, '地铁 1、2 号线通车'], [2019, '1 号线南延线'], [2020, '地铁 3 号线'], [2024, 'S1 线通到江阴']],
    geo: G, data: data,
    econ: { devOffset: 0, money: 1 },   // 无锡 2010 年 ≈ 广州样本 2010 年的发展阶段，人民币计价
    cfg: {
      W: 384, H: 372, ZONE: 12, START: { y: 2010, m: 1, d: 1, minute: 360 },
      growth: Object.assign({}, CM.CFG.growth, {
        popCurve: [[2000, 5.18e6], [2010, 6.37e6], [2015, 6.95e6], [2020, 7.46e6], [2030, 7.90e6], [2050, 8.30e6], [2300, 8.60e6]],
        histEnd: 2020,
        jobsRatio: [[2010, 0.56], [2015, 0.57], [2020, 0.58], [2040, 0.60]],
      }),
      money: { code: 'CNY', unit: '元', wan: '万元', yi: '亿元', sym: '¥' },
      econBase: 2000,
      // 造价（万元，2000 年价格；估算，参考无锡地铁 1 号线约 4.5 亿元/km 的量级）：跨运河与跨湖段附加较高
      cost: Object.assign({}, CM.CFG.cost, {
        trackPerKm: { underground: 45000, surface: 8000, elevated: 16000 },
        riverPerKm: { underground: 26000, surface: 18000, elevated: 18000 },
        hillPerKm: 12000, protectedPerKm: 7000,
        station: { underground: { S: 18000, M: 30000, L: 48000 }, elevated: { S: 9000, M: 14000, L: 22000 }, surface: { S: 6000, M: 9500, L: 14000 } },
        demolishPerCell: 40000,
      }),
      ops: Object.assign({}, CM.CFG.ops, { carKmCost: 0.0011, stationDaily: { S: 1.9, M: 3.2, L: 5.6 } }),
      fareDefault: { mode: 'flat', flat: 2 }, fareRange: { min: 0, max: 10, step: 0.1, scale: true },
      economy: Object.assign({}, CM.CFG.economy, { startFunds: 400000, grantBase: [[2000, 22000], [2005, 38000], [2010, 68000], [2015, 100000], [2020, 120000], [2050, 175000]], debtLimit: -260000, rewardScale: 1.3 }),
      // 城市经济（macro.js）：gdp0 是开局年的地图范围 GDP，按 2010 年约 5758 亿元计（估算：无锡大市 2010 年 GDP 约 5758 亿元）
      macro: {
        area: '地图范围（梁溪、滨湖、新吴、锡山、惠山与江阴、宜兴）', region: '中国内地',
        gdp0: 57580000, revRatio: [[2010, 0.17], [2020, 0.18], [2040, 0.17]], revElastic: 1.5,
        prod: [[2010, 0.07], [2011, 0.062], [2015, 0.05], [2020, 0.04], [2030, 0.026], [2050, 0.016], [2080, 0.012]],
        infl: 'cn', longRun: { infl: 0.02 }, histEnd: 2020, ref: 'cn',
        struct: { trade: 0.7, fin: 0.3, ind: 0.7, tour: 0.45, prop: 0.5 },
        events: [
          { id: 'quake2011', y: 2011, m: 3, scale: 0.5, desc: '东日本大地震冲击电子元器件与汽车零部件的供应，无锡的电子与机械企业短期减产。' },
          { id: 'cnstock2015', y: 2015, m: 6 },
          { id: 'g20_2016', y: 2016, m: 10, title: '世界物联网博览会落户无锡', desc: '物联网与集成电路成为无锡新的产业方向，展会、投资与太湖新城、新区的建设相互带动。' },
          { id: 'trade2018', y: 2018, m: 7, scale: 0.7 },
          { id: 'covid2020', y: 2020, m: 1, scale: 0.5, desc: '疫情使一季度的生产与消费大幅收缩，之后逐步恢复。' },
        ],
      },
    },
    cam: { cx: 271, cy: 177, zoom: 13 },
  });
})(window.CM);
