<template>
  <!-- 默认抽屉栏在左侧 -->
  <div class="mdui-drawer mdui-drawer-close" id="left-drawer">
    <v-img
        class="mdui-shadow-1"
        width="100%" height="180px"
        cover
        :src="ResourceURL + '/background/' + userStore.entry.uid + '.png'"
    >
      <div class="mdui-card-media-covered">
        <v-list rounded="0" style="background-color: rgba(0, 0, 0, .1); color: white;">
          <v-list-item
              :prepend-avatar="ResourceURL + '/avatar/' + userStore.entry.uid + '.png'"
              :subtitle="'提交:' + getNumText(userStore.entry.submitted) + ', 通过:' + getNumText(userStore.entry.accepted)"
              :title="userStore.entry.name"
          >
            <template v-slot:append>
              <v-tooltip text="退出登录">
                <template v-slot:activator="{ props }">
                  <v-btn icon="mdi-logout-variant" size="small" variant="text" class="mdui-m-l-2" v-bind="props"
                    @click="userLogout()" mdui-drawer-close></v-btn>
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
      <li class="mdui-list-item mdui-ripple" v-for="i in AppbarList" :key="i.title">
        <i class="mdui-list-item-icon mdui-icon material-icons">{{ i.icon }}</i>
        <div class="mdui-list-item-content" mdui-drawer-close @click="router.push(i.target)">{{ i.title }}</div>
      </li>
      <li class="mdui-collapse-item mdui-collapse-item-open">
        <div class="mdui-collapse-item-header mdui-list-item mdui-ripple">
          <i class="mdui-list-item-icon mdui-icon material-icons">people</i>
          <div class="mdui-list-item-content">我</div>
          <i class="mdui-collapse-item-arrow mdui-icon material-icons">keyboard_arrow_down</i>
        </div>
        <ul class="mdui-collapse-item-body mdui-list mdui-list-dense">
          <li class="mdui-list-item mdui-ripple" mdui-drawer-close @click="router.push('/user/detail/' + userStore.entry.uid)">我的主页</li>
          <li class="mdui-list-item mdui-ripple" mdui-drawer-close v-for="i in UserMenu" :key="i.title">{{ i.title }}</li>
        </ul>
      </li>
    </ul>
  </div>
  <header class="coj-header mdui-shadow-2">
    <v-progress-linear 
      :active="globalStore.loading" 
      :indeterminate="globalStore.loading" 
      color="teal" 
      absolute
      bottom
    ></v-progress-linear>
    <div class="coj-header-center">
      <button 
        class="mdui-btn mdui-btn-icon mdui-hidden-sm-up" 
        style="width: 47px; margin-left: -10px;"
        mdui-drawer="{target: '#left-drawer'}" 
        v-if="userReady"
      >
        <i class="mdui-icon material-icons" style="font-size: 25px;">menu</i>
      </button>
      <!-- 导航栏左侧按钮 -->
      <button class="coj-header-logo mdui-btn" @click="router.push('/')">
        <span>COJ</span>
      </button>
      <template v-for="(i, index) in AppbarList" :key="i.title">
        <button class="mdui-btn mdui-hidden-xs" @click="router.push(i.target)" v-if="index != 0">
          <i class="mdui-icon material-icons">{{ i.icon }}</i> {{ i.title }}
        </button>
      </template>
      <!-- 右侧头像 -->
      <div class="coj-header-center-avatar mdui-hidden-xs" v-if="userReady">
        <v-menu min-width="200px" rounded open-on-hover>
          <template v-slot:activator="{ props: menu }">
            <v-btn
                icon
                v-bind="menu"
                height="36"
                width="36"
                @click.prevent="router.push('/user/detail/' + userStore.entry.uid)"
                :href="'/user/detail/' + userStore.entry.uid"
            >
              <v-avatar color="teal" size="36">
                <v-img :src="ResourceURL + '/avatar/' + userStore.entry.uid + '.png'"></v-img>
              </v-avatar>
            </v-btn>
          </template>
          <div class="elevation-4 mdui-color-white">
            <v-list rounded="0">
              <v-list-item 
                :prepend-avatar="ResourceURL + '/avatar/' + userStore.entry.uid + '.png'"
                :subtitle="'提交:' + getNumText(userStore.entry.submitted) + ', 通过:' + getNumText(userStore.entry.accepted)"
                :title="userStore.entry.name"
              >
                <template v-slot:append>
                  <v-tooltip text="退出登录">
                    <template v-slot:activator="{ props }">
                      <v-btn icon="mdi-logout-variant" size="small" variant="text" class="mdui-m-l-2" v-bind="props"
                        @click="userLogout()"></v-btn>
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
              <li v-for="i in UserMenu" :key="i.title" class="mdui-list-item mdui-ripple" @click="router.push(i.target)">
                <i class="mdui-list-item-icon mdui-icon material-icons">{{ i.icon }}</i>
                <div class="mdui-list-item-content">{{ i.title }}</div>
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
    <div>{{ COJInfo.info }}</div>
    <div class="coj-version-info">Version: {{ COJInfo.version }}</div>
    <button 
      class="mdui-btn mdui-btn-icon mdui-btn-dense mdui-color-theme-accent mdui-ripple"
      mdui-tooltip="{content: '状态信息'}" 
      @click="router.push('/state')"
    >
      <i class="mdui-icon material-icons">storage</i>
    </button>
    <button 
      class="mdui-btn mdui-btn-icon mdui-btn-dense mdui-color-theme-accent mdui-ripple"
      mdui-tooltip="{content: 'Github'}"
    >
      <ion-icon name="logo-github"></ion-icon>
    </button>
  </footer>

  <v-dialog v-model="globalStore.error_message.show" scrollable max-width="780">
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
        <v-btn color="black darken-1" @click="globalStore.error_message.show = false">
          关闭
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts" name="App">
/* global mdui */
import { RouterView } from "vue-router";
import { useGlobalStore } from "./store/global";
import { computed, onMounted, onUpdated } from "vue";
import { useUserStore } from "./store/user";
import { getNumText } from "./utils";
import { userLogout } from '@/api/user'
import router from '@/router';
import {AppbarList, COJInfo, COJInit, ResourceURL, UserMenu} from "@/config/index";
import { userPassVerify } from "@/config/user";

const globalStore = useGlobalStore();
const userStore = useUserStore();

onMounted(() => {
  COJInit();
  mdui.mutation();
});

onUpdated(() => {
  mdui.mutation();
})

const userReady = computed(() => {
  return userStore.isLogin && userPassVerify(userStore.entry);
})
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

.coj-version-info {
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
