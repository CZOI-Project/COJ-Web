<template>
  <div>
    <div class="main">
      <div class="mdui-typo-headline">提交记录</div>

      <div class="mdui-shadow-2 mdui-m-t-2 mdui-color-white">
        <div class="mdui-p-l-3 mdui-p-r-3 mdui-p-t-3 mdui-p-b-3">
          <div style="font-weight: bold;" class="mdui-m-b-2">筛选</div>
          <v-sheet class="mdui-m-t-1">
            <v-form>
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
            </v-form>
          </v-sheet>
          <div style="font-weight: bold;">测试点状态</div>
          <v-chip-group
              v-model="form.status"
              column
              multiple
          >
            <v-chip
                text="Waiting"
                variant="outlined"
                filter
                color="blue"
            ></v-chip>
            <v-chip
                text="Judging"
                variant="outlined"
                filter
                color="blue"
            ></v-chip>
            <v-chip
                text="System Error"
                variant="outlined"
                filter
                color="pink"
            ></v-chip>
            <v-chip
                text="Unaccepted"
                variant="outlined"
                filter
                color="red"
            ></v-chip>
            <v-chip
                text="Accepted"
                variant="outlined"
                filter
                color="green"
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
          <div class="coj-clearfix">
            <div style="float: right; margin-top: 26px;">
              <v-btn icon="mdi-magnify" size="large" color="teal" :loading="loading" @click="searchAction()"></v-btn>
            </div>
          </div>
        </div>
      </div>

      <div class="mdui-m-t-2 coj-clearfix">
        <div style="float: left;font-weight: bold;line-height: 36px;vertical-align: middle; color: rgb(80,80,80)">
          {{ recordCount }} 个记录，共 {{ total }} 页。
        </div>
        <COJPagination :callback="pageCallback" style="float: right" class="mdui-color-white mdui-shadow-2"
                       :total="total" :now="now">
        </COJPagination>
      </div>

      <div class="mdui-shadow-2 mdui-m-t-2 mdui-color-white" style="overflow-x: auto; overflow-y: hidden">
        <v-row dense style="flex-wrap: nowrap; margin-right: 0px; border: 0.5px solid rgb(224,224,224);" v-for="record in recordList" v-bind:key="record.rid">
          <v-col cols="3" style="min-width: 180px"  class="touch" @click="router.push('/user/detail/' + record.uid)">
            <v-list rounded="0">
              <v-list-item
                  :prepend-avatar="COJConfig.resourceURL + '/avatar/' + record.uid + '.png'"
                  :subtitle="record.time"
                  :title="userList.get(record.uid).name"
              >
              </v-list-item>
            </v-list>
          </v-col>
          <v-col cols="2" class="col-flex2" style="min-width: 100px; padding-left: 10px" @click="go('/record/detail/' + record.rid)">
            <v-chip
                :color="getRecordColor(record.status)"
                label
                size="small"
                class="touch"
                style="margin-top: 4px"
            >
              {{ getRecordText(record.status) }}
            </v-chip>
            <div style="font-size: 16px; font-weight: bold;" :class="'text-' + getScoreColor(record.score) + ' touch'" @click="go('/record/detail/' + record.rid)">
              {{ record.score }}
            </div>
          </v-col>
          <v-col cols="3" class="col-flex2 text-teal" style="min-width: 230px;align-items: flex-start; font-weight: bold;">
            <a :href="'/problem/detail/' + record.pid">{{ record.pid + " " + problemList.get(record.pid).title }}</a>
          </v-col>
          <v-col cols="4" class="col-flex2 text-grey" style="min-width: 300px; align-items: flex-end; padding-right: 20px; font-size: 14px">
            <span><i class="mdui-icon material-icons">access_time</i><span>{{ getTimeText2(record.runTime) }}</span> / <i class="mdui-icon material-icons">data_usage</i><span>{{ getMemText(record.runMem) }}</span> / <i class="mdui-icon material-icons">code</i> {{ getMemText2(record.length) }}</span>
          </v-col>
        </v-row>
      </div>

      <div class="mdui-m-t-2 coj-clearfix">
        <div style="float: left;font-weight: bold;line-height: 36px;vertical-align: middle; color: rgb(80,80,80)">
          {{ recordCount }} 个记录，共 {{ total }} 页。
        </div>
        <COJPagination :callback="pageCallback" style="float: right" class="mdui-color-white mdui-shadow-2"
                       :total="total" :now="now">
        </COJPagination>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="Record">
import router from "@/router";
import {onMounted, reactive, ref} from "vue";
import {useUserStore} from "@/store/user";
import {COJConfig} from "@/config";
import {arrayToText, canBeConvertedToNumber, getMemText, getMemText2, getNumText, getRecordColor, getRecordText, getScoreColor, getTimeText2, toGetParams} from "@/utils";
import { Problem, Record, User } from "@/entry";
import request from '@/api'
import COJPagination from "@/component/coj-pagination.vue";
const userStore = useUserStore();
const loading = ref(false);

const form = reactive({
  uid: userStore.entry.uid.toString(),
  pid: '',
  cid: '',
  status: [0, 1, 2, 3, 4],
  sort_key: '提交时间',
  sort_order: '降序'
})

if(router.currentRoute.value.query['uid'] != undefined){
  form.uid = <string>router.currentRoute.value.query['uid']
}

if(router.currentRoute.value.query['pid'] != undefined){
  form.pid = <string>router.currentRoute.value.query['pid']
}

if(router.currentRoute.value.query['cid'] != undefined){
  form.cid = <string>router.currentRoute.value.query['cid']
}

onMounted(async () => {
  searchAction();
})

function go(url: string){
  window.location.href = url;
}

const recordList= ref([] as Record[]);
const userList = new Map();
const problemList = new Map();
async function searchAction(refresh = true){
  let index = now.value;
  if (refresh) index = 1;
  let data = {count: COJConfig.record_list_size, index: index, order: 0, key: 0};
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
  if(form.pid != "") data = Object.assign(data, {pid: form.pid});
  // uid
  if(form.uid != ""){
    if(!canBeConvertedToNumber(form.uid)){
      data = Object.assign(data, {name: form.uid});
    }else{
      data = Object.assign(data, {uid: Number(form.uid)});
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
    data = Object.assign(data, {cid: Number(form.cid)});
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
    _status.push(i + 1); 
  }
  data = Object.assign(data, {status: arrayToText(_status)});
  loading.value = true;
  try {
    //启动请求
    interface result{count:number, records:Record[]}
    let res:result = await request.get("/record/list", toGetParams(data));
    //更新分页信息
    if (refresh) {
      now.value = 1;
      if (res.count == 0) total.value = 1;
      else total.value = Math.ceil(res.count / COJConfig.record_list_size);
    }
    if(res.count != 0){
      let uids = []
      for(let record of res.records){
        if(!uids.includes(record.uid)) uids.push(record.uid);
      }
      let users: User[] = await request.get("/user/list", toGetParams({target: arrayToText(uids)}));
      userList.clear();
      for(let user of users){
        userList.set(user.uid, user);
      }
      let pids = []
      for(let record of res.records){
        if(!pids.includes(record.pid)) pids.push(record.pid);
      }
      let problems: Problem[] = await request.get("/problem/list_m", toGetParams({target: arrayToText(pids)}));
      problemList.clear();
      for(let problem of problems){
        problemList.set(problem.pid, problem);
      }
    }
    recordList.value = res.records;
    recordCount.value = res.count;
    //console.log(res);
  } catch (err) {
    console.log(err)
  }
  loading.value = false;
}

const recordCount = ref(0);
const total = ref(0);
const now = ref(0);
async function pageCallback(type:number, target:number) {
  if (type == 1) {
    now.value = 1;
  }
  if (type == 2) {
    now.value--;
  }
  if (type == 3) {
    now.value = target;
  }
  if (type == 4) {
    now.value++;
  }
  if (type == 5) {
    now.value = total.value;
  }
  await searchAction(false);
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