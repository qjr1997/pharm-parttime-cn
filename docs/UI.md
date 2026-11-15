# 页面与样式规范（UI）

本文件说明站点的页面骨架、样式组件和写作规则。**页面结构一旦定下就保持稳定，后续月度更新只改 `data/*.js`，不动页面结构。**

## 1. 文件与分工

| 路径 | 作用 | 维护者 |
|---|---|---|
| `index.html` | 总览：首屏、统计、入口、十件事、更新摘要 | Lead |
| `schools.html` | 院校对比与详情 | Lead（数据由 `data/schools-*.js` 驱动） |
| `advisors.html` | 导师名录与优先联系顺序 | Lead（`data/advisors.js`） |
| `outreach.html` | 套磁指引（时机、渠道、3 版邮件、禁忌） | 页面作者静态撰写 |
| `internal.html` | 内部打听手册（找谁、原话、问题、顺序、退路） | 页面作者静态撰写 |
| `agreement.html` | 定向就业协议办理流程 | 页面作者静态撰写 |
| `timeline.html` | 相对时间轴、截止日总表、年度日历 | Lead（`data/timeline.js` / `calendar.js`） |
| `jobs.html` | 事业单位岗位表、企业岗位表 | Lead（`data/jobs-*.js`） |
| `certs.html` | 证书与职称要求 | Lead（`data/certs.js`） |
| `sources.html` | 待核实清单 + 全部来源链接 | Lead（自动汇总） |
| `changelog.html` | 更新日志 | Lead（`data/changelog.js`） |
| `assets/site.css` | 全站样式（唯一） | Lead |
| `assets/app.js` | 数据渲染、导航高亮、计数 | Lead |
| `data/meta.js` | 站点标题、版本、简介、使用说明 | Lead |

- 全部文件在仓库根目录，页面之间用相对路径（`schools.html`）互相链接。
- 页面不引入外部 CDN、字体、统计脚本。打开即用，`file://` 双击也能预览。

## 2. 页面骨架（必须逐字复用）

新建页面时复制以下骨架，只改 `<title>`、`<meta name="description">`、`data-page`、`<main>` 内部内容。<br>
`data-page` 取值：`index` `schools` `advisors` `outreach` `internal` `timeline` `jobs` `certs` `agreement` `sources` `changelog`，`assets/app.js` 用它给导航加高亮。

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>页面标题 · 长三角非全日制药学硕士资料库</title>
<meta name="description" content="长三角（沪苏浙皖）非全日制药学类硕士：院校招生、导师方向、岗位门槛、证书职称与时间窗口，逐条附出处。">
<link rel="icon" href="data:,">
<link rel="stylesheet" href="assets/site.css">
</head>
<body data-page="PAGE_KEY">
<a class="skip" href="#main">跳到内容</a>

<header class="masthead">
  <div class="wrap masthead-in">
    <div class="brand">
      <a class="brand-title" href="index.html">长三角非全日制药学硕士资料库</a>
      <span class="brand-sub">院校 · 导师 · 岗位 · 证书 · 时间窗口</span>
    </div>
    <div class="masthead-meta">
      <span class="ver" id="siteVersion">2026.11</span>
      <div id="siteUpdated">更新于 2026-11-15</div>
    </div>
  </div>
</header>

<nav class="site-nav" aria-label="主导航">
  <div class="wrap nav">
    <a href="index.html">总览</a>
    <a href="schools.html">院校</a>
    <a href="advisors.html">导师</a>
    <a href="outreach.html">套磁</a>
    <a href="internal.html">内部打听</a>
    <a href="timeline.html">时间窗口</a>
    <a href="jobs.html">岗位</a>
    <a href="certs.html">证书职称</a>
    <a href="agreement.html">定向协议</a>
    <a href="sources.html">来源与待核实</a>
    <a href="changelog.html">更新日志</a>
  </div>
</nav>

<main id="main">
  <!-- 页面内容 -->
</main>

<footer class="foot">
  <div class="wrap">
    <div class="foot-top">
      <span>长三角非全日制药学硕士资料库 · <span id="footVersion">2026.11</span></span>
      <span>检索日期 2026-11-15</span>
    </div>
    <p>本资料库汇编公开信息，逐条标注出处与查阅日期。招生计划、招聘公告、考试政策每年调整，以官方最新公告为准；标为「经验建议」的内容为基于公开规则的推演，非官方口径。</p>
  </div>
</footer>

<script src="data/meta.js"></script>
<script src="assets/app.js"></script>
</body>
</html>
```

## 3. 常用组件（只用这些类名，不新增自定义样式）

### 3.1 页首区块

```html
<section class="section">
  <div class="wrap">
    <div class="section-head">
      <span class="section-num">01</span>
      <h2>区块标题</h2>
      <p>一段导语，说明这一区块解决什么问题。</p>
    </div>
    ...内容...
  </div>
</section>
```

- `.hero` / `.hero-title` / `.hero-lede` / `.hero-actions`：仅总览页首屏使用。
- `.kicker`：小号字距拉开的引导行。
- `.wrap--prose`：窄栏长文（宽度约 740px）。

### 3.2 卡片

```html
<div class="card">
  <div class="card-head"><h3 class="card-title">卡片标题</h3><span class="card-sub">小注</span></div>
  <div class="card-body"><p>正文…</p></div>
</div>
```

- 多列：`<div class="grid-2">` 或 `<div class="grid-3">` 包住多个 `.card`。
- 入口链接卡片：`.entry-grid` > `<a class="entry" href="...">`，内部 `.entry-k` / `.entry-title` / `.entry-desc` / `.entry-count`。

### 3.3 徽标与标签

```html
<span class="badge badge--official">官方</span>
<span class="badge badge--third">第三方</span>
<span class="badge badge--pending">未获取</span>
<span class="badge badge--advice">经验建议</span>
<span class="tag">药物分析</span><span class="tag tag--accent">优先</span>
```

- `.badge-row` / `.tag-row` 用于成行排列。

### 3.4 提示块

```html
<div class="note note--info">
  <span class="note-label">说明</span>
  <p>…</p>
</div>
```

变体：`.note--advice`（经验建议，陶土色）、`.note--warn`（注意）、`.note--info`（中性说明）。

### 3.5 表格

```html
<div class="tbl-wrap">
  <table class="tbl">
    <caption>表题与口径说明</caption>
    <thead><tr><th>列</th><th>列</th></tr></thead>
    <tbody><tr><td>值</td><td class="num">123</td></tr></tbody>
  </table>
</div>
```

- `.tbl--compact` 紧凑；`.num` 数字右对齐等宽。

### 3.6 键值

```html
<dl class="kv">
  <dt>学制</dt><dd>3 年，最长修业 5 年</dd>
</dl>
```

### 3.7 折叠

```html
<details class="acc">
  <summary>标题行：学校 · 2027 · 拟招 25 人 · 学费 3.6 万</summary>
  <div class="acc-body">…</div>
</details>
```

### 3.8 模板信函（唯一允许出现人称的地方）

```html
<div class="tpl-block">
  <div class="tpl-label">邮件模板 · 【】为待填</div>
  <pre class="tpl">尊敬的【导师姓名】老师：

【正文】</pre>
</div>
```

`pre.tpl` 内可用“您/我”等人称；`pre.tpl` 之外一律不得出现指向性代词。

### 3.9 时间线 / 日历 / 清单

```html
<div class="tl">
  <div class="tl-phase">
    <div class="phase-head"><span class="phase-num">PHASE 01</span><h3>报名</h3></div>
    <div class="tl-item"><div class="tl-event">事件</div><div class="tl-when">时间</div><div class="tl-miss"><b>错过</b> 后果</div></div>
  </div>
</div>

<div class="cal-grid"><div class="cal-month"><h3>9 月</h3><ul class="cal-list"><li>…</li></ul></div></div>

<div class="tier"><div class="tier-label">本周 <small>说明</small></div><div class="act">…</div></div>
```

### 3.10 筛选

```html
<div class="filters">
  <label class="field">地区 <select><option>全部</option></select></label>
  <span class="filter-count">共 12 条</span>
</div>
```

## 4. 写作规则（会被脚本扫描）

1. 正文不使用指向性代词：你、您、她、他、我。改用“在职人员”“考生”“本人之外的主语”或直接省略主语；需要指代自己时用“本人以外”的客观表述（如“报考者”“当事人”）。
2. 不出现任何具体个人的姓名、年龄、生日、籍贯、家庭、现工作单位、用工性质、收入。
3. 不出现“礼物、送给、想念、彩蛋、祝福、署名”等私人化措辞，也不出现“AI 生成、本工具、占位符、TODO”等痕迹。
4. 公开机构名（学校、学院、医院、药检机构、企业、招聘单位）属于公开事实，可以出现；只描述机构与岗位，不描述某个具体在职人员的处境。
5. 事实与经验分开：经验建议必须放在 `.note--advice` 或标明“经验建议”的段落里，并说明推演依据与不适用情形。
6. 需要填空的地方用全角【】，例如【学校名】、【导师姓名】、【单位名称】。
7. 语气克制：不用感叹号堆叠，不用“加油、一定、必须抓住”一类措辞。

## 5. 交互与脚本约定

- `assets/app.js` 自动完成：导航高亮（按 `body[data-page]`）、版本号回填（`#siteVersion` / `#footVersion` / `#siteUpdated`）、数据页渲染。
- 静态页面（`outreach.html` / `internal.html` / `agreement.html`）不需要额外脚本；确实需要少量交互时，写在页面末尾的 `<script>` 内，且不引入依赖。
- 页面首屏必须有内容，不能出现“加载中……”。数据未就绪时页面显示空态提示（`.empty`），但静态说明文字照常显示。

## 6. 移动端

- 主要断点 720px / 960px，已由 CSS 处理；新页面直接使用上表组件即可。
- 表格在窄屏横向滚动，不要手工压缩列宽。
- 长英文链接由 `.src-item` 自动断行，不要另加样式。

## 2026.11.3 阅读层级（本页目录与折叠）

- **本页目录**：`assets/app.js` 的 `buildToc()` 在 `main` 下方生成粘性 `.toc-bar`，条目取自 `main .section > .wrap > .section-head h2`（编号 + 标题）。右侧「展开全部 / 收起全部」按钮切换所有 `details.sec-acc`。
- **分区折叠**：`collapseSections(opened)` 把每个 `.section` 的 `.section-head` 转成 `<summary class="section-head">`，其后所有内容包进 `<div class="sec-acc-body">`。默认展开哪些分区由 `assets/app.js` 的 `PAGE_OPEN` 决定（键为 `body[data-page]`，值为分区下标数组）。新增页面或调整顺序时同步改这里。
- **列表折叠**：长列表统一用 `details.acc-item`，摘要行用 `.acc-sum`（`.sum-main`/`.sum-name`/`.sum-sub`/`.sum-meta`），正文用 `.acc-body`。院校、导师、岗位、证书、时间线阶段、排除院校都已按此改造；纯静态页（route/outreach/internal/agreement）的分区由 `collapseSections` 自动处理，无需额外标记。
- **锚点与展开**：`#school-xxx` 等锚点会经 `openAncestors()` 展开所在折叠；`hashOpen()` 处理直接打开带锚点的链接。新增折叠容器时保持 `id` 在 `details` 元素上。
- **改数据的边界**：折叠只影响展示，不改变渲染函数取字段的方式；新增数据字段仍需同步 `docs/SCHEMA.md` 与 `scripts/check.js`。
