<template>
  <div v-if="!globalStore.loading">
    <div class="main">
      <div class="mdui-typo-headline">提交记录 {{ data.rid }}</div>
      <div class="mdui-m-t-2">
        <v-row dense>
          <!-- 左栏 -->
          <v-col cols="12" sm="8" md="9">
            <div class="mdui-shadow-2 mdui-color-white">
              <!-- tab头部 -->
              <v-tabs v-model="tab" color="teal">
                <v-tab value="tab1">评测</v-tab>
                <v-tab value="tab2" v-if="data.code != undefined">代码</v-tab>
                <v-tab value="tab3" v-if="data.unshown == 0">日志</v-tab>
              </v-tabs>
              <v-tabs-window v-model="tab">
                <!-- 测试点状态 -->
                <v-tabs-window-item value="tab1" class="mdui-p-a-2">
                  <div class="info">
                    <i class="mdui-icon material-icons">check</i><span>评测已经启动。</span>
                  </div>
                  <template v-if="data.unshown != 0">
                    <div class="info">
                      <i class="mdui-icon material-icons">visibility_off</i><span>你无法查看该评测记录更多的消息，因为该评测记录是被隐藏的。可能是由于你正在参加一场不实时反馈评测结果的比赛。</span>
                    </div>
                  </template>
                  <template v-else>
                    <div class="info" v-if="checkpointTotal != checkpointFinish">
                      <v-progress-circular
                          color="teal"
                          :model-value="Math.ceil(checkpointFinish / checkpointTotal * 100)"
                          size="20"
                          style="margin-left: 2px;margin-right: 13px"
                      ></v-progress-circular>
                      <span>正在推送...</span>
                    </div>
                    <div class="info" v-else>
                      <i class="mdui-icon material-icons">check</i><span>推送完成</span>
                    </div>
                    <div class="info" v-if="hasOKTraces">
                      <i class="mdui-icon material-icons">info_outline</i>
                      <span>
                        以下robot将代理你的评测请求
                        <ul>
                          <template v-for="(v, index) in data.traces" :key="index">
                            <li v-if="v.status == 0">{{ v.jid }} - {{ v.username }}({{ v.uuid }})</li>
                          </template>
                        </ul>
                      </span>
                    </div>
                    <template v-if="hasJudgerFailed">
                      <template v-for="(v,index) in data.traces" :key="index">
                        <div class="info mdui-text-color-red" v-if="v.status == 1">
                          <i class="mdui-icon material-icons">close</i>
                          <span>测试点 {{ listToString(v.ids) }} 的Judger - {{ v.jid }} 未上线，因此评测受到影响</span>
                        </div>
                      </template>
                    </template>
                    <template v-if="hasRobotFailed">
                      <template v-for="(v,index) in data.traces" :key="index">
                        <div class="info mdui-text-color-red" v-if="v.status == 2">
                          <i class="mdui-icon material-icons">close</i>
                          <span>测试点 {{ listToString(v.ids) }} 的Judger - {{ v.jid }} 无法为你分配一个Robot代理你的评测，因此评测受到影响</span>
                        </div>
                      </template>
                    </template>

                    <div style="font-size: 16px;" class="mdui-text-color-grey-700 mdui-m-t-2">测试点信息</div>

                    <template v-for="(ids, index) in data.subtasks" :key="index">
                      <div class="mdui-typo-body-2 mdui-m-t-2">Subtask {{ index }}</div>
                      <div class="mdui-m-t-1 grid">
                        <template v-for="id in ids" :key="id">
                          <!-- warning: 这里要开个template，不然还会出现异常错误 -->
                          <COJCheckpoint
                              :nth="id"
                              :state="data.checkpoints[id].status"
                              :message="data.checkpoints[id].message"
                              :info="getInfo(id)"
                          ></COJCheckpoint>
                        </template>
                      </div>
                    </template>
                  </template>
                </v-tabs-window-item>
                <!-- 代码 -->
                <v-tabs-window-item value="tab2" class="mdui-p-a-2" v-if="data.code != undefined">
                  <v-tooltip text="复制代码">
                    <template v-slot:activator="{ props }">
                      <v-btn
                          icon="mdi-content-copy"
                          variant="flat"
                          size="small"
                          v-bind="props"
                          style="position: absolute; top: 15px; z-index: 1; right: 12px"
                          @click="copyToClipboard(data.code)"
                      ></v-btn>
                    </template>
                  </v-tooltip>
                  <div>
                    <code-mirror v-model="data.code" basic readonly wrap :lang="cpp()" />
                  </div>
                </v-tabs-window-item >
                <!-- 日志 -->
                <v-tabs-window-item value="tab3" class="mdui-p-a-2" v-if="data.unshown == 0">
                  <div style="max-height: 80vh;overflow-y: scroll;" class="log" v-html="data.log">
                  </div>
                </v-tabs-window-item>
              </v-tabs-window>
            </div>
          </v-col>
          <!-- 右栏 -->
          <v-col cols="12" sm="4" md="3">
            <div class="mdui-shadow-2">
              <!-- 关联题目 -->
              <div
                  class="mdui-color-teal mdui-ripple"
                  style="padding: 10px;"
                  @click="router.push('/problem/detail/' + data.problem.pid)"
              >
                <i class="mdui-icon material-icons" style="font-size: 20px;margin-left: 6px;">layers</i>
                <span style="font-size: 13px;margin-left: 14px;">题目：{{ data.problem.pid }} {{ data.problem.title }}</span>
              </div>
              <!-- 关联比赛 -->
              <div
                  class="mdui-color-indigo mdui-ripple"
                  style="padding: 10px;"
                  v-if="data.contest != undefined"
                  @click="router.push('/contest/detail/' + data.contest.cid)"
              >
                <i class="mdui-icon material-icons" style="font-size: 20px;margin-left: 6px;">flag</i>
                <span style="font-size: 13px;margin-left: 14px;">所属比赛：{{ data.contest.name }}</span>
              </div>
            </div>
            <div class="mdui-shadow-2 mdui-m-t-1">
              <!-- 提交者信息 -->
              <v-list
                  rounded="0"
                  style="cursor: pointer;"
                  @click="router.push('/user/detail/' + data.user.uid)"
              >
                <v-list-item
                    :prepend-avatar="ResourceURL + '/avatar/' + data.user.uid + '.png'"
                    :subtitle="'提交:' + getNumText(data.user.submitted) + ', 通过:' + getNumText(data.user.accepted)"
                    :title="data.user.name">
                </v-list-item>
              </v-list>
              <!-- 详细信息 -->
              <div class="mdui-color-white mdui-p-l-2 mdui-p-r-2 mdui-p-b-2" style="padding-bottom: 4px;">
                <div class="coj-clearfix">
                  <div style="font-size: 15px;float: left;">提交时间</div>
                  <div style="font-size: 15px;font-weight: bold;float: right;">{{ data.time }}</div>
                </div>
                <div class="coj-clearfix mdui-m-t-2" v-if="data.status != undefined">
                  <div style="font-size: 15px;float: left;">状态</div>
                  <div style="font-size: 15px;font-weight: bold;float: right;" :class="'text-' + RecordStatusList[data.status].color">
                    {{ RecordStatusList[data.status].title }}
                  </div>
                </div>
                <div class="coj-clearfix mdui-m-t-2" v-else>
                  <div style="font-size: 15px;float: left;">状态</div>
                  <div style="font-size: 15px;font-weight: bold;float: right;" class="mdui-text-color-indigo-900">
                    Unshown
                  </div>
                </div>
                <div class="coj-clearfix mdui-m-t-2" v-if="data.score != undefined">
                  <div style="font-size: 15px;float: left;">分数</div>
                  <div style="font-size: 15px;font-weight: bold;float: right;" :class="'text-' + getScoreColor(data.score)">
                    {{ data.score }}
                  </div>
                </div>
                <div class="coj-clearfix mdui-m-t-2" v-if="data.length != undefined">
                  <div style="font-size: 15px;float: left;">代码长度</div>
                  <div style="font-size: 15px;font-weight: bold;float: right;">{{ getCodeLengthText(data.length) }}
                  </div>
                </div>
                <div class="coj-clearfix mdui-m-t-2" v-if="data.runTime != undefined">
                  <div style="font-size: 15px;float: left;">评测耗时</div>
                  <div style="font-size: 15px;font-weight: bold;float: right;">{{ getTimeText2(data.runTime) }}</div>
                </div>
                <div class="coj-clearfix mdui-m-t-2" v-if="data.runMem != undefined">
                  <div style="font-size: 15px;float: left;">占用内存</div>
                  <div style="font-size: 15px;font-weight: bold;float: right;">{{ getMemText(data.runMem) }}</div>
                </div>
              </div>
            </div>
          </v-col>
        </v-row>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="RecordDetail">
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// fuck you ts!
import {ref, reactive, onBeforeMount, computed, onUnmounted} from 'vue'
import router from '@/router';
import COJCheckpoint from '@/component/coj-checkpoint.vue';
import {
  getCodeLengthText,
  getMemText,
  getNumText,
  getScoreColor,
  getTimeText2, listToString,
} from "@/utils";
import { useUserStore } from "@/store/user";
import { useGlobalStore } from "@/store/global";
import {cancel_subscribe, connect, subscribe, type WSResult} from "@/api/ws";
import { cpp } from "@codemirror/lang-cpp";
import type {CheckpointToRecord, RecordDetailDTO} from "@/entify/record";
import {recordDetail} from "@/api/record";
import {RecordStatusList} from "@/config/record";
import CodeMirror from 'vue-codemirror6';
import {ResourceURL} from "@/config";


let userStore = useUserStore();
let globalStore = useGlobalStore();
globalStore.loading = true;
let data: RecordDetailDTO = reactive({} as RecordDetailDTO);
let tab = ref();

// 防止先发出的数据包最后才到达
let time_lock: number[] = [0, 0, 0];
onBeforeMount(async () => {
  try{
    const rid: string = router.currentRoute.value.params.rid as string;
    Object.assign(data, await recordDetail(Number(rid)));

    // 更新本人提交信息
    if (data.user.uid == userStore.entry.uid) {
      // 更新
      userStore.entry.accepted = data.user.accepted;
      userStore.entry.submitted = data.user.submitted;
    }

    // 连接实时追踪服务
    await connect();
    subscribe("record", rid, (obj: WSResult) => {
      if (obj.target.toString() != rid) return;
      if (obj.option == "updated") {
        if(obj.time > time_lock[0]) time_lock[0] = obj.time;
        else return;
        data.checkpoints = obj.data.checkpoints;
        data.runTime = obj.data.runTime;
        data.runTime = obj.data.runTime;
        data.score = obj.data.score;
        data.status = obj.data.status;
      }
      if (obj.option == "trace") {
        if(obj.time > time_lock[1]) time_lock[1] = obj.time;
        else return;
        data.traces = obj.data
      }
      if (obj.option == "log") {
        if(obj.time > time_lock[2]) time_lock[2] = obj.time;
        else return;
        data.log = obj.data;
      }
    });
    globalStore.loading = false;
  }catch(err){
    if(typeof err == "string"){
      globalStore.error_message.detail = err;
      await router.push('/error');
    }else if(err != null) {
      console.error(err);
      await router.push('/error?default=1');
    }else{
      await router.push('/error?default=1');
    }
  }
})

onUnmounted(async () => {
  if(data.rid != undefined){
    cancel_subscribe("record", data.rid.toString());
  }
})

const checkpointTotal = computed(() => {
  if(data.subtasks == undefined) return 0;
  let now = 0;
  for(const subtask of data.subtasks){
    now += subtask.length;
  }
  return now;
})

const checkpointFinish = computed(() => {
  if(data.traces == undefined) return 0;
  let now = 0;
  for(const trace of data.traces){
    now += trace.ids.length;
  }
  return now;
})

const hasOKTraces = computed(() => {
  if(data.traces == undefined) return false;
  for(const trace of data.traces){
    if(trace.status == 0) return true;
  }
  return false;
})

const hasJudgerFailed = computed(() => {
  if(data.traces == undefined) return false;
  for(const trace of data.traces){
    if(trace.status == 1) return true;
  }
  return false;
})

const hasRobotFailed = computed(() => {
  if(data.traces == undefined) return false;
  for(const trace of data.traces){
    if(trace.status == 2) return true;
  }
  return false;
})

function getInfo(id: number) {
  let checkpoint: CheckpointToRecord = data.checkpoints[id];
  if ((checkpoint.status >= 2 && checkpoint.status <= 5) || checkpoint.status == 8) {
    return getTimeText2(checkpoint.runTime) + "/" + getMemText(checkpoint.runMem);
  } else {
    return "";
  }
}

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text).then(() => {}, err => {
    console.error('Failed to copy to clipboard: ', err);
  });
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

.info {
  margin-top: 8px;
  display: flex;
  line-height: 20px;
}

.info i {
  margin-right: 12px;
}

.info span {
  margin-top: 2px;
  flex: 1;
}

.log {
  font-size: 14px;
  color: rgba(20, 20, 20, 0.5);
  word-wrap: break-word;
  word-break: break-all;
  white-space: break-spaces;
}

.info ul {
  margin-top: 8px;
  margin-bottom: 0px;
}

.grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style>