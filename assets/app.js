/* ==========================================================================
   长三角非全日制药学硕士资料库 — 页面渲染
   依赖：各页面在 app.js 之前加载 data/meta.js 与对应 data/*.js
   约定：本文件只读 window.DATA，不修改数据；所有文本经转义后输出。
   ========================================================================== */
(function () {
  "use strict";

  var D = (window.DATA = window.DATA || {});
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- 基础工具 ---------- */

  function esc(v) {
    return String(v == null ? "" : v)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function isMissing(v) {
    return v === undefined || v === null || v === "" || v === "未获取" || v === "未知";
  }

  var MISS = '<span class="miss">未获取</span>';

  function val(v) {
    if (isMissing(v)) return MISS;
    if (Array.isArray(v)) {
      if (!v.length) return MISS;
      return v.map(function (x) { return esc(x); }).join("、");
    }
    return esc(v);
  }

  function txt(v, d) {
    return isMissing(v) ? esc(d || "未获取") : esc(v);
  }

  function num(v) {
    return isMissing(v) ? MISS : esc(v);
  }

  function money(v) {
    if (isMissing(v)) return MISS;
    var n = Number(v);
    if (!isFinite(n)) return esc(v);
    return (n / 10000).toFixed(1) + " 万元";
  }

  function badge(text, cls) {
    return '<span class="badge ' + (cls || "") + '">' + esc(text) + "</span>";
  }

  function tag(text, cls) {
    return '<span class="tag ' + (cls || "") + '">' + esc(text) + "</span>";
  }

  // 本月相对上一版的变化标记（数据里 changeTag：新增 / 更新）
  function changeBadge(t) {
    var meta = (window.DATA && window.DATA.meta) || {};
    if (meta.showChangeTags !== true) return "";
    if (t === "新增") return badge("本月新增", "badge--new");
    if (t === "更新") return badge("本月更新", "badge--updated");
    return "";
  }

  function srcTypeBadge(s) {
    return s && s.type === "official" ? badge("官方", "badge--official") : badge("第三方", "badge--third");
  }

  function srcList(sources, opts) {
    opts = opts || {};
    if (!Array.isArray(sources) || !sources.length) return "";
    var sorted = sources.slice().sort(function (a, b) {
      return (a.type === "official" ? 0 : 1) - (b.type === "official" ? 0 : 1);
    });
    var items = sorted.map(function (s) {
      var meta = [s.publisher, s.published && s.published !== "未知" ? s.published : "", s.accessed ? "查阅 " + s.accessed : ""]
        .filter(Boolean).map(esc).join(" · ");
      return '<li class="src-item">' + srcTypeBadge(s) +
        '<a href="' + esc(s.url) + '" target="_blank" rel="noopener">' + esc(s.title) + "</a>" +
        '<span class="src-meta">' + meta + "</span>" +
        (s.note ? '<span class="src-note">' + esc(s.note) + "</span>" : "") +
        "</li>";
    }).join("");
    return '<div class="src"><div class="src-title">' + esc(opts.title || "出处") + "</div><ul>" + items + "</ul></div>";
  }

  function conflictsHTML(list, opts) {
    if (!Array.isArray(list) || !list.length) return "";
    var title = (opts && opts.title) || "来源冲突 · 未作取舍";
    var body = list.map(function (c) {
      var claims = (c.claims || []).map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("");
      return '<div style="margin-bottom:12px"><b>' + esc(c.field || "字段") + "</b><ul>" + claims + "</ul>" +
        (c.note ? '<div class="small muted">' + esc(c.note) + "</div>" : "") +
        srcList(c.sources, { title: "" }) + "</div>";
    }).join("");
    return '<div class="conflict"><div class="conflict-title">' + esc(title) + "</div>" + body + "</div>";
  }

  function missingHTML(list, opts) {
    if (!Array.isArray(list) || !list.length) return "";
    var label = (opts && opts.label) || "未获取 / 待核实";
    var items = list.map(function (m) { return "<li>" + esc(m) + "</li>"; }).join("");
    return '<div class="missing-box"><span class="note-label">' + esc(label) + "</span><ul>" + items + "</ul></div>";
  }

  function kv(rows) {
    return '<dl class="kv">' + rows.map(function (r) {
      return "<dt>" + esc(r[0]) + "</dt><dd>" + r[1] + "</dd>";
    }).join("") + "</dl>";
  }

  function empty(text) {
    return '<div class="empty">' + esc(text || "该部分数据尚未就绪。") + "</div>";
  }

  function sectionHead(numLabel, title, lede) {
    return '<div class="section-head"><span class="section-num">' + esc(numLabel) + "</span><h2>" + esc(title) + "</h2>" +
      (lede ? "<p>" + esc(lede) + "</p>" : "") + "</div>";
  }

  function sectionOpen() { return '<section class="section"><div class="wrap">'; }
  function sectionClose() { return "</div></section>"; }

  function countBy(arr, fn) {
    var out = {};
    arr.forEach(function (x) { var k = fn(x); out[k] = (out[k] || 0) + 1; });
    return out;
  }

  /* ---------- 数据访问 ---------- */

  function schoolBundles() {
    return [D.schoolsHuSu, D.schoolsZheWan].filter(Boolean);
  }

  function allSchools() {
    var out = [];
    schoolBundles().forEach(function (b) {
      (b.items || []).forEach(function (s) { out.push(s); });
    });
    return out;
  }

  function allExclusions() {
    var out = [];
    schoolBundles().forEach(function (b) {
      (b.exclusions || []).forEach(function (e) { out.push(e); });
    });
    return out;
  }

  function advisors() { return (D.advisors && D.advisors.items) || []; }
  function govJobs() { return (D.jobsGov && D.jobsGov.items) || []; }
  function corpJobs() { return (D.jobsCorp && D.jobsCorp.items) || []; }
  function certs() { return (D.certs && D.certs.items) || []; }
  function timelinePhases() { return (D.timeline && D.timeline.phases) || []; }
  function calendarMonths() { return (D.calendar && D.calendar.months) || []; }
  function actionTiers() { return (D.actions && D.actions.tiers) || []; }

  function walkSources(obj, cb) {
    if (!obj || typeof obj !== "object") return;
    if (Array.isArray(obj)) { obj.forEach(function (x) { walkSources(x, cb); }); return; }
    if (Array.isArray(obj.sources)) obj.sources.forEach(cb);
    if (Array.isArray(obj.backgroundSources)) obj.backgroundSources.forEach(cb);
    Object.keys(obj).forEach(function (k) {
      if (k === "sources" || k === "backgroundSources") return;
      if (obj[k] && typeof obj[k] === "object") walkSources(obj[k], cb);
    });
  }

  function allSourceEntries() {
    var seen = {}, out = [];
    walkSources(D, function (s) {
      if (!s || !s.url || seen[s.url]) return;
      seen[s.url] = 1;
      out.push(s);
    });
    return out;
  }

  function sourceStats() {
    var list = allSourceEntries();
    return {
      total: list.length,
      official: list.filter(function (s) { return s.type === "official"; }).length,
      third: list.filter(function (s) { return s.type === "thirdparty"; }).length
    };
  }

  function collectMissing() {
    var out = [];
    allSchools().forEach(function (s) {
      if (Array.isArray(s.missing) && s.missing.length) {
        out.push({ cat: "院校", label: s.name, anchor: "school-" + s.id, fields: s.missing });
      }
      (s.programs || []).forEach(function (p) {
        if (Array.isArray(p.missing) && p.missing.length) {
          out.push({ cat: "院校", label: s.name + " · " + (p.programCode || p.programName || "招生项目"), anchor: "school-" + s.id, fields: p.missing });
        }
        (p.cycles || []).forEach(function (c) {
          if (Array.isArray(c.missing) && c.missing.length) {
            out.push({ cat: "院校", label: s.name + " · " + (p.programCode || p.programName || "项目") + " · " + c.year + " 年", anchor: "school-" + s.id, fields: c.missing });
          }
        });
      });
    });
    advisors().forEach(function (a) {
      if (Array.isArray(a.missing) && a.missing.length) {
        out.push({ cat: "导师", label: a.name + (a.schoolName ? " · " + a.schoolName : ""), anchor: "advisor-" + a.id, fields: a.missing });
      }
    });
    govJobs().forEach(function (j) {
      if (Array.isArray(j.missing) && j.missing.length) {
        out.push({ cat: "事业单位岗位", label: (j.unit || "") + " · " + (j.position || "") + (j.announcedAt ? "（" + j.announcedAt + "）" : ""), anchor: "gov-" + j.id, fields: j.missing });
      }
    });
    corpJobs().forEach(function (j) {
      if (Array.isArray(j.missing) && j.missing.length) {
        out.push({ cat: "企业岗位", label: (j.company || "") + " · " + (j.title || ""), anchor: "corp-" + j.id, fields: j.missing });
      }
    });
    certs().forEach(function (c) {
      if (Array.isArray(c.missing) && c.missing.length) {
        out.push({ cat: "证书职称", label: c.name || "", anchor: "cert-" + c.id, fields: c.missing });
      }
    });
    timelinePhases().forEach(function (p) {
      (p.items || []).forEach(function (it) {
        if (Array.isArray(it.missing) && it.missing.length) {
          out.push({ cat: "时间窗口", label: it.event || "", anchor: null, fields: it.missing });
        }
      });
    });
    return out;
  }

  function collectConflicts() {
    var out = [];
    function push(cat, label, list, anchor) {
      if (Array.isArray(list) && list.length) out.push({ cat: cat, label: label, list: list, anchor: anchor });
    }
    allSchools().forEach(function (s) {
      push("院校", s.name, s.conflicts, "school-" + s.id);
      (s.programs || []).forEach(function (p) {
        push("院校", s.name + " · " + (p.programCode || p.programName || ""), p.conflicts, "school-" + s.id);
        (p.cycles || []).forEach(function (c) {
          push("院校", s.name + " · " + (p.programCode || p.programName || "") + " · " + c.year + " 年", c.conflicts, "school-" + s.id);
        });
      });
    });
    advisors().forEach(function (a) { push("导师", a.name, a.conflicts, "advisor-" + a.id); });
    govJobs().forEach(function (j) { push("事业单位岗位", (j.unit || "") + " · " + (j.position || ""), j.conflicts, "gov-" + j.id); });
    corpJobs().forEach(function (j) { push("企业岗位", (j.company || "") + " · " + (j.title || ""), j.conflicts, "corp-" + j.id); });
    certs().forEach(function (c) { push("证书职称", c.name, c.conflicts, "cert-" + c.id); });
    return out;
  }

  function anchorLink(page, anchor, label) {
    if (!anchor) return esc(label);
    return '<a href="' + esc(page) + "#" + esc(anchor) + '">' + esc(label) + "</a>";
  }

  /* ---------- 站点公共部分 ---------- */

  function initChrome() {
    var page = document.body.getAttribute("data-page") || "";
    $$(".nav a").forEach(function (a) {
      var href = (a.getAttribute("href") || "").replace(".html", "");
      if (href === page) a.classList.add("is-active");
    });
    if (D.meta) {
      if ($("#siteVersion")) $("#siteVersion").textContent = D.meta.version || "2026.11";
      if ($("#footVersion")) $("#footVersion").textContent = D.meta.version || "2026.11";
      if ($("#siteUpdated")) $("#siteUpdated").textContent = "更新于 " + (D.meta.updatedAt || "2026-11-15");
    }
  }

  /* ==========================================================================
     总览页
     ========================================================================== */

  function renderHome() {
    var root = $("#app");
    if (!root) return;
    var meta = D.meta || {};
    var schools = allSchools().filter(function (s) { return s.enrollment === "是"; });
    var pendingSchools = allSchools().filter(function (s) { return s.enrollment === "待核实"; });
    var excl = allExclusions();
    var adv = advisors();
    var gov = govJobs();
    var corp = corpJobs();
    var cs = certs();
    var sStats = sourceStats();
    var missing = collectMissing();
    var missingCount = missing.reduce(function (n, x) { return n + x.fields.length; }, 0);
    var priorityCount = adv.filter(function (a) { return a.contactOrder != null; }).length;

    var html = "";
    html += '<section class="hero"><div class="wrap">';
    html += '<div class="kicker">' + esc(meta.latestAdmissionYear || 2027) + " 招生年度 · 检索日期 " + esc(meta.updatedAt || "2026-11-15") + "</div>";
    html += '<h1 class="hero-title">' + esc(meta.siteTitle || "长三角非全日制药学硕士资料库") + "</h1>";
    html += '<p class="hero-lede">' + esc(meta.intro || "") + "</p>";
    html += '<div class="hero-actions chips">' +
      '<a class="chip" href="schools.html">院校对比 <small>' + schools.length + " 所招生</small></a>" +
      '<a class="chip" href="advisors.html">优先联系导师 <small>' + priorityCount + " 位</small></a>" +
      '<a class="chip" href="#actions">现在就能做的十件事</a>' +
      '<a class="chip" href="sources.html">待核实清单 <small>' + missingCount + " 项</small></a>" +
      "</div></div></section>";

    html += '<section class="section"><div class="wrap"><div class="stat-row">' +
      '<div class="stat"><div class="stat-num">' + schools.length + (pendingSchools.length ? '<small>+' + pendingSchools.length + " 待核实</small>" : "") + '</div><div class="stat-label">招生院校</div></div>' +
      '<div class="stat"><div class="stat-num">' + adv.length + '</div><div class="stat-label">相关导师</div></div>' +
      '<div class="stat"><div class="stat-num">' + (gov.length + corp.length) + '</div><div class="stat-label">岗位样本</div></div>' +
      '<div class="stat"><div class="stat-num">' + sStats.total + '</div><div class="stat-label">附出处链接</div></div>' +
      "</div>";
    html += '<p class="small muted" style="margin:16px 0 0">其中官方来源 ' + sStats.official + " 条、第三方来源 " + sStats.third + " 条；" +
      (missing.length ? "另有 " + missingCount + " 项字段未获取（分布在 " + missing.length + " 条记录），汇总在" + anchorLink("sources.html", "", "来源与待核实") + "页。" : "所有字段均已获取。") +
      "</p>";
    html += "</div></section>";

    var entries = [
      { k: "院校", t: "院校对比与详情", d: "按地区筛选，查看学制、学费、上课方式、定向要求、历年分数与录取。", c: schools.length + " 所招生 · " + excl.length + " 所排除", href: "schools.html" },
      { k: "导师", t: "导师名录", d: "按研究方向与体系内背景筛选，附优先联系顺序与客观排序理由。", c: adv.length + " 位", href: "advisors.html" },
      { k: "行动", t: "套磁指引", d: "四个联系时机、渠道对比、三版可直接改的邮件、导师提问与禁忌。", c: "3 版邮件", href: "outreach.html" },
      { k: "行动", t: "内部打听手册", d: "找谁问、怎么开口、11 组问题两种问法、回答解读与退路。", c: "11 组问题", href: "internal.html" },
      { k: "时间", t: "时间窗口总表", d: "从报名到毕业的相对时间轴、截止日总表与全年日历。", c: "6 条线", href: "timeline.html" },
      { k: "岗位", t: "事业单位岗位表", d: "省属、市属、县区药学类岗位，标注学历、年龄、应届限制与拟录用学历。", c: gov.length + " 条", href: "jobs.html#gov" },
      { k: "岗位", t: "企业岗位表", d: "质量保证、注册、毒理、分析等岗位样本与薪资分布。", c: corp.length + " 条", href: "jobs.html#corp" },
      { k: "证书", t: "证书与职称", d: "实验动物从业证、执业药师、药学职称的条件、时间与续证要求。", c: cs.length + " 项", href: "certs.html" },
      { k: "流程", t: "定向协议办理", d: "谁盖章、何时交、档案户口怎么处理、换单位怎么办。", c: "分步流程", href: "agreement.html" },
      { k: "核验", t: "来源与待核实", d: "全部出处链接、来源冲突汇总，以及需要打电话核实的字段清单。", c: sStats.total + " 条来源", href: "sources.html" },
      { k: "记录", t: "更新日志", d: "每一轮改了什么、哪些条目新增或覆盖。", c: "按月追加", href: "changelog.html" }
    ];
    html += sectionOpen() + sectionHead("01", "资料库入口", "按需要查的部分进入；每页顶部都有筛选与口径说明。");
    html += '<div class="entry-grid">' + entries.map(function (e) {
      return '<a class="entry" href="' + e.href + '"><div class="entry-k">' + esc(e.k) + '</div><div class="entry-title">' + esc(e.t) +
        '</div><p class="entry-desc">' + esc(e.d) + '</p><span class="entry-count">' + esc(e.c) + "</span></a>";
    }).join("") + "</div></div></section>";

    html += sectionOpen() + sectionHead("02", "怎么用这份资料", "先定位需要的部分，再核对出处；冲突和未获取项都不做取舍。");
    html += '<div class="wrap--prose" style="margin:0"><ol class="small" style="line-height:2">' +
      (meta.usage || []).map(function (u) { return "<li>" + esc(u) + "</li>"; }).join("") + "</ol></div>";
    html += "</div></section>";

    html += '<section class="section" id="actions"><div class="wrap">' + sectionHead("03", "现在就能做的十件事", "按时间分档，每条写清完成标准；做完一件再进下一件。");
    html += renderActions() + "</div></section>";

    html += sectionOpen() + sectionHead("04", "数据边界", "这份资料能做什么、不能做什么。");
    html += '<div class="note note--info"><span class="note-label">说明</span><p>' + esc(meta.disclaimer || "") + "</p>" +
      "<p>全部事实性内容附出处并标注类型；官方来源可点击回原文，第三方来源只作为线索。来源之间说法不一致时全部并列，未获取的字段集中列在待核实清单，可直接作为电话核实的提问表。</p></div>";
    html += "</div></section>";

    html += sectionOpen() + sectionHead("05", "最近更新", "");
    var recent = (D.changelog && D.changelog.items) || [];
    recent.sort(function (a, b) { return (b.date || "").localeCompare(a.date || ""); });
    recent.slice(0, 3).forEach(function (c) {
      html += '<div class="card"><div class="card-head"><h3 class="card-title">' + esc(c.date || "") + " · " + esc(c.version || "") +
        "</h3><span class='card-sub'>" + esc(c.type || "") + '</span></div><div class="card-body"><p>' + esc(c.text || "") + "</p>" +
        (c.sections && c.sections.length ? '<div class="tag-row">' + c.sections.map(function (s) { return tag(s); }).join("") + "</div>" : "") +
        '</div></div>';
    });
    html += '<p class="small" style="margin-top:14px"><a href="changelog.html">查看完整更新日志 →</a></p>';
    html += "</div></section>";

    root.innerHTML = html;
  }

  function renderActions() {
    var tiers = actionTiers();
    if (!tiers.length) return empty("行动清单数据尚未就绪。");
    var n = 0;
    return tiers.map(function (t) {
      var items = (t.items || []).map(function (it) {
        n += 1;
        var mats = (it.materials || []).length ? '<div class="tag-row act-mats">' + it.materials.map(function (m) { return tag(m); }).join("") + "</div>" : "";
        return '<div class="act"><div class="act-num">' + ("0" + n).slice(-2) + '</div><div><div class="act-title">' + esc(it.title || "") + "</div>" +
          '<p class="act-detail">' + esc(it.detail || "") + "</p>" +
          '<div class="act-done">完成标准：<b>' + esc(it.doneWhen || "") + "</b></div>" + mats +
          (it.tag ? ' <div style="margin-top:6px">' + badge(esc(it.tag), /经验/.test(it.tag) ? "badge--advice" : "badge--official") + "</div>" : "") +
          "</div></div>";
      }).join("");
      return '<div class="tier"><div class="tier-label">' + esc(t.label || "") + "</div>" + items + "</div>";
    }).join("");
  }

  /* ==========================================================================
     院校页
     ========================================================================== */

  var schoolState = { prov: "", enr: "", q: "" };

  function primaryProgram(s) { return (s.programs || [])[0] || null; }
  function primaryCycle(p) {
    if (!p || !p.cycles || !p.cycles.length) return null;
    return p.cycles.slice().sort(function (a, b) { return b.year - a.year; })[0];
  }
  function findCycle(p, year) {
    if (!p || !p.cycles) return null;
    var hit = null;
    p.cycles.forEach(function (c) { if (c.year === year) hit = c; });
    return hit || primaryCycle(p);
  }

  function renderSchools() {
    var root = $("#app");
    if (!root) return;
    var items = allSchools();
    var excl = allExclusions();
    var provinces = ["上海", "江苏", "浙江", "安徽"];

    if (!items.length) { root.innerHTML = empty("院校数据尚未就绪。"); return; }

    var html = sectionOpen() + sectionHead("01", "院校对比", "收录长三角招收非全日制药学类硕士的院校，以及经核实暂不招非全日制的院校。按学习方式、学制、学费、上课地点与方向标签横向比较，点开每所学校看细节与出处。");
    html += '<div class="filters">' +
      '<label class="field">地区 <select id="f-prov"><option value="">全部</option>' +
      provinces.map(function (p) { return '<option value="' + p + '">' + p + "</option>"; }).join("") + "</select></label>" +
      '<label class="field">招生状态 <select id="f-enr"><option value="">全部</option><option value="是">招非全</option><option value="待核实">待核实</option></select></label>' +
      '<label class="field">关键词 <input id="f-q" type="search" placeholder="学校名称或城市"></label>' +
      '<span class="filter-count" id="f-count"></span>' +
      "</div>";
    html += '<div id="school-table"></div>';
    html += "</div></section>";

    html += sectionOpen() + sectionHead("02", "院校详情", "每所学校下列出招生项目与各年度口径；字段旁的出处可点回原文。");
    html += '<div id="school-list"></div></div></section>';

    if (excl.length) {
      html += sectionOpen() + sectionHead("03", "经核实暂不招非全日制的院校", "这些院校有药学类硕士点或相关方向，但招生目录中的学习方式为全日制；列出依据，便于排除与核对。");
      html += '<div class="tbl-wrap"><table class="tbl"><thead><tr><th>院校</th><th>地区</th><th>原因</th><th>目录原文</th><th>出处</th></tr></thead><tbody>' +
        excl.slice().sort(function (a, b) { return provinces.indexOf(a.province) - provinces.indexOf(b.province); }).map(function (e) {
          return "<tr><td><b>" + esc(e.name) + "</b></td><td>" + esc(e.province || "") + "</td><td>" + esc(e.reason || "") +
            '</td><td class="small">' + esc(e.evidenceRaw || "") + "</td><td>" + srcList(e.sources, { title: "" }) + "</td></tr>";
        }).join("") + "</tbody></table></div></div></section>";
    }
    root.innerHTML = html;

    function bind() {
      var prov = $("#f-prov"), enr = $("#f-enr"), q = $("#f-q");
      prov.value = schoolState.prov; enr.value = schoolState.enr; q.value = schoolState.q;
      prov.addEventListener("change", function () { schoolState.prov = prov.value; updateSchools(); });
      enr.addEventListener("change", function () { schoolState.enr = enr.value; updateSchools(); });
      var timer = null;
      q.addEventListener("input", function () {
        clearTimeout(timer);
        timer = setTimeout(function () { schoolState.q = q.value.trim(); updateSchools(); }, 120);
      });
    }
    bind();
    updateSchools();
  }

  function updateSchools() {
    var items = allSchools().filter(function (s) { return s.enrollment !== "否"; });
    var filtered = items.filter(function (s) {
      if (schoolState.prov && s.province !== schoolState.prov) return false;
      if (schoolState.enr && s.enrollment !== schoolState.enr) return false;
      if (schoolState.q) {
        var hay = (s.name || "") + (s.city || "") + (s.level || "");
        if (hay.indexOf(schoolState.q) < 0) return false;
      }
      return true;
    }).sort(function (a, b) {
      var pa = typeof a.priority === "number" ? a.priority : 99;
      var pb = typeof b.priority === "number" ? b.priority : 99;
      if (pa !== pb) return pa - pb;
      return (a.name || "").localeCompare(b.name || "", "zh-Hans-CN");
    });

    var cnt = $("#f-count");
    if (cnt) cnt.textContent = "共 " + filtered.length + " 条";

    var tbl = $("#school-table");
    if (tbl) {
      if (!filtered.length) tbl.innerHTML = empty("没有符合筛选条件的院校，调整筛选后再看。");
      else {
        var yesRows = filtered.filter(function (s) { return s.enrollment === "是"; });
        var pendRows = filtered.filter(function (s) { return s.enrollment !== "是"; });
        var out = "";
        if (yesRows.length) {
          out += '<div class="tbl-wrap"><table class="tbl"><caption>确认招收非全日制 · 学费为学制内总额，人数为最近一届计划数，具体以简章原文为准</caption><thead><tr>' +
            "<th>院校</th><th>地区</th><th>层次</th><th>学制</th><th>学费总额</th><th>上课方式</th><th>上课地点</th><th>拟招生</th><th>方向标签</th></tr></thead><tbody>" +
            yesRows.map(function (s) {
              var p = primaryProgram(s), cy = findCycle(p, 2027);
              var dur = cy && !isMissing(cy.durationYears) ? esc(cy.durationYears) + " 年" : (cy && cy.durationRaw ? esc(cy.durationRaw) : MISS);
              var plan = cy && !isMissing(cy.planCount) ? num(cy.planCount) : MISS;
              return "<tr>" +
                '<td><a href="#school-' + esc(s.id) + '"><b>' + esc(s.name) + "</b></a>" + (typeof s.priority === "number" ? ' <span class="tag tag--accent">优先 ' + s.priority + "</span>" : "") + "</td>" +
                '<td class="nowrap">' + esc(s.province || "") + (s.city ? " · " + esc(s.city) : "") + "</td>" +
                '<td class="nowrap">' + esc(s.level || "") + "</td>" +
                '<td class="num">' + dur + "</td>" +
                '<td class="num">' + (cy ? money(cy.tuitionTotal) : MISS) + "</td>" +
                "<td>" + (cy ? esc(cy.classMode || "") : MISS) + "</td>" +
                "<td>" + (cy ? val(cy.location) : MISS) + "</td>" +
                '<td class="num">' + plan + "</td>" +
                '<td><div class="tag-row">' + (s.fitTags || []).map(function (t) { return tag(t, "tag--accent"); }).join("") + "</div></td>" +
                "</tr>";
            }).join("") + "</tbody></table></div>";
        }
        if (pendRows.length) {
          out += '<div class="tbl-wrap" style="margin-top:' + (yesRows.length ? "22px" : "0") + '"><table class="tbl"><caption>待核实院校 · 尚未取得近年官方目录中关于「非全日制」的明确口径</caption><thead><tr>' +
            "<th>院校</th><th>地区</th><th>层次</th><th>目前确认到的信息</th><th>出处</th></tr></thead><tbody>" +
            pendRows.map(function (s) {
              return "<tr>" +
                '<td><a href="#school-' + esc(s.id) + '"><b>' + esc(s.name) + "</b></a></td>" +
                '<td class="nowrap">' + esc(s.province || "") + (s.city ? " · " + esc(s.city) : "") + "</td>" +
                '<td class="nowrap">' + esc(s.level || "") + "</td>" +
                '<td class="small">' + esc(s.enrollmentNote || "近年招生目录未取得非全日制口径，待核实。") + "</td>" +
                "<td>" + srcList(s.sources, { title: "" }) + "</td>" +
                "</tr>";
            }).join("") + "</tbody></table></div>";
        }
        tbl.innerHTML = out;
      }
    }

    var list = $("#school-list");
    if (list) {
      list.innerHTML = filtered.map(function (s) { return schoolCard(s); }).join("") || empty("没有符合条件的院校。");
    }
  }

  function schoolCard(s) {
    var enrCls = s.enrollment === "是" ? "badge--ok" : s.enrollment === "待核实" ? "badge--pending" : "badge--muted";
    var enrText = s.enrollment === "是" ? "招非全" : s.enrollment === "待核实" ? "待核实" : "不招非全";
    var head = '<div class="school-head"><div class="school-title"><h3>' + esc(s.name) + "</h3>" +
      badge(enrText, enrCls) +
      (typeof s.priority === "number" ? '<span class="tag tag--accent">优先 ' + s.priority + "</span>" : "") +
      "</div>" +
      '<div class="school-sub">' + esc(s.province || "") + (s.city ? " · " + esc(s.city) : "") + (s.level ? " · " + esc(s.level) : "") +
      (s.college ? " · " + esc(s.college) : "") + "</div></div>";
    var metaRow = '<div class="school-meta">' +
      '<span>适配方向：' + (s.fitTags || []).map(function (t) { return tag(t, "tag--accent"); }).join(" ") + "</span>" +
      (s.priorityReason ? "<span>排序依据：" + esc(s.priorityReason) + "</span>" : "") +
      "</div>";
    var body = "";
    if (s.enrollmentNote && s.enrollmentNote !== s.priorityReason) body += '<p class="small" style="margin:8px 0 0">' + esc(s.enrollmentNote) + "</p>";

    if (!(s.programs || []).length) {
      body += '<div class="note" style="margin-top:14px"><span class="note-label">招生情况</span><p>' + esc(s.enrollmentNote || "招生项目与年度信息见下方未获取清单，待补充。") + "</p></div>";
    }

    (s.programs || []).forEach(function (p) {
      body += '<div class="program"><div class="program-name">' + esc(p.programName || "") + "</div>" +
        '<div class="program-meta">' + (p.programCode && p.programCode !== "未获取" ? "代码 " + esc(p.programCode) + " · " : "") +
        esc(p.degreeType || "") + " · " + esc(p.mode || "") + (p.directionRaw ? " · " + esc(p.directionRaw) : "") + "</div>" +
        '<div class="tag-row" style="margin-bottom:8px">' + (p.directionTags || []).map(function (t) { return tag(t); }).join("") + "</div>";
      var cycles = (p.cycles || []).slice().sort(function (a, b) { return b.year - a.year; });
      cycles.forEach(function (cy, idx) {
        var summary = esc(cy.year) + " 年 · " + esc(cy.status || "") +
          (isMissing(cy.planCount) ? "" : " · 拟招 " + esc(cy.planCount) + " 人") +
          (isMissing(cy.tuitionTotal) ? "" : " · " + money(cy.tuitionTotal)) +
          (isMissing(cy.classMode) ? "" : " · " + esc(cy.classMode)) + " " + changeBadge(cy.changeTag);
        body += '<details class="acc"' + (idx === 0 ? " open" : "") + "><summary>" + summary + "</summary><div class='acc-body'>" + cycleBody(cy) + "</div></details>";
      });
      body += conflictsHTML(p.conflicts) + missingHTML(p.missing);
    });

    body += conflictsHTML(s.conflicts);
    body += missingHTML(s.missing);
    body += srcList(s.sources, { title: "本页出处" });

    return '<div class="school" id="school-' + esc(s.id) + '">' + head + metaRow + body + "</div>";
  }

  function cycleBody(cy) {
    var rows = [
      ["拟招生", num(cy.planCount) + (cy.planRaw ? ' <span class="small muted">（原文：' + esc(cy.planRaw) + "）</span>" : "")],
      ["学费", money(cy.tuitionTotal) + (cy.tuitionRaw ? ' <span class="small muted">（' + esc(cy.tuitionRaw) + "）</span>" : "")],
      ["学制", val(cy.durationRaw) + (cy.durationYears !== undefined && !isMissing(cy.durationYears) ? ' <span class="small muted">（' + esc(cy.durationYears) + " 年）</span>" : "")],
      ["上课方式", (cy.classMode && cy.classMode !== "未获取" ? badge(esc(cy.classMode), "badge--muted") + " " : "") + (cy.classModeRaw ? '<span class="small muted">' + esc(cy.classModeRaw) + "</span>" : "")],
      ["上课地点", val(cy.location)],
      ["考试科目", cy.examSubjects && cy.examSubjects.length ? cy.examSubjects.map(function (x) { return tag(esc(x)); }).join(" ") + (cy.examNote ? '<div class="small muted">' + esc(cy.examNote) + "</div>" : "") : MISS],
      ["复试", val(cy.reExamRaw)],
      ["参考书", Array.isArray(cy.referenceBooks) && cy.referenceBooks.length ? "<ul class='small' style='margin:0;padding-left:1.1em'>" + cy.referenceBooks.map(function (b) { return "<li>" + esc(b) + "</li>"; }).join("") + "</ul>" : MISS],
      ["定向要求", (cy.directed && cy.directed !== "未获取" ? badge(esc(cy.directed), cy.directed === "要求定向" ? "badge--warn" : "badge--muted") + " " : "") + (cy.directedRaw ? '<span class="small">' + esc(cy.directedRaw) + "</span>" : "")],
      ["协议办理", val(cy.agreementRaw)],
      ["奖助学金", val(cy.scholarshipRaw)],
      ["住宿", val(cy.dormRaw)]
    ];
    var out = kv(rows);
    if (Array.isArray(cy.scores) && cy.scores.length) {
      out += '<div class="tbl-wrap" style="margin-top:14px"><table class="tbl tbl--compact"><caption>历年分数与录取</caption><thead><tr><th>年份</th><th>分数线</th><th>类型</th><th>实际录取</th><th>最低分</th><th>调剂</th><th>备注</th></tr></thead><tbody>' +
        cy.scores.slice().sort(function (a, b) { return b.year - a.year; }).map(function (sc) {
          return "<tr><td class='num'>" + esc(sc.year) + "</td><td>" + esc(sc.lineRaw || "") + "</td><td>" + esc(sc.lineType || "") +
            "</td><td class='num'>" + num(sc.admittedCount) + "</td><td class='num'>" + num(sc.minScore) + "</td><td>" + esc(sc.adjustmentRaw || "未获取") +
            "</td><td class='small'>" + esc(sc.note || "") + "</td></tr>";
        }).join("") + "</tbody></table></div>";
    }
    out += conflictsHTML(cy.conflicts);
    out += missingHTML(cy.missing);
    out += srcList(cy.sources);
    return out;
  }

  /* ==========================================================================
     导师页
     ========================================================================== */

  var advState = { school: "", dir: "", bg: "", q: "", onlyPriority: false };

  function renderAdvisors() {
    var root = $("#app");
    if (!root) return;
    var items = advisors();
    if (!items.length) { root.innerHTML = empty("导师数据尚未就绪。"); return; }
    var meta = (D.advisors && D.advisors.meta) || {};
    var schools = [];
    var dirSet = {};
    var bgSet = {};
    items.forEach(function (a) {
      if (a.schoolName && schools.indexOf(a.schoolName) < 0) schools.push(a.schoolName);
      (a.directionTags || []).forEach(function (t) { dirSet[t] = 1; });
      (a.backgroundTags || []).forEach(function (t) { if (t !== "无" && t !== "未获取") bgSet[t] = 1; });
    });
    var dirs = Object.keys(dirSet);
    var bgs = Object.keys(bgSet);
    var priority = items.filter(function (a) { return typeof a.contactOrder === "number"; }).sort(function (a, b) { return a.contactOrder - b.contactOrder; });

    var html = sectionOpen() + sectionHead("01", "优先联系名单", "按研究方向、体系内经历与招生口径排序；排序理由只引用公开的客观条件。查不到是否招非全的，写未获取，不替院校作答。");
    if (priority.length) {
      html += '<div class="tbl-wrap"><table class="tbl"><caption>优先联系顺序 · 共 ' + priority.length + " 位</caption><thead><tr><th>顺序</th><th>姓名</th><th>院校</th><th>职称</th><th>研究方向</th><th>体系内经历</th><th>招非全</th><th>排序理由</th></tr></thead><tbody>" +
        priority.map(function (a) {
          return "<tr><td class='num'><b>" + esc(a.contactOrder) + "</b></td>" +
            "<td><a href='#advisor-" + esc(a.id) + "'><b>" + esc(a.name) + "</b></a></td>" +
            "<td>" + esc(a.schoolName || "") + "</td>" +
            "<td>" + esc(a.title || "") + "</td>" +
            "<td class='small'>" + (a.directionTags || []).map(function (t) { return tag(t, "tag--accent"); }).join(" ") + "</td>" +
            "<td>" + (a.backgroundTags || []).filter(function (t) { return t !== "无"; }).map(function (t) { return badge(t, "badge--official"); }).join(" ") + "</td>" +
            "<td>" + (a.partTimeEnrollment && a.partTimeEnrollment !== "未获取" ? esc(a.partTimeEnrollment) : badge("未获取", "badge--pending")) + "</td>" +
            "<td class='small'>" + esc(a.contactReason || "") + "</td></tr>";
        }).join("") + "</tbody></table></div>";
    } else {
      html += empty("优先联系顺序尚未生成。");
    }
    if (meta.note) html += '<p class="small muted" style="margin-top:12px">' + esc(meta.note) + "</p>";
    html += "</div></section>";

    html += sectionOpen() + sectionHead("02", "导师名录", "共 " + items.length + " 位，覆盖 " + schools.length + " 所院校。可按院校、研究方向、体系内背景筛选。");
    html += '<div class="filters">' +
      '<label class="field">院校 <select id="f-school"><option value="">全部</option>' + schools.map(function (s) { return '<option value="' + esc(s) + '">' + esc(s) + "</option>"; }).join("") + "</select></label>" +
      '<label class="field">研究方向 <select id="f-dir"><option value="">全部</option>' + dirs.map(function (d) { return '<option value="' + esc(d) + '">' + esc(d) + "</option>"; }).join("") + "</select></label>" +
      '<label class="field">体系内背景 <select id="f-bg"><option value="">全部</option>' + bgs.map(function (b) { return '<option value="' + esc(b) + '">' + esc(b) + "</option>"; }).join("") + "</select></label>" +
      '<label class="field">关键词 <input id="f-q" type="search" placeholder="姓名或方向"></label>' +
      '<label class="field"><input id="f-pri" type="checkbox" style="min-width:auto"> 只看优先</label>' +
      '<span class="filter-count" id="f-count"></span>' +
      "</div>";
    html += '<div id="adv-list"></div></div></section>';
    root.innerHTML = html;

    $("#f-school").value = advState.school;
    $("#f-dir").value = advState.dir;
    $("#f-bg").value = advState.bg;
    $("#f-q").value = advState.q;
    $("#f-pri").checked = advState.onlyPriority;

    $("#f-school").addEventListener("change", function (e) { advState.school = e.target.value; updateAdvList(); });
    $("#f-dir").addEventListener("change", function (e) { advState.dir = e.target.value; updateAdvList(); });
    $("#f-bg").addEventListener("change", function (e) { advState.bg = e.target.value; updateAdvList(); });
    $("#f-pri").addEventListener("change", function (e) { advState.onlyPriority = e.target.checked; updateAdvList(); });
    var timer = null;
    $("#f-q").addEventListener("input", function (e) {
      clearTimeout(timer);
      var v = e.target.value.trim();
      timer = setTimeout(function () { advState.q = v; updateAdvList(); }, 120);
    });
    updateAdvList();
  }

  function updateAdvList() {
    var items = advisors().filter(function (a) {
      if (advState.school && a.schoolName !== advState.school) return false;
      if (advState.dir && (a.directionTags || []).indexOf(advState.dir) < 0) return false;
      if (advState.bg && (a.backgroundTags || []).indexOf(advState.bg) < 0) return false;
      if (advState.onlyPriority && typeof a.contactOrder !== "number") return false;
      if (advState.q) {
        var hay = (a.name || "") + (a.directionRaw || "") + (a.directionTags || []).join("") + (a.title || "");
        if (hay.indexOf(advState.q) < 0) return false;
      }
      return true;
    }).sort(function (a, b) {
      var pa = typeof a.contactOrder === "number" ? a.contactOrder : 999;
      var pb = typeof b.contactOrder === "number" ? b.contactOrder : 999;
      if (pa !== pb) return pa - pb;
      return (a.schoolName || "").localeCompare(b.schoolName || "", "zh-Hans-CN") || (a.name || "").localeCompare(b.name || "", "zh-Hans-CN");
    });
    var cnt = $("#f-count");
    if (cnt) cnt.textContent = "共 " + items.length + " 位";
    var list = $("#adv-list");
    if (!list) return;
    if (!items.length) { list.innerHTML = empty("没有符合筛选条件的导师。"); return; }
    list.innerHTML = '<div class="grid-2">' + items.map(function (a) { return advisorCard(a); }).join("") + "</div>";
  }

  function advisorCard(a) {
    var bg = (a.backgroundTags || []).filter(function (t) { return t !== "无" && t !== "未获取"; });
    var rows = [
      ["行政职务", (a.adminRoles && a.adminRoles.length) ? a.adminRoles.map(function (x) { return tag(esc(x)); }).join(" ") : "无"],
      ["社会兼职", (a.socialRoles && a.socialRoles.length) ? a.socialRoles.map(function (x) { return tag(esc(x)); }).join(" ") : "无"],
      ["在研课题", (a.projects && a.projects.length) ? "<ul class='small' style='margin:0;padding-left:1.1em'>" + a.projects.map(function (p) {
        return "<li>" + esc(p.title || "") + (p.period ? "（" + esc(p.period) + "）" : "") + (p.funder ? "，" + esc(p.funder) : "") + "</li>";
      }).join("") + "</ul>" : MISS],
      ["代表作", (a.works && a.works.length) ? "<ul class='small' style='margin:0;padding-left:1.1em'>" + a.works.map(function (w) { return "<li>" + esc(w) + "</li>"; }).join("") + "</ul>" : MISS],
      ["联系方式", '<span class="adv-contact">' + (isMissing(a.email) ? "" : "<b>邮箱</b>" + esc(a.email) + "　") +
        (isMissing(a.phone) ? "" : "<b>电话</b>" + esc(a.phone) + "　") +
        (isMissing(a.homepage) ? "" : '<b>主页</b><a href="' + esc(a.homepage) + '" target="_blank" rel="noopener">' + esc(a.homepage) + "</a>") +
        (isMissing(a.email) && isMissing(a.phone) && isMissing(a.homepage) ? MISS : "") + "</span>"],
      ["招非全", (a.partTimeEnrollment && a.partTimeEnrollment !== "未获取") ? esc(a.partTimeEnrollment) : badge("未获取", "badge--pending")],
      ["近年非全学生", (a.recentPartTimeStudents && a.recentPartTimeStudents !== "未获取") ? esc(a.recentPartTimeStudents) : badge("未获取", "badge--pending")]
    ];
    var html = '<div class="adv" id="advisor-' + esc(a.id) + '">' +
      '<div class="adv-head"><h3 class="adv-name">' + esc(a.name) + "</h3>" +
      '<span class="adv-title">' + esc(a.title || "") + "</span>" +
      (typeof a.contactOrder === "number" ? '<span class="tag tag--accent">优先 ' + esc(a.contactOrder) + "</span>" : "") +
      " " + changeBadge(a.changeTag) + "</div>" +
      '<div class="adv-school">' + esc(a.schoolName || "") + (a.college ? " · " + esc(a.college) : "") + "</div>" +
      '<div class="tag-row" style="margin-bottom:8px">' + (a.directionTags || []).map(function (t) { return tag(t, "tag--accent"); }).join("") +
      bg.map(function (t) { return badge(t, "badge--official"); }).join("") +
      (a.confidence === "部分核实" ? badge("部分核实", "badge--pending") : "") + "</div>" +
      '<p class="adv-direction">' + esc(a.directionRaw || "") + "</p>" +
      kv(rows);
    if (a.contactReason) {
      html += '<div class="note note--info" style="margin:14px 0 0"><span class="note-label">排序理由</span><p>' + esc(a.contactReason) + "</p></div>";
    }
    if (a.backgroundRaw && a.backgroundRaw !== "未获取") {
      html += '<div class="note note--advice" style="margin:14px 0 0"><span class="note-label">体系内经历</span><p>' + esc(a.backgroundRaw) + "</p>" +
        srcList(a.backgroundSources, { title: "经历出处" }) + "</div>";
    }
    if (a.enrollmentNotes) html += '<p class="small" style="margin:10px 0 0">' + esc(a.enrollmentNotes) + "</p>";
    html += '<details class="acc" style="margin-top:12px"><summary>招生要求、来源与未获取项</summary><div class="acc-body">' +
      kv([["招生要求", a.enrollmentNotes ? esc(a.enrollmentNotes) : MISS]]) +
      conflictsHTML(a.conflicts) + missingHTML(a.missing) + srcList(a.sources) +
      "</div></details></div>";
    return html;
  }

  /* ==========================================================================
     时间窗口页
     ========================================================================== */

  function renderTimeline() {
    var root = $("#app");
    if (!root) return;
    var phases = timelinePhases();
    var months = calendarMonths();

    var html = sectionOpen() + sectionHead("01", "相对时间轴", "从决定报考到毕业后的第一个可报批次。所有时点用相对节点表示，不写死年份；具体日期每年以官方公告为准。");
    if (!phases.length) html += empty("时间轴数据尚未就绪。");
    else {
      html += '<div class="tl">' + phases.map(function (p, pi) {
        var items = (p.items || []).map(function (it) {
          var typeBadge = it.type === "official" ? badge("官方", "badge--official") : badge("经验建议", "badge--advice");
          var miss = String(it.missIf || "").replace(/^错过[，。：:\s]*/, "");
          return '<div class="tl-item"><div class="tl-event">' + esc(it.event || "") + " " + typeBadge + "</div>" +
            '<div class="tl-when">' + esc(it.when || "") + "</div>" +
            (miss ? '<div class="tl-miss"><b>错过</b> ' + esc(miss) + "</div>" : "") +
            (it.sources && it.sources.length ? srcList(it.sources, { title: "" }) : "") +
            "</div>";
        }).join("");
        return '<div class="tl-phase"><div class="phase-head"><span class="phase-num">阶段 ' + ("0" + (pi + 1)).slice(-2) + "</span><h3>" + esc(p.title || "") + "</h3></div>" + items + "</div>";
      }).join("") + "</div>";
    }
    html += "</div></section>";

    html += sectionOpen() + sectionHead("02", "截止日总表", "把所有带期限的事排在一起，写清时间窗口与错过后果。这一列可直接作为日历提醒的条目。");
    var rows = [];
    phases.forEach(function (p) {
      (p.items || []).forEach(function (it) {
        if (it.missIf) rows.push({ phase: p.title, event: it.event, when: it.when, missIf: it.missIf, type: it.type, sources: it.sources });
      });
    });
    if (!rows.length) html += empty("截止日数据尚未就绪。");
    else {
      html += '<div class="tbl-wrap"><table class="tbl"><thead><tr><th>阶段</th><th>事项</th><th>时间窗口</th><th>错过后果</th><th>类型</th></tr></thead><tbody>' +
        rows.map(function (r) {
          return "<tr><td>" + esc(r.phase || "") + "</td><td><b>" + esc(r.event || "") + "</b></td><td>" + esc(r.when || "") + "</td><td class='small'>" + esc(r.missIf || "") +
            "</td><td>" + (r.type === "official" ? badge("官方", "badge--official") : badge("经验建议", "badge--advice")) + "</td></tr>";
        }).join("") + "</tbody></table></div>";
    }
    html += "</div></section>";

    html += sectionOpen() + sectionHead("03", "年度日历", "按月份列出每年固定要盯的事与对应动作，可对着手机日历设提醒。");
    if (!months.length) html += empty("日历数据尚未就绪。");
    else {
      html += '<div class="cal-grid">' + months.slice().sort(function (a, b) { return a.month - b.month; }).map(function (m) {
        var items = (m.items || []).map(function (it) {
          return "<li><span class='cal-what'>" + esc(it.what || "") + "</span>" +
            (it.type === "experience" ? " " + badge("经验", "badge--advice") : "") +
            '<span class="cal-action">' + esc(it.action || "") + "</span></li>";
        }).join("");
        return '<div class="cal-month"><h3><span>' + esc(m.label || m.month + " 月") + "</span><span class='cnt'>" + (m.items || []).length + " 条</span></h3><ul class='cal-list'>" + items + "</ul></div>";
      }).join("") + "</div>";
      if (D.calendar && D.calendar.meta && D.calendar.meta.note) html += '<p class="small muted" style="margin-top:14px">' + esc(D.calendar.meta.note) + "</p>";
    }
    html += "</div></section>";
    root.innerHTML = html;
  }

  /* ==========================================================================
     岗位页
     ========================================================================== */

  var govState = { region: "", year: "", level: "" };
  var corpState = { city: "", family: "", q: "" };

  function jobFamilies() {
    return [
      { key: "质量保证 / 合规", re: /质量|QA|QC|合规|GMP|体系/i },
      { key: "药品注册 / 药政", re: /注册|药政|RA\b|申报/i },
      { key: "毒理 / 安全性评价", re: /毒理|安评|安全性|SD\b|非临床/i },
      { key: "药物分析 / 检验", re: /分析|检验|检测|理化/i },
      { key: "其他", re: null }
    ];
  }

  function familyOf(j) {
    var t = (j.title || "") + " " + (j.skills || []).join(" ");
    var fams = jobFamilies();
    for (var i = 0; i < fams.length; i++) {
      if (fams[i].re && fams[i].re.test(t)) return fams[i].key;
    }
    return "其他";
  }

  function renderJobs() {
    var root = $("#app");
    if (!root) return;
    var gov = govJobs();
    var corp = corpJobs();
    var govYears = [];
    var govRegions = ["浙江", "安徽"];
    var govLevels = [];
    gov.forEach(function (j) {
      var y = (j.announcedAt || "").slice(0, 4);
      if (y && y.length === 4 && govYears.indexOf(y) < 0) govYears.push(y);
      if (j.level && govLevels.indexOf(j.level) < 0) govLevels.push(j.level);
    });
    govYears.sort().reverse();

    var html = '<section class="section" id="gov">' + '<div class="wrap">' + sectionHead("01", "事业单位岗位", "浙江、安徽近年事业单位统一招聘中的药学类岗位。优先展示硕士可报且社会人员可报的岗位，并尽量补上拟录用人员的学历，用实际公示结果校准门槛。");
    html += '<div class="filters">' +
      '<label class="field">地区 <select id="g-region"><option value="">全部</option>' + govRegions.map(function (r) { return '<option value="' + r + '">' + r + "</option>"; }).join("") + "</select></label>" +
      '<label class="field">年份 <select id="g-year"><option value="">全部</option>' + govYears.map(function (y) { return '<option value="' + y + '">' + y + " 年公告</option>"; }).join("") + "</select></label>" +
      '<label class="field">层级 <select id="g-level"><option value="">全部</option>' + govLevels.map(function (l) { return '<option value="' + esc(l) + '">' + esc(l) + "</option>"; }).join("") + "</select></label>" +
      '<span class="filter-count" id="g-count"></span></div>';
    html += '<div id="gov-list"></div></div></section>';

    html += '<section class="section" id="corp"><div class="wrap">' + sectionHead("02", "企业岗位", "杭州、上海、南京、苏州、合肥等地的质量保证、注册、毒理、分析与检验岗位样本。薪资照抄招聘页原文，只用于看区间，不代表市场全貌；招聘平台链接易失效，投递前需核实。");
    html += '<div id="salary-block"></div>';
    html += '<div class="filters">' +
      '<label class="field">城市 <select id="c-city"><option value="">全部</option>' +
      Array.from(new Set(corp.map(function (j) { return j.city; }).filter(Boolean))).map(function (c) { return '<option value="' + esc(c) + '">' + esc(c) + "</option>"; }).join("") + "</select></label>" +
      '<label class="field">岗位族 <select id="c-family"><option value="">全部</option>' + jobFamilies().map(function (f) { return '<option value="' + esc(f.key) + '">' + esc(f.key) + "</option>"; }).join("") + "</select></label>" +
      '<label class="field">关键词 <input id="c-q" type="search" placeholder="岗位或技能"></label>' +
      '<span class="filter-count" id="c-count"></span></div>';
    html += '<div id="corp-list"></div></div></section>';
    root.innerHTML = html;

    $("#g-region").value = govState.region;
    $("#g-year").value = govState.year;
    $("#g-level").value = govState.level;
    $("#g-region").addEventListener("change", function (e) { govState.region = e.target.value; updateGovList(); });
    $("#g-year").addEventListener("change", function (e) { govState.year = e.target.value; updateGovList(); });
    $("#g-level").addEventListener("change", function (e) { govState.level = e.target.value; updateGovList(); });
    updateGovList();

    $("#c-city").value = corpState.city;
    $("#c-family").value = corpState.family;
    $("#c-q").value = corpState.q;
    $("#c-city").addEventListener("change", function (e) { corpState.city = e.target.value; updateCorpList(); });
    $("#c-family").addEventListener("change", function (e) { corpState.family = e.target.value; updateCorpList(); });
    var timer = null;
    $("#c-q").addEventListener("input", function (e) {
      clearTimeout(timer);
      var v = e.target.value.trim();
      timer = setTimeout(function () { corpState.q = v; updateCorpList(); }, 120);
    });
    renderSalaryBlock(corp);
    updateCorpList();
  }

  function updateGovList() {
    var items = govJobs().filter(function (j) {
      if (govState.region && j.region !== govState.region) return false;
      if (govState.year && (j.announcedAt || "").indexOf(govState.year) !== 0) return false;
      if (govState.level && j.level !== govState.level) return false;
      return true;
    }).sort(function (a, b) { return (b.announcedAt || "").localeCompare(a.announcedAt || ""); });
    var cnt = $("#g-count");
    if (cnt) cnt.textContent = "共 " + items.length + " 条";
    var list = $("#gov-list");
    if (!list) return;
    if (!items.length) { list.innerHTML = empty("没有符合条件的岗位。"); return; }
    var groups = {};
    items.forEach(function (j) {
      var y = (j.announcedAt || "").slice(0, 4) || "年份未获取";
      (groups[y] = groups[y] || []).push(j);
    });
    var html = "";
    Object.keys(groups).sort().reverse().forEach(function (y) {
      html += '<h3 style="margin:30px 0 6px">' + esc(y) + " 年公告 · " + groups[y].length + " 条</h3>";
      html += groups[y].map(govCard).join("");
    });
    list.innerHTML = html;
  }

  function govCard(j) {
    var social = j.socialOk === "是" ? badge("社会人员可报", "badge--ok") : j.socialOk === "否" ? badge("限应届", "badge--muted") : badge("社会人员口径未明确", "badge--pending");
    var rows = [
      ["学历要求", val(j.educationRaw) + (j.degree ? ' <span class="small muted">（' + esc(j.degree) + "）</span>" : "")],
      ["专业要求", val(j.majorRaw)],
      ["年龄要求", val(j.ageRaw)],
      ["应届限制", val(j.freshRaw)],
      ["其他条件", val(j.otherRaw)],
      ["考试方式", val(j.examRaw)],
      ["公告 / 截止", val(j.announcedAt) + (isMissing(j.deadline) ? "" : " / " + esc(j.deadline))],
      ["拟录用公示", val(j.admittedRaw) + (j.admittedDegrees && j.admittedDegrees.length ? ' <span class="small muted">（学历：' + j.admittedDegrees.map(esc).join("、") + "）</span>" : "")]
    ];
    return '<div class="job" id="gov-' + esc(j.id) + '" style="margin-top:12px">' +
      '<div class="job-head"><h4 class="job-title">' + esc(j.position || "") + "</h4>" +
      '<span class="job-salary">' + (isMissing(j.headcount) ? "人数未获取" : esc(j.headcount) + " 人") + "</span></div>" +
      '<div class="job-meta">' + esc(j.unit || "") + " · " + esc(j.region || "") + (j.city ? " " + esc(j.city) : "") + (j.level ? " · " + esc(j.level) : "") +
      (j.unitType ? " · " + esc(j.unitType) : "") + "</div>" +
      '<div class="badge-row" style="margin-bottom:10px">' + social +
      (j.batch ? '<span class="badge badge--third">' + esc(j.batch) + "</span>" : "") + changeBadge(j.changeTag) + "</div>" +
      kv(rows) + (j.notes ? '<p class="small muted" style="margin-top:8px">' + esc(j.notes) + "</p>" : "") +
      missingHTML(j.missing) + srcList(j.sources) + "</div>";
  }

  function renderSalaryBlock(corp) {
    var block = $("#salary-block");
    if (!block) return;
    var usable = corp.filter(function (j) { return typeof j.salaryMin === "number" && typeof j.salaryMax === "number"; });
    if (!usable.length) { block.innerHTML = ""; return; }
    var maxK = 0;
    usable.forEach(function (j) { maxK = Math.max(maxK, j.salaryMax); });
    maxK = Math.ceil(maxK / 10) * 10 || 50;
    var fams = jobFamilies();
    var stats = fams.map(function (f) {
      var list = usable.filter(function (j) { return familyOf(j) === f.key; });
      if (!list.length) return null;
      return {
        key: f.key,
        count: list.length,
        min: Math.min.apply(null, list.map(function (j) { return j.salaryMin; })),
        max: Math.max.apply(null, list.map(function (j) { return j.salaryMax; }))
      };
    }).filter(Boolean);
    var html = '<div class="card" style="margin-bottom:8px"><div class="card-head"><h3 class="card-title">薪资分布（按招聘页原文汇总）</h3><span class="card-sub">横轴单位：K / 月</span></div>' +
      '<div class="salary-scale">' + [0, 0.25, 0.5, 0.75, 1].map(function (p) {
        return '<span class="tick" style="left:' + p * 100 + '%">' + Math.round(maxK * p) + "K</span>";
      }).join("") + "</div>";
    stats.forEach(function (s) {
      var left = (s.min / maxK) * 100;
      var width = ((s.max - s.min) / maxK) * 100;
      html += '<div class="salary-row" style="margin-top:10px"><span class="label">' + esc(s.key) + "</span>" +
        '<div class="salary-bar"><div class="bar" style="left:' + left + "%;width:" + Math.max(width, 2) + '%"></div><div class="dot" style="left:' + left + '%"></div><div class="dot" style="left:' + (s.min === s.max ? left : (s.max / maxK) * 100) + '%"></div></div>' +
        '<span class="val">' + s.min + "–" + s.max + "K · " + s.count + " 条</span></div>";
    });
    html += '<p class="small muted" style="margin:14px 0 0">由各条招聘页原文的最低值与最高值汇总，仅反映这批样本的区间，不代表行业整体水平；同一条岗位的学历与经验要求不同，薪资差异属正常。</p></div>';
    block.innerHTML = html;
  }

  function updateCorpList() {
    var items = corpJobs().filter(function (j) {
      if (corpState.city && j.city !== corpState.city) return false;
      if (corpState.family && familyOf(j) !== corpState.family) return false;
      if (corpState.q) {
        var hay = (j.title || "") + (j.company || "") + (j.skills || []).join("") + (j.description || "");
        if (hay.indexOf(corpState.q) < 0) return false;
      }
      return true;
    });
    var cnt = $("#c-count");
    if (cnt) cnt.textContent = "共 " + items.length + " 条";
    var list = $("#corp-list");
    if (!list) return;
    if (!items.length) { list.innerHTML = empty("没有符合条件的岗位。"); return; }
    list.innerHTML = '<div class="grid-2">' + items.map(corpCard).join("") + "</div>";
  }

  function corpCard(j) {
    var rows = [
      ["学历", val(j.education)],
      ["经验", val(j.experience)],
      ["技能", (j.skills && j.skills.length) ? j.skills.map(function (s) { return tag(esc(s)); }).join(" ") : MISS]
    ];
    return '<div class="job" id="corp-' + esc(j.id) + '">' +
      '<div class="job-head"><h3 class="job-title">' + esc(j.title || "") + "</h3>" +
      '<span class="job-salary">' + val(j.salaryRaw) + "</span></div>" +
      '<div class="job-meta">' + esc(j.company || "") + " · " + esc(j.city || "") + (j.companyType ? " · " + esc(j.companyType) : "") + " " + changeBadge(j.changeTag) + "</div>" +
      '<p class="job-desc">' + val(j.description) + "</p>" + kv(rows) +
      '<p class="small" style="margin:10px 0 0">' + badge(j.sourceType === "official" ? "官方" : "第三方", j.sourceType === "official" ? "badge--official" : "badge--third") +
      " 来源：" + esc(j.platform || "") + (j.publishedAt ? " · " + esc(j.publishedAt) : "") +
      (j.url ? ' · <a href="' + esc(j.url) + '" target="_blank" rel="noopener">查看原页</a>' : "") + "</p>" +
      (j.notes ? '<p class="small muted" style="margin:4px 0 0">' + esc(j.notes) + "</p>" : "") +
      missingHTML(j.missing) + "</div>";
  }

  /* ==========================================================================
     证书页
     ========================================================================== */

  function renderCerts() {
    var root = $("#app");
    if (!root) return;
    var items = certs();
    var html = sectionOpen() + sectionHead("01", "证书与职称", "实验动物从业证、执业药师、药学专业技术职称的报考条件、时间窗口、有效期与用途。各地口径与年度安排不同，表中标注的「需电话确认」项以当地主管部门答复为准。");
    if (!items.length) html += empty("证书数据尚未就绪。");
    else {
      html += '<div class="grid-2">' + items.map(function (c) {
        var tl = (c.timeline || []).length ? '<ul class="cert-timeline">' + c.timeline.map(function (t) {
          return "<li><span class='when'>" + esc(t.when || "") + "</span>" + esc(t.event || "") + "</li>";
        }).join("") + "</ul>" : MISS;
        return '<div class="card" id="cert-' + esc(c.id) + '">' +
          '<div class="card-head"><h3 class="card-title">' + esc(c.name || "") + "</h3>" +
          '<span class="card-sub">' + badge(c.category || "", "badge--muted") + "</span></div>" +
          '<div class="card-body">' +
          '<p class="small muted" style="margin-bottom:10px">发证 / 主管：' + val(c.issuer) + "</p>" +
          kv([
            ["报考条件", val(c.conditionRaw)],
            ["时间窗口", tl],
            ["有效期", val(c.validityRaw)],
            ["续证 / 继续教育", val(c.renewalRaw)],
            ["用途", val(c.utilityRaw)],
            ["费用", val(c.costRaw)]
          ]) +
          (c.notes ? '<p class="small muted" style="margin-top:10px">' + esc(c.notes) + "</p>" : "") +
          missingHTML(c.missing) + srcList(c.sources) + "</div></div>";
      }).join("") + "</div>";
    }
    if (D.certs && D.certs.meta && D.certs.meta.disclaimer) {
      html += '<div class="note note--warn" style="margin-top:22px"><span class="note-label">口径提醒</span><p>' + esc(D.certs.meta.disclaimer) + "</p></div>";
    }
    html += "</div></section>";
    root.innerHTML = html;
  }

  /* ==========================================================================
     来源与待核实
     ========================================================================== */

  function renderSources() {
    var root = $("#app");
    if (!root) return;
    var missing = collectMissing();
    var conflicts = collectConflicts();
    var stats = sourceStats();
    var schools = allSchools();
    var adv = advisors();

    var html = sectionOpen() + sectionHead("01", "待核实清单", "下列字段在公开渠道未能确认，或来源之间口径不一致。按记录分组，可直接作为电话核实与下一轮更新的清单；查不到的字段不替任何人补。");
    if (!missing.length) html += empty("本轮没有未获取字段。");
    else {
      var cats = ["院校", "导师", "事业单位岗位", "企业岗位", "证书职称", "时间窗口"];
      cats.forEach(function (cat) {
        var list = missing.filter(function (m) { return m.cat === cat; });
        if (!list.length) return;
        html += '<h3 style="margin:26px 0 10px">' + esc(cat) + " · " + list.length + " 条</h3>";
        html += '<div class="tbl-wrap"><table class="tbl tbl--compact"><thead><tr><th>记录</th><th>未获取 / 待核实字段</th></tr></thead><tbody>' +
          list.map(function (m) {
            var page = cat === "导师" ? "advisors.html" : cat === "证书职称" ? "certs.html" : cat === "时间窗口" ? "timeline.html" : "schools.html";
            if (cat === "事业单位岗位" || cat === "企业岗位") page = "jobs.html";
            return "<tr><td>" + anchorLink(page, m.anchor, m.label) + "</td><td><ul style='margin:0;padding-left:1.1em'>" +
              m.fields.map(function (f) { return "<li>" + esc(f) + "</li>"; }).join("") + "</ul></td></tr>";
          }).join("") + "</tbody></table></div>";
      });
      html += '<p class="small muted" style="margin-top:16px">共 ' + missing.length + " 条记录、";
      html += missing.reduce(function (n, m) { return n + m.fields.length; }, 0) + ' 个字段待核实。</p>';
    }
    html += "</div></section>";

    html += sectionOpen() + sectionHead("02", "来源冲突", "同一个字段出现两种以上说法时全部并列，不替读者选择。每条冲突下方附各自出处。");
    if (!conflicts.length) html += empty("本轮没有登记来源冲突。");
    else {
      conflicts.forEach(function (c) {
        html += '<div class="card" style="margin-top:12px"><div class="card-head"><h3 class="card-title">' + esc(c.label) + "</h3><span class='card-sub'>" + esc(c.cat) + "</span></div><div class='card-body'>" +
          conflictsHTML(c.list) + "</div></div>";
      });
    }
    html += "</div></section>";

    html += sectionOpen() + sectionHead("03", "来源总表", "共 " + stats.total + " 条去重链接，其中官方 " + stats.official + " 条、第三方 " + stats.third + " 条。第三方只作为线索，不作为录取、学费、岗位等结论的唯一依据。");

    var groups = [
      { key: "院校", label: "院校招生与排除", collect: function (cb) { schools.forEach(function (s) { walkSources(s, cb); }); allExclusions().forEach(function (e) { walkSources(e, cb); }); } },
      { key: "导师", label: "导师", collect: function (cb) { adv.forEach(function (a) { walkSources(a, cb); }); } },
      { key: "事业单位岗位", label: "事业单位岗位", collect: function (cb) { govJobs().forEach(function (j) { walkSources(j, cb); }); } },
      { key: "企业岗位", label: "企业岗位", collect: function (cb) { corpJobs().forEach(function (j) { if (Array.isArray(j.sources)) j.sources.forEach(cb); }); } },
      { key: "证书职称", label: "证书与职称", collect: function (cb) { certs().forEach(function (c) { walkSources(c, cb); }); } },
      { key: "时间窗口与日历", label: "时间窗口与日历", collect: function (cb) { walkSources(D.timeline, cb); walkSources(D.calendar, cb); walkSources(D.actions, cb); } }
    ];
    groups.forEach(function (g) {
      var seen = {};
      var list = [];
      g.collect(function (s) {
        if (!s || !s.url || seen[s.url]) return;
        seen[s.url] = 1;
        list.push(s);
      });
      if (!list.length) return;
      html += '<h3 style="margin:28px 0 10px">' + esc(g.label) + " · " + list.length + " 条</h3>";
      html += '<div class="tbl-wrap"><table class="tbl tbl--compact"><thead><tr><th>标题</th><th>发布者</th><th>类型</th><th>发布</th><th>查阅</th></tr></thead><tbody>' +
        list.map(function (s) {
          return "<tr><td><a href='" + esc(s.url) + "' target='_blank' rel='noopener'>" + esc(s.title) + "</a>" +
            (s.note ? "<div class='small muted'>" + esc(s.note) + "</div>" : "") + "</td>" +
            "<td>" + esc(s.publisher || "") + "</td><td>" + srcTypeBadge(s) + "</td><td class='num'>" + esc(s.published || "未知") +
            "</td><td class='num'>" + esc(s.accessed || "") + "</td></tr>";
        }).join("") + "</tbody></table></div>";
    });
    html += "</div></section>";

    root.innerHTML = html;
  }

  /* ==========================================================================
     更新日志
     ========================================================================== */

  function renderChangelog() {
    var root = $("#app");
    if (!root) return;
    var items = ((D.changelog && D.changelog.items) || []).slice().sort(function (a, b) {
      return (b.date || "").localeCompare(a.date || "");
    });
    var html = sectionOpen() + sectionHead("01", "更新日志", "每次更新追加一条：日期、版本、改动类型、涉及板块与具体变化。旧数据不删除，过期的会标注。");
    if (!items.length) html += empty("暂无更新记录。");
    else {
      html += items.map(function (c) {
        return '<div class="card" style="margin-top:14px"><div class="card-head"><h3 class="card-title">' + esc(c.date) + " · " + esc(c.version || "") +
          "</h3><span class='card-sub'>" + badge(c.type || "", "badge--muted") + "</span></div><div class='card-body'>" +
          "<p>" + esc(c.text || "") + "</p>" + (c.detail ? '<p class="small muted">' + esc(c.detail) + "</p>" : "") +
          ((c.sections || []).length ? '<div class="tag-row" style="margin-top:8px">' + c.sections.map(function (s) { return tag(s); }).join("") + "</div>" : "") +
          "</div></div>";
      }).join("");
    }
    html += '<p class="small muted" style="margin-top:18px">更新方式与数据字段说明见仓库内 <span class="mono">docs/UPDATE.md</span>。</p>';
    html += "</div></section>";
    root.innerHTML = html;
  }

  /* ==========================================================================
     启动
     ========================================================================== */

  var renderers = {
    index: renderHome,
    schools: renderSchools,
    advisors: renderAdvisors,
    timeline: renderTimeline,
    jobs: renderJobs,
    certs: renderCerts,
    sources: renderSources,
    changelog: renderChangelog
  };

  function boot() {
    initChrome();
    var page = document.body.getAttribute("data-page") || "";
    var fn = renderers[page];
    if (fn) {
      try { fn(); } catch (e) {
        var root = $("#app");
        if (root) root.innerHTML = '<div class="empty">页面数据渲染出现错误，请检查 data 目录下的数据文件。</div>';
        if (window.console && console.error) console.error(e);
      }
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
