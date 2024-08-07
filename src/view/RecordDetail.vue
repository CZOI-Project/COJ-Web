<template>
  <div v-if="show">
    <div class="main">
      <div class="mdui-typo-headline">提交记录 {{ data.rid }}</div>
      <div class="mdui-m-t-2">
        <v-row dense>
          <v-col cols="12" sm="8" md="9">
            <div class="mdui-shadow-2 mdui-color-white">
              <v-tabs v-model="tab" color="teal">
                <v-tab value="tab1">评测</v-tab>
                <v-tab value="tab2">代码</v-tab>
                <v-tab value="tab3">日志</v-tab>
              </v-tabs>
              <v-tabs-window v-model="tab">
                <v-tabs-window-item value="tab1" class="mdui-p-a-2">
                  <div class="info">
                    <i class="mdui-icon material-icons">check</i><span>评测已经启动。</span>
                  </div>
                  <div class="info" v-if="data.traces.length != total">
                    <v-progress-circular color="teal" :model-value="Math.ceil(data.traces.length / total * 100)"
                      size="20" style="margin-left: 2px;margin-right: 13px"></v-progress-circular>
                    <span>正在推送...</span>
                  </div>
                  <div class="info" v-else>
                    <i class="mdui-icon material-icons">check</i><span>推送完成</span>
                  </div>
                  <div class="info" v-if="trace_list.size != 0">
                    <i class="mdui-icon material-icons">info_outline</i>
                    <span>
                      以下robot将代理你的评测请求
                      <ul v-for="v in trace_list">
                        <template v-for="(val, index) in v">
                          <li v-if="index != 0">{{ val.jid }} - {{ val.username }}({{ val.uuid }})</li>
                        </template>
                      </ul>
                    </span>
                  </div>
                  <div class="info mdui-text-color-red" v-if="trace_offline.length != 0">
                    <i class="mdui-icon material-icons">close</i><span>测试点 <span
                        v-for="(target, index) in trace_offline">{{ (index == 0 ?
                        '':',') + target }}</span> 的Judger未上线，因此评测受到影响</span>
                  </div>
                  <div class="info mdui-text-color-red" v-if="trace_error.size != 0">
                    <i class="mdui-icon material-icons">close</i><span>评测时发生错误，请见日志信息。</span>
                  </div>

                  <div style="font-size: 16px;" class="mdui-text-color-grey-700 mdui-m-t-2">测试点信息</div>

                  <template v-for="(subtask, index) in problem.subtasks">
                    <div class="mdui-typo-body-2 mdui-m-t-2">Subtask {{ index }}</div>
                    <div class="mdui-m-t-1 grid">
                      <COJCheckpoint v-for="checkpoint in subtask.checkpoints" :nth="checkpoint.id"
                        :state="data.checkpoints[checkpoint.id - 1].status"
                        :message="trace_error.has(checkpoint.id) ? trace_error.get(checkpoint.id) : data.checkpoints[checkpoint.id - 1].message"
                        :info="getInfo(checkpoint.id)"></COJCheckpoint>
                    </div>
                  </template>
                </v-tabs-window-item>

                <v-tabs-window-item value="tab2" class="mdui-p-a-2">
                  <v-tooltip text="复制代码">
                    <template v-slot:activator="{ props }">
                      <v-btn icon="mdi-content-copy" variant="flat" size="small" v-bind="props"
                        style="position: absolute; top: 15px; z-index: 1; right: 12px"></v-btn>
                    </template>
                  </v-tooltip>
                  <div>
                    <code-mirror v-model="data.code" basic readonly wrap :lang="cpp()" />
                  </div>
                </v-tabs-window-item>

                <v-tabs-window-item value="tab3" class="mdui-p-a-2">
                  <div style="max-height: 80vh;overflow-y: scroll;" class="log" v-html="data.log">

                  </div>
                </v-tabs-window-item>
              </v-tabs-window>
            </div>
          </v-col>
          <v-col cols="12" sm="4" md="3">
            <div class="mdui-shadow-2">
              <div class="mdui-color-teal mdui-ripple" style="padding: 10px;"
                @click="router.push('/problem/detail/' + problem.pid)">
                <i class="mdui-icon material-icons" style="font-size: 20px;margin-left: 6px;">layers</i>
                <span style="font-size: 13px;margin-left: 14px;">题目：{{ data.pid }} {{ problem.title }}</span>
              </div>
              <div class="mdui-color-indigo mdui-ripple" style="padding: 10px;" v-if="data.cid != undefined">
                <i class="mdui-icon material-icons" style="font-size: 20px;margin-left: 6px;">flag</i>
                <span style="font-size: 13px;margin-left: 14px;">所属比赛：aaa</span>
              </div>
            </div>
            <div class="mdui-shadow-2 mdui-m-t-1">
              <v-list rounded="0" style="cursor: pointer;" @click="router.push('/user/detail/' + user.uid)">
                <v-list-item :prepend-avatar="COJConfig.resourceURL + '/avatar/' + user.uid + '.png'"
                  :subtitle="'提交:' + getNumText(user.submitted) + ', 通过:' + getNumText(user.accepted)"
                  :title="user.name">
                </v-list-item>
              </v-list>
              <div class="mdui-color-white mdui-p-l-2 mdui-p-r-2 mdui-p-b-2" style="padding-bottom: 4px;">
                <div class="coj-clearfix">
                  <div style="font-size: 15px;float: left;">提交时间</div>
                  <div style="font-size: 15px;font-weight: bold;float: right;">{{ data.time }}</div>
                </div>
                <div class="coj-clearfix mdui-m-t-2">
                  <div style="font-size: 15px;float: left;">状态</div>
                  <div style="font-size: 15px;font-weight: bold;float: right;" :class="'text-' + getRecordColor(status)">
                    {{ getRecordText(status) }}
                  </div>
                </div>
                <div class="coj-clearfix mdui-m-t-2" v-if="!data.unshown">
                  <div style="font-size: 15px;float: left;">分数</div>
                  <div style="font-size: 15px;font-weight: bold;float: right;" :class="'text-' + getScoreColor(score)">{{
                    score }}
                  </div>
                </div>
                <div class="coj-clearfix mdui-m-t-2">
                  <div style="font-size: 15px;float: left;">代码长度</div>
                  <div style="font-size: 15px;font-weight: bold;float: right;">{{ getCodeLengthText(data.length) }}
                  </div>
                </div>
                <div class="coj-clearfix mdui-m-t-2">
                  <div style="font-size: 15px;float: left;">评测耗时</div>
                  <div style="font-size: 15px;font-weight: bold;float: right;">{{ getTimeText2(time) }}</div>
                </div>
                <div class="coj-clearfix mdui-m-t-2">
                  <div style="font-size: 15px;float: left;">占用内存</div>
                  <div style="font-size: 15px;font-weight: bold;float: right;">{{ getMemText(mem) }}</div>
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
import { ref, reactive, onMounted, onUpdated, watch } from 'vue'
import router from '@/router';
import COJCheckpoint from '@/component/coj-checkpoint.vue';
import { COJConfig } from "@/config";
import {
  getCodeLengthText,
  getMemText,
  getNumText,
  getRecordColor, getRecordText,
  getScoreColor,
  getTimeText2,
  toGetParams
} from "@/utils";
import { useUserStore } from "@/store/user";
import { useGlobalStore } from "@/store/global";
import type { Record, User, Problem, CheckpointToRecord } from "@/entry";
import request from "@/api";

import { connect, subscribe } from "@/api/ws";
import CodeMirror from "vue-codemirror6";
import { cpp } from "@codemirror/lang-cpp";


let userStore = useUserStore();
let globalStore = useGlobalStore();
let data = reactive({ pid: "", rid: 0, checkpoints: [], code: "", uid: 0, unshown: true, status: 0, time: "", runTime: 0, runMem: 0, log: "", length: 0, traces: [], score: 0 } as Record)
let user = reactive({} as User)
let problem = reactive({} as Problem)

let tab = ref()

// 如下的属性是要算出来的
let score = ref(0);
let status = ref(0);
let mem = ref(0);
let time = ref(0);
let total = ref(0);// 测试点总数

let show = ref(false);

interface Pair { key: number, value: number }
let checkpoint_index = new Map();

onMounted(async () => {
  globalStore.loading = true;
  let rid: string = router.currentRoute.value.params.rid as string;
  try {
    Object.assign(data, await request.get('/record/detail', toGetParams({ rid: rid })));
    Object.assign(problem, await request.get('/problem/detail', toGetParams({ pid: data.pid })));
    let users: User[] = await request.get('/user/list', toGetParams({ target: data.uid }));
    Object.assign(user, users[0]);
    if (user.uid == userStore.entry.uid) {
      // 更新
      userStore.entry.accepted = user.accepted;
      userStore.entry.submitted = user.submitted;
    }
    // 建立测试点映射
    let _total = 0;
    for (let i = 0; i < problem.subtasks.length; i++) {
      for (let j = 0; j < problem.subtasks[i].checkpoints.length; j++) {
        checkpoint_index.set(problem.subtasks[i].checkpoints[j].id, { key: i, value: j } as Pair);
        _total++;
      }
    }
    total.value = _total;
    updateTrace();
    updateCheckpoint();
    console.log(data);
    await connect();
    subscribe("record", rid, (obj: any) => {
      if (obj.target.toString() != rid) return;
      if (obj.option == "updated") {
        // 测试点更新
        data.checkpoints = obj.data;
        updateCheckpoint();
      }
      if (obj.option == "trace") {
        // trace更新，是增量
        data.traces.push(...obj.data);
        updateTrace();
      }
      if (obj.option == "log") {
        // 日志信息是增量
        data.log += "\n" + obj.data;
      }
    });
    show.value = true;
    globalStore.loading = false;
  } catch (err) {
    console.log(err);
    //router.go("/error");
    router.push("/error")
  }
})

let trace_offline = reactive([] as number[]); // (id)
let trace_list = reactive(new Map()); // 成功投递列表 (uuid,{uuid, username, jid})
let trace_error = reactive(new Map()); // 错误信息 (id, msg)
function updateTrace() {
  //Object.assign(trace_offline, []);
  //trace_list.clear();
  //trace_error.clear();
  for (let trace of data.traces) {
    if (trace.status == 0) {
      if (trace_list.has(trace.uuid)) continue;
      let pair: Pair = checkpoint_index.get(trace.id);
      let checkpoint = problem.subtasks[pair.key].checkpoints[pair.value];
      trace_list.set(trace.uuid, { uuid: trace.uuid, username: trace.username, jid: checkpoint.jid })
    }
    if (trace.status == 1) {
      if (!trace_offline.includes(trace.id)) trace_offline.push(trace.id);
    }
    if (trace.status == 2) {
      if (trace_error.has(trace.id)) continue;
      trace_error.set(trace.id, trace.message);
    }
  }
}

function updateCheckpoint() {
  // 计算分数
  let _score = 0;
  for (let subtask of problem.subtasks) {
    if (subtask.type == 1) {
      let d = subtask.score / subtask.checkpoints.length;
      for (let checkpoint of subtask.checkpoints) {
        let _checkpoint = data.checkpoints[checkpoint.id - 1];
        if (_checkpoint.status == 2) {
          _score += d;
        }
      }
    }
    if (subtask.type == 2 || subtask.type == 3) {
      let d = -1;
      for (let checkpoint of subtask.checkpoints) {
        let _checkpoint = data.checkpoints[checkpoint.id - 1];
        if (_checkpoint.status == 2) {
          if (d == -1) {
            d = _checkpoint.myScore;
          } else {
            if (subtask.type == 2) {
              d = Math.max(d, _checkpoint.myScore);
            } else {
              d = Math.min(d, _checkpoint.myScore);
            }
          }
        }
      }
      _score += d;
    }
    if (subtask.type == 4) {
      for (let checkpoint of subtask.checkpoints) {
        let _checkpoint = data.checkpoints[checkpoint.id - 1];
        if (_checkpoint.status == 2) {
          _score += _checkpoint.myScore;
        }
      }
    }
  }
  score.value = _score;
  // 计算内存、时间、评测记录状态
  let _mem = 0;
  let _time = 0;
  let waiting = 0, judging = 0, se = 0, unaccepted = 0, accepted = 0;
  for (let checkpoint of data.checkpoints) {
    _mem += checkpoint.myMem;
    _time += checkpoint.myTime;
    if (checkpoint.status == 0) waiting++;
    else if (checkpoint.status == 1) judging++;
    else if (checkpoint.status == 9) se++;
    else if (checkpoint.status == 2) accepted++;
    else unaccepted++;
  }
  if (waiting > 0) status.value = 1;
  else if (judging > 0) status.value = 2;
  else if (se > 0) status.value = 3;
  else if (unaccepted > 0) status.value = 4;
  else status.value = 5;
  mem.value = _mem;
  time.value = _time;

}

function getInfo(id: number) {
  let checkpoint: CheckpointToRecord = data.checkpoints[id - 1];
  if ((checkpoint.status >= 2 && checkpoint.status <= 5) || checkpoint.status == 8) {
    return getTimeText2(checkpoint.myTime) + "/" + getMemText(checkpoint.myMem);
  } else {
    return false;
  }
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

.flex-container {
  display: flex;
  flex-direction: row-reverse;
}

.flex-fix {
  flex-grow: 0;
  flex-shrink: 0;
}

.flex-rest {
  flex-grow: 1;
}

.info {
  margin-top: 8px;
  display: flex;
  line-height: 20px;
}

.info i {
  margin-right: 12px;
}

.info .mdui-spinner {
  width: 20px;
  height: 20px;
  margin-right: 17px;
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