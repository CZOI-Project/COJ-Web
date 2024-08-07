<template>
  <div class="main">
    <div class="mdui-typo-headline">{{ pid=='0'? '创建题目':'编辑题目 '+pid }}</div>
    <v-card class="mdui-m-t-2">
      <v-tabs
          v-model="_tab"
          color="teal"
      >
        <v-tab value="_tab1">基本信息</v-tab>
        <v-tab value="_tab2" v-if="pid!='0'">题目标签</v-tab>
        <v-tab value="_tab3" v-if="pid!='0'">题目描述</v-tab>
        <v-tab value="_tab4" v-if="pid!='0'">测试点配置</v-tab>
      </v-tabs>

      <v-card-text>
        <v-tabs-window v-model="_tab">
          <v-tabs-window-item value="_tab1">
            <div class="mdui-typo-subheading mdui-m-b-1">基本信息</div>
            <v-sheet class="mdui-m-t-1">
              <v-form ref="form">
                <v-row dense>
                  <v-col cols="12" sm="6">
                    <v-text-field
                        v-model="data.pid"
                        :rules="valid1"
                        label="题目编号"
                        hint="题目的唯一标识，一般是字母+数字，例如P1"
                        class="mdui-m-t-1"
                        required
                        :disabled="loading"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                        v-model="data.title"
                        :rules="valid2"
                        label="题目标题"
                        required
                        class="mdui-m-t-1"
                        :disabled="loading"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-text-field
                    v-model="data.origin"
                    :rules="valid3"
                    label="题目来源"
                    hint="一般包含年份、来源、题目原来所在位置，如NOIP2021 第一题"
                    class="mdui-m-t-1"
                    required
                    :disabled="loading"
                ></v-text-field>
              </v-form>
              <v-select
                  v-model="select"
                  :hint="`${select.type}, ${select.hint}`"
                  :items="select_items"
                  item-title="type"
                  item-value="hint"
                  label="题目类型"
                  persistent-hint
                  return-object
                  single-line
                  class="mdui-m-t-1"
              ></v-select>
              <v-switch color="teal" class="mdui-m-l-2" v-model="working" label="题目正在施工"></v-switch>
              <div class="mdui-typo-subheading">难度</div>
              <v-chip-group column v-model="data.difficulty">
                <v-chip
                    text="暂无评定"
                    variant="outlined"
                    filter
                    color="grey"
                ></v-chip>

                <v-chip
                    text="入门"
                    variant="outlined"
                    filter
                    color="pink"
                ></v-chip>

                <v-chip
                    text="普及-"
                    variant="outlined"
                    filter
                    color="amber"
                ></v-chip>

                <v-chip
                    text="普及/提高-"
                    variant="outlined"
                    filter
                    color="yellow-darken-1"
                ></v-chip>

                <v-chip
                    text="普及+/提高"
                    variant="outlined"
                    filter
                    color="green"
                ></v-chip>

                <v-chip
                    text="提高+/省选-"
                    variant="outlined"
                    filter
                    color="blue"
                ></v-chip>

                <v-chip
                    text="省选/NOI-"
                    variant="outlined"
                    filter
                    color="purple"
                ></v-chip>

                <v-chip
                    text="NOI/NOI+/CTSC"
                    variant="outlined"
                    filter
                    color="black"
                ></v-chip>
              </v-chip-group>
            </v-sheet>
            <v-btn
                color="teal"
                :append-icon="pid == '0'? 'mdi-playlist-plus':'mdi-refresh'"
                variant="flat"
                border="0"
                class="mdui-m-t-1"
                :loading="loading"
                @click="update()"
            >
              {{ pid=='0'? '创建题目':'更新信息' }}
            </v-btn>
            <v-btn
                append-icon="mdi-delete"
                variant="flat"
                border="0"
                class="mdui-m-t-1 mdui-m-l-1"
                @click="deleteProblem()"
                v-if="pid!='0'"
            >
              删除题目
            </v-btn>
          </v-tabs-window-item>
          <v-tabs-window-item value="_tab2">
            <div class="mdui-typo-subheading mdui-m-b-1">标签</div>
            <div v-if="count_0 + count_1 + count_2 == 0" class="mdui-typo-caption">没有选择标签，点击下方<i
                class="mdui-icon material-icons">add</i>可以对“算法”、“来源”等条件进行选择。
            </div>
            <template v-else>
              <template v-for="tag in data.tags">
                <v-chip
                    style="margin: 2px"
                    :color="COJConfig.tags_index.get(tag).color"
                    v-if="filterTag(tag)"
                    @click="deleteTag(tag)"
                >
                  {{ COJConfig.tags_index.get(tag).name }}
                </v-chip>
              </template>
            </template>
            <div class="coj-clearfix">
              <div style="float: right;margin-top: 20px;">
                <v-tooltip text="清空标签">
                  <template v-slot:activator="{ props }">
                    <button @click="clearTag()" class="mdui-btn mdui-btn-icon mdui-btn-dense mdui-ripple" v-bind="props">
                      <i class="mdui-icon material-icons">delete</i>
                    </button>
                  </template>
                </v-tooltip>
                <v-tooltip text="添加标签">
                  <template v-slot:activator="{ props }">
                    <button class="mdui-btn mdui-btn-icon mdui-btn-dense mdui-ripple" v-bind="props" @click="showTagDialog = true">
                      <i class="mdui-icon material-icons">add</i>
                    </button>
                  </template>
                </v-tooltip>
              </div>
            </div>
          </v-tabs-window-item>
          <v-tabs-window-item value="_tab3">
            <div class="mdui-typo-subheading mdui-m-b-1" style="display: inline-block;margin-top:4px">题目描述</div>
            <v-tooltip text="添加题目描述">
              <template v-slot:activator="{ props }">
                <v-btn
                    :loading="loading && loading_now == -1"
                    v-bind="props"
                    icon="mdi-playlist-plus"
                    size="x-small"
                    variant="flat"
                    class="mdui-m-l-1"
                    @click="addDescription()"></v-btn>
              </template>
            </v-tooltip>
            <template v-for="(description,index) in data.descriptions">
              <div class="mdui-typo-body-2">描述 #{{ index+1 }}</div>
              <v-sheet class="mdui-m-t-1">
                <v-form>
                  <v-row dense>
                    <v-col cols="12" sm="6">
                      <v-text-field
                          v-model="description.lang"
                          :rules="valid4"
                          label="语言代号"
                          placeholder="zh_cn"
                          hint="如zh_cn"
                          class="mdui-m-t-1"
                          required
                          :disabled="loading && loading_now == index"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field
                          v-model="description.author"
                          :rules="valid5"
                          label="来源或提供者"
                          required
                          class="mdui-m-t-1"
                          :disabled="loading && loading_now == index"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-form>
              </v-sheet>
              <coj-editor v-model="description.content"></coj-editor>
              <v-btn
                  color="teal"
                  variant="flat"
                  border="0"
                  class="mdui-m-t-1"
                  :disabled="loading && loading_now == index"
                  :loading="loading && loading_now == index"
                  @click="updateDescription(index)"
              >
                提交修改
              </v-btn>
              <v-btn
                  variant="flat"
                  border="0"
                  class="mdui-m-t-1 mdui-m-l-1"
                  :disabled="loading && loading_now == index"
                  @click="deleteDescription(index)"
              >
                删除
              </v-btn>
              <div class="mdui-typo mdui-m-b-2">
                <hr/>
              </div>
            </template>
          </v-tabs-window-item>
          <v-tabs-window-item value="_tab4">
            <div class="mdui-typo-subheading mdui-m-b-1">测试点配置</div>
            <CEditor
                v-model:value="code"
                mode="json5"
                style="height:500px"
            />
            <v-btn
                color="teal"
                variant="flat"
                border="0"
                class="mdui-m-t-1"
                :disabled="loading"
                @click="update()"
            >
              提交修改
            </v-btn>
          </v-tabs-window-item>
        </v-tabs-window>
      </v-card-text>
    </v-card>
    <v-dialog persistent v-model="showTagDialog">
      <v-card title="选择标签">
        <v-tabs
            v-model="tab"
            color="teal"
        >
          <v-tab value="tab1">算法</v-tab>
          <v-tab value="tab2">来源</v-tab>
          <v-tab value="tab3">时间</v-tab>
        </v-tabs>
        <v-card-text>
          <v-tabs-window v-model="tab">
            <v-tabs-window-item value="tab1">
              <div class="mdui-typo-subheading-opacity mdui-m-b-1">已选标签</div>
              <div class="mdui-typo-caption mdui-m-t-1" v-if="count_0 == 0">无</div>
              <template v-for="tag in data.tags" v-if="count_0 != 0">
                <v-chip
                    :color="COJConfig.tags_index.get(tag).color"
                    style="margin: 2px"
                    v-if="COJConfig.tags_index.get(tag).group == 0"
                    @click="deleteTag(tag)"
                >
                  {{ COJConfig.tags_index.get(tag).name }}
                </v-chip>
              </template>
              <template v-for="group in COJConfig.tags[0].groups">
                <div class="mdui-typo">
                  <hr/>
                </div>
                <div class="mdui-typo-subheading-opacity mdui-m-b-1 mdui-m-t-2">{{ group.title }}</div>
                <template v-for="tag in group.items">
                  <v-chip
                      :color="COJConfig.tags[0].color"
                      style="margin: 2px"
                      v-if="data.tags.includes(tag.tid)"
                      @click="deleteTag(tag.tid)"
                  >
                    {{ tag.name }}
                  </v-chip>
                  <v-chip
                      color="grey"
                      style="margin: 2px"
                      v-else
                      @click="addTag(tag.tid)"
                  >
                    {{ tag.name }}
                  </v-chip>
                </template>
              </template>
            </v-tabs-window-item>
            <v-tabs-window-item value="tab2">
              <div class="mdui-typo-subheading-opacity mdui-m-b-1">已选标签</div>
              <div class="mdui-typo-caption mdui-m-t-1" v-if="count_1 == 0">无</div>
              <template v-for="tag in data.tags" v-if="count_1 != 0">
                <v-chip
                    :color="COJConfig.tags_index.get(tag).color"
                    style="margin: 2px"
                    v-if="COJConfig.tags_index.get(tag).group == 1"
                    @click="deleteTag(tag)"
                >
                  {{ COJConfig.tags_index.get(tag).name }}
                </v-chip>
              </template>
              <template v-for="group in COJConfig.tags[1].groups">
                <div class="mdui-typo">
                  <hr/>
                </div>
                <div class="mdui-typo-subheading-opacity mdui-m-b-1 mdui-m-t-2">{{ group.title }}</div>
                <template v-for="tag in group.items">
                  <v-chip
                      :color="COJConfig.tags[1].color"
                      style="margin: 2px"
                      v-if="data.tags.includes(tag.tid)"
                      @click="deleteTag(tag.tid)"
                  >
                    {{ tag.name }}
                  </v-chip>
                  <v-chip
                      color="grey"
                      style="margin: 2px"
                      v-else
                      @click="addTag(tag.tid)"
                  >
                    {{ tag.name }}
                  </v-chip>
                </template>
              </template>
            </v-tabs-window-item>
            <v-tabs-window-item value="tab3">
              <div class="mdui-typo-subheading-opacity mdui-m-b-1">已选标签</div>
              <div class="mdui-typo-caption mdui-m-t-1" v-if="count_2 == 0">无</div>
              <template v-for="tag in data.tags" v-if="count_2 != 0">
                <v-chip
                    :color="COJConfig.tags_index.get(tag).color"
                    style="margin: 2px"
                    v-if="COJConfig.tags_index.get(tag).group == 2"
                    @click="deleteTag(tag)"
                >
                  {{ COJConfig.tags_index.get(tag).name }}
                </v-chip>
              </template>
              <template v-for="group in COJConfig.tags[2].groups">
                <div class="mdui-typo">
                  <hr/>
                </div>
                <div class="mdui-typo-subheading-opacity mdui-m-b-1 mdui-m-t-2">{{ group.title }}</div>
                <template v-for="tag in group.items">
                  <v-chip
                      :color="COJConfig.tags[2].color"
                      style="margin: 2px"
                      v-if="data.tags.includes(tag.tid)"
                      @click="deleteTag(tag.tid)"
                  >
                    {{ tag.name }}
                  </v-chip>
                  <v-chip
                      color="grey"
                      style="margin: 2px"
                      v-else
                      @click="addTag(tag.tid)"
                  >
                    {{ tag.name }}
                  </v-chip>
                </template>
              </template>
            </v-tabs-window-item>
          </v-tabs-window>
        </v-card-text>
        <template v-slot:actions>
          <v-btn
              variant="flat"
              @click="clearTag()">
            清空标签
          </v-btn>
          <v-btn
              variant="flat"
              :loading="loading"
              @click="showTagDialog = false">
            确定
          </v-btn>
        </template>
      </v-card>
    </v-dialog>
    <v-dialog max-width="500" v-model="showDialog" persistent>
      <v-card :title="title">
        <v-card-text>
          {{ message }}
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
              :disabled="loading"
              text="取消"
              @click="showDialog = false"
          ></v-btn>
          <v-btn
              text="确定"
              :loading="loading"
              @click="callback()"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import {onMounted, onUpdated, reactive, ref, watch} from "vue";
import router from "@/router";
import type {Description, Problem, ProblemStatus} from "@/entry";
import {COJConfig} from "@/config";

import "codemirror/mode/javascript/javascript.js"
import type {EditorConfiguration} from "codemirror"
import CEditor from "@/component/CEditor.vue";
import request from "@/api";
import {filterTag, getNowTime, toGetParams, toPostParams} from "@/utils";

import beautify from 'js-beautify';
import CojEditor from "@/component/coj-editor.vue";


let loading = ref(false);
let loading_now = ref(0);
let count_1 = ref(0);
let count_2 = ref(0);
let count_0 = ref(0);
let showTagDialog = ref(false);
let title = ref("");
let message = ref("");
let callback = ()=>{}
let showDialog = ref(false);
let tab = ref();
let _tab = ref();
let select = ref({ type: "", hint: "", tid: -1 });
watch(select, async (new_value, old_value)=>{
  if(old_value.tid == -1) return;
  if(pid.value == '0') return;
  try {
    await request.post("/problem/update", toPostParams({type: 2, pid: data.pid, tid: new_value.tid}));
    await request.post("/problem/update", toPostParams({type: 3, pid: data.pid, tid: old_value.tid}));
  }catch(err){console.log(err)}
})
let select_items = ref([
  { type: '传统型', hint: '传统的题目类型', tid: 1001 },
  { type: 'Special Judge', hint: '题目使用Special Judge', tid: 1002 },
  { type: '人工批阅', hint: '题目由人工批阅并给出分数', tid: 1003 }
]);
let working = ref();
watch(working, async (new_value, old_value)=>{
  if(old_value == undefined) return;
  if(pid.value == '0') return;
  try {
    if(new_value == true){
      await request.post("/problem/update", toPostParams({type: 2, pid: data.pid, tid: 1004}));
    }else{
      await request.post("/problem/update", toPostParams({type: 3, pid: data.pid, tid: 1004}));
    }
  }catch(err){console.log(err)}
})
let pid = ref(router.currentRoute.value.params.pid);
let type = reactive([] as number[]);
let data = reactive({difficulty: 0, tags: [], title: "", subtasks: [], submitted: 0, status: {} as ProblemStatus, pid: "", origin: "", descriptions: [], accepted: 0} as Problem);
const valid1 = [(text: string) => {
  if(text == ""){
    return "题目编号不能为空。"
  }
  return true;
}]
const valid2 = [(text: string) => {
  if(text == ""){
    return "题目标题不能为空。"
  }
  return true;
}]
const valid3 = [(text: string) => {
  if(text == ""){
    return "题目来源不能为空。"
  }
  return true;
}]
const valid4 = [(text: string) => {
  if(text == ""){
    return "语言代号不能为空。"
  }
  return true;
}]
const valid5 = [(text: string) => {
  if(text == ""){
    return "来源或提供者不能为空。"
  }
  return true;
}]

let refs = []

const cmOptions: EditorConfiguration = reactive({
  mode: 'text/javascript',
  theme: "default",
  readOnly: false,
  lineNumbers: true,
  lineWiseCopyCut: true,
  gutters: ["CodeMirror-lint-markers"]
});
const code = ref("[]")
const cmRef = ref();

let form: any = ref();
const update = async () => {
  const {valid} = await form.value.validate();
  if(!valid){
    return;
  }
  loading.value = true;

  try{
    let type = pid.value == '0'? 0:1;
    await request.post("/problem/update", toPostParams({type: type, pid: data.pid, title: data.title, origin: data.origin, difficulty: data.difficulty, subtasks: code.value}));
    if(type == 0){
      await request.post("/problem/update", toPostParams({type: 2, pid: data.pid, tid: select.value.tid}));
      if(working.value == true){
        await request.post("/problem/update", toPostParams({type: 2, pid: data.pid, tid: 1004}));
      }
      mdui.snackbar({
        message: "题目创建成功"
      });
      router.push("/problem/update/" + data.pid);
      pid.value = data.pid;
    }else{
      mdui.snackbar({
        message: "题目信息已更新"
      });
    }
  }catch(err){console.log(err)}

  loading.value = false;
}
const deleteProblem = () => {
  title.value = "删除题目";
  message.value = "您确定要删除该题目吗？删除后不可恢复。"
  callback = async () => {
    loading.value = true;
    try{
      await request.get("/problem/delete", toGetParams({pid: data.pid}));
      mdui.snackbar({
        message: "题目删除成功。"
      });
      router.push("/problem");
    }catch(err){console.log(err)}
    loading.value = false;
    showDialog.value = false;
  }
  showDialog.value = true;
}

onMounted(async () => {
  if(pid.value != '0'){
    try {
      Object.assign(data, await request.get('/problem/detail', toGetParams({pid: pid.value})));
      console.log(data);
      // 初始化count信息
      data.tags = data.tags.filter((target) => {
        if(filterTag(target)){
          return true;
        }else{
          type.push(target);
          return false;
        }
      });
      for(let tid of data.tags){
        let obj = COJConfig.tags_index.get(tid);
        if (obj.group == 0) count_0.value++;
        if (obj.group == 1) count_1.value++;
        if (obj.group == 2) count_2.value++;
      }
      // 初始化subtask信息
      code.value = beautify.js(JSON.stringify(data.subtasks));
      if(type.includes(1001)) select.value = select_items.value[0];
      if(type.includes(1002)) select.value = select_items.value[1];
      if(type.includes(1003)) select.value = select_items.value[2];
      if(type.includes(1004)) working.value = true;
      else working.value = false;
    } catch (err) {
      console.log(err);
      //router.go("/error");
      router.push("/error")
    }
  }else{
    select.value = select_items.value[0];
    working.value = true;
  }
});

const deleteTag = async (tid: number) => {
  loading.value = true;
  try{
    await request.post("/problem/update", toPostParams({type: 3, pid: data.pid, tid: tid}));
    data.tags = data.tags.filter((target) => {
      return target != tid;
    });
    let obj = COJConfig.tags_index.get(tid);
    if (obj.group == 0) count_0.value--;
    if (obj.group == 1) count_1.value--;
    if (obj.group == 2) count_2.value--;
  }catch(err){console.log(err)}
  loading.value = false;
  //console.log(chosenTid.value);
  //console.log("delete",tid);
}
const clearTag = async () => {
  title.value = "清空标签";
  message.value = "您真的要清空全部标签吗，清空后无法恢复。"
  callback = async ()=>{
    loading.value = true;
    for(let tid of data.tags){
      try{
        await request.post("/problem/update", toPostParams({type: 3, pid: data.pid, tid: tid}));
      }catch(err){console.log(err)}
    }
    data.tags = [];
    count_0.value = 0;
    count_1.value = 0;
    count_2.value = 0;
    loading.value = false;
    showDialog.value = false;
  }
  showDialog.value = true;
}
const addTag = async (tid: number) => {
  //console.log("add",tid);
  loading.value = true;
  try{
    await request.post("/problem/update", toPostParams({type: 2, pid: data.pid, tid: tid}));
    data.tags.push(tid);
    let obj = COJConfig.tags_index.get(tid);
    if (obj.group == 0) count_0.value++;
    if (obj.group == 1) count_1.value++;
    if (obj.group == 2) count_2.value++;
  }catch(err){console.log(err)}
  loading.value = false;
}

const deleteDescription = async (index: number) => {
  title.value = "删除题目描述";
  message.value = "您确定要删除该题目描述吗？删除后不可恢复。";
  callback = async () => {
    loading.value = true;
    loading_now.value = index;
    try{
      let did = data.descriptions[index].did;
      await request.get("/problem/description/delete", toGetParams({did: did}))
      data.descriptions = data.descriptions.filter((target) => {
        return target.did != did;
      })
      mdui.snackbar({
        message: "删除成功。"
      });
    }catch(err){console.log(err)}
    loading.value = false;
    showDialog.value = false;
  }
  showDialog.value = true;
}
const addDescription = async () => {
  loading.value = true;
  loading_now.value = -1;
  try{
    let description: Description = {pid: data.pid, lang: "zh_cn", author: "官方", time: getNowTime(), content: COJConfig.default_description}
    description.did = await request.post("/problem/description/update", toPostParams(description));
    data.descriptions.push(description);
  }catch(err){console.log(err)}
  loading.value = false;
}
const updateDescription = async (index: number) => {
  let valid = true;
  if(data.descriptions[index].author.trim().length == 0) valid = false;
  if(data.descriptions[index].content.trim().length == 0) valid = false;
  if(data.descriptions[index].author.trim().length == 0) valid = false;
  if(!valid) return;
  loading.value = true;
  loading_now.value = index;
  try{
    await request.post("/problem/description/update", toPostParams(data.descriptions[index]));
    mdui.snackbar({
      message: "修改成功。"
    });
  }catch(err){console.log(err)}
  loading.value = false;
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
.grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style>