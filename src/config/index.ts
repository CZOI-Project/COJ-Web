import { TagsIndex, TagsList } from "./tags";

export function COJInit() {
  // 建立tag索引
  for (let i = 0; i < TagsList.length; i++) {
    //console.log(COJConfig.tags[i].groups)
    for (const group of TagsList[i].groups) {
      //console.log(group);
      for (const item of group.items) {
        TagsIndex.set(item.tid, {
          name: item.name,
          color: TagsList[i].color,
          group: i,
          show: TagsList[i].onTab
        });
      }
    }
  }
}

export const AppbarList = [
  {
    title: "首页",
    icon: "home",
    target: "/"
  },
  {
    title: "题库",
    icon: "layers",
    target: "/problem"
  },
  {
    title: "比赛",
    icon: "view_week",
    target: "/contest"
  },
  {
    title: "提交记录",
    icon: "fiber_smart_record",
    target: "/record"
  }
]

export const UserMenu = [
  {
    title: "我的提交",
    icon: "send",
    target: "/record"
  },
  {
    title: "我的比赛",
    icon: "flag",
    target: "/"
  },
  {
    title: "我的收藏",
    icon: "star",
    target: "/"
  },
  {
    title: "我的消息",
    icon: "textsms",
    target: "/"
  }
]

export const COJInfo = {
  info: "COJ Powered By Caiwen",
  version: "0.1Beta 内部测试"
}

export const NotNeedLogin = [
  "error",
  "user_login",
  "user_register",
  "user_forget"
]

export const NotNeedVerify = [
  "error",
  "user_login",
  "user_register",
  "user_forget",
  "user_verify"
]

export const ProblemListSize = 2;
export const RecordListSize = 2;
export const BaseURL = '/api';
export const ResourceURL = '/resources';
export const WS = 'ws://localhost:8080/ws';