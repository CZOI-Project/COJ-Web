<template>
  <div v-if="!globalStore.loading || finishTag">
    <div class="main">
      <div class="mdui-typo-headline">提交记录</div>
      <!-- 筛选 -->
      <div class="mdui-shadow-2 mdui-m-t-2 mdui-color-white">
        <div class="mdui-p-l-3 mdui-p-r-3 mdui-p-t-3 mdui-p-b-3">
          <v-sheet class="mdui-m-t-1">
            <v-form @submit.prevent="searchAction()">
              <div style="font-weight: bold;" class="mdui-m-b-2">筛选</div>
              <v-row dense>
                <v-col cols="12" sm="4">
                  <v-text-field
                      v-model="form.pid"
                      label="题目编号"
                      hint="为空则不筛选题目编号"
                      :disabled="loading"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="4">
                  <v-text-field
                      v-model="form.uid"
                      label="提交者uid/姓名"
                      hint="为空则不筛选提交者"
                      :disabled="loading"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="4">
                  <v-text-field
                      v-model="form.cid"
                      label="比赛cid"
                      hint="为空则不筛选比赛"
                      :disabled="loading"
                  ></v-text-field>
                </v-col>
              </v-row>
              <div style="font-weight: bold;">测试点状态</div>
              <v-chip-group
                  v-model="form.status"
                  column
                  multiple
              >
                <v-chip
                    v-for="(item, index) in RecordStatusList"
                    :text="item.title"
                    variant="outlined"
                    filter
                    :color="item.color"
                    :key="item.title"
                    v-show="index != 0"
                ></v-chip>
              </v-chip-group>
              <div style="font-weight: bold;" class="mdui-m-b-2 mdui-m-t-2">排序</div>
              <v-row dense>
                <v-col cols="12" sm="9" >
                  <v-select
                      label="关键字"
                      :items="['提交时间', '分数', '运行时间', '运行内存', '代码长度']"
                      v-model="form.sort_key"
                      :disabled="loading"
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="3">
                  <v-select
                      label="顺序"
                      :items="['降序', '升序']"
                      v-model="form.sort_order"
                      :disabled="loading"
                  ></v-select>
                </v-col>
              </v-row>
              <!-- 搜索按钮 -->
              <div class="coj-clearfix">
                <div style="float: right; margin-top: 26px;">
                  <v-btn
                      icon="mdi-magnify"
                      size="large"
                      color="teal"
                      :loading="loading"
                      type="submit"
                  ></v-btn>
                </div>
              </div>
            </v-form>
          </v-sheet>
        </div>
      </div>

      <div class="mdui-m-t-2 coj-clearfix">
        <div style="float: left;font-weight: bold;line-height: 36px;vertical-align: middle; color: rgb(80,80,80)">
          {{ recordCount }} 个记录，共 {{ total }} 页。
        </div>
        <COJPagination
            :callback="pageCallback"
            style="float: right"
            class="mdui-color-white mdui-shadow-2"
            :total="total"
            :now="form.page"
        ></COJPagination>
      </div>

      <div class="mdui-shadow-2 mdui-m-t-2 mdui-color-white" style="overflow-x: auto; overflow-y: hidden" ref="listRef">
        <template v-for="record in recordList" v-bind:key="record.rid">
          <v-row dense style="flex-wrap: nowrap; margin-right: 0px;">
            <!-- 提交者信息 -->
            <v-col cols="3" style="min-width: 210px"  class="touch" @click="router.push('/user/detail/' + record.user.uid)">
              <v-list rounded="0">
                <v-list-item
                    :prepend-avatar="ResourceURL + '/avatar/' + record.user.uid + '.png'"
                    :subtitle="record.time"
                    :title="record.user.name"
                ></v-list-item>
              </v-list>
            </v-col>
            <!-- 状态与分数 -->
            <v-col cols="2" class="col-flex2" style="min-width: 100px; padding-left: 10px" @click="router.push('/record/detail/' + record.rid)">
              <v-chip
                  :color="RecordStatusList[record.status].color"
                  label
                  size="small"
                  class="touch"
                  style="margin-top: 4px"
                  v-if="record.status != undefined"
              >
                {{ RecordStatusList[record.status].title }}
              </v-chip>
              <v-chip
                  color="#1A237E"
                  label
                  size="small"
                  class="touch"
                  style="margin-top: 4px"
                  v-else
              >
                Unshown
              </v-chip>
              <div v-if="record.score != undefined" style="font-size: 16px; font-weight: bold;" :class="'text-' + getScoreColor(record.score) + ' touch'">
                {{ record.score }}
              </div>
            </v-col>
            <!-- 对应题目 -->
            <v-col cols="4" class="col-flex2 text-teal" style="min-width: 230px;align-items: flex-start; font-weight: bold;">
              <a
                  :href="'/problem/detail/' + record.problem.pid"
                  @click.prevent="router.push('/problem/detail/' + record.problem.pid)"
              >
                {{ record.problem.pid + " " + record.problem.title }}
              </a>
            </v-col>
            <!-- 评测信息 -->
            <v-col cols="3" class="col-flex2 text-grey" style="min-width: 230px; align-items: flex-end; padding-right: 20px; font-size: 14px">
              <template v-if="record.unshown == 0 && record.length != undefined">
                <span><i class="mdui-icon material-icons">access_time</i><span>{{ getTimeText2(record.runTime) }}</span> / <i class="mdui-icon material-icons">data_usage</i><span>{{ getMemText(record.runMem) }}</span> / <i class="mdui-icon material-icons">code</i><span> {{ getMemText2(record.length) }} </span></span>
              </template>
              <template v-else-if="record.length != undefined">
                <span><i class="mdui-icon material-icons">code</i><span> {{ getMemText2(record.length) }} </span></span>
              </template>
            </v-col>
          </v-row>
          <div class="mdui-typo"><hr :style="'height: 0; width: ' + (listWidth) + 'px'"/></div>
        </template>
      </div>

      <div class="mdui-m-t-2 coj-clearfix">
        <COJPagination
            :callback="pageCallback"
            style="float: right"
            class="mdui-color-white mdui-shadow-2"
            :total="total"
            :now="form.page"
        ></COJPagination>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="RecordList">
/* global mdui */
import router from "@/router";
import {onBeforeMount, onUpdated, reactive, ref} from "vue";
import { useUserStore } from "@/store/user";
import {RecordListSize, ResourceURL} from "@/config";
import { arrayToText, canBeConvertedToNumber, getMemText, getMemText2, getScoreColor, getTimeText2 } from "@/utils";
import COJPagination from "@/component/coj-pagination.vue";
import { useGlobalStore } from "@/store/global";
import type {RecordQuery, RecordSummaryDTO} from "@/entify/record";
import { recordSearch } from "@/api/record";
import { RecordStatusList } from "@/config/record";

const userStore = useUserStore();
const loading = ref(false);
const globalStore = useGlobalStore();
globalStore.loading = true;
const form = reactive({
  uid: userStore.entry.uid.toString(),
  pid: '',
  cid: '',
  status: [1, 2, 3, 4, 5],
  sort_key: '提交时间',
  sort_order: '降序',
  page: 1
})
const recordList = ref([] as RecordSummaryDTO[])
const recordCount = ref(0);
const total = ref(0);
let finishTag = ref(false); // 引入这个可以防止地址栏更改时页面重新渲染
const listRef = ref();
const listWidth = ref();

onBeforeMount(async () => {
  const _query = router.currentRoute.value.query;
  if(_query['uid'] != null){
    form.uid = <string>_query['uid']
  }
  if(_query['pid'] != null){
    form.pid = <string>_query['pid']
  }
  if(_query['cid'] != null){
    form.cid = <string>_query['cid']
  }
  if(_query['status'] != null){
    const _str = (_query['status'] as string).replace(/\s+/g, '').split(',')
    const _arr = [];
    for(const i of _str){
      _arr.push(Number(i));
    }
    form.status = _arr;
  }
  if(_query['sort_key'] != null){
    const t = Number(_query['sort_key']);
    if(t == 0) form.sort_key = "提交时间";
    if(t == 1) form.sort_key = "分数";
    if(t == 2) form.sort_key = "运行时间";
    if(t == 3) form.sort_key = "运行内存";
    if(t == 4) form.sort_key = "代码长度";
  }
  if(_query['sort_order'] != null){
    const t = Number(_query['sort_order']);
    if(t == 0) form.sort_key = "降序";
    if(t == 1) form.sort_key = "升序";
  }
  if(_query['page'] != null){
    //console.log(_query['page']);
    form.page = Number(_query['page']);
  }
  await searchAction(false);
  globalStore.loading = false;
  finishTag.value = true;
});

async function searchAction(refresh = true){
  let index = form.page;
  if (refresh) index = 1;
  let data: RecordQuery = {count: RecordListSize, index: index, key: 0, order: 0}
  // order
  if(form.sort_order == "降序") data.order = 0;
  if(form.sort_order == "升序") data.order = 1;
  // key
  if(form.sort_key == "提交时间") data.key = 0;
  if(form.sort_key == "分数") data.key = 1;
  if(form.sort_key == "运行时间") data.key = 2;
  if(form.sort_key == "运行内存") data.key = 3;
  if(form.sort_key == "代码长度") data.key = 4;
  // pid
  if(form.pid != "") data.pid = form.pid;
  // uid
  if(form.uid != ""){
    if(!canBeConvertedToNumber(form.uid)){
      data.name = form.uid;
    }else{
      data.uid = Number(form.uid);
    }
  }
  // cid
  if(form.cid != ""){
    if(!canBeConvertedToNumber(form.uid)){
      mdui.snackbar({
        message: '比赛CID不存在。'
      });
      return;
    }
    data.cid = Number(form.cid);
  }
  // status
  if(form.status.length == 0){
    mdui.snackbar({
      message: '至少选择一个状态。'
    });
    return;
  }
  let _status = []
  for(let i of form.status){
    _status.push(i);
  }
  data.status = arrayToText(_status);
  buildURL(data);
  loading.value = true;
  try {
    const res = await recordSearch(data);
    //更新分页信息
    if (refresh) {
      form.page = 1;
    }
    if (res[0] == 0) total.value = 1;
    else total.value = Math.ceil(res[0] / RecordListSize);
    recordList.value = res[1];
    recordCount.value = res[0];
    //console.log(res);
  } catch (err) {
    console.log(err)
  }
  loading.value = false;
}

onUpdated(() => {
  listWidth.value = listRef.value.scrollWidth;
})

async function pageCallback(type:number, target:number) {
  if (type == 1) {
    form.page = 1;
  }
  if (type == 2) {
    form.page--;
  }
  if (type == 3) {
    form.page = target;
  }
  if (type == 4) {
    form.page++;
  }
  if (type == 5) {
    form.page = total.value;
  }
  await searchAction(false);
}

function buildURL(data: RecordQuery){
  let url = "/record?page=" + data.index + "&order=" + data.order + "&key=" + data.key;
  if(data.status != undefined){
    url += "&status=" + data.status;
  }
  if(data.cid != undefined){
    url += "&cid=" + data.cid;
  }
  if(data.name != undefined){
    url += "&uid=" + data.name
  }
  if(data.uid != undefined){
    url += "&uid=" + data.uid;
  }
  if(data.pid != undefined){
    url += "pid=" + data.pid;
  }
  router.push(url);
}
</script>

<style scoped>
.main {
  padding-top: 10px;
  padding-left: 5px;
  padding-right: 5px;
}
.coj-clearfix::after {
  content: '';
  display: block;
  clear: both;
}
.col-flex{
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: flex-start;
  transition: background-color .3s cubic-bezier(.4,0,.2,1);
  -webkit-transition: background-color .3s cubic-bezier(.4,0,.2,1);
}
.col-flex:hover{
  background-color: rgba(0,0,0,.08);
}
.col-flex2{
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: flex-start;
}
a{
  text-decoration: none; /* 去掉下划线 */
  color: rgb(0,150,136);        /* 设置链接颜色 */
  transition: color .3s cubic-bezier(.4,0,.2,1);
  -webkit-transition: color .3s cubic-bezier(.4,0,.2,1);
}
a:hover{
  color: #00695C;        /* 设置链接颜色 */
}
.col-flex2 i{
  font-size: 16px;
}
.touch{
  cursor: pointer;
}
</style>