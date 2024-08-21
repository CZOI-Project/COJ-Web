<template>
  <div class="main" v-if="!globalStore.loading">
    <div class="mdui-typo-headline">{{ pid=='0'? '创建题目':'编辑题目 '+pid }}</div>
    <v-card class="mdui-m-t-2">
      <v-tabs
          v-model="tab"
          color="teal"
      >
        <v-tab value="_tab1">基本信息</v-tab>
        <v-tab value="_tab2" v-if="pid!='0'">题目标签</v-tab>
        <v-tab value="_tab3" v-if="pid!='0'">题目描述</v-tab>
        <v-tab value="_tab4" v-if="pid!='0'">测试点配置</v-tab>
      </v-tabs>

      <v-card-text>
        <v-tabs-window v-model="tab">
          <!-- 基本信息 -->
          <v-tabs-window-item value="_tab1">
            <div class="mdui-typo-subheading mdui-m-b-1">基本信息</div>
            <v-sheet class="mdui-m-t-1">
              <v-form ref="form" @submit.prevent="">
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
                  v-for="i in DifficultyList"
                  :key="i.title"
                  :text="i.title"
                  variant="outlined"
                  filter
                  :color="i.color"
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
          <!-- 题目标签 -->
          <v-tabs-window-item value="_tab2">
            <div class="mdui-typo-subheading mdui-m-b-1">标签</div>
            <COJTags edit :loading="loading" v-model="data.tags" @delete="deleteTag" @add="addTag"></COJTags>
          </v-tabs-window-item>
          <!-- 题目描述 -->
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
            <template v-for="(description,index) in data.descriptions" :key="description.did">
              <div class="mdui-typo-body-2">描述 #{{ index + 1 }}</div>
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
              <COJEditor v-model="description.content"></COJEditor>
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
              <div class="mdui-typo mdui-m-b-2"><hr/></div>
            </template>
          </v-tabs-window-item>
          <!-- 测试点配置 -->
          <v-tabs-window-item value="_tab4">
            <div class="mdui-typo-subheading mdui-m-b-1">测试点配置</div>
            <code-mirror
                v-model="code"
                basic
                wrap
                :lang="javascript()"
                style="max-height: 500px; height:500px; width: 100%; overflow-y: scroll;"
                tab
            />
            <v-btn
                color="teal"
                variant="flat"
                border="0"
                class="mdui-m-t-1"
                :disabled="loading"
                @click="updateSubtask()"
            >
              提交修改
            </v-btn>
          </v-tabs-window-item>
        </v-tabs-window>
      </v-card-text>
    </v-card>
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

<script setup lang="ts" name="ProblemUpdate">
/* global mdui */
import {onBeforeMount, reactive, ref, watch} from "vue";
import router from "@/router";
import beautify from 'js-beautify';
import COJEditor from "@/component/coj-editor.vue";
import COJTags from '@/component/COJTags.vue'
import { DifficultyList } from "@/config/problem";
import CodeMirror from 'vue-codemirror6';
import { javascript } from "@codemirror/lang-javascript";
import type { DescriptionPO } from "@/entify/problem";
import {useGlobalStore} from "@/store/global";
import {
  descriptionCreate,
  descriptionDelete, descriptionUpdate,
  problemCreate,
  problemDelete,
  problemDetail,
  problemUpdate,
  subtaskDetail, subtaskUpdate,
  tagAdd,
  tagDelete
} from "@/api/problem";

const globalStore = useGlobalStore();
globalStore.loading = true;

let tab = ref();

// 页面相关
const loading = ref(false);  // 是否正在加载
const loading_now = ref(0);  // 正在加载的目标是谁，用于多个题目描述的更新
const pid = ref(router.currentRoute.value.params.pid as string);  // 路由上的pid
const data = reactive({
  pid: "",
  origin: "",
  tags: [],
  title: "",
  difficulty: 0,
  descriptions: [],
}); // 题目数据
const code = ref();  // subtask的json字符串

// 弹窗相关
let title = ref("");  // 弹窗标题
let message = ref("");  // 弹窗内容
let callback = ()=>{}  // 确认按钮回调
let showDialog = ref(false);  // 是否显示

// 题目类型
// 候选项
let select_items = ref([
  { type: '传统型', hint: '传统的题目类型', tid: 1001 },
  { type: 'Special Judge', hint: '题目使用Special Judge', tid: 1002 },
  { type: '人工批阅', hint: '题目由人工批阅并给出分数', tid: 1003 }
]);
//已选
let select = ref({ type: "", hint: "", tid: -1 });
watch(select, async (new_value, old_value)=>{
  if(old_value.tid == -1) return;
  if(pid.value == '0') return;
  try {
    await tagAdd(pid.value, new_value.tid);
    await tagDelete(pid.value, new_value.tid);
  }catch(err){console.log(err)}
})

// 是否正在施工
let working = ref();
watch(working, async (new_value, old_value)=>{
  if(old_value == undefined) return;
  if(pid.value == '0') return;
  try {
    if(new_value == true){
      await tagAdd(pid.value, 1004);
    }else{
      await tagDelete(pid.value, 1004);
    }
  }catch(err){console.log(err)}
})

// 表单验证
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

onBeforeMount(async () => {
  if(pid.value != '0'){
    try {
      Object.assign(data, await problemDetail(pid.value as string));
      // 初始化subtask信息
      code.value = beautify.js(JSON.stringify(await subtaskDetail(pid.value as string)));
      // 其他值
      // 题目的特殊类型
      if(data.tags.includes(1001)) select.value = select_items.value[0];
      if(data.tags.includes(1002)) select.value = select_items.value[1];
      if(data.tags.includes(1003)) select.value = select_items.value[2];
      // 是否施工
      working.value = data.tags.includes(1004);
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
  }else{
    select.value = select_items.value[0];
    working.value = true;
  }
  globalStore.loading = false;
});

// 更新基本信息
let form = ref();
async function update() {
  const {valid} = await form.value.validate();
  if(!valid){
    return;
  }
  loading.value = true;

  try{
    if(pid.value == '0'){
      // 创建题目
      await problemCreate(data.pid, data.title, data.origin, data.difficulty);
      // 置施工状态
      if(working.value == true) await addTag(1004);
      // 置题目状态
      await addTag(select.value.tid);
      mdui.snackbar({
        message: "题目创建成功"
      });
      await router.push("/problem/update/" + data.pid);
      pid.value = data.pid;
    }else{
      await problemUpdate(data.pid, data.title, data.origin, data.difficulty);
      mdui.snackbar({
        message: "题目信息已更新"
      });
    }
  }catch(err){console.log(err)}

  loading.value = false;
}
async function deleteProblem() {
  title.value = "删除题目";
  message.value = "您确定要删除该题目吗？删除后不可恢复。"
  callback = async () => {
    loading.value = true;
    try{
      await problemDelete(data.pid);
      mdui.snackbar({
        message: "题目删除成功。"
      });
      await router.push("/problem");
    }catch(err){console.log(err)}
    loading.value = false;
    showDialog.value = false;
  }
  showDialog.value = true;
}

async function deleteTag(tid: number) {
  loading.value = true;
  try{
    await tagDelete(data.pid, tid);
  }catch(err){console.log(err)}
  loading.value = false;
}
async function addTag(tid: number) {
  loading.value = true;
  try{
    await tagAdd(data.pid, tid);
  }catch(err){console.log(err)}
  loading.value = false;
}

async function deleteDescription(index: number) {
  title.value = "删除题目描述";
  message.value = "您确定要删除该题目描述吗？删除后不可恢复。";
  callback = async () => {
    loading.value = true;
    loading_now.value = index;
    try{
      let did = data.descriptions[index].did;
      await descriptionDelete(did);
      data.descriptions = data.descriptions.filter((target) => {
        return target.did != did;
      });
      mdui.snackbar({
        message: "删除成功。"
      });
    }catch(err){console.log(err)}
    loading.value = false;
    showDialog.value = false;
  }
  showDialog.value = true;
}
async function addDescription() {
  loading.value = true;
  loading_now.value = -1;
  try{
    const description: DescriptionPO = await descriptionCreate(
        data.pid,
        "zh-cn",
        "官方",
        ""
    );
    data.descriptions.push(description);
  }catch(err){console.log(err)}
  loading.value = false;
}
async function updateDescription(index: number){
  let valid = true;
  if(data.descriptions[index].author.trim().length == 0) valid = false;
  if(data.descriptions[index].content.trim().length == 0) valid = false;
  if(data.descriptions[index].author.trim().length == 0) valid = false;
  if(!valid) return;
  loading.value = true;
  loading_now.value = index;
  try{
    const obj = data.descriptions[index];
    await descriptionUpdate(obj.did, obj.pid, obj.lang, obj.author, obj.content);
    mdui.snackbar({
      message: "修改成功。"
    });
  }catch(err){console.log(err)}
  loading.value = false;
}

async function updateSubtask(){
  loading.value = true;
  try{
    await subtaskUpdate(data.pid, code.value);
    mdui.snackbar({
      message: "更新成功"
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