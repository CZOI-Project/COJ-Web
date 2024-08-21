export const TagsList = [
    {
        color: "teal",
        title: "算法",
        id: 0,
        onTab: true,
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
        color: "indigo",
        title: "来源",
        id: 1,
        onTab: true,
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
        title: "时间",
        onTab: true,
        id: 2,
        color: "purple",
        groups: []
    },
    {//第四组的标签是保留标签
        color: "",
        title: "内置",
        id: 3,
        onTab: false,
        groups: [
            {
                title: "",
                items: [
                    {name: "传统型", tid: 1001},
                    {name: "SPJ", tid: 1002},
                    {name: "人工", tid: 1003},
                    {name: "施工", tid: 1004}
                ]
            }
        ]
    }
]

export interface TagIndex {
    name: string,
    color: string,
    group: number,
    show: boolean
}

export const TagsIndex: Map<number, TagIndex> = new Map();