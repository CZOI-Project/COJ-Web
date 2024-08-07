<template>
  <div>
    <div class="main">
      <v-img class="mdui-shadow-2" style="border-radius: 2px;" width="100%" height="200px" cover
        src="https://cdn.vuetifyjs.com/images/parallax/material.jpg">
        <div class="mdui-card-media-covered">
          <div class="mdui-card-primary" style="display: flex; align-items: center;">
            <v-avatar size="x-large">
              <v-img :src="COJConfig.resourceURL + '/avatar/' + user.uid + '.png'"></v-img>
            </v-avatar>
            <div style="margin-left: 15px; flex: 1; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">
              <div class="mdui-card-primary-title">{{ user.name }}</div>
              <div class="mdui-card-primary-subtitle" style="overflow: hidden; text-overflow: ellipsis;">{{ user.sign }}</div>
            </div>
            <div style="display: flex; flex-shrink: 0;">
              <v-tooltip text="关注">
                <template v-slot:activator="{ props }">
                  <button class="mdui-btn mdui-btn-icon" v-bind="props">
                    <i class="mdui-icon material-icons">group_add</i>
                  </button>
                </template>
              </v-tooltip>
              <v-tooltip text="设置">
                <template v-slot:activator="{ props }">
                  <button class="mdui-btn mdui-btn-icon" v-bind="props" @click="router.push('/setting')">
                    <i class="mdui-icon material-icons">settings</i>
                  </button>
                </template>
              </v-tooltip>
            </div>
          </div>
        </div>
      </v-img>
      <v-card class="mdui-m-t-2">
        <v-tabs v-model="tab" color="teal">
          <v-tab value="tab1">主页</v-tab>
          <v-tab value="tab2">练习</v-tab>
          <v-tab value="tab3">比赛</v-tab>
        </v-tabs>

        <v-card-text>
          <v-tabs-window v-model="tab">
            <v-tabs-window-item value="tab1">
              <v-row dense>
                <v-col cols="12" sm="8">
                  <div class="mdui-typo-title mdui-m-b-1" style="font-size: 15px;">个人介绍</div>
                  <CojEditor v-model="ren_html" hide></CojEditor>
                </v-col>
                <v-col cols="12" sm="4">
                  <div class="coj-clearfix">
                    <div class="mdui-typo-title" style="font-size: 15px; float: left;">用户编号（UID）</div>
                    <div class="mdui-typo-title" style="font-size: 15px; float: right;">{{ user.uid }}</div>
                  </div>
                  <div class="coj-clearfix mdui-m-t-1">
                    <div class="mdui-typo-title" style="font-size: 15px; float: left;">入学年份</div>
                    <div class="mdui-typo-title" style="font-size: 15px; float: right;">{{ user.year }}</div>
                  </div>
                  <div class="coj-clearfix mdui-m-t-1">
                    <div class="mdui-typo-title" style="font-size: 15px; float: left;">CCF等级</div>
                    <div class="mdui-typo-title" style="font-size: 15px; float: right;">{{ user.ccfLevel }}</div>
                  </div>
                </v-col>
              </v-row>
            </v-tabs-window-item>
            <v-tabs-window-item value="tab2">

            </v-tabs-window-item>
            <v-tabs-window-item value="tab3">

            </v-tabs-window-item>
          </v-tabs-window>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>
<script setup lang="ts" name="User">
import router from "@/router";
import { onMounted, reactive, ref } from "vue";
import request from '@/api'
import { toGetParams } from "@/utils";
import { COJConfig } from "@/config";
import { User } from "@/entry";
import CojEditor from "@/component/coj-editor.vue";
const tab = ref();
const ren_html = ref('');

const user = reactive({} as User)

onMounted(async () => {
  let uid = router.currentRoute.value.params.uid;
  try{
    let data = await request.get('/user/detail', toGetParams({uid: uid}))
    Object.assign(user, data);
    ren_html.value = user.introduce;
  }catch(err){
    console.log(err);
    router.push('/error');
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
</style>