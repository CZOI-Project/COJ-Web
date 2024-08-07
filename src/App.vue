<template>
  <!-- 默认抽屉栏在左侧 -->
  <div class="mdui-drawer mdui-drawer-close" id="left-drawer">
    <v-img class="mdui-shadow-1" width="100%" height="180px" cover
      src="https://cdn.vuetifyjs.com/images/parallax/material.jpg">
      <div class="mdui-card-media-covered">
        <v-list rounded="0" style="background-color: rgba(0, 0, 0, .1); color: white;">
          <v-list-item :prepend-avatar="COJConfig.resourceURL + '/avatar/' + userStore.entry.uid + '.png'"
            :subtitle="'提交:' + getNumText(userStore.entry.submitted) + ', 通过:' + getNumText(userStore.entry.accepted)"
            :title="userStore.entry.name">
            <template v-slot:append>
              <v-tooltip text="退出登录">
                <template v-slot:activator="{ props }">
                  <v-btn icon="mdi-logout-variant" size="small" variant="text" class="mdui-m-l-2" v-bind="props"
                    @click="userLogoutService()" mdui-drawer-close></v-btn>
                </template>
              </v-tooltip>
              <v-tooltip text="设置">
                <template v-slot:activator="{ props }">
                  <v-btn icon="mdi-cog" size="small" variant="text" v-bind="props" mdui-drawer-close
                    @click="router.push('/setting')"></v-btn>
                </template>
              </v-tooltip>
            </template>
          </v-list-item>
        </v-list>
      </div>
    </v-img>
    <ul class="mdui-list" mdui-collapse="{accordion: true}">
      <li class="mdui-list-item mdui-ripple">
        <i class="mdui-list-item-icon mdui-icon material-icons">home</i>
        <div class="mdui-list-item-content" mdui-drawer-close @click="router.push('/')">首页</div>
      </li>
      <li class="mdui-list-item mdui-ripple">
        <i class="mdui-list-item-icon mdui-icon material-icons">layers</i>
        <div class="mdui-list-item-content" mdui-drawer-close @click="router.push('/problem')">题库</div>
      </li>
      <li class="mdui-list-item mdui-ripple">
        <i class="mdui-list-item-icon mdui-icon material-icons">view_week</i>
        <div class="mdui-list-item-content" mdui-drawer-close @click="router.push('/contest')">比赛</div>
      </li>
      <li class="mdui-list-item mdui-ripple">
        <i class="mdui-list-item-icon mdui-icon material-icons">fiber_smart_record</i>
        <div class="mdui-list-item-content" mdui-drawer-close @click="router.push('/record')">提交记录</div>
      </li>

      <li class="mdui-collapse-item mdui-collapse-item-open">
        <div class="mdui-collapse-item-header mdui-list-item mdui-ripple">
          <i class="mdui-list-item-icon mdui-icon material-icons">people</i>
          <div class="mdui-list-item-content">我</div>
          <i class="mdui-collapse-item-arrow mdui-icon material-icons">keyboard_arrow_down</i>
        </div>
        <ul class="mdui-collapse-item-body mdui-list mdui-list-dense">
          <li class="mdui-list-item mdui-ripple" mdui-drawer-close @click="router.push('/user/detail/' + userStore.entry.uid)">我的主页</li>
          <li class="mdui-list-item mdui-ripple" mdui-drawer-close>我的比赛</li>
          <li class="mdui-list-item mdui-ripple" mdui-drawer-close>我的收藏</li>
          <li class="mdui-list-item mdui-ripple" mdui-drawer-close>我的消息</li>
        </ul>
      </li>
    </ul>
  </div>
  <header class="coj-header mdui-shadow-2">
    <v-progress-linear :active="globalStore.loading" :indeterminate="globalStore.loading" color="teal" absolute
      bottom></v-progress-linear>
    <div class="coj-header-center">
      <button class="mdui-btn mdui-btn-icon mdui-hidden-sm-up" style="width: 47px; margin-left: -10px;"
        mdui-drawer="{target: '#left-drawer'}" v-if="userStore.isLogin">
        <i class="mdui-icon material-icons" style="font-size: 25px;">menu</i>
      </button>
      <!-- 导航栏左侧按钮 -->
      <button class="coj-header-logo mdui-btn" @click="goto('/')">
        <span>COJ</span>
      </button>
      <button class="mdui-btn mdui-hidden-xs" @click="goto('/problem')">
        <i class="mdui-icon material-icons">layers</i> 题库
      </button>
      <button class="mdui-btn mdui-hidden-xs" @click="goto('/contest')">
        <i class="mdui-icon material-icons">flag</i> 比赛
      </button>
      <button class="mdui-btn mdui-hidden-xs" @click="goto('/training')">
        <i class="mdui-icon material-icons">view_week</i> 题单
      </button>
      <button class="mdui-btn mdui-hidden-xs" @click="goto('/record')">
        <i class="mdui-icon material-icons">fiber_smart_record</i> 提交记录
      </button>
      <!-- 右侧头像 -->
      <div class="coj-header-center-avatar mdui-hidden-xs" v-if="userStore.isLogin">
        <v-menu min-width="200px" rounded open-on-hover>
          <template v-slot:activator="{ props: menu }">
            <v-btn icon v-bind="menu" height="36" width="36">
              <v-avatar color="teal" size="36">
                <v-img alt="John" :src="COJConfig.resourceURL + '/avatar/' + userStore.entry.uid + '.png'"></v-img>
              </v-avatar>
            </v-btn>
          </template>
          <div class="elevation-4 mdui-color-white">
            <v-list rounded="0">
              <v-list-item :prepend-avatar="COJConfig.resourceURL + '/avatar/' + userStore.entry.uid + '.png'"
                :subtitle="'提交:' + getNumText(userStore.entry.submitted) + ', 通过:' + getNumText(userStore.entry.accepted)"
                :title="userStore.entry.name">
                <template v-slot:append>
                  <v-tooltip text="退出登录">
                    <template v-slot:activator="{ props }">
                      <v-btn icon="mdi-logout-variant" size="small" variant="text" class="mdui-m-l-2" v-bind="props"
                        @click="userLogoutService()"></v-btn>
                    </template>
                  </v-tooltip>
                  <v-tooltip text="设置">
                    <template v-slot:activator="{ props }">
                      <v-btn icon="mdi-cog" size="small" variant="text" v-bind="props"
                        @click="router.push('/setting')"></v-btn>
                    </template>
                  </v-tooltip>
                </template>
              </v-list-item>
            </v-list>
            <ul class="mdui-list mdui-list-dense">
              <li class="mdui-list-item mdui-ripple" @click="router.push('/record')">
                <i class="mdui-list-item-icon mdui-icon material-icons">send</i>
                <div class="mdui-list-item-content">我的提交</div>
              </li>
              <li class="mdui-list-item mdui-ripple">
                <i class="mdui-list-item-icon mdui-icon material-icons">flag</i>
                <div class="mdui-list-item-content">我的比赛</div>
              </li>
              <li class="mdui-list-item mdui-ripple">
                <i class="mdui-list-item-icon mdui-icon material-icons">star</i>
                <div class="mdui-list-item-content">我的收藏</div>
              </li>
              <li class="mdui-list-item mdui-ripple">
                <i class="mdui-list-item-icon mdui-icon material-icons">textsms</i>
                <div class="mdui-list-item-content">我的消息</div>
              </li>
            </ul>
          </div>
        </v-menu>
      </div>
    </div>
  </header>
  <div class="coj-container">
    <router-view v-slot="{ Component }">
      <transition name="mainfade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
  <footer class="coj-footer">
    <div>COJ Powered By GreyCloudTeam</div>
    <div id="version-info">Version: 0.1Beta 内部测试</div>
    <button class="mdui-btn mdui-btn-icon mdui-btn-dense mdui-color-theme-accent mdui-ripple"
      mdui-tooltip="{content: '状态信息'}" @click="goto('/state')">
      <i class="mdui-icon material-icons">storage</i>
    </button>
    <button class="mdui-btn mdui-btn-icon mdui-btn-dense mdui-color-theme-accent mdui-ripple"
      mdui-tooltip="{content: 'Github'}">
      <ion-icon name="logo-github"></ion-icon>
    </button>
  </footer>
  <v-dialog v-model="globalStore.error_message.show" scrollable>
    <v-card>
      <v-card-title class="mdui-text-color-red">
        发生错误
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <span class="text-subtitle-2">我为什么看到这个窗口？</span><br />
        <span class="text-caption">COJ在处理你的请求时发生了未知错误。请您将这个错误反馈给COJ的开发人员，帮助我们完善COJ。</span><br /><br />
        <span class="text-subtitle-2">错误发生位置：</span><br><span class="text-caption">{{ globalStore.error_message.location
          }}</span><br />
        <span class="text-subtitle-2">错误信息：</span><br>
        <div class="text-caption">{{ globalStore.error_message.detail }}</div><br />
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="black darken-1" text @click="globalStore.error_message.show = false">
          关闭
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts" name="App">
import { RouterView } from "vue-router";
import { useGlobalStore } from "./store/global";
import { onMounted, onUpdated } from "vue";
import { useUserStore } from "./store/user";
import { COJConfig } from "./config";
import { getNumText } from "./utils";
import { userLogoutService } from '@/api/user'
import router from '@/router';

const globalStore = useGlobalStore();
const userStore = useUserStore();

onMounted(() => {
  //建立索引
  for (let i = 0; i < COJConfig.tags.length; i++) {
    //console.log(COJConfig.tags[i].groups)
    for (let group of COJConfig.tags[i].groups) {
      //console.log(group);
      for (let item of group.items) {
        COJConfig.tags_index.set(item.tid, {
          name: item.name,
          color: COJConfig.tags[i].color,
          group: i,
        });
      }
    }
  }
  mdui.mutation();
});

onUpdated(() => {
  mdui.mutation();
})

function goto(link: string) {
  router.push(link);
}
</script>

<style scoped>
.coj-header {
  height: 47px;
  display: block;
  width: 100%;
  position: fixed;
  z-index: 100;
  background-color: rgba(255, 255, 255, 0.4);
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
}

.coj-header-center {
  max-width: 1100px;
  height: 47px;
  margin: 0 auto;
  padding-left: 20px;
  padding-right: 20px;
}

.coj-header-logo {
  height: 47px;
  line-height: 47px;
  font-size: 0px;
}

.coj-header-logo img {
  height: 35px;
  vertical-align: middle;
  margin-right: 10px;
}

.coj-header-logo span {
  font-size: 20px;
  vertical-align: middle;
  font-weight: bold;
}

.coj-header-center .mdui-btn {
  height: 47px;
  min-width: none;
  padding-left: 15px;
  padding-right: 15px;
}

.coj-header-center-avatar {
  height: 47px;
  line-height: 47px;
  float: right;
  cursor: pointer;
}

.coj-header-center-avatar img {
  height: 38px;
  border-radius: 35px;
  vertical-align: middle;
  box-sizing: border-box;
  border-width: 3px;
  border-color: rgba(230, 230, 230, 0);
  border-style: solid;
}

.coj-header-center-avatar img:hover {
  border-color: rgba(230, 230, 230, 0.5);
}

.mdui-icon {
  font-size: 20px;
}

.coj-header-menu-bar img {
  height: 50px;
  float: left;
}

.coj-header-menu-info-btns .mdui-btn {
  height: 32px;
}

.coj-header-menu-btns>.mdui-btn {
  display: block;
  width: 50%;
}

/* 关于这里的2n+1和2n-1尚且不知道为什么要这样 */
.coj-header-menu-btns>.mdui-btn:nth-child(2n + 1) {
  float: right;
}

.coj-header--menu-btns>.mdui-btn:nth-child(2n-1) {
  float: left;
}

.coj-container {
  padding-top: 60px;
  padding-left: 15px;
  padding-right: 15px;
  padding-bottom: 15px;
  min-height: calc(100vh - 173px);
  max-width: 1100px;
  margin: 0 auto;
}

.coj-footer {
  padding: 15px;
  text-align: center;
  color: rgb(153, 153, 153);
}

.coj-footer ion-icon {
  font-size: 20px;
  margin-top: 5px;
}

#version-info {
  font-size: 13px;
  color: rgb(199, 199, 199);
  margin-top: 4px;
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
