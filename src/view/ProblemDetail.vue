<template>
  <div>
    <div class="main">
      <div class="flex-container mdui-hidden-xs">
        <div class="flex-fix">
          <div style="display: inline-block;text-align: center;" class="mdui-ripple mdui-p-a-1">
            <span class="mdui-typo-subheading">提交</span><br>
            <span class="mdui-typo-body-2">{{ getNumText(data.submitted) }}</span>
          </div>
          <div style="display: inline-block;text-align: center;" class="mdui-ripple mdui-p-a-1">
            <span class="mdui-typo-subheading">通过</span><br>
            <span class="mdui-typo-body-2">{{ getNumText(data.accepted) }}</span>
          </div>
          <div style="display: inline-block;text-align: center;" class="mdui-ripple mdui-p-a-1"
            @click="showDialog = true">
            <span class="mdui-typo-subheading">内存</span><br>
            <span class="mdui-typo-body-2">{{ max_mem == 0 ? '无数据' : (max_mem == min_mem ?
              getMemText(max_mem) : getMemText(min_mem) + "~" + getMemText(max_mem)) }}</span>
          </div>
          <div style="display: inline-block;text-align: center;" class="mdui-ripple mdui-p-a-1"
            @click="showDialog = true">
            <span class="mdui-typo-subheading">时间</span><br>
            <span class="mdui-typo-body-2">{{ max_time == 0 ? '无数据' : (max_time == min_time ?
              getTimeText2(max_time) : getTimeText2(min_time) + "~" + getTimeText2(max_time)) }}</span>
          </div>
        </div>
        <div class="flex-rest">
          <div class="mdui-typo-headline">
            <i class="mdui-icon material-icons"
              :class="{ 'mdui-text-color-grey': data.status.status == 0, 'mdui-text-color-red': data.status.status == 1, 'mdui-text-color-green': data.status.status == 2, 'mdui-text-color-blue': data.status.status == 3 }">
              {{ data.status.status == 0 ? 'remove' : (data.status.status == 1 ? 'clear' : 'check') }}
            </i>
            {{ data.pid }} {{ data.title }}
          </div>
          <div class="mdui-typo-caption">
            来源：{{ data.origin }}<br>
          </div>
        </div>
      </div>
      <div class="mdui-hidden-sm-up">
        <div class="mdui-typo-headline">
          <i class="mdui-icon material-icons"
            :class="{ 'mdui-text-color-grey': data.status.status == 0, 'mdui-text-color-red': data.status.status == 1, 'mdui-text-color-green': data.status.status == 2, 'mdui-text-color-blue': data.status.status == 3 }">
            {{ data.status.status == 0 ? 'remove' : (data.status.status == 1 ? 'clear' : 'check') }}
          </i>
          {{ data.pid }} {{ data.title }}
        </div>
        <div class="mdui-typo-caption">
          来源：{{ data.origin }}<br>
        </div>
        <div class="mdui-hidden-sm-up" style="display: flex; justify-content: center;">
          <div style="display: inline-block;text-align: center;" class="mdui-ripple mdui-p-a-1">
            <span class="mdui-typo-subheading">提交</span><br>
            <span class="mdui-typo-body-2">{{ getNumText(data.submitted) }}</span>
          </div>
          <div style="display: inline-block;text-align: center;" class="mdui-ripple mdui-p-a-1">
            <span class="mdui-typo-subheading">通过</span><br>
            <span class="mdui-typo-body-2">{{ getNumText(data.accepted) }}</span>
          </div>
          <div style="display: inline-block;text-align: center;" class="mdui-ripple mdui-p-a-1"
            @click="showDialog = true">
            <span class="mdui-typo-subheading">内存</span><br>
            <span class="mdui-typo-body-2">{{ max_mem == 0 ? '无数据' : (max_mem == min_mem ?
              getMemText(max_mem) : getMemText(min_mem) + "~" + getMemText(max_mem)) }}</span>
          </div>
          <div style="display: inline-block;text-align: center;" class="mdui-ripple mdui-p-a-1"
            @click="showDialog = true">
            <span class="mdui-typo-subheading">时间</span><br>
            <span class="mdui-typo-body-2">{{ max_time == 0 ? '无数据' : (max_time == min_time ?
              getTimeText2(max_time) : getTimeText2(min_time) + "~" + getTimeText2(max_time)) }}</span>
          </div>
        </div>
      </div>
      <Transition name="mainfade" mode="out-in">
        <div class="mdui-m-t-1" v-if="page == 1">
          <!-- 桌面端界面 -->
          <div class="mdui-hidden-xs">
            <v-row dense>
              <v-col cols="12" sm="8" md="9">
                <div class="mdui-shadow-2 mdui-color-white mdui-p-l-1 mdui-p-r-1" v-if="page == 1"
                  style="padding-top: 16px; padding-bottom: 40px">
                  <CojEditor v-model="ren_html" hide></CojEditor>
                </div>
              </v-col>
              <v-col cols="12" sm="4" md="3">
                <div class="mdui-shadow-2">
                  <div class="mdui-color-teal" style="padding: 10px;" v-if="data.tags.includes(1001)">
                    <i class="mdui-icon material-icons" style="font-size: 20px;margin-left: 6px;">note</i>
                    <span style="font-size: 13px;margin-left: 14px;">传统型</span>
                  </div>
                  <div class="mdui-color-teal" style="padding: 10px;" v-if="data.tags.includes(1002)">
                    <i class="mdui-icon material-icons" style="font-size: 20px;margin-left: 6px;">note</i>
                    <span style="font-size: 13px;margin-left: 14px;">Special Judge</span>
                  </div>
                  <div class="mdui-color-teal" style="padding: 10px;" v-if="data.tags.includes(1003)">
                    <i class="mdui-icon material-icons" style="font-size: 20px;margin-left: 6px;">note</i>
                    <span style="font-size: 13px;margin-left: 14px;">人工批阅</span>
                  </div>
                  <div class="mdui-color-red" style="padding: 10px;" v-if="data.tags.includes(1004)">
                    <i class="mdui-icon material-icons" style="font-size: 20px;margin-left: 6px;">format_paint</i>
                    <span style="font-size: 13px;margin-left: 14px;">题目正在施工，暂时无法提交</span>
                  </div>
                  <div class="mdui-color-indigo" style="padding: 10px;" v-if="data.contest != undefined">
                    <i class="mdui-icon material-icons" style="font-size: 20px;margin-left: 6px;">flag</i>
                    <span style="font-size: 13px;margin-left: 14px;">所属比赛：{{ data.contest.name }}</span>
                  </div>
                </div>
                <div class="mdui-shadow-2 mdui-m-t-1">
                  <div class="mdui-color-white mdui-p-l-2 mdui-p-r-2 mdui-p-t-2" style="padding-bottom: 4px;">
                    <div class="coj-clearfix">
                      <div style="font-size: 15px;float: left;">历史分数</div>
                      <div style="font-size: 15px;font-weight: bold;float: right;"
                        :class="data.status.status == 0 ? 'mdui-text-color-grey' : (data.status.status == 3 ? 'mdui-text-color-blue' : 'mdui-text-color-' + getScoreColor(data.status.score))">
                        {{ data.status.status == 0 ? '未提交' : (data.status.status == 3 ? '已提交' : data.status.score) }}
                      </div>
                    </div>
                    <div class="coj-clearfix mdui-m-t-1">
                      <div style="font-size: 15px;float: left;margin-top:7px">难度</div>
                      <button class="mdui-btn mdui-btn-icon mdui-btn-dense mdui-ripple"
                        style="float: left;margin-left: 4px;" @click="showDifficulty = false" v-show="showDifficulty">
                        <i class="mdui-icon material-icons">visibility</i>
                      </button>
                      <button class="mdui-btn mdui-btn-icon mdui-btn-dense mdui-ripple"
                        style="float: left;margin-left: 4px;" @click="showDifficulty = true" v-show="!showDifficulty">
                        <i class="mdui-icon material-icons">visibility_off</i>
                      </button>
                      <div style="font-size: 15px;font-weight: bold;float: right;margin-top: 7px;"
                        v-show="showDifficulty" :class="getDifficultyColor(data.difficulty)">
                        {{ getDifficultyText(data.difficulty) }}
                      </div>
                    </div>
                    <div class="coj-clearfix">
                      <div style="font-size: 15px;float: left;margin-top:7px">标签</div>
                      <button class="mdui-btn mdui-btn-icon mdui-btn-dense mdui-ripple"
                        style="float: left;margin-left: 4px;" @click="showTag = false" v-show="showTag">
                        <i class="mdui-icon material-icons">visibility</i>
                      </button>
                      <button class="mdui-btn mdui-btn-icon mdui-btn-dense mdui-ripple"
                        style="float: left;margin-left: 4px;" @click="showTag = true" v-show="!showTag">
                        <i class="mdui-icon material-icons">visibility_off</i>
                      </button>
                    </div>
                    <template v-show="showTag" v-for="tid in data.tags">
                      <v-chip size="small" style="margin: 2px" :color="COJConfig.tags_index.get(tid).color"
                        v-show="showTag && filterTag(tid)">
                        {{ COJConfig.tags_index.get(tid).name }}
                      </v-chip>
                    </template>
                  </div>
                  <ul class="mdui-list mdui-list-dense" style="padding-top: 0;padding-bottom: 0;">
                    <li class="mdui-list-item mdui-ripple">
                      <i class="mdui-list-item-icon mdui-icon material-icons"
                        :class="{ 'mdui-text-color-orange': data.status.star }">star</i>
                      <div class="mdui-list-item-content" style="margin-left: 12px;" @click="starAction()">{{
                        data.status.star == 0 ?
                          '收藏' : '已收藏' }}</div>
                    </li>
                    <li class="mdui-list-item mdui-ripple">
                      <i class="mdui-list-item-icon mdui-icon material-icons">list</i>
                      <div class="mdui-list-item-content" style="margin-left: 12px;">提交记录</div>
                    </li>
                    <li class="mdui-list-item mdui-ripple">
                      <i class="mdui-list-item-icon mdui-icon material-icons">data_usage</i>
                      <div class="mdui-list-item-content" style="margin-left: 12px;">统计</div>
                    </li>
                    <li class="mdui-list-item mdui-ripple mdui-color-teal" @click="page == 1 ? (page = 2) : submit()">
                      <i class="mdui-list-item-icon mdui-icon material-icons">{{ page == 1 ? 'edit' : 'send' }}</i>
                      <div class="mdui-list-item-content" style="margin-left: 12px;">{{ page == 1 ? '编辑代码' : '提交' }}
                      </div>
                    </li>
                  </ul>
                </div>
                <div class="mdui-shadow-2 mdui-m-t-1 mdui-color-white">
                  <div class="mdui-color-white mdui-p-l-2 mdui-p-r-2 mdui-p-t-2">
                    <div style="font-size: 15px;">题目描述</div>
                  </div>
                  <ul class="mdui-list mdui-list-dense">
                    <li class="mdui-list-item mdui-ripple" v-for="(description, index) in data.descriptions"
                      :class="{ 'mdui-list-item-active': now_description == index }" @click="now_description = index">
                      <div class="mdui-list-item-content">
                        <div class="mdui-list-item-title mdui-list-item-one-line">{{ description.lang }}</div>
                        <div class="mdui-list-item-text mdui-list-item-one-line">{{ description.author }}</div>
                      </div>
                    </li>
                  </ul>
                </div>
              </v-col>
            </v-row>
          </div>
          <!-- 手机端界面 -->
          <div class="mdui-hidden-sm-up">
            <div class="mdui-shadow-2">
              <div class="mdui-color-teal" style="padding: 10px;" v-if="data.tags.includes(1001)">
                <i class="mdui-icon material-icons" style="font-size: 20px;margin-left: 6px;">note</i>
                <span style="font-size: 13px;margin-left: 14px;">传统型</span>
              </div>
              <div class="mdui-color-teal" style="padding: 10px;" v-if="data.tags.includes(1002)">
                <i class="mdui-icon material-icons" style="font-size: 20px;margin-left: 6px;">note</i>
                <span style="font-size: 13px;margin-left: 14px;">Special Judge</span>
              </div>
              <div class="mdui-color-teal" style="padding: 10px;" v-if="data.tags.includes(1003)">
                <i class="mdui-icon material-icons" style="font-size: 20px;margin-left: 6px;">note</i>
                <span style="font-size: 13px;margin-left: 14px;">人工批阅</span>
              </div>
              <div class="mdui-color-red" style="padding: 10px;" v-if="data.tags.includes(1004)">
                <i class="mdui-icon material-icons" style="font-size: 20px;margin-left: 6px;">format_paint</i>
                <span style="font-size: 13px;margin-left: 14px;">题目正在施工，暂时无法提交</span>
              </div>
              <div class="mdui-color-indigo" style="padding: 10px;" v-if="data.contest != undefined">
                <i class="mdui-icon material-icons" style="font-size: 20px;margin-left: 6px;">flag</i>
                <span style="font-size: 13px;margin-left: 14px;">所属比赛：{{ data.contest.name }}</span>
              </div>
            </div>
            <div class="mdui-shadow-2 mdui-m-t-1 mdui-m-b-1 mdui-color-white">
              <div class="mdui-color-white mdui-p-l-2 mdui-p-r-2 mdui-p-t-2">
                <div style="font-size: 15px;">题目描述</div>
              </div>
              <ul class="mdui-list mdui-list-dense">
                <li class="mdui-list-item mdui-ripple" v-for="(description, index) in data.descriptions"
                  :class="{ 'mdui-list-item-active': now_description == index }" @click="now_description = index">
                  <div class="mdui-list-item-content">
                    <div class="mdui-list-item-title mdui-list-item-one-line">{{ description.lang }}</div>
                    <div class="mdui-list-item-text mdui-list-item-one-line">{{ description.author }}</div>
                  </div>
                </li>
              </ul>
            </div>
            <div class="mdui-shadow-2 mdui-color-white mdui-p-l-1 mdui-p-r-1" v-if="page == 1"
              style="padding-top: 16px; padding-bottom: 40px">
              <CojEditor v-model="ren_html" hide></CojEditor>
            </div>
            <div class="mdui-shadow-2 mdui-m-t-1">
              <div class="mdui-color-white mdui-p-l-2 mdui-p-r-2 mdui-p-t-2" style="padding-bottom: 4px;">
                <div class="coj-clearfix">
                  <div style="font-size: 15px;float: left;">历史分数</div>
                  <div style="font-size: 15px;font-weight: bold;float: right;"
                    :class="data.status.status == 0 ? 'mdui-text-color-grey' : (data.status.status == 3 ? 'mdui-text-color-blue' : 'mdui-text-color-' + getScoreColor(data.status.score))">
                    {{ data.status.status == 0 ? '未提交' : (data.status.status == 3 ? '已提交' : data.status.score) }}
                  </div>
                </div>
                <div class="coj-clearfix mdui-m-t-1">
                  <div style="font-size: 15px;float: left;margin-top:7px">难度</div>
                  <button class="mdui-btn mdui-btn-icon mdui-btn-dense mdui-ripple"
                    style="float: left;margin-left: 4px;" @click="showDifficulty = false" v-show="showDifficulty">
                    <i class="mdui-icon material-icons">visibility</i>
                  </button>
                  <button class="mdui-btn mdui-btn-icon mdui-btn-dense mdui-ripple"
                    style="float: left;margin-left: 4px;" @click="showDifficulty = true" v-show="!showDifficulty">
                    <i class="mdui-icon material-icons">visibility_off</i>
                  </button>
                  <div style="font-size: 15px;font-weight: bold;float: right;margin-top: 7px;" v-show="showDifficulty"
                    :class="getDifficultyColor(data.difficulty)">
                    {{ getDifficultyText(data.difficulty) }}
                  </div>
                </div>
                <div class="coj-clearfix">
                  <div style="font-size: 15px;float: left;margin-top:7px">标签</div>
                  <button class="mdui-btn mdui-btn-icon mdui-btn-dense mdui-ripple"
                    style="float: left;margin-left: 4px;" @click="showTag = false" v-show="showTag">
                    <i class="mdui-icon material-icons">visibility</i>
                  </button>
                  <button class="mdui-btn mdui-btn-icon mdui-btn-dense mdui-ripple"
                    style="float: left;margin-left: 4px;" @click="showTag = true" v-show="!showTag">
                    <i class="mdui-icon material-icons">visibility_off</i>
                  </button>
                </div>
                <template v-show="showTag" v-for="tid in data.tags">
                  <v-chip size="small" style="margin: 2px" :color="COJConfig.tags_index.get(tid).color"
                    v-show="showTag && filterTag(tid)">
                    {{ COJConfig.tags_index.get(tid).name }}
                  </v-chip>
                </template>
              </div>
              <ul class="mdui-list mdui-list-dense" style="padding-top: 0;padding-bottom: 0;">
                <li class="mdui-list-item mdui-ripple">
                  <i class="mdui-list-item-icon mdui-icon material-icons"
                    :class="{ 'mdui-text-color-orange': data.status.star }">star</i>
                  <div class="mdui-list-item-content" style="margin-left: 12px;" @click="starAction()">{{
                    data.status.star == 0 ?
                      '收藏' : '已收藏' }}</div>
                </li>
                <li class="mdui-list-item mdui-ripple">
                  <i class="mdui-list-item-icon mdui-icon material-icons">list</i>
                  <div class="mdui-list-item-content" style="margin-left: 12px;">提交记录</div>
                </li>
                <li class="mdui-list-item mdui-ripple">
                  <i class="mdui-list-item-icon mdui-icon material-icons">data_usage</i>
                  <div class="mdui-list-item-content" style="margin-left: 12px;">统计</div>
                </li>
                <li class="mdui-list-item mdui-ripple mdui-color-teal" @click="page == 1 ? (page = 2) : submit()">
                  <i class="mdui-list-item-icon mdui-icon material-icons">{{ page == 1 ? 'edit' : 'send' }}</i>
                  <div class="mdui-list-item-content" style="margin-left: 12px;">{{ page == 1 ? '编辑代码' : '提交' }}</div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="mdui-m-t-2 mdui-shadow-2 mdui-color-white mdui-p-a-1" v-else>
          <button class="mdui-btn mdui-btn-icon" @click="page = 1">
            <i class="mdui-icon material-icons">arrow_back</i>
          </button>
          <span style="font-weight: bold;margin-left: 5px;">编辑代码</span>
          <div class="mdui-typo-caption mdui-m-t-1 mdui-m-l-1">将会使用C/C++语言进行评测，并开启O2优化。</div>
          <Codemirror v-model:value="code" :options="cmOptions" ref="cmRef" height="400" width="100%"
            class="mdui-m-t-1">
          </Codemirror>
          <v-btn color="teal" append-icon="mdi-send" variant="flat" border="0" :loading="loading" @click="submit()"
            class="mdui-m-t-1">
            提交
          </v-btn>
        </div>
      </Transition>
    </div>
    <v-dialog v-model="showDialog">
      <v-card title="测试点信息">
        <div class="mdui-table-fluid mdui-shadow-0" style="border: 0;border-top: 1px solid rgba(0, 0, 0, 0.12);">
          <table class="mdui-table mdui-table-hoverable">
            <thead>
              <tr>
                <th>#</th>
                <th>Subtask</th>
                <th>分数</th>
                <th>时间限制</th>
                <th>内存限制</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="(subtask, index) in data.subtasks">
                <tr v-for="checkpoint in subtask.checkpoints">
                  <td>{{ checkpoint.id }}</td>
                  <td>{{ index }}</td>
                  <td>{{ checkpoint.score }}</td>
                  <td>{{ getTimeText2(checkpoint.timeLimit) }}</td>
                  <td>{{ getMemText(checkpoint.memoryLimit) }}</td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text="关闭" @click="showDialog = false"></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts" name="ProblemDetail">
import router from '@/router'
import { onMounted, reactive, ref, watch } from 'vue';
import request from '@/api'
import {
  filterTag,
  getMemText,
  getScoreColor,
  getTimeText2,
  toGetParams,
  toPostParams
} from '@/utils';
import { getDifficultyColor, getDifficultyText, getNumText } from '@/utils';
import { COJConfig } from '@/config';
import type { Problem } from "@/entry";
import "codemirror/mode/javascript/javascript.js"
import 'codemirror/mode/clike/clike.js'
import Codemirror from "codemirror-editor-vue3"
import type { Editor, EditorConfiguration } from "codemirror"
import CojEditor from "@/component/coj-editor.vue";

const cmOptions: EditorConfiguration = reactive({
  mode: 'text/x-c++src',
  theme: "default",
  readOnly: false,
  lineNumbers: true,
  lineWiseCopyCut: true,
  gutters: ["CodeMirror-lint-markers"],
  lint: true,
});
const code = ref("")

const data = reactive({ tags: [], accepted: 0, contest: undefined, descriptions: [], pid: "", difficulty: 0, origin: "", status: { status: 0, score: 0, star: 0 }, submitted: 0, subtasks: [], title: "" } as Problem);
let loading = ref(false);
let page = ref(1);
let showDialog = ref(false);

onMounted(async () => {
  let pid = router.currentRoute.value.params.pid;
  try {
    Object.assign(data, await request.get('/problem/detail', toGetParams({ pid: pid })));
    console.log(data);
    init();
    if (data.descriptions.length > 0) {
      ren_html.value = data.descriptions[0].content;
    }
  } catch (err) {
    console.log(err);
    //router.go("/error");
    router.push("/error")
  }
})

let showTag = ref(false);
let showDifficulty = ref(false);

let ren_html = ref('');
let now_description = ref(0);

async function submit() {
  if (code.value.trim().length <= 0) {
    mdui.snackbar({
      message: "代码不能为空。"
    });
    return;
  }
  try {
    let rid: number = await request.post("/problem/submit", toPostParams({ pid: data.pid, code: code.value }))
    mdui.snackbar({
      message: "提交成功。"
    });
    router.push("/record/detail/" + rid);
  } catch (err) { console.log(err) }
}

async function starAction() {

}

let max_time = ref(0);
let min_time = ref(0);
let max_mem = ref(0);
let min_mem = ref(0);
function init() {
  // 首先计算内存和时间占用
  let _max_time = 0;
  let _min_time = 0;
  let _min_mem = 0;
  let _max_mem = 0;
  for (let i of data.subtasks) {
    for (let j of i.checkpoints) {
      if (_max_time == 0) _max_time = j.timeLimit;
      else _max_time = Math.max(_max_time, j.timeLimit);
      if (_min_time == 0) _min_time = j.timeLimit;
      else _min_time = Math.min(_min_time, j.timeLimit);
      if (_max_mem == 0) _max_mem = j.memoryLimit;
      else _max_mem = Math.max(_max_mem, j.memoryLimit);
      if (_min_mem == 0) _min_mem = j.memoryLimit;
      else _min_mem = Math.min(_min_mem, j.memoryLimit);
    }
  }
  max_mem.value = _max_mem;
  max_time.value = _max_time;
  min_mem.value = _min_mem;
  min_time.value = _min_time;

}

watch(now_description, (now: number) => {
  ren_html.value = data.descriptions[now].content;
})

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

/* 路由过渡动画 */
/* 离开 */
.mainfade-enter-from,
.mainfade-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

/* 动画触发时 */
.mainfade-enter-active,
.mainfade-leave-active {
  transition: all 0.3s;
}

/* 已经进入 */
.mainfade-enter-to,
.mainfade-leave-from {
  opacity: 1;
  transform: translateX(0);
}
</style>