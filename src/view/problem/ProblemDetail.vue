<template>
  <div v-if="!globalStore.loading">
    <div class="main">
      <!-- 顶部信息 -->
      <!-- 电脑端 -->
      <div class="flex-container mdui-hidden-xs">
        <div class="flex-fix">
          <div style="display: inline-block;text-align: center;" class="mdui-ripple mdui-p-a-1" v-if="data.submitted != undefined">
            <span class="mdui-typo-subheading">提交</span><br>
            <span class="mdui-typo-body-2">{{ getNumText(data.submitted) }}</span>
          </div>
          <div style="display: inline-block;text-align: center;" class="mdui-ripple mdui-p-a-1" v-if="data.accepted != undefined">
            <span class="mdui-typo-subheading">通过</span><br>
            <span class="mdui-typo-body-2">{{ getNumText(data.accepted) }}</span>
          </div>
          <div style="display: inline-block;text-align: center;" class="mdui-ripple mdui-p-a-1">
            <span class="mdui-typo-subheading">内存</span><br>
            <span class="mdui-typo-body-2">{{ memory }}</span>
          </div>
          <div style="display: inline-block;text-align: center;" class="mdui-ripple mdui-p-a-1">
            <span class="mdui-typo-subheading">时间</span><br>
            <span class="mdui-typo-body-2">{{ time }}</span>
          </div>
        </div>
        <div class="flex-rest">
          <div class="mdui-typo-headline">
            <i
                class="mdui-icon material-icons"
                :class="'mdui-text-color-' + ProblemStatusList[data.status.status].color"
            >
              {{ ProblemStatusList[data.status.status].icon }}
            </i>
            {{ data.pid }} {{ data.title }}
          </div>
          <div class="mdui-typo-caption">
            来源：{{ data.origin }}<br>
          </div>
        </div>
      </div>
      <!-- 手机端 -->
      <div class="mdui-hidden-sm-up">
        <div class="mdui-typo-headline">
          <i
              class="mdui-icon material-icons"
              :class="'mdui-text-color-' + ProblemStatusList[data.status.status].color"
          >
            {{ ProblemStatusList[data.status.status].icon }}
          </i>
          {{ data.pid }} {{ data.title }}
        </div>
        <div class="mdui-typo-caption">
          来源：{{ data.origin }}<br>
        </div>
        <div class="mdui-hidden-sm-up" style="display: flex; justify-content: center;">
          <div style="display: inline-block;text-align: center;" class="mdui-ripple mdui-p-a-1" v-if="data.accepted != undefined">
            <span class="mdui-typo-subheading">提交</span><br>
            <span class="mdui-typo-body-2">{{ getNumText(data.submitted) }}</span>
          </div>
          <div style="display: inline-block;text-align: center;" class="mdui-ripple mdui-p-a-1" v-if="data.accepted != undefined">
            <span class="mdui-typo-subheading">通过</span><br>
            <span class="mdui-typo-body-2">{{ getNumText(data.accepted) }}</span>
          </div>
          <div style="display: inline-block;text-align: center;" class="mdui-ripple mdui-p-a-1">
            <span class="mdui-typo-subheading">内存</span><br>
            <span class="mdui-typo-body-2">{{ memory }}</span>
          </div>
          <div style="display: inline-block;text-align: center;" class="mdui-ripple mdui-p-a-1">
            <span class="mdui-typo-subheading">时间</span><br>
            <span class="mdui-typo-body-2">{{ time }}</span>
          </div>
        </div>
      </div>
      <Transition name="mainfade" mode="out-in">
        <div class="mdui-m-t-1" v-if="page == 1">
          <!-- 桌面端界面 -->
          <div class="mdui-hidden-xs">
            <v-row dense>
              <!-- 题目渲染 -->
              <v-col cols="12" sm="8" md="9">
                <div class="mdui-shadow-2 mdui-color-white mdui-p-l-1 mdui-p-r-1" v-if="page == 1"
                  style="padding-top: 16px; padding-bottom: 40px">
                  <COJEditor v-model="ren_html" hide></CojEditor>
                </div>
              </v-col>
              <!-- 右栏信息 -->
              <v-col cols="12" sm="4" md="3">
                <!-- 题目类型 -->
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
                  <!-- 比赛信息 -->
                  <div class="mdui-color-indigo" style="padding: 10px;" v-if="data.contest != undefined">
                    <i class="mdui-icon material-icons" style="font-size: 20px;margin-left: 6px;">flag</i>
                    <span style="font-size: 13px;margin-left: 14px;">所属比赛：{{ data.contest.name }}</span>
                  </div>
                </div>
                <!-- 题目信息 -->
                <div class="mdui-shadow-2 mdui-m-t-1">
                  <div class="mdui-color-white mdui-p-l-2 mdui-p-r-2 mdui-p-t-2" style="padding-bottom: 4px;">
                    <!-- 分数 -->
                    <div class="coj-clearfix">
                      <div style="font-size: 15px;float: left;">历史分数</div>
                      <div
                          style="font-size: 15px;font-weight: bold;float: right;"
                          :class="scoreColor"
                      >
                        {{ scoreText }}
                      </div>
                    </div>
                    <!-- 难度 -->
                    <div class="coj-clearfix mdui-m-t-1">
                      <div style="font-size: 15px;float: left;margin-top:7px">难度</div>
                      <button
                          class="mdui-btn mdui-btn-icon mdui-btn-dense mdui-ripple"
                          style="float: left;margin-left: 4px;"
                          @click="showDifficulty = false"
                          v-show="showDifficulty"
                      >
                        <i class="mdui-icon material-icons">visibility</i>
                      </button>
                      <button
                          class="mdui-btn mdui-btn-icon mdui-btn-dense mdui-ripple"
                          style="float: left;margin-left: 4px;"
                          @click="showDifficulty = true"
                          v-show="!showDifficulty"
                      >
                        <i class="mdui-icon material-icons">visibility_off</i>
                      </button>
                      <div style="font-size: 15px;font-weight: bold;float: right;margin-top: 7px;"
                        v-show="showDifficulty" :class="'mdui-text-color-' + DifficultyList[data.difficulty].color">
                        {{ DifficultyList[data.difficulty].title }}
                      </div>
                    </div>
                    <!-- 标签 -->
                    <div class="coj-clearfix">
                      <div style="font-size: 15px;float: left;margin-top:7px">标签</div>
                      <button
                          class="mdui-btn mdui-btn-icon mdui-btn-dense mdui-ripple"
                          style="float: left;margin-left: 4px;"
                          @click="showTag = false"
                          v-show="showTag"
                      >
                        <i class="mdui-icon material-icons">visibility</i>
                      </button>
                      <button
                          class="mdui-btn mdui-btn-icon mdui-btn-dense mdui-ripple"
                          style="float: left;margin-left: 4px;"
                          @click="showTag = true"
                          v-show="!showTag"
                      >
                        <i class="mdui-icon material-icons">visibility_off</i>
                      </button>
                    </div>
                    <COJTags v-show="showTag" v-model="data.tags"></COJTags>
                  </div>
                  <!-- 其他操作 -->
                  <ul class="mdui-list mdui-list-dense" style="padding-top: 0;padding-bottom: 0;">
                    <!-- 收藏 -->
                    <li class="mdui-list-item mdui-ripple">
                      <i
                          class="mdui-list-item-icon mdui-icon material-icons"
                          :class="{ 'mdui-text-color-orange': data.status.star }"
                      >
                        star
                      </i>
                      <div
                          class="mdui-list-item-content"
                          style="margin-left: 12px;"
                          @click="starAction()"
                      >
                        {{ data.status.star == 0 ? '收藏' : '已收藏' }}
                      </div>
                    </li>
                    <!-- 提交记录 -->
                    <li class="mdui-list-item mdui-ripple">
                      <i class="mdui-list-item-icon mdui-icon material-icons">list</i>
                      <div class="mdui-list-item-content" style="margin-left: 12px;">提交记录</div>
                    </li>
                    <!-- 统计 -->
                    <li class="mdui-list-item mdui-ripple" v-if="data.contest == undefined">
                      <i class="mdui-list-item-icon mdui-icon material-icons">data_usage</i>
                      <div class="mdui-list-item-content" style="margin-left: 12px;">统计</div>
                    </li>
                    <!-- 编辑 -->
                    <a
                        v-if="userAdmin(userStore.entry)"
                        :href="'/problem/update/' + data.pid"
                        @click.prevent="router.push('/problem/update/' + data.pid)"
                    >
                      <li class="mdui-list-item mdui-ripple" >
                        <i class="mdui-list-item-icon mdui-icon material-icons">settings</i>
                        <div class="mdui-list-item-content" style="margin-left: 12px;">题目设置</div>
                      </li>
                    </a>
                    <!-- 提交 -->
                    <li class="mdui-list-item mdui-ripple mdui-color-teal" @click="page == 1 ? (page = 2) : submit()">
                      <i class="mdui-list-item-icon mdui-icon material-icons">{{ page == 1 ? 'edit' : 'send' }}</i>
                      <div class="mdui-list-item-content" style="margin-left: 12px;">{{ page == 1 ? '编辑代码' : '提交' }}
                      </div>
                    </li>
                  </ul>
                </div>
                <!-- 题目描述 -->
                <div class="mdui-shadow-2 mdui-m-t-1 mdui-color-white">
                  <div class="mdui-color-white mdui-p-l-2 mdui-p-r-2 mdui-p-t-2">
                    <div style="font-size: 15px;">题目描述</div>
                  </div>
                  <ul class="mdui-list mdui-list-dense">
                    <li 
                        class="mdui-list-item mdui-ripple"
                        v-for="(description, index) in data.descriptions"
                        :class="{ 'mdui-list-item-active': now_description == index }"
                        @click="now_description = index"
                        :key="description.did"
                    >
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
            <!-- 题目类型 -->
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
            <!-- 题目描述 -->
            <div class="mdui-shadow-2 mdui-m-t-1 mdui-m-b-1 mdui-color-white">
              <div class="mdui-color-white mdui-p-l-2 mdui-p-r-2 mdui-p-t-2">
                <div style="font-size: 15px;">题目描述</div>
              </div>
              <ul class="mdui-list mdui-list-dense">
                <li 
                    class="mdui-list-item mdui-ripple"
                    v-for="(description, index) in data.descriptions"
                    :class="{ 'mdui-list-item-active': now_description == index }"
                    @click="now_description = index"
                    :key="description.did"
                >
                  <div class="mdui-list-item-content">
                    <div class="mdui-list-item-title mdui-list-item-one-line">{{ description.lang }}</div>
                    <div class="mdui-list-item-text mdui-list-item-one-line">{{ description.author }}</div>
                  </div>
                </li>
              </ul>
            </div>
            <!-- 题目渲染 -->
            <div class="mdui-shadow-2 mdui-color-white mdui-p-l-1 mdui-p-r-1" v-if="page == 1"
              style="padding-top: 16px; padding-bottom: 40px">
              <COJEditor v-model="ren_html" hide></COJEditor>
            </div>
            <!-- 题目信息 -->
            <div class="mdui-shadow-2 mdui-m-t-1">
              <div class="mdui-color-white mdui-p-l-2 mdui-p-r-2 mdui-p-t-2" style="padding-bottom: 4px;">
                <!-- 分数 -->
                <div class="coj-clearfix">
                  <div style="font-size: 15px;float: left;">历史分数</div>
                  <div
                      style="font-size: 15px;font-weight: bold;float: right;"
                      :class="scoreColor"
                  >
                    {{ scoreText }}
                  </div>
                </div>
                <!-- 难度 -->
                <div class="coj-clearfix mdui-m-t-1">
                  <div style="font-size: 15px;float: left;margin-top:7px">难度</div>
                  <button
                      class="mdui-btn mdui-btn-icon mdui-btn-dense mdui-ripple"
                      style="float: left;margin-left: 4px;"
                      @click="showDifficulty = false"
                      v-show="showDifficulty"
                  >
                    <i class="mdui-icon material-icons">visibility</i>
                  </button>
                  <button
                      class="mdui-btn mdui-btn-icon mdui-btn-dense mdui-ripple"
                      style="float: left;margin-left: 4px;"
                      @click="showDifficulty = true"
                      v-show="!showDifficulty"
                  >
                    <i class="mdui-icon material-icons">visibility_off</i>
                  </button>
                  <div style="font-size: 15px;font-weight: bold;float: right;margin-top: 7px;"
                       v-show="showDifficulty"
                       :class="'mdui-text-color-' + DifficultyList[data.difficulty].color"
                  >
                    {{ DifficultyList[data.difficulty].title }}
                  </div>
                </div>
                <!-- 标签 -->
                <div class="coj-clearfix">
                  <div style="font-size: 15px;float: left;margin-top:7px">标签</div>
                  <button
                      class="mdui-btn mdui-btn-icon mdui-btn-dense mdui-ripple"
                      style="float: left;margin-left: 4px;"
                      @click="showTag = false"
                      v-show="showTag"
                  >
                    <i class="mdui-icon material-icons">visibility</i>
                  </button>
                  <button
                      class="mdui-btn mdui-btn-icon mdui-btn-dense mdui-ripple"
                      style="float: left;margin-left: 4px;"
                      @click="showTag = true"
                      v-show="!showTag"
                  >
                    <i class="mdui-icon material-icons">visibility_off</i>
                  </button>
                </div>
                <COJTags v-show="showTag" v-model="data.tags"></COJTags>
              </div>
              <!-- 其他操作 -->
              <ul class="mdui-list mdui-list-dense" style="padding-top: 0;padding-bottom: 0;">
                <!-- 收藏 -->
                <li class="mdui-list-item mdui-ripple">
                  <i
                      class="mdui-list-item-icon mdui-icon material-icons"
                      :class="{ 'mdui-text-color-orange': data.status.star }"
                  >
                    star
                  </i>
                  <div
                      class="mdui-list-item-content"
                      style="margin-left: 12px;"
                      @click="starAction()"
                  >
                    {{ data.status.star == 0 ? '收藏' : '已收藏' }}
                  </div>
                </li>
                <!-- 提交记录 -->
                <li class="mdui-list-item mdui-ripple">
                  <i class="mdui-list-item-icon mdui-icon material-icons">list</i>
                  <div class="mdui-list-item-content" style="margin-left: 12px;">提交记录</div>
                </li>
                <!-- 统计 -->
                <li class="mdui-list-item mdui-ripple" v-if="data.contest == undefined">
                  <i class="mdui-list-item-icon mdui-icon material-icons">data_usage</i>
                  <div class="mdui-list-item-content" style="margin-left: 12px;">统计</div>
                </li>
                <!-- 提交 -->
                <li class="mdui-list-item mdui-ripple mdui-color-teal" @click="page == 1 ? (page = 2) : submit()">
                  <i class="mdui-list-item-icon mdui-icon material-icons">{{ page == 1 ? 'edit' : 'send' }}</i>
                  <div class="mdui-list-item-content" style="margin-left: 12px;">{{ page == 1 ? '编辑代码' : '提交' }}
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <!-- 代码编辑 -->
        <div class="mdui-m-t-1 mdui-shadow-2 mdui-color-white mdui-p-a-1" v-else>
          <button class="mdui-btn mdui-btn-icon" @click="page = 1">
            <i class="mdui-icon material-icons">arrow_back</i>
          </button>
          <span style="font-weight: bold;margin-left: 5px;">编辑代码</span>
          <div class="mdui-typo-caption mdui-m-t-1 mdui-m-l-1">将会使用C/C++语言进行评测，并开启O2优化。</div>
          <code-mirror
              v-model="code"
              basic
              wrap
              :lang="cpp()"
              class="mdui-m-t-1"
              style="height: 400px;max-height: 400px; width: 100%;overflow-y: scroll;"
              tab
          />
          <v-btn color="teal" append-icon="mdi-send" variant="flat" border="0" :loading="loading" @click="submit()"
            class="mdui-m-t-1">
            提交
          </v-btn>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts" name="ProblemDetail">
/* global mdui */
import router from '@/router'
import {computed, onBeforeMount, reactive, ref, watch} from 'vue';
import {
  getMemText,
  getScoreColor,
  getTimeText2,
} from '@/utils';
import { getNumText } from '@/utils';
import CodeMirror from 'vue-codemirror6';
import { cpp } from "@codemirror/lang-cpp";
import COJEditor from "@/component/coj-editor.vue";
import COJTags from '@/component/COJTags.vue';
import {problemDetail, problemSubmit} from "@/api/problem";
import type {ProblemDetailDTO} from "@/entify/problem";
import {useGlobalStore} from "@/store/global";
import {DifficultyList, ProblemStatusList} from "@/config/problem";
import {userAdmin} from "@/config/user";
import {useUserStore} from "@/store/user";

const globalStore = useGlobalStore();
globalStore.loading = true;
const userStore = useUserStore();

const code = ref("")
let loading = ref(false);
let page = ref(1);
const data: ProblemDetailDTO = reactive({} as ProblemDetailDTO);

let showTag = ref(false);
let showDifficulty = ref(false);

let ren_html = ref('');
let now_description = ref(0);

onBeforeMount(async () => {
  let _data;
  try{
    if(router.currentRoute.value.query['cid'] != null){
      _data = await problemDetail(router.currentRoute.value.params.pid as string, Number(router.currentRoute.value.query['cid']));
    }else{
      _data = await problemDetail(router.currentRoute.value.params.pid as string);
    }
    Object.assign(data, _data);
    console.log(data);
    // 渲染题面
    if(data.descriptions.length > 0){
      ren_html.value = data.descriptions[0].content;
    }
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

async function submit() {
  if (code.value.trim().length <= 0) {
    mdui.snackbar({
      message: "代码不能为空。"
    });
    return;
  }
  loading.value = true;
  try {
    let rid;
    if(data.contest != undefined){
      rid = await problemSubmit(data.pid, code.value, data.contest.cid);
    }else{
      rid = await problemSubmit(data.pid, code.value);
    }
    mdui.snackbar({
      message: "提交成功。"
    });
    await router.push("/record/detail/" + rid);
  } catch (err) { if(err != null) console.log(err) }
  loading.value = false;
}

async function starAction(){

}

watch(now_description, (now: number) => {
  ren_html.value = data.descriptions[now].content;
})

const memory = computed(() => {
  if(data.memHigh == -1){
    return "无数据";
  }
  if(data.memHigh == data.memLow){
    return getMemText(data.memLow);
  }else{
    return getMemText(data.memLow) + "~" + getMemText(data.memHigh);
  }
})

const time = computed(() => {
  if(data.timeLow == -1){
    return "无数据";
  }
  if(data.timeLow == data.timeHigh){
    return getTimeText2(data.timeHigh);
  }else{
    return getTimeText2(data.timeLow) + "~" + getTimeText2(data.timeHigh);
  }
})

const scoreColor = computed(() => {
  if(data.status.status == 0){
    return 'mdui-text-color-grey'; // 未提交
  }else if(data.status.status == 3){
    return 'mdui-text-color-blue'; // 已提交
  }else{
    return 'mdui-text-color-' + getScoreColor(data.status.score); // 可以看到分数
  }
})

const scoreText = computed(() => {
  if(data.status.status == 0){
    return '未提交';
  }else if(data.status.status == 3){
    return '已提交';
  }else{
    return data.status.score;
  }
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