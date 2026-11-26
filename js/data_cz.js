'use strict';
// 常州 · 2015 场景。地理来自 OpenStreetMap（geo_cz.js，现代数据），本文件补充 2015 年起的区域开放（按街道与区划分）、
// 跨运河桥梁、快速路通车年份、人口就业中心、地标、重要设施、历史事件、本地任务与人民币经营参数。坐标单位为格（250 m）。
// 本文件的经纬度按 OSM 的 WGS-84 填写（不套 GCJ-02 换算），用 ll(纬度, 经度) 投影。
// 真实性：2002 年武进撤市设区、2015 年戚墅堰并入武进与金坛撤市设区、常州科教城、京杭运河改线、沪宁城际与常州北站、
// 京沪高铁、沪宁沿江高铁、常州地铁各线通车年份、地标落成年份为史实参考；2015 年人口与就业分布、增长曲线、造价、票价与拨款为估算；
// 2020 年之后为模拟。
(function (CM) {
  const G = CM.GEOS && CM.GEOS.cz; if (!G) return;
  const P = G.proj;
  // 纯投影：本文件所有经纬度都是 OSM 使用的 WGS-84
  const ll = function (lat, lon) { return [+((lon - P.lon0) * P.kx).toFixed(2), +((P.lat0 - lat) * P.ky).toFixed(2)]; };
  const at = function (lat, lon, o) { const p = ll(lat, lon); return Object.assign({ x: p[0], y: p[1] }, o); };
  const poly = function (pts) { return pts.map(function (p) { return ll(p[0], p[1]); }); };
  const anchor = function (name, lat, lon, r) { const p = ll(lat, lon); return { name: name, x: p[0], y: p[1], r: r }; };

  // 风景区范围（不能开发，只能地下穿过或绕行）：茅山（金坛与句容交界）、南山竹海（溧阳南山）
  const maoshan = poly([[31.7000, 119.2400], [31.7000, 119.3600], [31.8600, 119.3600], [31.8600, 119.2400]]);
  const nanshan = poly([[31.1800, 119.3700], [31.1800, 119.4800], [31.2900, 119.4800], [31.2900, 119.3700]]);
  // 常州奔牛机场跑道（民用 1996 年 3 月开通，跑道 02/20，位于新北区奔牛镇）
  const rw1a = ll(31.9080, 119.7727), rw1b = ll(31.9314, 119.7843);
  // 镜头对准老城（文化宫一带），与投影无关
  const CAM = ll(31.7900, 119.9600);

  const data = {
    // 城市特色（traits.js）：新条目加在末尾，已触发事件按序号记录
    traits: [
      { use: 'crossing', star: true, icon: 'bridge', label: '运河与铁路', text: '京杭运河、新运河与沪宁铁路把城区切成几片，跨河与下穿铁路段造价明显更高', why: '常州因运河而生，老城夹在古运河与沪宁铁路之间，新北、戚墅堰与武进被运河和铁路分隔，跨河通道一直是建设的重点。' },
      { use: 'scenic', star: true, icon: 'wave', label: '茅山与南山', text: '茅山、南山竹海与天目湖一带不能开发，穿过山地与景区还要另付环境费', why: '茅山是道教名山与省级风景名胜区，溧阳南山竹海与天目湖是山地与湖滨生态景区，开发强度长期受限。' },
      { use: 'foresight', level: 'mid', star: true, icon: 'chart', label: '常州高新区提前布局', text: '高新区扩区前就通地铁，能得到开发商出资，片区也长得更快', id: 'cz-xb', pos: ll(31.8250, 119.9680), ym: [2018, 9], before: 2017, r: 7, region: 'xinbei', title: '常州高新区扩区',
        hit: '常州高新区扩区，早已通车的{st}站让这里一下子有了人气。', miss: '常州高新区扩区，可这里还没有地铁，通勤只能靠通江路。',
        why: '1992 年设立的常州高新区在 2000 年代扩容，装备制造与外资企业向新北集中。' },
      { use: 'foresight', level: 'light', icon: 'chart', label: '武进高新区升级', text: '武进高新区升级前就通地铁，能得到开发商出资，片区也长得更快', id: 'cz-wj', pos: ll(31.7280, 119.9480), ym: [2020, 9], before: 2019, r: 7, region: 'wujin', title: '武进高新区升级',
        hit: '武进高新区升级为国家高新区，早已通车的{st}站让湖塘一带更有吸引力。', miss: '武进高新区升级为国家高新区，可湖塘还没有地铁。',
        why: '武进高新区 2012 年升级为国家高新区，湖塘一带的装备与电子产业继续集聚。' },
      { use: 'guard', level: 'light', label: '古运河古建', guards: ['cz_tianningsi', 'cz_yancheng'], why: '天宁寺与淹城遗址是常州最重要的历史名胜，周边只能走地下。' },
      { use: 'finance', flavor: 'cn' },
      { use: 'cityLink', icon: 'bridge', label: '锡常口岸', map: 'wx', name: '无锡', region: 'wujin_s',
        gates: [
          { id: 'cz_gate_xy', n: '雪堰接驳口', to: '无锡 · 雪堰', at: ll(31.5299, 120.0462), dir: 'E', y: [2018, 1], pax: [[2018.5, 0.3], [2028, 0.6]], free: true, note: '雪堰一带，接无锡地铁。' },
          { id: 'cz_gate_ms', n: '马山接驳口', to: '无锡 · 马山', at: ll(31.4476, 120.1020), dir: 'E', y: [2016, 1], pax: [[2016.5, 0.3], [2026, 0.7]], free: true, note: '雪堰以东、马山半岛对岸。' },
        ],
        why: '常州与无锡之间在雪堰、马山各设一处口岸，接通后可乘地铁过境、切换到无锡，不另收跨境附加费。' },

    ],
    city: '常州', terrainRevision: 1, riverName: '京杭运河', hsrYear: 2010,
    stages: [[2019, '运河与老城'], [2021, '地铁时代'], [2025, '两湖与市域']], stageLast: '万亿之城',
    // 历史发展阶段（eras.js）：summary 中「史实」可查证，「估算」为模型设定的发展倾向
    eras: [
      { id: 'cz-e1', from: 2015, name: '老城与新区', tag: '史实',
        summary: '史实：2015 年常州主城区人口约 470 万，城市沿京杭运河与延陵路展开，南大街与文化宫是商业中心；新北高新区与武进湖塘承接新增的产业与居住，戚墅堰刚并入武进、金坛撤市设区；2019 年常州地铁 1 号线通车。估算：老城人口趋于饱和，新增居住落在新北与湖塘。',
        grow: { pop: { tianning: 0.8, zhonglou: 0.8, xinbei: 1.4, wujin: 1.2 }, jobs: { tianning: 1.1, zhonglou: 1.1, xinbei: 1.4, wujin: 1.2 } },
        demand: { decayHW: 0.9 }, corridors: [{ a: 'tianning', b: 'xinbei', f: 1.1 }, { a: 'zhonglou', b: 'wujin', f: 1.1 }],
        goals: [{ id: 'cz-g1', type: 'connect', months: 48, reward: 40000, title: '老城与新区', desc: '新北的装备制造与电子企业带来大量岗位，老城到新北只有几条公交线路。用地铁连接文化宫与新北一带。', anchors: [anchor('文化宫', 31.7780, 119.9560, 3), anchor('新北高新区', 31.8250, 119.9680, 5)] }] },
      { id: 'cz-e2', from: 2019, name: '地铁时代', tag: '史实',
        summary: '史实：2019 年 9 月常州地铁 1 号线通车，2021 年 6 月 2 号线通车并与 1 号线在文化宫换乘；武进湖塘与新北的装备制造、光伏与电子产业继续扩张，金坛撤市设区后开始承接主城产业。估算：湖塘与新北成为主要的新增居住与就业地，跨运河与铁路的通勤增加。',
        grow: { pop: { wujin: 1.6, xinbei: 1.6, kejiao: 1.5, qishuyan: 1.1, jintan: 1.1, tianning: 0.7, zhonglou: 0.7 }, jobs: { xinbei: 1.8, wujin: 1.6, kejiao: 1.4, tianning: 1.1, zhonglou: 1.0 } },
        relocate: { jobs: { zhonglou: 0.0004 } },
        demand: { sc: 1.05, decayHW: 1.05 },
        corridors: [{ a: 'tianning', b: 'wujin', f: 1.15 }, { a: 'xinbei', b: 'tianning', f: 1.15 }, { a: 'kejiao', b: 'tianning', f: 1.1 }],
        goals: [{ id: 'cz-g2', type: 'connect', months: 48, reward: 45000, title: '湖塘的通勤', desc: '地铁 1 号线通车后，湖塘的居民大量到老城上班，早晚高峰只有中吴大道与常武路几条通道。用地铁连接湖塘与文化宫。', anchors: [anchor('湖塘', 31.7280, 119.9480, 4), anchor('文化宫', 31.7780, 119.9560, 3)] },
          { id: 'cz-g3', type: 'connect', months: 48, reward: 45000, title: '高铁新城的接驳', desc: '京沪高铁常州北站每天到发大量旅客，从车站进城只能坐公交或打车。用地铁把常州北站接进老城。', anchors: [anchor('常州北站', 31.8494, 119.9507, 4), anchor('文化宫', 31.7780, 119.9560, 3)] }] },
      { id: 'cz-e3', from: 2022, name: '两湖与金坛', tag: '史实',
        summary: '史实：2021 年常州提出以滆湖、长荡湖为核心的「两湖」创新区，金坛撤市设区后金坛城区与尧塘一带开始承接主城产业转移；2023 年常州 GDP 突破一万亿元。估算：就业向两湖、金坛与武进南部扩散，跨湖与跨区通勤变长。',
        grow: { pop: { twohu: 1.5, wujin: 1.3, jintan: 1.35, xinbei: 1.2, tianning: 0.7, zhonglou: 0.7 }, jobs: { twohu: 1.6, xinbei: 1.3, wujin: 1.3, jintan: 1.3, tianning: 0.8 } },
        relocate: { jobs: { zhonglou: 0.0004 } },
        demand: { sh: 1.05, lz: 1.08, decayHW: 1.1, hub: 1.1 },
        corridors: [{ a: 'twohu', b: 'wujin', f: 1.2 }, { a: 'jintan', b: 'wujin', f: 1.15 }],
        goals: [{ id: 'cz-g4', type: 'regionCov', regions: ['wujin'], areaName: '武进（湖塘一带）', target: 0.2, months: 60, reward: 45000, title: '武进的覆盖', desc: '湖塘与武进高新区的居民越来越多，让武进两成居民步行就能到地铁站。' },
          { id: 'cz-g5', type: 'connect', months: 60, reward: 50000, title: '金坛的接驳', desc: '金坛撤市设区后与常州主城联系更紧，金坛城区到湖塘只有公路。用地铁把金坛城区接进武进。', anchors: [anchor('金坛城区', 31.7400, 119.5800, 5), anchor('湖塘', 31.7280, 119.9480, 5)] }] },
      { id: 'cz-e4', from: 2025, name: '市域与溧阳', tag: '模拟',
        summary: '模拟：此后的发展按模型推演，不代表真实历史。估算：就业继续向两湖、金坛与溧阳扩散，溧阳城区与天目湖一带随市域线与旅游增长，老城保持稳定。',
        grow: { pop: { twohu: 1.4, wujin: 1.2, jintan: 1.3, liyang: 1.3, xinbei: 1.2, tianning: 0.7, zhonglou: 0.7 }, jobs: { twohu: 1.5, xinbei: 1.3, wujin: 1.3, jintan: 1.2, liyang: 1.2, tianning: 0.8 } },
        relocate: { jobs: { zhonglou: 0.0003 } },
        demand: { lz: 1.15, decayHW: 1.15 },
        corridors: [{ a: 'twohu', b: 'wujin', f: 1.2 }, { a: 'jintan', b: 'wujin', f: 1.15 }, { a: 'liyang', b: 'wujin', f: 1.15 }],
        goals: [{ id: 'cz-g6', type: 'connect', months: 72, reward: 60000, title: '溧阳的市域线', desc: '溧阳城区与天目湖一带的居民到常州主城仍靠公路。用地铁把溧阳城区接进武进。', anchors: [anchor('溧阳城区', 31.4200, 119.4800, 5), anchor('湖塘', 31.7280, 119.9480, 5)] }] },
    ],
    briefing: {
      lead: '2015 年的常州还没有地铁。城市沿京杭运河与延陵路展开，南大街与文化宫是最热闹的地方；新北的高新区已经聚集了大量装备制造与外资企业，武进的湖塘与老城连成一片，金坛刚撤市设区，溧阳还守着天目湖与南山。公交与自行车是主要出行方式，地铁 1 号线要等到 2019 年才通车。',
      modes: [
        ['metro', '地铁', '尚无地铁。现实中 1 号线 2019 年、2 号线 2021 年才通车，本局由你规划，真实线路不会自动出现。'],
        ['bus', '公交与自行车', '延陵路与运河两岸的公交高峰期十分拥挤，自行车仍是通勤主力。'],
        ['bridge', '过河与跨铁路', '京杭运河与沪宁铁路把城区分成几片，跨河与下穿铁路的通道有限，绕行很远。'],
        ['rail', '铁路', '常州站承担对外铁路交通，2011 年京沪高铁常州北站启用。列车本身不参与模拟，车站会产生市内接驳出行，地面铁路会阻隔步行。'],
      ],
    },
    airport: null,
    runways: [{ a: rw1a, b: rw1b, from: 1996.3 }],
    regions: [
      // 风景区：茅山与南山竹海不能开发
      { id: 'maoshan', name: '茅山风景区（金坛·句容）', scenic: true, open: null, poly: maoshan, relief: 280, lockNote: '茅山山地与道教景区，只能地下穿过，不能设站开发' },
      { id: 'nanshan', name: '南山竹海（溧阳南山）', scenic: true, open: null, poly: nanshan, relief: 380, lockNote: '南山竹海与山地林场，只保留风景与林业用地，不能开发' },
      // 奔牛机场：照常运营，用地不开发，范围内只能地下设站与地下穿越
      { id: 'airport', name: '常州奔牛国际机场', poly: poly([[31.8800, 119.7300], [31.8800, 119.8200], [31.9600, 119.8200], [31.9600, 119.7300]]), open: null, hub: true, empty: true, lockNote: '民用机场照常运营，用地不开发', note: '1996 年开通民航；重要交通枢纽：范围内可以地下设站与地下穿越' },
      // 老城：天宁区与钟楼区（2015 年时的城区）
      { id: 'tianning', name: '天宁（文化宫·红梅）', district: ['天宁区'], seed: ll(31.7780, 119.9650), seedW: 1.3, seedIn: ['天宁区'], streets: ['天宁街道', '兰陵街道', '茶山街道', '红梅街道', '青龙街道', '雕庄街道', '郑陆镇'], open: 2015, plan: 'oldmix', note: '天宁寺、红梅公园与文化宫一带是常州的老城中心（史实）' },
      { id: 'zhonglou', name: '钟楼（南大街·怀德）', district: ['钟楼区'], seed: ll(31.7800, 119.9400), seedW: 1.3, seedIn: ['钟楼区'], streets: ['南大街街道', '荷花池街道', '五星街道', '永红街道', '西林街道', '新闸街道', '邹区镇'], open: 2015, plan: 'oldmix', note: '南大街、怀德桥与勤业一带是常州的商业与居住中心（史实）' },
      // 戚墅堰（2015 年并入武进区）
      { id: 'qishuyan', name: '戚墅堰（铁路工业区）', seed: ll(31.7200, 120.0550), seedW: 1.3, seedIn: ['武进区'], streets: ['戚墅堰街道', '丁堰街道', '潞城街道', '遥观镇'], open: 2015, plan: 'ind', note: '戚机厂、戚研所所在的铁路工业区，2015 年随戚墅堰区并入武进（史实）' },
      // 新北区
      { id: 'xinbei', name: '新北（高新区·河海）', district: ['新北区'], seed: ll(31.8250, 119.9680), seedW: 1.4, seedIn: ['新北区'], streets: ['河海街道', '三井街道', '龙虎塘街道', '薛家镇', '新桥镇'], open: 2015, plan: 'ind', growK: [1.5, 1.3], note: '1992 年设立的常州高新区，2000 年代装备制造与外资企业集中（史实）' },
      { id: 'xinbei_n', name: '新北沿江（春江·孟河）', seed: ll(31.9300, 119.8900), seedW: 1.6, seedIn: ['新北区'], streets: ['春江镇', '孟河镇', '西夏墅镇'], open: 2015, plan: 'port', note: '长江岸线的港口与临江化工、装备产业带（史实）' },
      // 武进区
      { id: 'wujin', name: '武进（湖塘·牛塘）', district: ['武进区'], seed: ll(31.7280, 119.9480), seedW: 1.5, seedIn: ['武进区'], streets: ['湖塘镇', '牛塘镇', '南夏墅街道', '西湖街道'], open: 2015, plan: 'mix', growK: [1.4, 1.2], note: '武进县城湖塘，2002 年撤市设区后与常州主城连成一片（史实）' },
      { id: 'wujin_e', name: '武进东部（遥观·横林·洛阳）', seed: ll(31.6900, 120.0700), seedW: 1.6, seedIn: ['武进区'], streets: ['遥观镇', '横林镇', '洛阳镇', '横山桥镇'], open: 2015, plan: 'resind', note: '横林的地板、洛阳的电机与遥观的纺织是常州东部的乡镇工业（史实）' },
      { id: 'wujin_s', name: '武进南部（前黄·雪堰）', seed: ll(31.6100, 119.9900), seedW: 1.7, seedIn: ['武进区'], streets: ['前黄镇', '雪堰镇', '礼嘉镇'], open: 2015, plan: 'res', relief: 120, note: '太湖湾与雪堰一带的低山与湖岸（史实）' },
      // 科教城（大学城）与两湖创新区：按年份开放的新城
      { id: 'kejiao', name: '常州科教城（大学城）', poly: poly([[31.6800, 119.9300], [31.6800, 119.9800], [31.7200, 119.9800], [31.7200, 119.9300]]), seed: ll(31.6980, 119.9550), seedW: 1.2, seedIn: ['武进区'], streets: ['湖塘镇'], open: 2015, plan: 'campus', note: '2002 年启动、2006 年前后建成的常州科教城，集中了常州大学与多所高职院校（史实）' },
      { id: 'twohu', name: '两湖创新区（滆湖·长荡湖）', poly: poly([[31.6400, 119.7800], [31.6400, 119.8800], [31.7300, 119.8800], [31.7300, 119.7800]]), seed: ll(31.7000, 119.8500), seedW: 1.6, seedIn: ['武进区'], streets: ['嘉泽镇', '湟里镇'], open: 2015, plan: 'newtown', note: '2021 年常州提出「两湖」创新区，滆湖与长荡湖之间成为新的发展空间（史实）' },
      // 金坛区
      { id: 'jintan', name: '金坛城区（金城·尧塘）', district: ['金坛区'], seed: ll(31.7400, 119.5800), seedW: 1.5, seedIn: ['金坛区'], streets: ['金城镇', '尧塘街道', '东城街道', '西城街道'], open: 2020, plan: 'mix', note: '2015 年金坛撤市设区，2020 年前后开始与常州主城一体化开发（史实）' },
      { id: 'jintan_w', name: '金坛西部（薛埠·直溪）', seed: ll(31.7700, 119.4600), seedW: 1.7, seedIn: ['金坛区'], streets: ['薛埠镇', '直溪镇', '朱林镇'], open: 2021, plan: 'resind', note: '茅山老区与建材、盐化工（史实）' },
      { id: 'jintan_s', name: '金坛南部（长荡湖·儒林）', seed: ll(31.6400, 119.5800), seedW: 1.6, seedIn: ['金坛区'], streets: ['儒林镇', '指前镇'], open: 2021, plan: 'res', note: '长荡湖东岸的圩区与水产养殖（史实）' },
      // 溧阳市（县级市，图内南部，可建设）
      { id: 'liyang', name: '溧阳城区（溧城·昆仑）', district: ['溧阳市'], seed: ll(31.4200, 119.4800), seedW: 1.5, seedIn: ['溧阳市'], streets: ['溧城镇', '溧城街道', '昆仑街道', '上黄镇'], open: 2024, plan: 'mix', note: '溧阳城区沿胥河与宁杭公路展开（史实）' },
      { id: 'liyang_n', name: '溧阳北部（上兴·竹箦）', seed: ll(31.5200, 119.4200), seedW: 1.7, seedIn: ['溧阳市'], streets: ['上兴镇', '竹箦镇', '南渡镇'], open: 2025, plan: 'resind' },
      { id: 'liyang_s', name: '溧阳南部（戴埠·天目湖）', seed: ll(31.3500, 119.4800), seedW: 1.6, seedIn: ['溧阳市'], streets: ['戴埠镇', '天目湖镇'], open: 2025, plan: 'res', relief: 180, note: '天目湖与南山一带的低山丘陵，旅游度假区（史实）' },
      // 图内的邻市范围：线路可以穿过，不能设站
      { id: 'mashan_wx', name: '无锡马山（接驳）', district: ['滨湖区'], open: 2016, plan: 'res', note: '常州图西侧的无锡马山一带，2016 年开放，供马山口岸接驳（示意）' },
      { id: 'outside', name: '周边县市（境外）', district: ['丹阳市', '句容市', '宜兴市', '江阴市', '梁溪区', '新吴区', '惠山区', '滨湖区', '锡山区', '溧水区', '高淳区', '郎溪县', '广德市', '扬中市', '泰兴市', '靖江市'], open: null, passOnly: true, lockNote: '常州以外的周边县市，不属于本图建设范围：线路可以穿过，不能设站' },
    ],
    defaultRegion: { id: 'outer', name: '外围地区', open: 2015, plan: 'res', pop: 2.4e6 },
    plans: CM.DATA.plans,
    // 片区设施（商业中心、区域医院、文体公园）出现门槛的人口基准：按 2015 年大市口径
    facPopRef: 4.70e6,
    // 2015 年人口与就业中心（估算，人/km²；r 约为影响半径 km）
    centers: [
      at(31.7780, 119.9560, { pop: 40000, jobs: 44000, r: 1.2 }),   // 文化宫、南大街
      at(31.7862, 119.9737, { pop: 22000, jobs: 24000, r: 1.0 }),   // 常州站、北环
      at(31.7650, 119.9420, { pop: 30000, jobs: 12000, r: 1.2 }),   // 清潭、兰陵
      at(31.7830, 119.9350, { pop: 26000, jobs: 11000, r: 1.2 }),   // 怀德桥、勤业
      at(31.7200, 120.0550, { pop: 16000, jobs: 22000, r: 1.3 }),   // 戚墅堰、戚机厂
      at(31.8250, 119.9680, { pop: 12000, jobs: 26000, r: 1.6 }),   // 新北高新区、河海
      at(31.9300, 119.8900, { pop: 5000, jobs: 9000, r: 1.5 }),     // 春江、圩塘（沿江）
      at(31.7280, 119.9480, { pop: 16000, jobs: 13000, r: 1.4 }),   // 湖塘
      at(31.6980, 119.9550, { pop: 5000, jobs: 7000, r: 1.2 }),     // 科教城（2006 年建成）
      at(31.6900, 120.0700, { pop: 7000, jobs: 8000, r: 1.3 }),     // 遥观、横林
      at(31.6100, 119.9900, { pop: 4000, jobs: 3000, r: 1.4 }),     // 前黄、雪堰
      at(31.7000, 119.8500, { pop: 2500, jobs: 2000, r: 1.4 }),     // 滆湖东岸、嘉泽（两湖）
      at(31.7400, 119.5800, { pop: 22000, jobs: 18000, r: 1.6 }),   // 金坛城区
      at(31.7700, 119.4600, { pop: 5000, jobs: 4000, r: 1.4 }),     // 薛埠、茅山
      at(31.4200, 119.4800, { pop: 24000, jobs: 20000, r: 1.6 }),   // 溧阳城区
      at(31.5200, 119.4200, { pop: 5000, jobs: 4000, r: 1.4 }),     // 上兴、竹箦
      at(31.3500, 119.4800, { pop: 4000, jobs: 3000, r: 1.4 }),     // 戴埠、天目湖
      at(31.8400, 119.7900, { pop: 4000, jobs: 3000, r: 1.2 }),     // 奔牛、机场
    ],
    rural: { pop: 560, jobs: 140 },
    // 铁路通车年份（线路名或前缀 → 年份，或 [通车, 停运]）
    railYears: {
      '京沪线': 1908, '京沪铁路': 1908, '沪宁线': 1908, '沪宁铁路': 1908,
      '新长线': 2005, '新长铁路': 2005,
      '沪宁城际': 2010, '沪宁城际线': 2010, '沪宁城际铁路': 2010,
      '京沪高铁': 2011, '京沪高速线': 2011, '京沪高速铁路': 2011,
      '连镇': 2020, '连镇高速线': 2020, '连镇高铁': 2020,
      '南沿江': 2023, '沪宁沿江高速线': 2023,
      '宁杭高速线': 2013, '宁杭高铁': 2013,
      '盐宜高速线': 2026,
    },
    // 道路通车年份（名称完全相同或前缀匹配；未列出的道路随所在片区开放）
    roadYears: {
      '延陵': 1950, '和平路': 1950, '怀德': 1950, '局前街': 1950, '南大街': 1950, '广化街': 1960,
      '晋陵': 1995, '通江': 1998, '龙城大道': 2002, '关河': 1986, '青洋': 2008, '常澄': 1985,
      '中吴大道': 2000, '长江路': 1993, '武宜': 1995, '兰陵': 1985, '劳动': 1985, '清潭': 1988,
      '花园': 1988, '汉江': 1995, '河海': 1998, '机场路': 2002, '常金': 2000, '长虹': 2005,
      '龙江路': 2008, '沪宁高速': 1996, '沿江高速': 2004, '常溧高速': 2015, '沪蓉高速': 1996,
      '常武': 1998, '运河路': 1990, '新堂路': 1998, '东方大道': 2005,
    },
    bridgeYears: {
      '文亨桥': 1548, '怀德桥': 1922,
      '龙城大桥': 2008, '青洋大桥': 2008, '常金大桥': 2008, '钟楼大桥': 2008,
      '常泰长江大桥': 2025,
    },
    bridgeDefaultYear: 1995,
    linkRoadYears: true,
    simRoads: [],
    regionOpenRevision: 1,   // 片区开放年份修订号：读档时据此关闭「数据里改晚、且还没有车站」的片区
    landmarks: [
      Object.assign(at(31.7795, 119.9715), { id: 'cz_tianningsi', name: '天宁寺', w: 320, d: 260, year: 650, kind: 'temple' }),
      Object.assign(at(31.7804, 119.9660), { id: 'cz_wenbita', name: '文笔塔', w: 60, d: 60, year: 480, kind: 'pagoda', h: 48 }),
      Object.assign(at(31.7723, 119.9685), { id: 'cz_hongmei', name: '红梅公园', w: 700, d: 500, year: 1958, kind: 'open' }),
      Object.assign(at(31.8254, 119.9969), { id: 'cz_dinosaur', name: '中华恐龙园', w: 1200, d: 900, rot: 10, year: 2000, kind: 'open' }),
      Object.assign(at(31.7437, 119.9330), { id: 'cz_yancheng', name: '淹城遗址', w: 1000, d: 800, year: -500, kind: 'traditional' }),
      Object.assign(at(31.7691, 119.9730), { id: 'cz_dongpo', name: '东坡公园', w: 300, d: 250, year: 1954, kind: 'traditional' }),
      Object.assign(at(31.7734, 119.9580), { id: 'cz_qingguoxiang', name: '青果巷', w: 600, d: 250, rot: 20, year: 1600, kind: 'traditional' }),
      Object.assign(at(31.8110, 119.9670), { id: 'cz_museum', name: '常州博物馆', w: 300, d: 220, year: 2007, kind: 'box' }),
      Object.assign(at(31.8104, 119.9709), { id: 'cz_grand', name: '常州大剧院', w: 260, d: 200, year: 2009, kind: 'opera', h: 40 }),
      Object.assign(at(31.7867, 119.9682), { id: 'cz_station', name: '常州站', w: 620, d: 260, year: 1908, kind: 'rail' }),
      Object.assign(at(31.8561, 119.9507), { id: 'cz_north', name: '常州北站', w: 700, d: 380, rot: 15, year: 2011, kind: 'rail' }),
      Object.assign(at(31.8160, 119.9470), { id: 'cz_sports', name: '常州奥体中心', w: 500, d: 400, year: 2005, kind: 'stadium' }),
      Object.assign(at(31.7461, 119.2895), { id: 'cz_maoshan', name: '茅山', w: 4000, d: 3000, year: 1986, kind: 'open' }),
      Object.assign(at(31.3235, 119.4437), { id: 'cz_tianmu', name: '天目湖', w: 4000, d: 3000, year: 1992, kind: 'open', shore: true }),
      Object.assign(at(31.2381, 119.4102), { id: 'cz_nanshan', name: '南山竹海', w: 3000, d: 2500, year: 1998, kind: 'open' }),
      Object.assign(at(31.7410, 119.5770), { id: 'cz_jintan_cut', name: '金坛刻纸艺术馆', w: 150, d: 120, year: 2008, kind: 'box' }),
      Object.assign(at(31.4930, 120.0060), { id: 'cz_xiexi', name: '环球动漫嬉戏谷', w: 900, d: 700, year: 2011, kind: 'open' }),
      Object.assign(at(31.7745, 119.9375), { id: 'cz_yunhe5', name: '运河五号创意街区', w: 300, d: 200, rot: -15, year: 2008, kind: 'traditional' }),
      Object.assign(at(31.6950, 119.8320), { id: 'cz_xitaihu', name: '西太湖花博园', w: 1500, d: 1000, year: 2013, kind: 'open', shore: true }),
      Object.assign(at(31.3880, 119.4977), { id: 'cz_liyang_station', name: '溧阳站', w: 460, d: 220, rot: -10, year: 2013, kind: 'rail' }),
      Object.assign(at(31.6973, 119.5390), { id: 'cz_jintan_station', name: '金坛站', w: 460, d: 220, rot: 8, year: 2023, kind: 'rail' }),
    ],
    // 重要设施（facility.js）：位置与启用/停用年份为史实参考（位置近似）；规模均为估算
    facilities: [
      { id: 'cz_rail', n: '常州站', t: 'rail', lm: 'cz_station', pax: [[2000, 2.2], [2010, 4.2], [2019, 5.2], [2030, 5.8]] },
      { id: 'cz_north_f', n: '常州北站', t: 'rail', lm: 'cz_north', y0: [2011, 6], pax: [[2011.5, 1.4], [2019, 3.6], [2030, 4.5]], note: '2011 年 6 月京沪高铁通车，常州北站同时启用。' },
      { id: 'cz_qishuyan_f', n: '戚墅堰站', t: 'rail', at: ll(31.7242, 120.0624), y0: [1908, 1], pax: [[2000, 0.1], [2010, 0.15], [2030, 0.2]] },
      { id: 'cz_liyang_f', n: '溧阳站', t: 'rail', lm: 'cz_liyang_station', y0: [2013, 7], pax: [[2013.6, 0.6], [2019, 1.1], [2030, 1.6]], note: '2013 年 7 月宁杭高铁通车，溧阳站启用（史实）。' },
      { id: 'cz_jintan_f', n: '金坛站', t: 'rail', lm: 'cz_jintan_station', y0: [2023, 9], pax: [[2023.7, 0.5], [2030, 1.2]], note: '2023 年 9 月沪宁沿江高铁通车，金坛站启用（史实）。' },
      { id: 'cz_air', n: '常州奔牛国际机场', t: 'air', at: ll(31.9185, 119.7752), y0: [1996, 3], rw: [rw1a, rw1b],
        pax: [[2000, 0.4], [2010, 1.2], [2019, 2.8], [2030, 3.6]], note: '常州奔牛机场 1996 年 3 月开通民用航班（史实）；需求点设在航站楼。' },
      { id: 'cz_cczu', n: '常州大学', t: 'uni', at: ll(31.7080, 119.9480), y0: 1978, w: 0.03, note: '常州大学武进校区，位于科教城西侧（史实）。' },
      { id: 'cz_hhu', n: '河海大学常州校区', t: 'uni', at: ll(31.8200, 119.9720), y0: 1986, w: 0.018 },
      { id: 'cz_czu', n: '常州工学院', t: 'uni', at: ll(31.8732, 119.9394), y0: 1978, w: 0.02 },
      { id: 'cz_jsut', n: '江苏理工学院', t: 'uni', at: ll(31.7533, 119.9125), y0: 1984, w: 0.02 },
      { id: 'cz_1h', n: '常州市第一人民医院', t: 'hosp', at: ll(31.7815, 119.9561), w: 0.05 },
      { id: 'cz_2h', n: '常州市第二人民医院', t: 'hosp', at: ll(31.7720, 119.9580), w: 0.04 },
      { id: 'cz_tcm', n: '常州市中医医院', t: 'hosp', at: ll(31.7752, 119.9605), w: 0.03 },
      { id: 'cz_4h', n: '常州市第四人民医院', t: 'hosp', at: ll(31.8722, 119.9588), w: 0.03 },
      { id: 'cz_ndj_shop', n: '南大街商圈', t: 'shop', at: ll(31.7790, 119.9535), r: 1.3, w: [[2000, 0.06], [2010, 0.08], [2020, 0.07]] },
      { id: 'cz_wuyue_shop', n: '武进吾悦广场', t: 'shop', at: ll(31.7320, 119.9480), y0: 2012, w: [[2012, 0.01], [2020, 0.03]] },
      { id: 'cz_wanda_shop', n: '新北万达广场', t: 'shop', at: ll(31.8201, 119.9648), y0: 2010, w: [[2010, 0.01], [2020, 0.025]] },
      { id: 'cz_xb_cbd', n: '新北商务区', t: 'cbd', at: ll(31.8200, 119.9650), y0: 2004, w: [[2004, 0.003], [2014, 0.012], [2030, 0.02]] },
      { id: 'cz_wj_cbd', n: '武进商务区', t: 'cbd', at: ll(31.7300, 119.9400), y0: 2008, w: [[2008, 0.002], [2018, 0.012]] },
      { id: 'cz_kj_cbd', n: '科教城研发园', t: 'cbd', at: ll(31.7000, 119.9550), y0: 2008, w: [[2008, 0.002], [2018, 0.01]] },
      { id: 'cz_tianningsi_f', n: '天宁寺', t: 'scenic', lm: 'cz_tianningsi', tour: true, w: 0.02 },
      { id: 'cz_dinosaur_f', n: '中华恐龙园', t: 'scenic', lm: 'cz_dinosaur', tour: true, w: 0.025 },
      { id: 'cz_yancheng_f', n: '淹城遗址', t: 'scenic', lm: 'cz_yancheng', tour: true, w: 0.015 },
      { id: 'cz_tianmu_f', n: '天目湖', t: 'scenic', lm: 'cz_tianmu', tour: true, w: 0.02 },
      { id: 'cz_maoshan_f', n: '茅山', t: 'scenic', lm: 'cz_maoshan', tour: true, w: 0.018 },
      { id: 'cz_nanshan_f', n: '南山竹海', t: 'scenic', lm: 'cz_nanshan', tour: true, w: 0.016 },
      { id: 'cz_hongmei_p', n: '红梅公园', t: 'park', lm: 'cz_hongmei', w: 0.02 },
      { id: 'cz_qingfeng_p', n: '青枫公园', t: 'park', at: ll(31.8046, 119.8943), w: 0.012 },
      { id: 'cz_dongpo_p', n: '东坡公园', t: 'park', lm: 'cz_dongpo', w: 0.01 },
      { id: 'cz_xitaihu_p', n: '西太湖花博园', t: 'park', lm: 'cz_xitaihu', y0: 2013, w: 0.01 },
      { id: 'cz_sports_f', n: '常州奥体中心', t: 'stadium', lm: 'cz_sports', w: 0.016 },
      { id: 'cz_expo_f', n: '常州国际会展中心', t: 'venue', at: ll(31.8102, 119.9739), y0: 2005, w: 0.012 },
      { id: 'cz_jintan_cut_f', n: '金坛刻纸艺术馆', t: 'venue', lm: 'cz_jintan_cut', y0: 2008, tour: true, w: 0.006 },
    ],
    // 区名标注：用街道/镇一级的质心定位，避免用整个区（质心常落在湖面或乡野）
    districtLabels: [['天宁', ['天宁街道']], ['钟楼', ['南大街街道']], ['戚墅堰', ['戚墅堰街道']], ['新北', ['河海街道']], ['武进', ['湖塘镇']], ['金坛', ['金城镇', '东城街道', '西城街道']], ['溧阳', ['溧城街道', '溧城镇', '昆仑街道']], ['孟河', ['孟河镇']], ['横林', ['横林镇']], ['薛埠', ['薛埠镇']]],
    // 纪事（只能在末尾追加：已发生记录按序号保存）
    events: [
      { y: 2015, m: 1, tag: '史实', title: '2015 年的常州', desc: '主城区人口约 470 万。城市沿京杭运河与延陵路展开，南大街与文化宫是商业中心；新北高新区与武进湖塘承接新增的产业与居住，金坛刚撤市设区，尚无地铁。' },
      { y: 2015, m: 5, tag: '史实', title: '戚墅堰并入武进，金坛撤市设区', desc: '戚墅堰区撤销并入武进区，金坛市撤销设立金坛区，常州形成五个市辖区。', fx: { grow: { region: ['jintan', 'qishuyan'], pop: 1.25, jobs: 1.2, years: 6 } } },
      { y: 2018, m: 10, tag: '史实', title: '沪宁沿江高铁开工', desc: '沪宁沿江高铁（南沿江）开工，在金坛设站，金坛与南京、上海之间的通勤时间将大幅缩短。', fx: { grow: { region: 'jintan', pop: 1.1, jobs: 1.1, years: 8 } } },
      { y: 2019, m: 9, tag: '史实', title: '常州地铁 1 号线通车', desc: '常州地铁 1 号线（森林公园—南夏墅）通车，串联常州北站、常州站、文化宫与武进湖塘。本局的地铁由你规划，真实线路不会自动出现。', fx: { demand: { lz: 1.1, months: 12 }, sat: { v: 1.5, months: 6 } },
        task: { id: 'cz-e1', type: 'facShare', fac: 'cz_rail', target: 0.15, months: 48, rewardMonths: 1, title: '常州站的接驳', desc: '地铁 1 号线通车，常州站每天到发大量旅客。让到发旅客坐地铁接驳的比例达到 15%。' } },
      { y: 2020, m: 6, tag: '史实', title: '金坛撤市设区后的开发', desc: '金坛撤市设区五年后，金坛城区与尧塘、华罗庚科技园一带开始承接主城产业转移，常金一体化推进。', fx: { grow: { region: 'jintan', pop: 1.2, jobs: 1.15, years: 6 } } },
      { y: 2021, m: 1, tag: '模拟', title: '进入模拟发展阶段', desc: '此后人口、道路和区域变化按模拟规则推演，不代表真实历史。' },
      { y: 2021, m: 6, tag: '史实', title: '常州地铁 2 号线通车', desc: '常州地铁 2 号线（青枫公园—五一路）通车，在文化宫与 1 号线换乘。本局的地铁由你规划，真实线路不会自动出现。', fx: { demand: { lz: 1.05, months: 12 } } },
      { y: 2021, m: 11, tag: '史实', title: '「两湖」创新区启动', desc: '常州提出以滆湖、长荡湖为核心建设「两湖」创新区，西太湖一带成为新的发展空间。', fx: { grow: { region: 'twohu', pop: 1.2, jobs: 1.2, years: 6 } } },
      { y: 2023, m: 12, tag: '史实', title: '常州 GDP 突破一万亿元', desc: '常州成为万亿之城，新能源与装备制造产业规模居前。', fx: { grow: { region: ['xinbei', 'wujin'], pop: 1.1, jobs: 1.15, years: 6 } } },
      { y: 2024, m: 1, tag: '模拟', title: '两湖创新区、金坛与溧阳继续成长', desc: '城市西部与北部的就业继续集聚，溧阳城区与天目湖一带随市域线与旅游发展，跨滆湖与跨运河的通勤增加。', fx: { grow: { region: ['twohu', 'xinbei', 'jintan', 'liyang'], pop: 1.12, jobs: 1.12, years: 6 } } },
    ],
    // 本地历史主题任务：参考常州的发展需求，不要求复刻真实线路走向（奖励单位：万元，按下发年份的价格指数折算）
    histTasks: [
      { id: 'cz1', appear: [2015, 1], deadline: [2032, 12], type: 'connect', reward: 180000, title: '参考 1 号线（2019 年通车）', desc: '建设连接新北、常州站、老城与武进湖塘的南北向线路，为常州提供第一条轨道交通。', anchors: [anchor('常州北站一带', 31.8494, 119.9507, 3), anchor('常州站一带', 31.7862, 119.9737, 3), anchor('文化宫一带', 31.7780, 119.9560, 4), anchor('湖塘一带', 31.7280, 119.9480, 4)] },
      { id: 'cz2', appear: [2016, 1], deadline: [2032, 12], type: 'connect', reward: 180000, title: '参考 2 号线（2021 年通车）', desc: '建设连接钟楼青枫公园、南大街、文化宫与戚墅堰的东西向线路。', anchors: [anchor('青枫公园', 31.7850, 119.9050, 3), anchor('南大街', 31.7790, 119.9535, 3), anchor('戚墅堰', 31.7200, 120.0550, 4)] },
      { id: 'cz3', appear: [2017, 1], deadline: [2032, 12], type: 'connect', reward: 180000, title: '连接常州北站', desc: '京沪高铁通车后，常州北站成为城北门户。在车站附近设站并接入线网。', anchors: [anchor('常州北站', 31.8494, 119.9507, 2.4), anchor('新北高新区', 31.8250, 119.9680, 4)] },
      { id: 'cz4', appear: [2018, 1], deadline: [2033, 12], type: 'connect', reward: 170000, title: '机场接驳', desc: '常州奔牛机场的旅客只能坐大巴进城。用地铁连接机场与新区、老城。', anchors: [anchor('奔牛机场', 31.9197, 119.7785, 2.4), anchor('新北高新区', 31.8250, 119.9680, 4)] },
      { id: 'cz5', appear: [2019, 1], deadline: [2034, 12], type: 'coverage', target: 0.22, reward: 220000, title: '地铁覆盖两成二人口', desc: '步行 15 分钟可到达地铁站的人口不低于全市人口的 22%。' },
      { id: 'cz6', appear: [2020, 1], deadline: [2036, 12], type: 'regionCov', regions: ['wujin'], areaName: '武进（湖塘一带）', target: 0.25, months: 72, reward: 200000, title: '武进的覆盖', desc: '武进是常州南部的重点，让这里四分之一的居民步行就能到地铁站。' },
    ],
    dynTasks: [
      { id: 'czd1', from: [2015, 1], to: [2028, 12], type: 'connect', months: 36, reward: 40000, title: '湖塘的早高峰', desc: '湖塘与牛塘住进大量居民，早高峰进城只有中吴大道与常武路。连接湖塘、清潭与文化宫。', anchors: [anchor('湖塘', 31.7280, 119.9480, 4), anchor('清潭', 31.7650, 119.9420, 3), anchor('文化宫', 31.7780, 119.9560, 3)] },
      { id: 'czd2', from: [2016, 1], to: [2030, 12], type: 'connect', months: 36, reward: 40000, title: '新北到老城的通勤', desc: '新北的装备制造与外资企业雇了大量工人，他们多住在老城与钟楼。连接新北、常州站与老城。', anchors: [anchor('新北高新区', 31.8250, 119.9680, 4), anchor('常州站', 31.7862, 119.9737, 3), anchor('文化宫', 31.7780, 119.9560, 3)] },
      { id: 'czd3', from: [2017, 1], to: [2032, 12], type: 'connect', months: 36, reward: 45000, title: '戚墅堰的居民', desc: '戚墅堰与经开区一带的居民越来越多，进城要绕运河与铁路。连接戚墅堰、常州站与老城。', anchors: [anchor('戚墅堰', 31.7200, 120.0550, 4), anchor('常州站', 31.7862, 119.9737, 3), anchor('文化宫', 31.7780, 119.9560, 3)] },
    ],
    taskNote: '历史主题任务参考常州 2015 年起的发展需求（老城线网、新北、湖塘、常州北站、奔牛机场），不要求按真实线路走向建设，只需满足目标描述。',
    // 城市策略难题（可选挑战）
    scenarios: [
      { id: 'cz-sc1', theme: '常州：运河与铁路之间', title: '用有限预算串起老城与新区', type: 'budgetConnect', from: [2005, 1], to: [2018, 12], months: 60, rewardMonths: 3, budgetX: 1.2,
        anchors: [anchor('文化宫', 31.7780, 119.9560, 3), anchor('常州站', 31.7862, 119.9737, 3), anchor('新北高新区', 31.8250, 119.9680, 5)],
        desc: '老城到新北是全城最繁忙的走廊，中间要跨京杭运河与沪宁铁路，两头街巷密集、拆迁和地下施工都贵。预算只比一条笔直的地下线多一点，要在走向、站数和形式之间取舍。',
        tips: ['走向尽量直，少绕行就少花钱', '站点只放在客流最大的地方，少而精', '新北一侧的空地可以考虑高架'] },
      { id: 'cz-sc2', theme: '常州：运河与湖岸', title: '跨过运河与滆湖，覆盖武进', type: 'regionCov', from: [2010, 1], to: [2026, 12], months: 60, rewardMonths: 4,
        regions: ['wujin'], areaName: '武进（湖塘一带）', target: 0.3,
        desc: '武进是常州南部的重点，湖塘与科教城住进大量年轻人，可从老城过去要跨运河、下穿铁路，滆湖东岸还有大片低地。让武进三成居民步行就能到地铁站。',
        tips: ['先找出最窄的跨河断面', '铁路两侧的站点放在既有通道附近', '湖塘与科教城用一条南北向走廊串起来'] },
    ],
    dataNote: [
      ['真实地理', 'hist', '京杭运河与新运河、滆湖、长荡湖、天目湖、长江新北段、茅山与南山、道路与桥隧、铁路、公园与风景区、街道与区界、地名均来自 OpenStreetMap（© OpenStreetMap 贡献者，ODbL），为现代数据，按 250 m 网格投影。'],
      ['史实参考', 'hist', '2002 年武进撤市设区与郊区改设新北区、2006 年常州科教城、2008 年京杭运河改线、2010 年沪宁城际与常州站城际场、2011 年京沪高铁与常州北站、2015 年戚墅堰并入武进与金坛撤市设区、2023 年沪宁沿江高铁金坛站、常州地铁各线通车年份、地标落成年份。'],
      ['估算', 'est', '2015 年人口与就业分布、人口增长曲线、出行率、时间价值、造价、票价、运营费用与拨款、地图范围 GDP。'],
      ['模拟', 'sim', '2020 年之后的发展、居民出行选择、道路拥堵、客流与财政结果。普通铁路与高速铁路不参与乘客出行与运营模拟，只模拟车站的市内接驳出行；地面铁路按真实线位阻隔步行与小路；真实的常州地铁 1、2 号线不会自动出现。'],
      ['', '', '模拟结果不得作为真实常州交通规划预测。'],
    ],
    // 线路配色参考常州地铁 1 号线红、2 号线蓝，其余为自拟
    lineColorsNice: ['#e60012', '#0063b0', '#f39800', '#00a651', '#8fc31f', '#8e44ad', '#00a0e9', '#c2185b', '#5c6bc0', '#7cb342', '#8d6e63', '#26a69a'],
    stationNameCorrections: {},
    places: (G.places || []).map(function (p) { return [p[0], p[1], p[2], p[3]]; }),
  };
  // 位置校正：与 OSM 地铁站/火车站同名的设施与任务锚点，改用车站位置（相距 12 格以内时）
  const ST = {}; for (const p of G.places || []) if ((p[3] === 0 || p[3] === 1) && !ST[p[0]]) ST[p[0]] = p;
  const nearSt = function (name, x, y) { const p = ST[name.replace(/（.*?）/g, '')]; return p && Math.hypot(p[1] - x, p[2] - y) < 12 ? p : null; };
  for (const f of data.facilities) if (f.at) { const p = nearSt(f.n, f.at[0], f.at[1]); if (p) f.at = [p[1], p[2]]; }
  for (const t of data.histTasks.concat(data.dynTasks)) for (const a of t.anchors || []) { const p = nearSt(a.name, a.x, a.y); if (p) { a.x = p[1]; a.y = p[2]; } }

  (CM.MAP_LIST = CM.MAP_LIST || []).push({
    id: 'cz', name: '常州', title: '常州 · 2015', sub: '真实地理 · 2015 年起 · 人民币',
    desc: '从 2015 年尚无地铁的常州开始：京杭运河穿城而过，老城夹在运河与沪宁铁路之间，新北的高新区已经聚集了大量装备制造与外资企业，武进的湖塘与主城连成一片，金坛刚撤市设区，溧阳还守着天目湖与南山。跨河与下穿铁路段贵、风景区不能开发，城市之后要向北接上高铁新城，向西铺开两湖创新区，2019 年才等来第一条地铁。',
    facts: [['范围', '114 km × 108 km'], ['起始', '2015 年'], ['人口', '约 470 万'], ['货币', '人民币（元）'], ['模式', '经营挑战 / 自由建造']],
    modes: ['challenge', 'free'], kind: 'real', mapVersion: 1, scenario: 'cz-2015',
    region: '中国内地', tagline: '运河、铁路与两湖之间的常州', difficulty: 2, tags: ['无地铁开局', '跨运河与铁路', '市域线'],
    intro: '2015 年的常州沿京杭运河与延陵路生长，还没有地铁；北面新北的高新区已经聚集了大量装备制造与外资企业，南面武进的湖塘与老城连成一片，西面金坛刚撤市设区，南面溧阳还守着天目湖与南山。接下来十年，地铁 1、2 号线通车，新北高铁新城与两湖创新区相继成型，金坛与溧阳也等来了高铁。你要在运河与铁路之间画下第一条线，再把武进、新北和两座县级市接进来。',
    features: [['bridge', '运河与铁路', '跨京杭运河与下穿沪宁铁路段造价更高，通道选择很关键'], ['map', '金坛与溧阳', '茅山、天目湖与南山竹海都在图内，可以修市域线'], ['flag', '6 项历史任务', '参考常州地铁的发展需求，不要求复刻真实线路']],
    highlights: [[2015, '戚墅堰并入武进、金坛设区'], [2019, '地铁 1 号线通车'], [2021, '地铁 2 号线通车、两湖创新区'], [2023, 'GDP 突破万亿、金坛站启用'], [2025, '常泰长江大桥通车']],
    geo: G, data: data,
    econ: { devOffset: 0, money: 1 },   // 常州 2015 年 ≈ 广州样本 2015 年的发展阶段，人民币计价
    cfg: {
      W: 456, H: 432, ZONE: 12, START: { y: 2015, m: 1, d: 1, minute: 360 },
      growth: Object.assign({}, CM.CFG.growth, {
        popCurve: [[2000, 3.45e6], [2005, 3.62e6], [2010, 4.60e6], [2015, 4.70e6], [2020, 5.28e6], [2030, 5.60e6], [2050, 5.95e6], [2300, 6.15e6]],
        histEnd: 2020,
        jobsRatio: [[2000, 0.50], [2005, 0.53], [2010, 0.56], [2015, 0.58], [2020, 0.59], [2040, 0.60]],
      }),
      money: { code: 'CNY', unit: '元', wan: '万元', yi: '亿元', sym: '¥' },
      econBase: 2000,
      // 造价（万元，2000 年价格；估算，参考常州地铁 1 号线约 4.2 亿元/km 的量级）：跨运河与下穿铁路段附加较高
      cost: Object.assign({}, CM.CFG.cost, {
        trackPerKm: { underground: 42000, surface: 7500, elevated: 15000 },
        riverPerKm: { underground: 24000, surface: 17000, elevated: 17000 },
        hillPerKm: 12000, protectedPerKm: 7000,
        station: { underground: { S: 17000, M: 28000, L: 45000 }, elevated: { S: 8500, M: 13000, L: 20000 }, surface: { S: 5500, M: 9000, L: 13000 } },
        demolishPerCell: 36000,
      }),
      ops: Object.assign({}, CM.CFG.ops, { carKmCost: 0.0010, stationDaily: { S: 1.7, M: 2.9, L: 5.0 } }),
      fareDefault: { mode: 'flat', flat: 2 }, fareRange: { min: 0, max: 10, step: 0.1, scale: true },
      economy: Object.assign({}, CM.CFG.economy, { startFunds: 330000, grantBase: [[2000, 20000], [2005, 34000], [2010, 60000], [2015, 90000], [2020, 110000], [2050, 160000]], debtLimit: -220000, rewardScale: 1.3 }),
      // 城市经济（macro.js）：2015 年地图范围 GDP 约 5273 亿元（史实：常州大市 2015 年 GDP 约 5273 亿元）
      macro: {
        area: '地图范围（天宁、钟楼、新北、武进、金坛与溧阳）', region: '中国内地',
        gdp0: 52732000, revRatio: [[2000, 0.12], [2010, 0.16], [2020, 0.17], [2040, 0.16]], revElastic: 1.5,
        prod: [[2000, 0.09], [2005, 0.088], [2008, 0.075], [2011, 0.062], [2015, 0.048], [2020, 0.04], [2030, 0.026], [2050, 0.016], [2080, 0.012]],
        infl: 'cn', longRun: { infl: 0.02 }, histEnd: 2020, ref: 'cn',
        struct: { trade: 0.7, fin: 0.25, ind: 0.8, tour: 0.45, prop: 0.5 },
        events: [
          { id: 'cnstock2015', y: 2015, m: 6 },
          { id: 'trade2018', y: 2018, m: 7, scale: 0.7 },
          { id: 'covid2020', y: 2020, m: 1, scale: 0.5, desc: '疫情使一季度的生产与消费大幅收缩，之后逐步恢复。' },
        ],
      },
    },
    cam: { cx: Math.round(CAM[0]), cy: Math.round(CAM[1]), zoom: 13 },
  });
})(window.CM);
