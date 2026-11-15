# 数据契约（SCHEMA）

本文件是站点数据的唯一契约。所有 `data/*.js` 必须符合本文件；`scripts/check.js` 会做自动校验。
**任何人不得改动字段名或语义**；确需新增字段，先改本文件并说明原因。

---

## 0. 总原则（比字段更重要）

1. **可溯源**：每一条事实都必须能点回一个具体页面（不是栏目首页、不是学校主页、不是平台首页）。
2. **宁缺勿造**：查不到就写 `"未获取"`，并在 `missing` 数组里列出。**严禁推测、估算、用常识补齐。**
3. **区分口径**：一手官方（学校研究生院/学院官网、研招网、人社/药监部门、法规原文）标
   `type: "official"`；培训机构、考研号、知乎小红书、招聘平台、薪资统计站标 `type: "thirdparty"`，
   第三方只能当线索，不得单独支撑录取/学费/岗位等结论。
4. **原文保真**：简章写“拟招生”“参考”“以正式通知为准”，照抄，不要替它改。
5. **冲突摊开**：来源说法不一致时，全部列进 `conflicts`，不要自己挑一个当结论。
6. **年度口径**：当前可查最新招生年度是 **2027**（2026 年 9–10 月发布），上一届是 **2026**。
   每个招生字段必须能看出是哪一届（`year` 字段）。
7. **隐私红线**：
   - 全站不出现任何具体个人的姓名、年龄、生日、籍贯、家庭情况、现工作单位、用工性质、税前收入。
   - 全站不出现“你 / 您 / 她 / 本人 / 我的”等指向性代词（`其他`、`他们` 需改写）。
   - 不写“AI 生成 / 本工具 / 模板 / 占位符 / TODO / 示例数据”等痕迹。
   - 需要填空的模板只用全角【】占位，如【学校名】【姓名】【单位名称】。
8. **语气**：客观陈述、克制、不热情、不劝诱。用“可、宜、一般、通常”等中性词；不用“加油、一定、必须抓住”。
9. **日期格式**：`YYYY-MM-DD`；只知道年月写 `YYYY-MM`；完全不知道写 `"未知"`。
10. **查阅日期**：本次统一为 `2026-11-15`（写入 `accessed` 字段）。

---

## 1. 数据文件格式

每个文件是一个普通 JS 脚本，挂到全局 `window.DATA`：

```js
// data/schools-hu-su.js
window.DATA = window.DATA || {};
window.DATA.schoolsHuSu = {
  meta: { region: "沪苏", updatedAt: "2026-11-15", coverageNote: "..." },
  items: [ /* 学校对象 */ ],
  exclusions: [ /* 排除学校 */ ]
};
```

- 文件内部不得 `import` / `require`（避免本地双击打不开）。
- 值里允许出现中文引号、全角括号；字符串用双引号，内部双引号转义。
- 数值型字段没有数据时写 `"未获取"`（字符串），不要写 `null`/`0` 冒充。
- 数组字段没有内容写 `[]`；对象字段没有内容写 `{}` 或 `"未获取"`。

### 来源对象 Source

```js
{
  title: "中国药科大学2027年硕士研究生招生简章与招生专业目录",
  publisher: "中国药科大学研究生招生网",
  url: "https://yjszs.cpu.edu.cn/bc/04/c10893a244740/page.htm",
  type: "official",            // official | thirdparty
  published: "2026-10-09",     // 页面发布日期；未知写 "未知"
  accessed: "2026-11-15",
  note: ""                     // 可选：如"附件PDF内第3页"
}
```

规则：
- `url` 必须是具体内容页；URL 只有域名或 `/` 会被校验器判错。
- 同一记录至少 1 个 `official` 来源；若只有第三方，`confidence` 必须是 `"部分核实"` 且 `missing` 注明待官方核实。
- 来源很多时全列；页面按 type 分组展示。

### 通用字段（多数 record 都有）

| 字段 | 类型 | 说明 |
|---|---|---|
| `id` | string | 全局唯一，kebab-case，如 `cpu`、`cpu-zhangwei`、`zj-2026-001` |
| `updatedAt` | string | 本条最后一次核对日期 |
| `changeTag` | string | `"新增"` / `"更新"` / `"无变化"` / `null`（本次相对上一版） |
| `missing` | string[] | 明确“未获取/待核实”的字段清单，页面会展示 |
| `conflicts` | object[] | 见下 |
| `sources` | Source[] | 本条证据 |
| `confidence` | string | `"已核实"` / `"部分核实"` |

`conflicts` 元素：

```js
{ field: "学费", claims: ["2026简章：3年3.6万", "2025简章：3年3万"], note: "可能为年度调整，两届口径不同", sources: [ /* Source */ ] }
```

---

## 2. 院校数据 `data/schools-hu-su.js` / `data/schools-zhe-wan.js`

文件内挂载键：`window.DATA.schoolsHuSu` / `window.DATA.schoolsZheWan`。
`meta` 必填 `region`（`"沪苏"` / `"浙皖"`）、`updatedAt`、`coverageNote`。

### 2.1 学校对象

```js
{
  id: "cpu",
  name: "中国药科大学",
  province: "江苏",             // 上海 | 江苏 | 浙江 | 安徽
  city: "南京",
  level: "211 / 双一流",        // 免费文本，写公开定位标签即可
  college: "研究生院（药学院等）",
  enrollment: "是",             // 是 | 否 | 待核实 —— 该校是否招过非全日制药学类硕士
  enrollmentNote: "2026年起首次招收非全日制药学硕士（以官方目录为准）",
  programs: [ /* 见 2.2；enrollment="否" 时可为 [] */ ],
  fitTags: ["药品质量体系", "药物分析", "药事法规", "GLP/GMP"],
  priority: 1,                  // 客观排序，1 最高；仅依据学制/学费/通勤/导师方向/招生人数等客观因素
  priorityReason: "学制3年、周末授课、位于南京、导师方向覆盖药品质量标准与 GLP",
  advisorsNote: "该院非全导师与全日制共用，详见导师页",
  notes: "",
  missing: [],
  conflicts: [],
  sources: [],
  updatedAt: "2026-11-15",
  confidence: "已核实"
}
```

- `fitTags` 是**方向标签**，取自固定集合：`药品质量体系`、`药物分析`、`质量标准`、`GLP/GMP`、
  `药品注册`、`药事法规`、`药物警戒`、`体内药物分析`、`中药质量`、`制药工程`、`临床药学`。
- `priority` 可空（`null`）；排序理由只写客观因素，不得出现任何个人处境。

### 2.2 项目对象（programs[]）

```js
{
  programName: "药学（专业学位）",
  programCode: "105500",        // 未获取写 "未获取"
  degreeType: "专业学位",        // 专业学位 | 学术学位
  mode: "非全日制",
  directionRaw: "不区分研究方向", // 官网原文
  directionTags: ["药物分析"],
  cycles: [ /* 见 2.3，按 year 倒序 */ ]
}
```

### 2.3 招生年度对象（cycles[]）

```js
{
  year: 2027,                   // 招生年度（入学年）
  status: "已发布",              // 已发布 | 未发布 | 未发布（参考上一年） | 已截止
  publishedAt: "2026-10-09",    // 简章发布日
  planCount: 25,                // 拟招生人数；未知 "未获取"
  planRaw: "拟招收非全日制 25 人",  // 原文
  planNote: "不含推免；含调剂口径未知",
  tuitionRaw: "学制3年，学费共3.6万元",
  tuitionTotal: 36000,          // 元；未知 "未获取"
  durationRaw: "学制3年，最长修业年限5年",
  durationYears: 3,             // 数字；未知 "未获取"
  classMode: "周末",             // 周末 | 集中 | 周末+集中 | 工作日 | 线上 | 未获取
  classModeRaw: "周六、周日上课",
  location: "南京江宁校区",
  examSubjects: ["101思想政治理论", "204英语（二）", "349药学综合"],
  examNote: "自命题综合科目代码与范围以目录为准",
  reExamRaw: "复试：专业课笔试+综合面试（差额比例一般不低于120%）",
  referenceBooks: ["《药剂学》…"],   // 未知 "未获取"
  directed: "要求定向",          // 要求定向 | 不要求定向 | 未明确 | 未获取
  directedRaw: "非全日制硕士研究生只招收在职定向就业人员",
  agreementRaw: "拟录取后须签订《定向就业协议书》，由定向单位盖章后寄回",
  scholarshipRaw: "非全日制不享受国家助学金与学业奖学金",
  dormRaw: "非全日制不安排住宿",
  scores: [ /* 2.4 */ ],
  missing: [],
  conflicts: [],
  sources: []
}
```

### 2.4 历年分数/录取 `scores[]`

```js
{
  year: 2026,
  lineRaw: "总分300，单科（满分=100）39、（满分>100）117",  // 国家线/校线，注明
  lineType: "国家线A类",         // 国家线A类 | 校线 | 院线 | 未知
  admittedCount: 20,            // 实际录取；未知 "未获取"
  minScore: 312,                // 最低录取分；未知 "未获取"
  adjustmentRaw: "接受调剂" / "无调剂",   // 未获取写 "未获取"
  note: "",
  sources: []
}
```

### 2.5 排除学校 `exclusions[]`

“看着该招其实不招”的学校也要列，理由 + 依据：

```js
{
  id: "fudan",
  name: "复旦大学",
  province: "上海",
  reason: "药学院硕士招生目录中学习方式仅全日制，无非全日制计划",
  evidenceRaw: "2027年硕士招生专业目录：药学（1055）学习方式为全日制",
  sources: [ /* 至少 1 个 official */ ],
  updatedAt: "2026-11-15"
}
```

---

## 3. 导师数据 `data/advisors.js`

挂载键：`window.DATA.advisors = { meta, items, priorityNote }`。

```js
{
  id: "cpu-zhangwei",
  schoolId: "cpu",
  schoolName: "中国药科大学",
  college: "药学院",
  name: "张伟",
  title: "教授",
  adminRoles: ["药学院副院长"],           // 行政职务；无 []
  socialRoles: ["中国药学会药物分析专业委员会委员"], // 社会兼职；无 []
  directionRaw: "药物质量控制与质量标准研究",  // 官网原文，照抄
  directionTags: ["质量标准", "药物分析", "药品质量体系"],
  projects: [ { title: "…", period: "2023–2026", funder: "国家自然科学基金" } ],
  works: ["…（《…》，2024）"],             // 代表作 2–5 条
  email: "…" / "未获取",
  phone: "…" / "未获取",                   // 优先学院研招办电话
  homepage: "https://…" / "未获取",
  backgroundTags: ["药检系统"],            // 药检系统|药监审评|中检院|药典委|GMP检查员|企业质量|无|未获取
  backgroundRaw: "曾任江苏省药品检验所…",   // 原文/页面措辞；无则 "未获取"
  backgroundSources: [ /* Source */ ],
  partTimeEnrollment: "未获取",            // 招非全 | 不招非全 | 未明确 | 未获取
  recentPartTimeStudents: "未获取",        // 近几年有无非全学生
  enrollmentNotes: "",
  contactOrder: 1,                        // 全站优先联系顺序；不排序写 null
  contactReason: "研究方向含药品质量标准，且有省级药检机构经历（客观）",
  missing: [],
  confidence: "已核实" / "部分核实",
  sources: [],
  updatedAt: "2026-11-15",
  changeTag: "新增"
}
```

- 导师名单必须来自**学院官网师资页/研究生导师名单**或**研招目录导师栏**；主页写了不等于今年招，
  两个来源对不上就两个都列进 `conflicts`。
- “药检所 / 食药检 / 药监审评 / 中检院”经历是重点，单独打 `backgroundTags`。
- 未获取的字段必须进 `missing`，不得写“应该会招”。

---

## 4. 事业单位岗位 `data/jobs-gov.js`

```js
window.DATA.jobsGov = { meta: { updatedAt, coverageNote }, items: [] };
```

```js
{
  id: "zj-2026-0001",
  batch: "2026年浙江省属事业单位统一公开招聘",
  region: "浙江", city: "杭州", level: "省属",   // 省属 | 市属 | 县区 | 其他
  unit: "某省级药品检验机构",                   // 单位名称按公告原文；不出现任何个人现任单位信息
  unitType: "公益一类事业单位",
  position: "药品检验与研究",
  headcount: 1,
  educationRaw: "硕士研究生及以上",
  degree: "硕士及以上",
  majorRaw: "药学类、中药学类",
  ageRaw: "35 周岁及以下",
  freshRaw: "不限",                 // 应届限制；"限应届" / "不限" / 未获取
  socialOk: "是",                   // 社会人员是否可报：是 | 否 | 未明确
  otherRaw: "需 2 年以上药品检验相关经历",
  examRaw: "笔试+面试",
  announcedAt: "2026-03-12",
  deadline: "2026-03-20",
  admittedRaw: "拟录用公示 2 人，均为硕士研究生",
  admittedDegrees: ["硕士", "硕士"],
  sourceType: "official",
  sources: [],
  notes: "",
  missing: [],
  updatedAt: "2026-11-15",
  changeTag: "新增"
}
```

覆盖面：**浙江、安徽**近两年（2025–2026）省属/市属事业单位药学类岗位，优先“硕士可报 + 社会人员可报”；
能查到拟录用学历的补 `admittedRaw`。逐年逐地翻，至少覆盖省级统考批次 + 杭州/宁波/绍兴/合肥/芜湖等市。

---

## 5. 企业岗位 `data/jobs-corp.js`

```js
window.DATA.jobsCorp = { meta: { updatedAt, coverageNote, salaryNote }, items: [] };
```

```js
{
  id: "corp-0001",
  company: "某医药企业（名称按招聘页）",
  companyType: "CRO",              // 药企 | CRO | 药品检验检测 | 医疗器械 | 其他
  city: "杭州",
  title: "质量保证专员（QA）",
  education: "本科及以上",
  experience: "3–5 年",
  salaryRaw: "12–18K·13 薪",
  salaryMin: 12, salaryMax: 18,    // 单位：K/月；未知 "未获取"
  skills: ["GLP", "质量体系", "偏差管理"],
  description: "岗位职责摘要，2–3 句",
  publishedAt: "2026-10-20",
  url: "https://…",
  platform: "BOSS直聘",
  sourceType: "thirdparty",        // 招聘平台一律 thirdparty
  notes: "招聘页链接易失效，投递前需核实",
  missing: [],
  updatedAt: "2026-11-15"
}
```

目标岗位族：质量保证/QA、药品注册/药政事务、毒理专题负责人/安评、药物分析、药品检验、GMP 合规。
薪资只能来自招聘页原样，不得估算；分布区间由多条岗位自然体现。

---

## 6. 证书与职称 `data/certs.js`

```js
window.DATA.certs = { meta: { updatedAt, disclaimer }, items: [
  {
    id: "lab-animal",
    name: "实验动物从业人员培训合格证",
    category: "证书",              // 证书 | 职称
    issuer: "省级实验动物管理部门/指定培训机构",
    conditionRaw: "从事实验动物相关工作的人员…",
    timeline: [ { when: "每年 3–4 月、9–10 月（各省不同）", event: "报名与培训" } ],
    validityRaw: "有效期 5 年（以证书为准）",
    renewalRaw: "到期前参加继续培训换证",
    utilityRaw: "GLP 机构动物实验岗位上岗与合规检查的常见要求",
    costRaw: "未获取",
    sources: [],
    notes: "",
    missing: [],
    updatedAt: "2026-11-15"
  }
]};
```

覆盖：实验动物从业证、执业药师、药学专业技术职称（初级/中级/副高）申报条件与时间。
每条注明“各地口径不同，需电话确认”。

---

## 7. 时间线与日历 `data/timeline.js` / `data/calendar.js` / `data/actions.js`

### 7.1 `window.DATA.timeline`

```js
{
  meta: { updatedAt, latestCycle: 2027, note: "相对时间轴，不写死年份" },
  phases: [
    {
      id: "apply",
      title: "报名",
      items: [
        {
          event: "招生简章发布",
          when: "每年 9–10 月（以学校研究生院官网为准）",
          missIf: "错过则无法确认当年专业、学费、定向要求，报名易出错",
          type: "official",       // official | experience
          sources: [ /* 官方链接；类型必须与 type 一致 */ ]
        }
      ]
    }
  ]
}
```

`type: "experience"` 的内容不得带 official 来源，页面会以“经验建议”样式呈现。

### 7.2 `window.DATA.calendar`

```js
{
  meta: { updatedAt, note: "全年固定要盯的月份；每年以官方公告为准" },
  months: [
    { month: 9, label: "9月", items: [
      { what: "硕士招生简章与专业目录集中发布", action: "逐校官网核对学习方式、学费、定向要求", type: "official", sources: [...] }
    ]}
  ]
}
```

### 7.3 `window.DATA.actions`

```js
{
  meta: { updatedAt },
  tiers: [
    { label: "本周", items: [
      { id: "a1", title: "核对目标院校上一届简章", detail: "…", doneWhen: "…",
        materials: ["…"], tag: "经验建议", refs: [] }
    ]}
  ]
}
```

---

## 8. 站点元数据 `data/meta.js`

```js
window.DATA.meta = {
  siteTitle: "长三角非全日制药学硕士与职业路径资料库",
  version: "2026.11",
  updatedAt: "2026-11-15",
  latestAdmissionYear: 2027,
  previousAdmissionYear: 2026,
  intro: "…",                     // 2–3 句，客观说明收录范围与核验方式
  usage: ["…"],                   // 怎么用这份资料（3–5 条）
  disclaimer: "…",                // 数据以官方最新公告为准等
  changelogLatest: [ { date: "2026-11-15", type: "新建", text: "首次发布…" } ]
};
```

`data/changelog.js`：`window.DATA.changelog = { items: [ { date, version, type, sections:["院校"], text, detail } ] }`。

---

## 9. 页面与脚本

- 页面：`index.html`、`schools.html`、`advisors.html`、`outreach.html`、`internal.html`、
  `timeline.html`、`jobs.html`、`certs.html`、`agreement.html`、`sources.html`、`changelog.html`。
- 共享：`assets/site.css`、`assets/app.js`（Lead 维护）。
- 页面通过 `<script src="data/xxx.js">` 加载数据，由 `assets/app.js` 渲染。
- 静态 HTML 段落（话术模板、流程说明）直接写在页面里，不经过数据文件。

## 10. 交付前自检

```bash
node scripts/check.js          # 结构 + 来源 + 隐私 + 重复 id
```
另有 `docs/UPDATE.md` 说明月度更新步骤。
