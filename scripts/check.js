#!/usr/bin/env node
/**
 * 数据与隐私自检
 * 用法：node scripts/check.js
 * 退出码：0 = 无错误（可能有警告）；1 = 有错误
 */
"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.resolve(__dirname, "..");
const errors = [];
const warns = [];
const stat = (k, n) => { stat[k] = (stat[k] || 0) + n; };

const DATA_FILES = [
  "data/meta.js",
  "data/schools-hu-su.js",
  "data/schools-zhe-wan.js",
  "data/advisors.js",
  "data/jobs-gov.js",
  "data/jobs-corp.js",
  "data/certs.js",
  "data/timeline.js",
  "data/calendar.js",
  "data/actions.js",
  "data/changelog.js"
];

const ENUMS = {
  province: ["上海", "江苏", "浙江", "安徽"],
  enrollment: ["是", "否", "待核实"],
  cycleStatus: ["已发布", "未发布", "未发布（参考上一年）", "已截止", "已完结"],
  classMode: ["周末", "集中", "周末+集中", "工作日", "线上", "未获取", "周末/集中"],
  directed: ["要求定向", "不要求定向", "未明确", "未获取"],
  sourceType: ["official", "thirdparty"],
  bgTags: ["药检系统", "药监审评", "中检院", "药典委", "GMP检查员", "企业质量", "无", "未获取"],
  degreeType: ["专业学位", "学术学位"],
  certCategory: ["证书", "职称"]
};

const S = (v) => typeof v === "string";
const A = (v) => Array.isArray(v);
const isMissing = (v) => v === "未获取" || v === "未知";
const validDate = (v) => !v || v === "未知" || /^\d{4}-\d{2}(-\d{2})?$/.test(v);
const href = (u) => typeof u === "string" && /^https?:\/\//.test(u);
const rootUrl = (u) => /^https?:\/\/[^/]+\/?$/.test(u || "");

function err(ctx, msg) { errors.push(`${ctx}: ${msg}`); }
function warn(ctx, msg) { warns.push(`${ctx}: ${msg}`); }
function req(obj, ctx, keys) {
  if (!obj || typeof obj !== "object") { err(ctx, "不是对象"); return; }
  for (const k of keys) {
    if (!(k in obj)) err(ctx, `缺少字段 ${k}`);
  }
}

// ---------- 加载数据 ----------
const DATA = {};
const loaded = [];
for (const f of DATA_FILES) {
  const p = path.join(ROOT, f);
  if (!fs.existsSync(p)) { warn(f, "数据文件尚未创建"); continue; }
  const ctx = { window: {} };
  vm.createContext(ctx);
  try {
    vm.runInContext(fs.readFileSync(p, "utf8"), ctx, { filename: f });
  } catch (e) {
    err(f, `语法/运行错误：${e.message}`);
    continue;
  }
  Object.assign(DATA, ctx.window.DATA || {});
  loaded.push(f);
}

// ---------- 来源 ----------
function checkSource(src, ctx, { needOfficial = false } = {}) {
  req(src, ctx, ["title", "publisher", "url", "type", "published", "accessed"]);
  if (src.url && !href(src.url)) err(ctx, `来源 url 非法：${src.url}`);
  if (src.url && rootUrl(src.url)) err(ctx, `来源 url 是站点首页，需具体页面：${src.url}`);
  if (src.type && !ENUMS.sourceType.includes(src.type)) err(ctx, `来源 type 非法：${src.type}`);
  if (src.published && !validDate(src.published)) err(ctx, `发布日期格式：${src.published}`);
  if (src.accessed && !validDate(src.accessed)) err(ctx, `查阅日期格式：${src.accessed}`);
  if (!S(src.title) || !src.title.trim()) err(ctx, "来源 title 为空");
  if (!S(src.publisher) || !src.publisher.trim()) err(ctx, "来源 publisher 为空");
  stat("sources", 1);
  if (src.type === "official") stat("sourcesOfficial", 1); else stat("sourcesThird", 1);
  if (needOfficial && src.type !== "official") warn(ctx, "该处需要至少一个官方来源");
}

function checkSources(list, ctx, opt) {
  if (!A(list) || list.length === 0) { err(ctx, "缺少 sources（至少 1 条）"); return; }
  list.forEach((s, i) => checkSource(s, `${ctx}.sources[${i}]`, opt));
  if (opt && opt.needOfficial && !list.some((s) => s.type === "official")) {
    err(ctx, "没有 official 来源，不能支撑事实性结论");
  }
}

function checkConflicts(list, ctx) {
  if (list === undefined) return;
  if (!A(list)) { err(ctx, "conflicts 必须是数组"); return; }
  list.forEach((c, i) => {
    req(c, `${ctx}.conflicts[${i}]`, ["field", "claims", "note"]);
    if (!A(c.claims) || c.claims.length < 2) err(ctx, `conflicts[${i}].claims 至少两条`);
  });
}

function checkMissing(list, ctx) {
  if (list === undefined) return;
  if (!A(list)) err(ctx, "missing 必须是数组");
  else stat("missingFields", list.length);
}

// ---------- 院校 ----------
const schoolIds = new Set();
function checkSchools(bundle, ctx) {
  if (!bundle) { warn(ctx, "数据缺失"); return; }
  req(bundle, ctx, ["meta", "items", "exclusions"]);
  req(bundle.meta, `${ctx}.meta`, ["region", "updatedAt", "coverageNote"]);
  if (!A(bundle.items)) { err(ctx, "items 必须是数组"); return; }
  bundle.items.forEach((s, i) => {
    const c = `${ctx}.items[${i}](${s.name || "?"})`;
    req(s, c, ["id", "name", "province", "city", "level", "college", "enrollment", "programs", "fitTags", "missing", "sources", "updatedAt", "confidence"]);
    if (s.id) { if (schoolIds.has(s.id)) err(c, `学校 id 重复：${s.id}`); schoolIds.add(s.id); }
    if (s.province && !ENUMS.province.includes(s.province)) err(c, `province 非法：${s.province}`);
    if (s.enrollment && !ENUMS.enrollment.includes(s.enrollment)) err(c, `enrollment 非法：${s.enrollment}`);
    if (s.confidence && !["已核实", "部分核实"].includes(s.confidence)) err(c, "confidence 非法");
    if (!A(s.fitTags)) err(c, "fitTags 必须是数组");
    checkMissing(s.missing, c);
    checkConflicts(s.conflicts, c);
    if (s.sources) checkSources(s.sources, c);
    if (s.enrollment === "是" && (!A(s.programs) || s.programs.length === 0)) err(c, "招非全但 programs 为空");
    if (s.enrollment === "是" && A(s.sources) && !s.sources.some((x) => x.type === "official")) err(c, "招非全但无官方来源");
    if (s.enrollment === "否" && A(s.programs) && s.programs.length) warn(c, "enrollment=否 但有 programs");
    stat("schools", 1);
    (s.programs || []).forEach((p, pi) => {
      const pc = `${c}.programs[${pi}]`;
      req(p, pc, ["programName", "programCode", "degreeType", "mode", "directionTags", "cycles"]);
      if (p.degreeType && !ENUMS.degreeType.includes(p.degreeType)) err(pc, `degreeType 非法：${p.degreeType}`);
      if (!A(p.cycles)) { err(pc, "cycles 必须是数组"); return; }
      p.cycles.forEach((cy, ci) => {
        const cc = `${pc}.cycles[${ci}](${cy.year})`;
        req(cy, cc, ["year", "status", "publishedAt", "planCount", "planRaw", "tuitionRaw", "tuitionTotal",
          "durationRaw", "durationYears", "classMode", "classModeRaw", "location", "examSubjects", "directed",
          "directedRaw", "agreementRaw", "scholarshipRaw", "dormRaw", "scores", "sources"]);
        if (typeof cy.year !== "number" || cy.year < 2024 || cy.year > 2029) err(cc, `year 异常：${cy.year}`);
        if (cy.status && !ENUMS.cycleStatus.includes(cy.status)) err(cc, `status 非法：${cy.status}`);
        if (cy.classMode && !ENUMS.classMode.includes(cy.classMode)) err(cc, `classMode 非法：${cy.classMode}`);
        if (cy.directed && !ENUMS.directed.includes(cy.directed)) err(cc, `directed 非法：${cy.directed}`);
        if (cy.publishedAt && !validDate(cy.publishedAt)) err(cc, "publishedAt 格式错误");
        if (!A(cy.examSubjects)) err(cc, "examSubjects 必须是数组");
        if (!A(cy.scores)) err(cc, "scores 必须是数组");
        (cy.scores || []).forEach((sc, si) => {
          req(sc, `${cc}.scores[${si}]`, ["year", "lineRaw", "lineType", "admittedCount", "adjustmentRaw"]);
        });
        checkMissing(cy.missing, cc);
        checkConflicts(cy.conflicts, cc);
        if (cy.sources) checkSources(cy.sources, cc);
        stat("cycles", 1);
        if (cy.status === "已发布") stat("cyclesPublished", 1);
      });
    });
  });
  (bundle.exclusions || []).forEach((e, i) => {
    const c = `${ctx}.exclusions[${i}](${e.name || "?"})`;
    req(e, c, ["id", "name", "province", "reason", "evidenceRaw", "sources", "updatedAt"]);
    if (e.province && !ENUMS.province.includes(e.province)) err(c, `province 非法：${e.province}`);
    checkSources(e.sources, c, { needOfficial: true });
    stat("exclusions", 1);
  });
}

// ---------- 导师 ----------
function checkAdvisors(bundle) {
  if (!bundle) { warn("advisors", "数据缺失"); return; }
  req(bundle, "advisors", ["meta", "items"]);
  if (!A(bundle.items)) { err("advisors", "items 必须是数组"); return; }
  const orders = new Map();
  bundle.items.forEach((a, i) => {
    const c = `advisors[${i}](${a.name || "?"})`;
    req(a, c, ["id", "schoolId", "schoolName", "college", "name", "title", "directionRaw", "directionTags",
      "backgroundTags", "partTimeEnrollment", "contactOrder", "missing", "sources", "updatedAt", "confidence"]);
    if (a.id && schoolIds.size) { /* id 唯一性在下面统一查 */ }
    if (a.schoolId && schoolIds.size && !schoolIds.has(a.schoolId)) warn(c, `schoolId 未在院校数据中找到：${a.schoolId}`);
    if (a.backgroundTags && !A(a.backgroundTags)) err(c, "backgroundTags 必须是数组");
    (a.backgroundTags || []).forEach((t) => { if (!ENUMS.bgTags.includes(t)) warn(c, `backgroundTags 未约定值：${t}`); });
    if (a.partTimeEnrollment && !["招非全", "不招非全", "未明确", "未获取"].includes(a.partTimeEnrollment)) err(c, "partTimeEnrollment 非法");
    if (a.contactOrder !== null && a.contactOrder !== undefined) {
      if (typeof a.contactOrder !== "number") err(c, "contactOrder 必须为数字或 null");
      else if (orders.has(a.contactOrder)) err(c, `contactOrder 重复：${a.contactOrder}`);
      else orders.set(a.contactOrder, a.name);
    }
    checkMissing(a.missing, c);
    checkSources(a.sources, c, { needOfficial: true });
    stat("advisors", 1);
    if ((a.backgroundTags || []).some((t) => ["药检系统", "药监审评", "中检院"].includes(t))) {
      if (!A(a.backgroundSources) || !a.backgroundSources.length) warn(c, "有体系内经历但缺 backgroundSources");
    }
  });
  if (!bundle.meta.updatedAt) err("advisors.meta", "缺少 updatedAt");
}

// ---------- 事业单位 ----------
function checkJobsGov(bundle) {
  if (!bundle) { warn("jobsGov", "数据缺失"); return; }
  req(bundle, "jobsGov", ["meta", "items"]);
  if (!A(bundle.items)) { err("jobsGov", "items 必须是数组"); return; }
  bundle.items.forEach((j, i) => {
    const c = `jobsGov[${i}](${j.position || "?"})`;
    req(j, c, ["id", "batch", "region", "city", "level", "unit", "position", "headcount", "educationRaw",
      "degree", "ageRaw", "freshRaw", "socialOk", "announcedAt", "sources", "updatedAt"]);
    if (j.region && !ENUMS.province.includes(j.region)) err(c, `region 非法：${j.region}`);
    if (j.socialOk && !["是", "否", "未明确"].includes(j.socialOk)) err(c, "socialOk 非法");
    if (j.announcedAt && !validDate(j.announcedAt)) err(c, "announcedAt 格式错误");
    if (j.headcount !== undefined && typeof j.headcount !== "number" && j.headcount !== "未获取") err(c, "headcount 类型错误");
    checkMissing(j.missing, c);
    checkSources(j.sources, c, { needOfficial: true });
    stat("jobsGov", 1);
  });
}

// ---------- 企业 ----------
function checkJobsCorp(bundle) {
  if (!bundle) { warn("jobsCorp", "数据缺失"); return; }
  req(bundle, "jobsCorp", ["meta", "items"]);
  if (!A(bundle.items)) { err("jobsCorp", "items 必须是数组"); return; }
  bundle.items.forEach((j, i) => {
    const c = `jobsCorp[${i}](${j.title || "?"})`;
    req(j, c, ["id", "company", "companyType", "city", "title", "education", "experience",
      "salaryRaw", "skills", "publishedAt", "url", "platform", "sourceType", "updatedAt"]);
    if (j.url && !href(j.url)) err(c, "url 非法");
    if (j.sourceType !== "thirdparty") warn(c, "招聘信息应为 thirdparty（除非企业官网原帖）");
    if (!A(j.skills)) err(c, "skills 必须是数组");
    checkMissing(j.missing, c);
    if (j.sourceType && !ENUMS.sourceType.includes(j.sourceType)) err(c, "sourceType 非法");
    const needsSource = j.sourceType === "official"
      ? ["title", "publisher", "url", "type", "published", "accessed"]
      : null;
    if (needsSource) {
      // 企业官网原帖：构造单条 source 亦可；缺失则警告
      if (!j.url) warn(c, "缺 url");
    }
    stat("jobsCorp", 1);
    if (j.salaryMin !== "未获取" && typeof j.salaryMin !== "number") warn(c, "salaryMin 建议为数字");
  });
}

// ---------- 证书 ----------
function checkCerts(bundle) {
  if (!bundle) { warn("certs", "数据缺失"); return; }
  req(bundle, "certs", ["meta", "items"]);
  if (!A(bundle.items)) { err("certs", "items 必须是数组"); return; }
  bundle.items.forEach((c0, i) => {
    const c = `certs[${i}](${c0.name || "?"})`;
    req(c0, c, ["id", "name", "category", "issuer", "conditionRaw", "timeline", "validityRaw", "utilityRaw", "sources", "updatedAt"]);
    if (c0.category && !ENUMS.certCategory.includes(c0.category)) err(c, "category 非法");
    if (c0.timeline && !A(c0.timeline)) err(c, "timeline 必须是数组");
    checkMissing(c0.missing, c);
    checkSources(c0.sources, c, { needOfficial: false });
    stat("certs", 1);
  });
}

// ---------- 时间线 / 日历 / 清单 ----------
function checkTimeline(t) {
  if (!t) { warn("timeline", "数据缺失"); return; }
  req(t, "timeline", ["meta", "phases"]);
  if (!A(t.phases)) { err("timeline", "phases 必须是数组"); return; }
  t.phases.forEach((p, i) => {
    req(p, `timeline.phases[${i}]`, ["id", "title", "items"]);
    if (!A(p.items)) { err(`timeline.phases[${i}]`, "items 必须是数组"); return; }
    p.items.forEach((it, j) => {
      const c = `timeline.phases[${i}].items[${j}]`;
      req(it, c, ["event", "when", "missIf", "type"]);
      if (!["official", "experience"].includes(it.type)) err(c, "type 必须是 official/experience");
      if (it.type === "official" && (!A(it.sources) || !it.sources.length)) warn(c, "official 条目缺 sources");
      if (it.type === "experience" && A(it.sources) && it.sources.length) warn(c, "experience 条目不应挂官方来源");
      (it.sources || []).forEach((s, k) => checkSource(s, `${c}.sources[${k}]`));
      stat("timelineItems", 1);
    });
  });
}

function checkCalendar(cal) {
  if (!cal) { warn("calendar", "数据缺失"); return; }
  req(cal, "calendar", ["meta", "months"]);
  if (!A(cal.months)) { err("calendar", "months 必须是数组"); return; }
  cal.months.forEach((m, i) => {
    if (typeof m.month !== "number" || m.month < 1 || m.month > 12) err(`calendar.months[${i}]`, "month 非法");
    if (!A(m.items)) err(`calendar.months[${i}]`, "items 必须是数组");
    (m.items || []).forEach((it, j) => {
      const c = `calendar.months[${i}].items[${j}]`;
      req(it, c, ["what", "action", "type"]);
      if (!["official", "experience"].includes(it.type)) err(c, "type 必须是 official/experience");
      (it.sources || []).forEach((s, k) => checkSource(s, `${c}.sources[${k}]`));
      stat("calendarItems", 1);
    });
  });
}

function checkActions(a) {
  if (!a) { warn("actions", "数据缺失"); return; }
  req(a, "actions", ["meta", "tiers"]);
  if (!A(a.tiers)) { err("actions", "tiers 必须是数组"); return; }
  a.tiers.forEach((t, i) => {
    req(t, `actions.tiers[${i}]`, ["label", "items"]);
    if (!A(t.items)) err(`actions.tiers[${i}]`, "items 必须是数组");
    (t.items || []).forEach((it, j) => {
      const c = `actions.tiers[${i}].items[${j}]`;
      req(it, c, ["id", "title", "detail", "doneWhen", "tag"]);
      stat("actions", 1);
    });
  });
  const total = (a.tiers || []).reduce((n, t) => n + (t.items || []).length, 0);
  if (total < 10) warn("actions", `清单条目为 ${total}，目标 10 条`);
}

function checkMeta(m) {
  if (!m) { warn("meta", "数据缺失"); return; }
  req(m, "meta", ["siteTitle", "version", "updatedAt", "latestAdmissionYear", "intro", "usage", "disclaimer"]);
  if (m.latestAdmissionYear !== undefined && typeof m.latestAdmissionYear !== "number") err("meta", "latestAdmissionYear 应为数字");
  if (!A(m.usage)) err("meta", "usage 必须是数组");
}

function checkChangelog(c) {
  if (!c) { warn("changelog", "数据缺失"); return; }
  if (!A(c.items)) { err("changelog", "items 必须是数组"); return; }
  c.items.forEach((it, i) => {
    req(it, `changelog[${i}]`, ["date", "version", "type", "sections", "text"]);
    if (it.date && !validDate(it.date)) err(`changelog[${i}]`, "日期格式");
    if (!A(it.sections)) err(`changelog[${i}]`, "sections 必须是数组");
  });
}

// ---------- 唯一性 ----------
function checkUniqueIds() {
  const seen = new Map();
  const walk = (obj, ctx) => {
    if (!obj || typeof obj !== "object") return;
    if (A(obj)) { obj.forEach((x, i) => walk(x, `${ctx}[${i}]`)); return; }
    if (typeof obj.id === "string") {
      if (seen.has(obj.id)) err(ctx, `id 重复：${obj.id}（先出现于 ${seen.get(obj.id)}）`);
      else seen.set(obj.id, ctx);
    }
    for (const k of Object.keys(obj)) {
      if (["sources", "backgroundSources", "conflicts"].includes(k)) continue;
      if (typeof obj[k] === "object") walk(obj[k], `${ctx}.${k}`);
    }
  };
  walk(DATA, "DATA");
}

checkMeta(DATA.meta);
checkSchools(DATA.schoolsHuSu, "schoolsHuSu");
checkSchools(DATA.schoolsZheWan, "schoolsZheWan");
checkAdvisors(DATA.advisors);
checkJobsGov(DATA.jobsGov);
checkJobsCorp(DATA.jobsCorp);
checkCerts(DATA.certs);
checkTimeline(DATA.timeline);
checkCalendar(DATA.calendar);
checkActions(DATA.actions);
checkChangelog(DATA.changelog);
checkUniqueIds();

// ---------- 隐私与文风扫描 ----------
const SCAN_EXT = [".html", ".css", ".md"];
const SKIP_DIRS = new Set(["scripts", "node_modules", ".git", "research", "docs"]);
const HARD = [
  [/前女友|女友|女朋友|礼物|送给|想你|彩蛋|祝福|署名|告白/, "私人化措辞"],
  [/(?:19|20)\d{2}\s*[年\-/]\s*\d{1,2}\s*[月\-/]\s*\d{1,2}\s*(?:日|号)?\s*(?:出生|生|生日)/, "出生日期类信息"],
  [/籍贯|祖籍|老家|出生地/, "籍贯/出生地信息"],
  [/AI\s*生成|人工智能生成|由\s*AI|ChatGPT|大模型生成|本工具/, "AI 痕迹"],
  [/占位符|TODO|FIXME|lorem ipsum/i, "模板痕迹"],
  [/直签|劳务派遣|合同制|非在编|编制外/, "用工性质措辞（需人工确认是否必要）"],
  [/税前\s*\d|税后\s*\d|月入\s*\d|到手\s*\d/, "个人收入类信息"]
];
// 正文代词（模板块可豁免）
const PRONOUN = [/你|您/, /她/, /(?<!其)他/, /我(?!们)/];

function stripTemplates(text) {
  return text
    .replace(/<pre[^>]*class="[^"]*tpl[^"]*"[^>]*>[\s\S]*?<\/pre>/gi, " ")
    .replace(/<div[^>]*class="[^"]*tpl[^"]*"[^>]*>[\s\S]*?<\/div>/gi, " ");
}

function walkFiles(dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    if (name.startsWith(".") || SKIP_DIRS.has(name)) continue;
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) walkFiles(p, out);
    else if (SCAN_EXT.includes(path.extname(name)) || (path.dirname(p) === path.join(ROOT, "data") && name.endsWith(".js"))) out.push(p);
  }
  return out;
}

const scanTargets = walkFiles(ROOT);
for (const p of scanTargets) {
  const rel = path.relative(ROOT, p);
  let text = fs.readFileSync(p, "utf8");
  const isHtml = p.endsWith(".html");
  const isTplPage = /(outreach|internal|agreement)\.html$/.test(p);
  if (isHtml) text = stripTemplates(text);
  for (const [re, label] of HARD) {
    const m = text.match(re);
    if (m) {
      // 模板页中的【单位名称】等留空、以及公开机构名不在此列
      err(rel, `隐私/文风：${label}「${m[0]}」`);
    }
  }
  const pronounText = isTplPage ? stripTemplates(text) : text;
  for (const re of PRONOUN) {
    const m = pronounText.match(re);
    if (m) err(rel, `正文出现指向性代词「${m[0]}」`);
  }
  if (/[\u4e00-\u9fa5]/.test(text) === false) warn(rel, "无中文内容");
}

// ---------- 输出 ----------
const statOrder = ["schools", "exclusions", "cycles", "cyclesPublished", "advisors", "jobsGov", "jobsCorp",
  "certs", "timelineItems", "calendarItems", "actions", "sources", "sourcesOfficial", "sourcesThird", "missingFields"];
console.log("== 数据概况 ==");
for (const k of statOrder) console.log(`  ${k.padEnd(18)} ${stat[k] || 0}`);
console.log(`  已加载文件         ${loaded.length}/${DATA_FILES.length}`);

if (warns.length) {
  console.log(`\n== 警告 ${warns.length} 条 ==`);
  for (const w of warns.slice(0, 60)) console.log(`  ! ${w}`);
  if (warns.length > 60) console.log(`  ... 另有 ${warns.length - 60} 条`);
}
if (errors.length) {
  console.log(`\n== 错误 ${errors.length} 条 ==`);
  for (const e of errors.slice(0, 120)) console.log(`  x ${e}`);
  if (errors.length > 120) console.log(`  ... 另有 ${errors.length - 120} 条`);
  console.log("\n自检未通过。");
  process.exit(1);
}
console.log("\n自检通过（警告可接受，但需人工判断）。");
