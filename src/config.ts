export const COJConfig = {
    baseURL: '/api',
    resourceURL: '/resources',
    ws: 'ws://localhost:8080/ws',
    //不需要登录
    notNeedLogin: [
        "login","register","forget","404"
    ],
    //不需要验证界面
    notNeedVerify: [
        "login","register","forget","verify","404"
    ],
    tags: [
        {
            color:"teal",
            groups:[
                {
                    title:"基础算法",
                    items:[
                        {name:"模拟",tid:1},
                        {name:"贪心",tid:2},
                        {name:"二分",tid:3},
                        {name:"倍增",tid:4},
                        {name:"枚举",tid:5},
                        {name:"分治",tid:6},
                        {name:"排序",tid:7},
                    ]
                },
                {
                    title:"搜索",
                    items:[
                        {name:"DFS",tid:8},
                        {name:"BFS",tid:9}
                    ]
                }
            ]
        },
        {
            color:"indigo",
            groups:[
                {
                    title:"CCF",
                    items:[
                        {name:"NOIP提高组",tid:10},
                        {name:"NOIP普通组",tid:11},
                        {name:"CSP-J",tid:12},
                        {name:"CSP-S",tid:13},
                        {name:"NOI",tid:14},
                        {name:"NOI Online",tid:15},
                        {name:"NOI春季测试",tid:16},
                        {name:"WC",tid:17},
                        {name:"CTSC",tid:18}
                    ]
                },
                {
                    title:"CZOI",
                    items:[
                        {name:"CZOI",tid:19},
                        {name:"CZSC",tid:20},
                        {name:"CZOI Online",tid:21},
                    ]
                },
                {
                    title:"国际",
                    items:[
                        {name:"IOI",tid:22},
                        {name:"APIO",tid:23}
                    ]
                },
            ]
        },
        {
            color: "purple",
            groups: []
        },
        {//第四组的标签是保留标签
            color: "",
            groups: [
                {
                    title: "",
                    items: [
                        {name: "传统型", tid: 1001},
                        {name: "spj", tid: 1002},
                        {name: "人工", tid: 1003},
                        {name: "施工", tid: 1004}
                    ]
                }
            ]
        }
    ],
    tags_index: new Map(),
    list_size: 2,//单次请求题目列表最多返回数量
    record_list_size: 20,
    default_description: "test",
}