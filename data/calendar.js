window.DATA = window.DATA || {};
window.DATA.calendar = {
  meta: {
    updatedAt: "2026-11-15",
    note: "全年固定要盯的月份；每年以官方公告为准。挂官方出处的条目为该年度已确认口径，其余为经验建议，月份为通行节奏。"
  },
  months: [
    {
      month: 1,
      label: "1月",
      items: [
        {
          what: "上一年度考研与证书结果复盘，确认是再战、调剂还是转向",
          action: "列一张复盘表：分数、差额、薄弱科目、证书通过科目、下一年度要改的三件事",
          type: "experience"
        },
        {
          what: "省直事业单位统考公告即将发布，核对目标岗位的学历、专业、年龄条件",
          action: "把上一年度岗位表与公告下载归档，标出目标岗位的年龄口径与专业限制",
          type: "experience"
        },
        {
          what: "本年度职称评审的继续教育学时开始计算",
          action: "按学时要求选课，保留学习记录与证书，避免年底集中补",
          type: "experience"
        },
        {
          what: "卫生专业技术资格考试报名窗口（一般在 12 月至次年 1 月，以官方公告为准）",
          action: "核对报考专业与工作年限，按报名系统要求上传材料",
          type: "experience"
        }
      ]
    },
    {
      month: 2,
      label: "2月",
      items: [
        {
          what: "省直事业单位统一公开招聘报名：以 2026 年度为例，2 月 2 日至 2 月 6 日报名",
          action: "按公告要求填报岗位，确认资格复审材料清单与单位同意报考证明要求",
          type: "official",
          sources: [
            {
              title: "2026年度安徽省省直事业单位统一公开招聘工作人员公告",
              publisher: "安徽省人事考试网",
              url: "http://apta.net.cn/Officer/FAnnouncementDetail/1101",
              type: "official",
              published: "2026-01-29",
              accessed: "2026-11-15"
            }
          ]
        },
        {
          what: "考研初试成绩公布（一般 2 月中下旬，以研招网与学校通知为准）",
          action: "出分后 48 小时内完成三件事：核对单科线、判断复试可能性、准备成绩单截图与简历",
          type: "experience"
        },
        {
          what: "复试与调剂信息开始发布",
          action: "建立目标院校复试科目与参考书清单，收到通知后按学校模板准备材料",
          type: "experience"
        },
        {
          what: "单位年度考核结果与岗位安排沟通",
          action: "确认新一年度排班与集中授课安排，提前报备可能的请假时段",
          type: "experience"
        }
      ]
    },
    {
      month: 3,
      label: "3月",
      items: [
        {
          what: "国家线与一区范围公布，上海、江苏、浙江、安徽均在一区",
          action: "按一区线判断复试与调剂，同步核对目标院校院线与专业线",
          type: "official",
          sources: [
            {
              title: "教育部关于印发《2027年全国硕士研究生招生工作管理规定》的通知",
              publisher: "中国研究生招生信息网（转载教育部文件）",
              url: "https://yz.chsi.com.cn/kyzx/jybzc/202609/20260924/2293971511.html",
              type: "official",
              published: "2026-09-24",
              accessed: "2026-11-15"
            }
          ]
        },
        {
          what: "复试与调剂集中进行（一般 3 月至 4 月，以学校通知为准）",
          action: "按学校复试办法准备专业课、英语与综合面试；定向单位同意报考材料提前办好",
          type: "experience"
        },
        {
          what: "省直事业单位统考笔试：以 2026 年度为例，3 月 28 日综合管理类、3 月 29 日其他类别",
          action: "提前打印准考证、确认考点，笔试后保留报名表与准考证用于资格复审",
          type: "official",
          sources: [
            {
              title: "2026年度安徽省省直事业单位统一公开招聘工作人员公告",
              publisher: "安徽省人事考试网",
              url: "http://apta.net.cn/Officer/FAnnouncementDetail/1101",
              type: "official",
              published: "2026-01-29",
              accessed: "2026-11-15"
            }
          ]
        },
        {
          what: "职称申报通知陆续发布，核对申报口子与材料清单",
          action: "按通知准备学历、资历、业绩、继续教育材料，向人事确认单位内部排序规则",
          type: "experience"
        }
      ]
    },
    {
      month: 4,
      label: "4月",
      items: [
        {
          what: "拟录取名单公示，公示期不少于 7 日",
          action: "逐项核对姓名、考生编号、专业、学习方式与就业方式；有误在公示期内提出",
          type: "official",
          sources: [
            {
              title: "教育部关于印发《2027年全国硕士研究生招生工作管理规定》的通知",
              publisher: "中国研究生招生信息网（转载教育部文件）",
              url: "https://yz.chsi.com.cn/kyzx/jybzc/202609/20260924/2293971511.html",
              type: "official",
              published: "2026-09-24",
              accessed: "2026-11-15"
            }
          ]
        },
        {
          what: "定向就业协议签订与寄回学校，录取工作一般应在录取当年 4 月底前完成",
          action: "收到协议当天启动单位内部审批，留出用印排期；寄出前扫描留存全部盖章页",
          type: "official",
          sources: [
            {
              title: "教育部关于印发《2027年全国硕士研究生招生工作管理规定》的通知",
              publisher: "中国研究生招生信息网（转载教育部文件）",
              url: "https://yz.chsi.com.cn/kyzx/jybzc/202609/20260924/2293971511.html",
              type: "official",
              published: "2026-09-24",
              accessed: "2026-11-15"
            }
          ]
        },
        {
          what: "函调与现实表现材料盖章（复试后至录取前）",
          action: "确认由档案所在单位还是工作单位出材料，人事或政工部门盖章后按学校要求寄回",
          type: "experience"
        },
        {
          what: "事业单位统考资格复审与专业测试",
          action: "按公告准备身份证、学历学位证、报名表、单位同意报考证明",
          type: "experience"
        }
      ]
    },
    {
      month: 5,
      label: "5月",
      items: [
        {
          what: "录取检查与补正材料（部分学校要求补充协议或政审材料）",
          action: "每天查看研招网站内信与学校通知，补正材料在 3 个工作日内寄出",
          type: "experience"
        },
        {
          what: "录取通知书寄发前的地址与联系方式核对",
          action: "在研招网系统内更新邮寄地址与手机号，避免代收丢失",
          type: "experience"
        },
        {
          what: "下半年职称与证书计划排期",
          action: "把执业药师、职称申报、论文开题的时间节点写进同一张年度表",
          type: "experience"
        }
      ]
    },
    {
      month: 6,
      label: "6月",
      items: [
        {
          what: "录取通知书陆续寄发，入学须知与缴费通知同步下发",
          action: "按通知完成学费缴纳、住宿意向、组织关系与档案确认（定向一般不转）",
          type: "experience"
        },
        {
          what: "毕业季：单位内新入职与轮岗调整集中，岗位机会增多",
          action: "关注内部岗位与条线借调通知，结合在读方向判断是否申请",
          type: "experience"
        },
        {
          what: "执业药师报名入口开放前准备（一般 8 月开放，以中国人事考试网通知为准）",
          action: "提前注册报名平台账号、核对学历学位信息与工作年限证明",
          type: "experience"
        }
      ]
    },
    {
      month: 7,
      label: "7月",
      items: [
        {
          what: "执业药师报名前最后核对：专业、学历、工作年限、免试条件",
          action: "按报考提醒逐项自查，材料扫描件按系统要求命名归档",
          type: "experience"
        },
        {
          what: "招生单位上一届简章与录取数据可用于下一轮院校调研",
          action: "整理目标院校的学制、学费、上课方式、定向要求与复试线，形成对比表",
          type: "experience"
        },
        {
          what: "下半年事业单位统考与行业招聘的公告观察",
          action: "订阅省人社厅、人事考试网与主管部门网站更新，按月记录公告节奏",
          type: "experience"
        }
      ]
    },
    {
      month: 8,
      label: "8月",
      items: [
        {
          what: "执业药师职业资格考试报名：2026 年度报名入口 8 月 4 日至 8 月 25 日在全国专业技术人员资格考试报名服务平台开放，各地具体时间以当地通知为准",
          action: "在报名平台完成填报与缴费，保留报名表与缴费凭证",
          type: "official",
          sources: [
            {
              title: "2026年度执业药师职业资格考试报考提醒",
              publisher: "中国人事考试网",
              url: "http://www.cpta.com.cn/examNotice/2211.html",
              type: "official",
              published: "2026-07-07",
              accessed: "2026-11-15"
            }
          ]
        },
        {
          what: "各地执业药师报名时间不同，需以当地人事考试机构通知为准",
          action: "按所在考区通知核对报名、缴费与准考证打印时间，避免只记全国口径",
          type: "official",
          sources: [
            {
              title: "关于做好2026年度执业药师职业资格考试考务工作的通知（辽宁考区）",
              publisher: "辽宁省人事考试中心",
              url: "https://www.lnrsks.com/html/zyzg_tongzhitonggao/7517.html",
              type: "official",
              published: "2026-07-24",
              accessed: "2026-11-15"
            }
          ]
        },
        {
          what: "招生简章陆续发布（一般 9–10 月集中发布，以学校研究生院官网为准）",
          action: "每周固定一天查目标院校研究生院官网，简章发布后 48 小时内完成关键字段摘录",
          type: "experience"
        }
      ]
    },
    {
      month: 9,
      label: "9月",
      items: [
        {
          what: "当年全国硕士研究生招生工作管理规定与考试日程表发布",
          action: "下载管理规定原文，标出报名、初试、定向协议、公示与录取的条款位置",
          type: "official",
          sources: [
            {
              title: "教育部关于印发《2027年全国硕士研究生招生工作管理规定》的通知",
              publisher: "中国研究生招生信息网（转载教育部文件）",
              url: "https://yz.chsi.com.cn/kyzx/jybzc/202609/20260924/2293971511.html",
              type: "official",
              published: "2026-09-24",
              accessed: "2026-11-15"
            },
            {
              title: "2027年全国硕士研究生招生考试日程表",
              publisher: "中国研究生招生信息网",
              url: "https://yz.chsi.com.cn/kyzx/kydt/202609/20260924/2293971536.html",
              type: "official",
              published: "2026-09-24",
              accessed: "2026-11-15"
            }
          ]
        },
        {
          what: "招生简章与专业目录集中发布，定向要求、学费、上课方式以简章原文为准",
          action: "逐校核对学习方式、定向要求、学费与授课安排，形成三所最终候选",
          type: "experience"
        },
        {
          what: "预报名前的账号与学籍学历校验",
          action: "提前注册或登录研招网账号，完成学籍学历校验，信息有误尽早更正",
          type: "experience"
        },
        {
          what: "职称申报材料定稿与单位内部报送",
          action: "按通知截止日提前一周报送，保留报送回执",
          type: "experience"
        }
      ]
    },
    {
      month: 10,
      label: "10月",
      items: [
        {
          what: "网上预报名：2026 年 10 月 9 日至 10 月 12 日，每日 9:00–22:00（2027 招生年度）",
          action: "填报后逐项核对招生单位、专业、学习方式与定向就业信息",
          type: "official",
          sources: [
            {
              title: "教育部关于印发《2027年全国硕士研究生招生工作管理规定》的通知",
              publisher: "中国研究生招生信息网（转载教育部文件）",
              url: "https://yz.chsi.com.cn/kyzx/jybzc/202609/20260924/2293971511.html",
              type: "official",
              published: "2026-09-24",
              accessed: "2026-11-15"
            }
          ]
        },
        {
          what: "网上报名：2026 年 10 月 15 日至 10 月 24 日，每日 9:00–22:00（2027 招生年度）",
          action: "报名号生成后保存截图；需修改信息的在报名期内完成，逾期不补报",
          type: "official",
          sources: [
            {
              title: "教育部关于印发《2027年全国硕士研究生招生工作管理规定》的通知",
              publisher: "中国研究生招生信息网（转载教育部文件）",
              url: "https://yz.chsi.com.cn/kyzx/jybzc/202609/20260924/2293971511.html",
              type: "official",
              published: "2026-09-24",
              accessed: "2026-11-15"
            }
          ]
        },
        {
          what: "执业药师职业资格考试：2026 年度考试时间 10 月 31 日、11 月 1 日",
          action: "打印准考证、确认考点路线，考试用品与证件提前备好",
          type: "official",
          sources: [
            {
              title: "2026年度执业药师职业资格考试报考提醒",
              publisher: "中国人事考试网",
              url: "http://www.cpta.com.cn/examNotice/2211.html",
              type: "official",
              published: "2026-07-07",
              accessed: "2026-11-15"
            }
          ]
        },
        {
          what: "报名后与单位确认定向协议与同意报考材料的口径",
          action: "非正式确认：单位是否愿意在协议上盖章、由谁签字、需要哪些内部材料",
          type: "experience"
        }
      ]
    },
    {
      month: 11,
      label: "11月",
      items: [
        {
          what: "网上确认：按报考点要求提交材料、采集信息（11 月上旬，以报考点公告为准）",
          action: "确认前检查身份证有效期与照片要求，确认后保留回执",
          type: "experience"
        },
        {
          what: "初试时间确认公告发布，核对考试日期与科目安排",
          action: "把初试日期写进日历并倒排复习计划，提前请假与调班",
          type: "official",
          sources: [
            {
              title: "2027年全国硕士研究生招生考试初试时间确定",
              publisher: "中国研究生招生信息网（教育部来源）",
              url: "https://yz.chsi.com.cn/kyzx/jybzc/202611/20261113/2293984092.html",
              type: "official",
              published: "2026-11-13",
              accessed: "2026-11-15"
            }
          ]
        },
        {
          what: "打印准考证前的信息核对（考点、考场、考试科目）",
          action: "准考证开放打印后立即下载多份备份，核对姓名与证件号",
          type: "experience"
        },
        {
          what: "执业药师成绩与合格标准关注，决定次年是否补考",
          action: "按成绩有效期规划次年报考科目，保留成绩单",
          type: "experience"
        }
      ]
    },
    {
      month: 12,
      label: "12月",
      items: [
        {
          what: "初试：12 月 19 日上午思想政治理论、下午外国语；20 日上午业务课一或专业基础综合、下午业务课二（2027 招生年度）",
          action: "考前一天确认考点、证件与文具；每场考试提前 40 分钟到达",
          type: "official",
          sources: [
            {
              title: "教育部关于印发《2027年全国硕士研究生招生工作管理规定》的通知",
              publisher: "中国研究生招生信息网（转载教育部文件）",
              url: "https://yz.chsi.com.cn/kyzx/jybzc/202609/20260924/2293971511.html",
              type: "official",
              published: "2026-09-24",
              accessed: "2026-11-15"
            },
            {
              title: "2027年全国硕士研究生招生考试初试时间确定",
              publisher: "中国研究生招生信息网（教育部来源）",
              url: "https://yz.chsi.com.cn/kyzx/jybzc/202611/20261113/2293984092.html",
              type: "official",
              published: "2026-11-13",
              accessed: "2026-11-15"
            }
          ]
        },
        {
          what: "单位年度考核与下一年度工作计划",
          action: "把在读安排写进年度工作计划，提前沟通次年集中授课与排班",
          type: "experience"
        },
        {
          what: "卫生专业技术资格考试报名前准备（一般在 12 月至次年 1 月，以官方公告为准）",
          action: "核对报考条件与工作年限，准备学历、学位、执业证书等材料",
          type: "experience"
        }
      ]
    }
  ]
};
