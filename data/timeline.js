window.DATA = window.DATA || {};
window.DATA.timeline = {
  meta: {
    updatedAt: "2026-11-15",
    latestCycle: 2027,
    note: "相对时间轴，不写死年份。事件前的【】标注所属线：学历线、年龄线、职称线、证书线、考编线、业界线。官方节点挂具体出处；标注「经验建议」的条目为基于公开规则的推演，动手前以当年官方公告为准。"
  },
  phases: [
    {
      id: "decide",
      title: "决定与摸底",
      items: [
        {
          event: "【学历线】确定报考方式：非全日制、同等学力申硕、全日制之间做取舍",
          when: "每年 3–6 月，早于当年简章发布",
          missIf: "方向定错，后期换学校要重走一轮简章核对与导师沟通",
          type: "experience"
        },
        {
          event: "【学历线】逐校核对招生简章：学习方式、学制、学费、上课方式、定向要求",
          when: "每年 9–10 月集中发布，以学校研究生院官网为准",
          missIf: "漏看定向要求或学费口径，报名后无法更改",
          type: "experience"
        },
        {
          event: "【学历线】确认非全日制原则上只招在职定向就业人员，需在被录取前签订定向就业合同",
          when: "研读当年招生管理规定与院校简章时",
          missIf: "单位不同意盖章，录取后协议无法签订，录取资格受影响",
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
          event: "【年龄线】核对事业单位招聘的年龄条件与出生日期口径",
          when: "招聘公告发布时（省直统考多在年初）",
          missIf: "年龄按公告的出生日期计算，误判会白准备一年",
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
          event: "【年龄线】区分考研报名与招聘报考两条年龄口径：前者看当年管理规定，后者看岗位表",
          when: "决定报考前",
          missIf: "把招聘年龄条件误当成考研报名限制，放弃报考",
          type: "experience"
        },
        {
          event: "【职称线】核对药学职称申报的学历、任职年限与继续教育要求",
          when: "每年评审通知发布前，留出半年准备期",
          missIf: "学历或年限不匹配、学时不足，材料被退回",
          type: "experience"
        },
        {
          event: "【证书线】核对执业药师报考条件与报名时间，确认专业、学历、工作年限是否符合",
          when: "每年 6–8 月报名季前",
          missIf: "错过报名或科目不符，当年无法参考",
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
          event: "【考编线】了解省直事业单位统考的公告节奏：公告发布、报名、笔试集中在年初至 3 月",
          when: "年初公告发布时",
          missIf: "错过报名窗口，只能等下一年度",
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
          event: "【业界线】跟踪本单位新院区、新实验室、条线交流与借调机会",
          when: "全年，每季度至少一次",
          missIf: "机会出现时才发现资历、证书或学历条件不满足",
          type: "experience"
        },
        {
          event: "【业界线】参加行业协会、条线培训与学术会议，建立可请教的同行网络",
          when: "全年，会议与培训季集中在春秋两季",
          missIf: "信息停留在本单位内部，缺少横向参照",
          type: "experience"
        }
      ]
    },
    {
      id: "apply",
      title: "报名与初试",
      items: [
        {
          event: "【学历线】网上预报名",
          when: "2026 年 10 月 9 日至 10 月 12 日，每日 9:00–22:00（2027 招生年度）",
          missIf: "预报名信息未核对，正式报名需重新填报",
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
          event: "【学历线】网上报名：填报招生单位、专业、学习方式与定向就业信息",
          when: "2026 年 10 月 15 日至 10 月 24 日，每日 9:00–22:00（2027 招生年度）",
          missIf: "逾期不补报；定向单位信息填错，后期更正流程复杂",
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
          event: "【学历线】网上确认：按报考点要求提交材料、采集信息",
          when: "报名结束后至 11 月上旬，以各报考点公告为准",
          missIf: "未完成确认，报名信息无效",
          type: "experience"
        },
        {
          event: "【学历线】打印准考证",
          when: "初试前约 10 天，以研招网通知为准",
          missIf: "无准考证不能进入考场",
          type: "experience"
        },
        {
          event: "【学历线】初试：12 月 19 日上午思想政治理论、下午外国语；20 日上午业务课一或专业基础综合、下午业务课二",
          when: "2026 年 12 月 19 日至 12 月 20 日（2027 招生年度）",
          missIf: "缺考任一单元即无复试资格；迟到与证件不符按考场规则处理",
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
          event: "【学历线】药学类专业学位初试科目为思想政治理论、外国语、专业基础综合三个单元",
          when: "备考初期确认科目与分值，按当年简章与考试大纲复习",
          missIf: "按四个单元复习，浪费一科时间",
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
          event: "【证书线】执业药师职业资格考试与考研初试仅相隔约 7 周，报名与复习时间需分开排",
          when: "2026 年 10 月 31 日、11 月 1 日（2026 年度）",
          missIf: "两场考试复习撞车，两线都准备不足",
          type: "official",
          sources: [
            {
              title: "2026年度执业药师职业资格考试报考提醒",
              publisher: "中国人事考试网",
              url: "http://www.cpta.com.cn/examNotice/2211.html",
              type: "official",
              published: "2026-07-07",
              accessed: "2026-11-15"
            },
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
          event: "【年龄线】考研报名条件不设年龄上限；事业单位招聘仍按岗位表设年龄条件，两条线分开看",
          when: "报名前核对当年管理规定与目标岗位公告",
          missIf: "误信年龄限制而放弃报名，或忽略招聘年龄条件白准备一年",
          type: "experience"
        },
        {
          event: "【职称线】继续教育学时与业绩材料同步准备，避免年底集中补",
          when: "报名后至年底，按当年学时要求执行",
          missIf: "学时不足或材料缺失，影响次年职称申报",
          type: "experience"
        },
        {
          event: "【考编线】关注省属事业单位统考的报名与笔试时间，与考研复习错峰",
          when: "以当年省人社厅与人事考试网公告为准",
          missIf: "两条线时间冲突，临时调整导致两边都赶",
          type: "experience"
        },
        {
          event: "【业界线】年底单位年度考核与来年工作计划，提前沟通集中授课安排",
          when: "每年 12 月至次年 1 月",
          missIf: "排班与集中授课冲突，临时调休协调成本高",
          type: "experience"
        }
      ]
    },
    {
      id: "admit",
      title: "出分、复试与录取",
      items: [
        {
          event: "【学历线】初试成绩公布，按成绩判断复试、调剂或再战",
          when: "一般 2 月中下旬，以研招网与学校通知为准",
          missIf: "错过成绩复核申请期限，分数争议无法申诉",
          type: "experience"
        },
        {
          event: "【学历线】国家线公布与一区范围确认：上海、江苏、浙江、安徽均在一区",
          when: "查阅国家线时",
          missIf: "误按二区准备，调剂策略与分数预期偏差",
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
          event: "【学历线】复试与调剂：按学校复试办法准备笔试、面试与材料",
          when: "一般 3 月至 4 月，以学校研究生院通知为准",
          missIf: "材料不齐或未按时确认，视为放弃复试资格",
          type: "experience"
        },
        {
          event: "【学历线】拟录取名单公示，公示期不少于 7 日",
          when: "复试结束后至录取检查前",
          missIf: "公示期内未核对信息，定向单位名称或就业方式有误难更正",
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
          event: "【学历线】与招生单位、定向单位签订定向就业协议，一经录取不得变更就业方式",
          when: "拟录取公示后至录取检查前，学校通知的截止日为准",
          missIf: "协议缺章或逾期寄回，录取资格受影响",
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
          event: "【学历线】函调与现实表现材料由档案所在单位或工作单位的人事、政工部门加盖印章",
          when: "复试后至录取前",
          missIf: "盖章单位不符或材料缺失，录取检查被退回",
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
          event: "【学历线】录取检查完成，录取工作一般应在录取当年 4 月底前结束",
          when: "录取当年 4 月底前",
          missIf: "协议与政审材料逾期，录取结论延后或取消",
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
          event: "【考编线】省直事业单位统考笔试：以 2026 年度为例，3 月 28 日综合管理类、3 月 29 日其他类别",
          when: "每年 3 月下旬，具体以省人事考试网公告为准",
          missIf: "与复试、协议办理时间重叠，需提前排优先级",
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
          event: "【年龄线】招聘公告的年龄条件按公告年度折算：岗位表写「38 周岁以下」，即按公告规定的出生日期起算",
          when: "每次招聘公告发布时逐条核对",
          missIf: "按自然年龄自估，与公告的出生日期口径不一致",
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
          event: "【职称线】职称申报通知发布：核对申报口子、材料清单与单位内部排序规则",
          when: "多在年中至下半年，以人社部门与主管部门通知为准",
          missIf: "错过申报批次，只能等下一年度",
          type: "experience"
        },
        {
          event: "【证书线】执业药师成绩与合格标准公布，决定是否次年补考",
          when: "以中国人事考试网通知为准",
          missIf: "未在成绩有效期内通过全部科目，已通过科目失效",
          type: "experience"
        }
      ]
    },
    {
      id: "study",
      title: "在读与毕业",
      items: [
        {
          event: "【学历线】入学资格复查：学历学位证书、体检报告、定向协议存档件",
          when: "开学后 1–3 个月，以学校通知为准",
          missIf: "材料不齐或信息不一致，影响学籍注册",
          type: "experience"
        },
        {
          event: "【学历线】课程学习与集中授课：按培养方案完成公共课、专业课与必修环节",
          when: "入学后 1–2 年，周末或集中时段",
          missIf: "缺勤超过规定比例，课程成绩无效需重修",
          type: "experience"
        },
        {
          event: "【学历线】开题与中期考核：论文选题尽量结合本职工作中的真实问题",
          when: "课程阶段结束后 1 年内",
          missIf: "开题未通过需重新选题，挤占论文写作时间",
          type: "experience"
        },
        {
          event: "【学历线】论文送审与答辩：按学校时间节点提交查重、送审与答辩材料",
          when: "学制最后一学年，按学校通知",
          missIf: "送审未通过或答辩延期，毕业时间顺延",
          type: "experience"
        },
        {
          event: "【学历线】毕业与学位授予：核对定向就业信息与毕业去向登记",
          when: "答辩通过后至毕业当年",
          missIf: "定向信息有误，毕业就业手续办理受阻",
          type: "experience"
        },
        {
          event: "【职称线】在读期间可继续申报职称：学历提升与任职年限的对应关系以当年评审文件为准",
          when: "按每年职称申报通知",
          missIf: "误以为在读不能申报，错过晋升窗口",
          type: "experience"
        },
        {
          event: "【证书线】执业药师继续教育与注册：按注册管理规定完成学时与注册手续",
          when: "每年继续教育学时周期内",
          missIf: "学时不足或未按时注册，影响执业与职称材料",
          type: "experience"
        },
        {
          event: "【年龄线】招聘年龄条件随公告年度逐年变化，在读期间持续关注目标岗位口径",
          when: "每年招聘季",
          missIf: "按往年口径准备，临近报考才发现年龄不符合",
          type: "experience"
        },
        {
          event: "【业界线】行业条线培训、技能竞赛与学术交流，积累论文素材与同行网络",
          when: "全年，按单位培训计划",
          missIf: "论文选题与工作脱节，数据获取困难",
          type: "experience"
        }
      ]
    },
    {
      id: "after",
      title: "毕业后：考编、职称与证书",
      items: [
        {
          event: "【学历线】毕业证书与学位证书发放，学历信息在学信网可查",
          when: "毕业当年，按学校安排",
          missIf: "证书信息有误未及时更正，影响后续报考与评审",
          type: "experience"
        },
        {
          event: "【学历线】按定向就业协议回原单位办理就业手续，档案与人事关系按协议处理",
          when: "毕业后 1–3 个月内",
          missIf: "未按协议报到，可能触发违约责任",
          type: "experience"
        },
        {
          event: "【考编线】事业单位统考：公告、报名、笔试集中在年初至 3 月，硕士学历可按岗位条件报考",
          when: "每年年初至 3 月，以省人社厅与人事考试网公告为准",
          missIf: "错过报名或未取得单位同意报考证明，资格复审被拒",
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
          event: "【考编线】公务员考试：国考公告与笔试多在每年 11–12 月，省考时间以各省公告为准",
          when: "每年 11 月至次年 3 月，按当年公告",
          missIf: "与定向协议服务期冲突，报考前须核对协议与单位规定",
          type: "experience"
        },
        {
          event: "【职称线】以硕士学历申报职称：核对任职年限、业绩成果与继续教育要求",
          when: "按每年职称评审通知",
          missIf: "年限计算方式理解有误，材料被退回",
          type: "experience"
        },
        {
          event: "【证书线】执业药师注册、变更注册与继续教育，按注册管理办法执行",
          when: "注册到期前与每年学时周期内",
          missIf: "注册过期影响执业资格与单位岗位安排",
          type: "experience"
        },
        {
          event: "【年龄线】招聘年龄条件与报考窗口：按公告的出生日期口径逐年核对",
          when: "每次招聘公告发布时",
          missIf: "按自然年龄自估，错过最后的报考窗口",
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
          event: "【业界线】行业岗位流动、新院区建设与条线机会，结合学历与证书规划下一阶段",
          when: "全年，每季度复盘一次",
          missIf: "只看本单位内部机会，错过系统内横向流动窗口",
          type: "experience"
        }
      ]
    }
  ]
};
