<template>
  <div>
    <transition name="mainfade" mode="out-in">
      <div class="main" v-if="now == 0">
      <v-row>
        <v-col cols="12" sm="8">
          <div class="mdui-typo-title mdui-m-b-1">公告</div>
          <v-row dense>
            <v-col cols="12" v-for="(announcement, index) in announcements" v-bind:key="announcement.title">
              <v-card @click="showAnnouncement(index)" class="mx-auto" :subtitle="announcement.time" :title="announcement.title" :color="announcement.top? 'teal':''"
                variant="tonal">
                <template v-slot:prepend>
                  <v-avatar>
                    <v-icon :icon="announcement.icon"></v-icon>
                  </v-avatar>
                </template>
                <template v-slot:append>
                  <v-avatar size="24">
                    <v-img :src="ResourceURL + '/avatar/' + announcement.user + '.png'"></v-img>
                  </v-avatar>
                </template>
              </v-card>
            </v-col>
          </v-row>
          <div class="mdui-typo-title mdui-m-b-1 mdui-m-t-2">最新比赛</div>
          <v-row dense>
            <v-col cols="12">
              <v-card color="teal" variant="tonal">
                <v-card-item>
                  <v-card-title class="text-body-2 d-flex align-center">
                    <v-icon color="rgb(0,60,54)" icon="mdi-calendar" start></v-icon>
                    <span class="text-medium-emphasis font-weight-bold">8/6 9:00 - 8/7 9:00（已开始）</span>
                    <v-spacer></v-spacer>
                    <v-chip class="ms-2" prepend-icon="mdi-account-multiple"
                      size="small" text="81" variant="flat"></v-chip>
                  </v-card-title>
                  <div>
                    <div class="text-h6">Hello, COJ! #1</div>
                    <div class="font-weight-light text-medium-emphasis">
                      <v-chip
                        class="ma-2"
                        color="success"
                        variant="outlined"
                        size="small"
                      >
                        <v-icon icon="mdi-palette-swatch" start></v-icon>
                        IOI赛制
                      </v-chip>
                      <v-chip
                        class="ma-2"
                        color="success"
                        variant="outlined"
                        size="small"
                      >
                        <v-icon icon="mdi-palette-swatch" start></v-icon>
                        IOI赛制
                      </v-chip>
                    </div>
                  </div>
                </v-card-item>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" sm="4">
          <div class="mdui-typo-title mdui-m-b-1">时间轴</div>
          <div style="height: 300px; overflow-y: auto;padding-right:10px" class="mdui-shadow-2 mdui-color-white">
            <v-timeline align="start" side="end">
              <v-timeline-item v-for="(item, index) in countdown" v-bind:key="item.title" :dot-color="index == 0? 'pink':'teal-lighten-3'" :size="index == 0? 'small':'x-small'">
                <div class="d-flex">
                  <strong class="me-4">{{ item.time }}</strong>
                  <div>
                    <strong>{{ item.title }}</strong>
                    <div class="text-caption">
                      还有{{ item.dis }}天
                    </div>
                  </div>
                </div>
              </v-timeline-item>
            </v-timeline>
          </div>
          <div class="mdui-typo-title mdui-m-b-1 mdui-m-t-2">问题跳转</div>
          <div class="mdui-shadow-2 mdui-color-white mdui-p-t-1 mdui-p-l-3 mdui-p-r-3 mdui-p-b-2">
            <v-sheet class="mdui-m-t-1">
              <v-form @submit.prevent="router.push('/problem/detail/' + jump_target)">
                <v-text-field variant="underlined" label="题目编号" v-model="jump_target"></v-text-field>
              </v-form>
            </v-sheet>
            <div class="coj-clearfix">
              <v-btn variant="text" icon="mdi-arrow-right" style="float: right" @click="router.push('/problem/detail/' + jump_target)"></v-btn>
            </div>
          </div>
        </v-col>
      </v-row>
      </div>
      <div class="main" v-else>
        <button class="mdui-btn mdui-btn-icon" @click="now = 0">
          <i class="mdui-icon material-icons">arrow_back</i>
        </button>
        <span style="font-weight: bold;margin-left: 5px;">{{ now_title }}</span>
        <div class="mdui-shadow-2 mdui-color-white mdui-p-l-1 mdui-p-r-1 mdui-m-t-2" style="padding-top: 16px; padding-bottom: 40px">
          <CojEditor v-model="ren_html" hide></CojEditor>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts" name="HomeView">
import router from '@/router';
import { daysUntil, parseDateTime } from '@/utils';
import axios from 'axios';
import { onMounted, reactive, ref } from 'vue';
import CojEditor from '@/component/coj-editor.vue';
import {ResourceURL} from "@/config";

const announcements = reactive([]);
const countdown = reactive([]);
const jump_target = ref('');
const now = ref(0);
const now_title = ref('');//标题

onMounted(async () => {
  const response_announcements = await axios.get(ResourceURL + "/announcements/index.json");
  Object.assign(announcements, response_announcements.data);
  const response_countdown = await axios.get(ResourceURL + "/countdown.json");
  Object.assign(countdown, response_countdown.data);
  for(let i = 0; i < countdown.length; i ++){
    let d = parseDateTime(countdown[i].time);
    //console.log(countdown[i].time);
    countdown[i].time = (d.getMonth() + 1) + "." + d.getDate();
    countdown[i].dis = daysUntil(d);
  }
});

const ren_html = ref('')
async function showAnnouncement(target:number) {
  now_title.value = "公告：" + announcements[target].title;
  const res = await axios.get(ResourceURL + "/announcements/" + announcements[target].target);
  now.value = 1;
  ren_html.value = res.data;
  console.log(ren_html.value)
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