//省市三级联动数据
let city = [{
    "children": [
      {
        "children": [
          {
            "value": "650100",
            "label": "乌鲁木齐市"
          },
          {
            "value": "650101",
            "label": "乌鲁木齐市市辖区"
          },
          {
            "value": "650102",
            "label": "天山区"
          },
          {
            "value": "650103",
            "label": "沙依巴克区"
          },
          {
            "value": "650104",
            "label": "新市区"
          },
          {
            "value": "650105",
            "label": "水磨沟区"
          },
          {
            "value": "650106",
            "label": "头屯河区"
          },
          {
            "value": "650107",
            "label": "达坂城区"
          },
          {
            "value": "650108",
            "label": "东山区"
          },
          {
            "value": "650121",
            "label": "乌鲁木齐县"
          }
        ],
        "value": "650100",
        "label": "乌鲁木齐市"
      },
      {
        "children": [
          {
            "value": "650200",
            "label": "克拉玛依市"
          },
          {
            "value": "650201",
            "label": "克拉玛依市市辖区"
          },
          {
            "value": "650202",
            "label": "独山子区"
          },
          {
            "value": "650203",
            "label": "克拉玛依区"
          },
          {
            "value": "650204",
            "label": "白碱滩区"
          },
          {
            "value": "650205",
            "label": "乌尔禾区"
          }
        ],
        "value": "650200",
        "label": "克拉玛依市"
      },
      {
        "children": [
          {
            "value": "652100",
            "label": "吐鲁番地区"
          },
          {
            "value": "652101",
            "label": "吐鲁番市"
          },
          {
            "value": "652122",
            "label": "鄯善县"
          },
          {
            "value": "652123",
            "label": "托克逊县"
          }
        ],
        "value": "652100",
        "label": "吐鲁番地区"
      },
      {
        "children": [
          {
            "value": "652200",
            "label": "哈密地区"
          },
          {
            "value": "652201",
            "label": "哈密市"
          },
          {
            "value": "652222",
            "label": "巴里坤哈萨克自治县"
          },
          {
            "value": "652223",
            "label": "伊吾县"
          }
        ],
        "value": "652200",
        "label": "哈密地区"
      },
      {
        "children": [
          {
            "value": "652300",
            "label": "昌吉回族自治州"
          },
          {
            "value": "652301",
            "label": "昌吉市"
          },
          {
            "value": "652302",
            "label": "阜康市"
          },
          {
            "value": "652303",
            "label": "米泉市"
          },
          {
            "value": "652323",
            "label": "呼图壁县"
          },
          {
            "value": "652324",
            "label": "玛纳斯县"
          },
          {
            "value": "652325",
            "label": "奇台县"
          },
          {
            "value": "652327",
            "label": "吉木萨尔县"
          },
          {
            "value": "652328",
            "label": "木垒哈萨克自治县"
          }
        ],
        "value": "652300",
        "label": "昌吉回族自治州"
      },
      {
        "children": [
          {
            "value": "652700",
            "label": "博尔塔拉蒙古自治州"
          },
          {
            "value": "652701",
            "label": "博乐市"
          },
          {
            "value": "652722",
            "label": "精河县"
          },
          {
            "value": "652723",
            "label": "温泉县"
          }
        ],
        "value": "652700",
        "label": "博尔塔拉蒙古自治州"
      },
      {
        "children": [
          {
            "value": "652800",
            "label": "巴音郭楞蒙古自治州"
          },
          {
            "value": "652801",
            "label": "库尔勒市"
          },
          {
            "value": "652822",
            "label": "轮台县"
          },
          {
            "value": "652823",
            "label": "尉犁县"
          },
          {
            "value": "652824",
            "label": "若羌县"
          },
          {
            "value": "652825",
            "label": "且末县"
          },
          {
            "value": "652826",
            "label": "焉耆回族自治县"
          },
          {
            "value": "652827",
            "label": "和静县"
          },
          {
            "value": "652828",
            "label": "和硕县"
          },
          {
            "value": "652829",
            "label": "博湖县"
          }
        ],
        "value": "652800",
        "label": "巴音郭楞蒙古自治州"
      },
      {
        "children": [
          {
            "value": "652900",
            "label": "阿克苏地区"
          },
          {
            "value": "652901",
            "label": "阿克苏市"
          },
          {
            "value": "652922",
            "label": "温宿县"
          },
          {
            "value": "652923",
            "label": "库车县"
          },
          {
            "value": "652924",
            "label": "沙雅县"
          },
          {
            "value": "652925",
            "label": "新和县"
          },
          {
            "value": "652926",
            "label": "拜城县"
          },
          {
            "value": "652927",
            "label": "乌什县"
          },
          {
            "value": "652928",
            "label": "阿瓦提县"
          },
          {
            "value": "652929",
            "label": "柯坪县"
          }
        ],
        "value": "652900",
        "label": "阿克苏地区"
      },
      {
        "children": [
          {
            "value": "653000",
            "label": "克孜勒苏柯尔克孜自治州"
          },
          {
            "value": "653001",
            "label": "阿图什市"
          },
          {
            "value": "653022",
            "label": "阿克陶县"
          },
          {
            "value": "653023",
            "label": "阿合奇县"
          },
          {
            "value": "653024",
            "label": "乌恰县"
          }
        ],
        "value": "653000",
        "label": "克孜勒苏柯尔克孜自治州"
      },
      {
        "children": [
          {
            "value": "653100",
            "label": "喀什地区"
          },
          {
            "value": "653101",
            "label": "喀什市"
          },
          {
            "value": "653121",
            "label": "疏附县"
          },
          {
            "value": "653122",
            "label": "疏勒县"
          },
          {
            "value": "653123",
            "label": "英吉沙县"
          },
          {
            "value": "653124",
            "label": "泽普县"
          },
          {
            "value": "653125",
            "label": "莎车县"
          },
          {
            "value": "653126",
            "label": "叶城县"
          },
          {
            "value": "653127",
            "label": "麦盖提县"
          },
          {
            "value": "653128",
            "label": "岳普湖县"
          },
          {
            "value": "653129",
            "label": "伽师县"
          },
          {
            "value": "653130",
            "label": "巴楚县"
          },
          {
            "value": "653131",
            "label": "塔什库尔干塔吉克自治县"
          }
        ],
        "value": "653100",
        "label": "喀什地区"
      },
      {
        "children": [
          {
            "value": "653200",
            "label": "和田地区"
          },
          {
            "value": "653201",
            "label": "和田市"
          },
          {
            "value": "653221",
            "label": "和田县"
          },
          {
            "value": "653222",
            "label": "墨玉县"
          },
          {
            "value": "653223",
            "label": "皮山县"
          },
          {
            "value": "653224",
            "label": "洛浦县"
          },
          {
            "value": "653225",
            "label": "策勒县"
          },
          {
            "value": "653226",
            "label": "于田县"
          },
          {
            "value": "653227",
            "label": "民丰县"
          }
        ],
        "value": "653200",
        "label": "和田地区"
      },
      {
        "children": [
          {
            "value": "654000",
            "label": "伊犁哈萨克自治州"
          },
          {
            "value": "654002",
            "label": "伊宁市"
          },
          {
            "value": "654003",
            "label": "奎屯市"
          },
          {
            "value": "654021",
            "label": "伊宁县"
          },
          {
            "value": "654022",
            "label": "察布查尔锡伯自治县"
          },
          {
            "value": "654023",
            "label": "霍城县"
          },
          {
            "value": "654024",
            "label": "巩留县"
          },
          {
            "value": "654025",
            "label": "新源县"
          },
          {
            "value": "654026",
            "label": "昭苏县"
          },
          {
            "value": "654027",
            "label": "特克斯县"
          },
          {
            "value": "654028",
            "label": "尼勒克县"
          }
        ],
        "value": "654000",
        "label": "伊犁哈萨克自治州"
      },
      {
        "children": [
          {
            "value": "654200",
            "label": "塔城地区"
          },
          {
            "value": "654201",
            "label": "塔城市"
          },
          {
            "value": "654202",
            "label": "乌苏市"
          },
          {
            "value": "654221",
            "label": "额敏县"
          },
          {
            "value": "654223",
            "label": "沙湾县"
          },
          {
            "value": "654224",
            "label": "托里县"
          },
          {
            "value": "654225",
            "label": "裕民县"
          },
          {
            "value": "654226",
            "label": "和布克赛尔蒙古自治县"
          }
        ],
        "value": "654200",
        "label": "塔城地区"
      },
      {
        "children": [
          {
            "value": "654300",
            "label": "阿勒泰地区"
          },
          {
            "value": "654301",
            "label": "阿勒泰市"
          },
          {
            "value": "654321",
            "label": "布尔津县"
          },
          {
            "value": "654322",
            "label": "富蕴县"
          },
          {
            "value": "654323",
            "label": "福海县"
          },
          {
            "value": "654324",
            "label": "哈巴河县"
          },
          {
            "value": "654325",
            "label": "青河县"
          },
          {
            "value": "654326",
            "label": "吉木乃县"
          }
        ],
        "value": "654300",
        "label": "阿勒泰地区"
      },
      {
        "children": [
          {
            "value": "659000",
            "label": "新疆维吾尔自治区省直辖行政单位"
          },
          {
            "value": "659001",
            "label": "石河子市"
          },
          {
            "value": "659002",
            "label": "阿拉尔市"
          },
          {
            "value": "659003",
            "label": "图木舒克市"
          },
          {
            "value": "659004",
            "label": "五家渠市"
          }
        ],
        "value": "659000",
        "label": "新疆维吾尔自治区省直辖行政单位"
      }
    ],
    "value": "650000",
    "label": "新  疆"
  }]
//并网方式
const behoofType = [
    { value: 'self', label: '自发自用' },
    { value: 'all', label: '全额上网' },
];
//水泥平屋顶
let roofIncline = [
    { value: '5', label: '倾角5°' },
    { value: '10', label: '倾角10°' },
    { value: '15', label: '倾角15°' },
];
//朝向
let orientation = [
    { value: '180', label: '180°（正南）' },
    { value: '0', label: '0°（正北）' },
    { value: '90', label: '90°（正东）' },
]

//底部文案

let footer = "绘制屋顶领取10亿基金"

//搜索得到的数据
let resData = {
    leijifuzhao:1365,
    biaogan:0.88,
    tuoliu:0.352,
    yongdian:0.884,
    guobu:0.42,
    guoyear:20,
    shengbu:0.30,
    shengyear:5,
    shibu:0.02,
    shiyear:1,
    chart:[
        {
            pNum:'P90',
            num:'1165'
        },
        {
            pNum:'P75',
            num:'1211'
        },
        {
            pNum:'P50',
            num:'1234'
        }
    ]
}

export {city, behoofType, orientation,roofIncline,footer,resData};