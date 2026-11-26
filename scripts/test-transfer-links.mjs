// 换乘连接回归测试：距离筛选、站内/出站计数规则、链接增删
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import path from 'node:path';
import assert from 'node:assert/strict';

const root = 'C:/Users/ASUS/Documents/deepseek-harness/default-workspace/city-and-metro/city-and-metro-main';
const scope = { console, performance, atob, btoa, TextEncoder, TextDecoder, setTimeout, clearTimeout, setInterval: () => 0, navigator: { hardwareConcurrency: 4 }, matchMedia: () => ({ matches: false }) };
scope.window = scope;
vm.createContext(scope);
const load = async f => vm.runInContext(await readFile(path.join(root, f), 'utf8'), scope, { filename: f });
const html = await readFile(path.join(root, 'index.html'), 'utf8');
for (const [, f] of html.matchAll(/<script src="([^"]+)"/g)) { await load(f); if (f === 'js/save.js') break; }
const { CM } = scope, M = CM.Metro;
CM.UI = function () {};
for (const f of ['settings', 'corp', 'fleet']) await load('js/' + f + '.js');
CM.useMap('wx');
const g = CM.Game.create({ mode: 'free', seed: 1 });
const net = g.net;
// 两座相距约 250 m 的车站（1 格 = 250 m），各属不同线路
const a = M.addStation(net, 275.0, 186.7, { size: 'M', type: 'underground' }, g.city);
const b = M.addStation(net, 276.0, 186.7, { size: 'M', type: 'elevated' }, g.city);
const l1 = M.newLine(net), l2 = M.newLine(net);
M.addSegment(net, l1, a, M.addStation(net, 278, 186.7, { size: 'M', type: 'underground' }, g.city), [], 'underground');
M.addSegment(net, l2, b, M.addStation(net, 274, 186.7, { size: 'M', type: 'elevated' }, g.city), [], 'elevated');

const cand = M.linkCandidates(net, a);
assert.ok(cand.some(c => c.id === b), '250 m 内的不同线路车站应成为候选');
assert.equal(M.stationGroups(net).count, 4, '未建立连接时 4 座车站');

M.linkStations(net, a, b, 'out');
assert.equal(M.stationGroups(net).count, 4, '出站换乘：4 座车站仍算 4 座');

M.linkStations(net, a, b, 'in');
assert.equal(M.stationGroups(net).count, 3, '站内换乘：两站合并为 1 座，总数 3');

assert.equal(M.linkCandidates(net, a).some(x => x.id === b), false, '已建立连接的站不再提示');
assert.equal(M.unlinkStations(net, a, b), true);
assert.equal(M.stationGroups(net).count, 4, '取消连接后恢复 4 座');

// 距离窗口：<100 m 或 >300 m 不提示
const c1 = M.addStation(net, 275.1, 186.7, { size: 'M', type: 'underground' }, g.city);
const c2 = M.addStation(net, 278.0, 186.7, { size: 'M', type: 'underground' }, g.city);
M.addSegment(net, l1, a, c2, [], 'underground');
assert.equal(M.linkCandidates(net, a).some(x => x.id === c1), false, '<100 m 不提示');
assert.equal(M.linkCandidates(net, a).some(x => x.id === c2), false, '>300 m（同线路）不提示');

console.log('PASS 换乘连接：候选距离、站内合并计数、出站各计、增删与不提示');
