# 长三角非全日制药学硕士资料库

面向在职药学从业者的公开资料库：长三角（上海、江苏、浙江、安徽）招收非全日制药学类硕士的院校招生信息、相关导师方向、事业单位与企业岗位、证书与职称要求，以及整条路径上的时间窗口。每条事实性内容都附具体出处链接与查阅日期；来源冲突并列展示，查不到的字段集中列为「待核实清单」。

## 特点

- **纯静态，无构建步骤**：HTML + CSS + 普通 JS 数据文件，不需要 Node、不需要打包，克隆下来直接打开即可预览。
- **可逐条核验**：每个字段旁可点开来源（官方 / 第三方分别标注），来源页精确到公告或简章，而不是栏目首页。
- **数据与页面分离**：内容全部在 `data/*.js` 里，页面结构固定；每月更新只改数据文件。
- **自动检查**：`node scripts/check.js` 校验数据字段、来源、重复 ID，并扫描隐私词与不当代词。
- **手机上可读**：单栏布局、可横向滑动的导航、表格自动换行。

## 目录结构

```
.
├── index.html / schools.html / advisors.html / timeline.html
├── jobs.html / certs.html / sources.html / changelog.html
├── outreach.html / internal.html / agreement.html
├── assets/
│   ├── site.css          样式（设计变量集中在文件开头）
│   └── app.js            读取 window.DATA 渲染各页
├── data/
│   ├── meta.js           站点标题、版本、更新日期、使用说明
│   ├── schools-hu-su.js  沪苏院校
│   ├── schools-zhe-wan.js 浙皖院校
│   ├── advisors.js       导师名录
│   ├── jobs-gov.js       事业单位岗位
│   ├── jobs-corp.js      企业岗位
│   ├── certs.js          证书与职称
│   ├── timeline.js       时间窗口
│   ├── calendar.js       年度日历
│   ├── actions.js        现在就能做的十件事
│   └── changelog.js      更新日志
├── docs/
│   ├── SCHEMA.md         数据契约（字段、枚举、来源格式、隐私规则）
│   └── UI.md             页面骨架与组件类
└── scripts/check.js      自检脚本
```

`research/` 为历次检索的研究笔记（已逐条抹去可指向个人的信息），随仓库一同保存，供下一轮更新时核对失效链接与待电话核实项；站点的公开页面不引用这些文件。

## 本地预览

不需要装任何依赖。两种方式任选：

```bash
# 方式一：直接打开
open index.html          # macOS

# 方式二：起一个静态服务器（推荐，行为与线上一致）
python3 -m http.server 8000
# 浏览器打开 http://localhost:8000
```

## 数据校验

```bash
node scripts/check.js
```

有错误（error）时退出码为 1；warning 多为队友数据文件暂缺或个别字段未获取，可按提示处理。

## 部署到 GitHub Pages（照着做即可）

1. 在 GitHub 新建一个仓库，例如 `pharm-parttime-cn`。**可见性选 Public**：GitHub Pages 对公开仓库免费；私有仓库使用 Pages 需要 GitHub Pro 等付费方案。
2. 在本地项目根目录初始化并推送（把地址换成自己的仓库地址）：

   ```bash
   git init
   git add .
   git commit -m "init"
   git branch -M main
   git remote add origin https://github.com/qjr1997/pharm-parttime-cn.git
   git push -u origin main
   ```

3. 打开仓库页面 → **Settings → Pages** → Build and deployment：
   - Source 选 **Deploy from a branch**
   - Branch 选 **main**，目录选 **/(root)**
   - 点击 **Save**
4. 等 1–2 分钟，页面顶部会显示访问地址，形如
   `https://qjr1997.github.io/pharm-parttime-cn/`。
5. 之后每次更新：本地改 `data/*.js` → `git add . && git commit -m "2026.12 更新" && git push`，Pages 会自动重新发布（通常 30–60 秒）。
6. 仓库里已有 `.nojekyll` 文件，用于关闭 Jekyll 处理；不要删除。

如果后续要绑定自定义域名，在 Settings → Pages → Custom domain 填写域名，并按提示配置 DNS 的 CNAME 记录；仓库内不需要额外文件（也可放置 `CNAME` 文件）。

## 更新

每月更新流程、数据结构速查与常见场景处理见 **[UPDATE.md](UPDATE.md)**。

## 数据边界

本资料库为公开信息汇编，不构成报考、求职或晋升建议。招生计划、考试科目、学费、招聘条件与考试日期每年调整，务必以官方最新公告为准。页面中标为「经验建议」的内容为基于公开规则的推演，未标注官方出处，使用前请结合自身情况判断。
