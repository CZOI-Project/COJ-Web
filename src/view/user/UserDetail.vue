<template>
  <div v-if="!globalStore.loading">
    <div class="main">
      <v-img
          class="mdui-shadow-2"
          style="border-radius: 2px;"
          width="100%"
          height="200px"
          cover
          :src="ResourceURL + '/background/' + user.uid + '.png'"
      >
        <div class="mdui-card-media-covered">
          <div class="mdui-card-primary" style="display: flex; align-items: center;">
            <v-avatar size="x-large">
              <v-img :src="ResourceURL + '/avatar/' + user.uid + '.png'"></v-img>
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
                  <div class="mdui-typo-title mdui-m-b-1">个人介绍</div>
                  <CojEditor v-model="ren_html" hide></CojEditor>
                </v-col>
                <v-col cols="12" sm="4">
                  <div class="coj-clearfix">
                    <div class="mdui-typo-title" style="font-size: 15px; float: left;">用户编号（UID）</div>
                    <div class="mdui-typo-title" style="font-size: 15px; float: right;">{{ user.uid }}</div>
                  </div>
                  <div class="coj-clearfix mdui-m-t-2">
                    <div class="mdui-typo-title" style="font-size: 15px; float: left;">入学年份</div>
                    <div class="mdui-typo-title" style="font-size: 15px; float: right;">{{ user.year }}</div>
                  </div>
                  <div class="coj-clearfix mdui-m-t-2">
                    <div class="mdui-typo-title" style="font-size: 15px; float: left;">CCF等级</div>
                    <div class="mdui-typo-title" style="font-size: 15px; float: right;">{{ user.ccfLevel }}</div>
                  </div>
                </v-col>
              </v-row>
            </v-tabs-window-item>
            <v-tabs-window-item value="tab2">
              <v-progress-circular
                  color="teal"
                  indeterminate
                  v-if="loading"
              ></v-progress-circular>
              <template v-else>
                <div class="mdui-typo-title mdui-m-b-1">统计</div>
                <div class="mdui-typo-subheading" style="font-size: 15px">每天0点更新</div>
                <div class="mdui-m-t-1 mdui-p-b-1" style="overflow-x: auto">
                  <CalendarHeatmap
                      :values="hotmap"
                      :end-date="new Date()"
                      no-data-text="没有提交"
                      tooltip-unit="提交"
                      :max="10"
                      style="min-width: 800px"
                  />
                </div>
                <v-row class="mdui-m-t-1">
                  <v-col cols="12" sm="7">
                    <div class="mdui-typo-title mdui-m-b-1">通过的题目</div>
                    <template v-for="(i, index) in DifficultyList" :key="index">
                      <div style="font-weight: bold; font-size: 15px; margin-bottom: 6px" :class="'text-' + i.color + ' ' + (index != 0 ? 'mdui-m-t-2' : '')">
                        {{ i.title }}
                      </div>
                      <div class="mdui-typo-body-1-opacity" v-if="practiceData[index].length == 0">没有题目</div>
                      <div style="display: flex;" v-else>
                        <v-tooltip :text="j.pid + ' ' + j.title" v-for="j in practiceData[index]" :key="j.pid">
                          <template v-slot:activator="{ props }">
                            <a
                                style="margin: 1px 5px;"
                                :href="'/problem/detail/' + j.pid"
                                v-bind="props"
                                @click.prevent="router.push('/problem/detail/' + j.pid)"
                            >{{ j.pid }}</a>
                          </template>
                        </v-tooltip>
                      </div>
                    </template>
                  </v-col>
                  <v-col cols="12" sm="5">
                    <div class="mdui-typo-title mdui-m-b-1">难易度统计</div>
                    <div style="border-radius: 3px">
                      <div
                          v-for="(i, index) in DifficultyList"
                          :key="index"
                          :style="index != 0 ? 'margin-top: 26px' : ''"
                      >
                        <v-progress-linear
                            model-value="0"
                            :color="i.color"
                            height="32"
                            :style="'width: ' + Math.ceil(practiceData[index].length / practiceTotal * 100) + '%'"
                        ></v-progress-linear>
                        <div :class="'text-' + i.color" style="z-index: 5; margin-top: -26px; margin-left: 12px; margin-right: 12px;">
                          <span style="float: left; font-weight: bold">{{ i.title }}</span>
                          <span style="float: right">{{ practiceData[index].length }}</span>
                        </div>
                      </div>
                    </div>
                  </v-col>
                </v-row>
              </template>
            </v-tabs-window-item>
            <v-tabs-window-item value="tab3">
              <v-card
                  color="green"
                  variant="tonal"
                  class="mx-auto"
              >
                <v-card-item>
                  <div>
                    <div>2024-8-20 00:00 - 12:00</div>
                    <div class="text-h6 mb-1">NOIP 2023</div>
                    <v-chip variant="outlined" class="ma-1" prepend-icon="mdi-align-vertical-bottom">
                      排名：100000/200000 (50%)
                    </v-chip>
                    <v-chip variant="outlined" class="ma-1" prepend-icon="mdi-seal-variant">
                      一等奖
                    </v-chip>
                  </div>
                  <div class="mdui-hidden-xs" style="font-size: 32px; font-weight: bold; float: right; margin-top: -70px">
                    233/400
                  </div>
                </v-card-item>
              </v-card>
              <v-card
                  color="teal"
                  variant="tonal"
                  class="mx-auto mdui-m-t-2"
              >
                <v-card-item>
                  <div>
                    <div>2024-8-20 00:00 - 12:00</div>
                    <div class="text-h6 mb-1">NOIP 2023</div>
                    <v-chip variant="outlined" class="ma-1" prepend-icon="mdi-align-vertical-bottom">
                      排名：100000/200000 (50%)
                    </v-chip>
                    <v-chip variant="outlined" class="ma-1" prepend-icon="mdi-seal-variant">
                      一等奖
                    </v-chip>
                  </div>
                  <div class="mdui-hidden-xs" style="font-size: 32px; font-weight: bold; float: right; margin-top: -70px">
                    233/400
                  </div>
                </v-card-item>
              </v-card>
              <v-card
                  color="light-green-darken-1"
                  variant="tonal"
                  class="mx-auto mdui-m-t-2"
              >
                <v-card-item>
                  <div>
                    <div>2024-8-20 00:00 - 12:00</div>
                    <div class="text-h6 mb-1">NOIP 2023</div>
                    <v-chip variant="outlined" class="ma-1" prepend-icon="mdi-align-vertical-bottom">
                      排名：100000/200000 (50%)
                    </v-chip>
                    <v-chip variant="outlined" class="ma-1" prepend-icon="mdi-seal-variant">
                      一等奖
                    </v-chip>
                  </div>
                  <div class="mdui-hidden-xs" style="font-size: 32px; font-weight: bold; float: right; margin-top: -70px">
                    233/400
                  </div>
                </v-card-item>
              </v-card>
              <v-card
                  color="lime-darken-3"
                  variant="tonal"
                  class="mx-auto mdui-m-t-2"
              >
                <v-card-item>
                  <div>
                    <div>2024-8-20 00:00 - 12:00</div>
                    <div class="text-h6 mb-1">NOIP 2023</div>
                    <v-chip variant="outlined" class="ma-1" prepend-icon="mdi-align-vertical-bottom">
                      排名：100000/200000 (50%)
                    </v-chip>
                    <v-chip variant="outlined" class="ma-1" prepend-icon="mdi-seal-variant">
                      一等奖
                    </v-chip>
                  </div>
                  <div class="mdui-hidden-xs" style="font-size: 32px; font-weight: bold; float: right; margin-top: -70px">
                    233/400
                  </div>
                </v-card-item>
              </v-card>
              <v-card
                  color="yellow-darken-4"
                  variant="tonal"
                  class="mx-auto mdui-m-t-2"
              >
                <v-card-item>
                  <div>
                    <div>2024-8-20 00:00 - 12:00</div>
                    <div class="text-h6 mb-1">NOIP 2023</div>
                    <v-chip variant="outlined" class="ma-1" prepend-icon="mdi-align-vertical-bottom">
                      排名：100000/200000 (50%)
                    </v-chip>
                    <v-chip variant="outlined" class="ma-1" prepend-icon="mdi-seal-variant">
                      一等奖
                    </v-chip>
                  </div>
                  <div class="mdui-hidden-xs" style="font-size: 32px; font-weight: bold; float: right; margin-top: -70px">
                    233/400
                  </div>
                </v-card-item>
              </v-card>
              <v-card
                  color="red"
                  variant="tonal"
                  class="mx-auto mdui-m-t-2"
              >
                <v-card-item>
                  <div>
                    <div>2024-8-20 00:00 - 12:00</div>
                    <div class="text-h6 mb-1">NOIP 2023</div>
                    <v-chip variant="outlined" class="ma-1" prepend-icon="mdi-align-vertical-bottom">
                      排名：100000/200000 (50%)
                    </v-chip>
                    <v-chip variant="outlined" class="ma-1" prepend-icon="mdi-seal-variant">
                      一等奖
                    </v-chip>
                  </div>
                  <div class="mdui-hidden-xs" style="font-size: 32px; font-weight: bold; float: right; margin-top: -70px">
                    233/400
                  </div>
                </v-card-item>
              </v-card>
            </v-tabs-window-item>
          </v-tabs-window>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>
<script setup lang="ts" name="UserDetail">
import router from "@/router";
import {onBeforeMount, reactive, ref, watch} from "vue";
import CojEditor from "@/component/coj-editor.vue";
import { UserDetailDTO } from "@/entify/user";
import { ResourceURL } from "@/config";
import { useGlobalStore } from "@/store/global";
import { userDetail } from "@/api/user";
import { CalendarHeatmap } from 'vue3-calendar-heatmap'
import axios from "axios";
import {DifficultyList} from "@/config/problem";
const tab = ref();
const ren_html = ref('');

const user = reactive({} as UserDetailDTO)
const globalStore = useGlobalStore();
globalStore.loading = true;
const query = router.currentRoute.value.query;
const loading = ref(false);

if(query['tab'] == '2'){
  tab.value = 'tab2';
}else if(query['tab'] == '3') {
  tab.value = 'tab3';
}

onBeforeMount(async () => {
  let uid = router.currentRoute.value.params.uid;
  try{
    Object.assign(user, await userDetail(Number(uid)));
    ren_html.value = user.introduce;
    if(user.introduce == null || user.introduce == ''){
      ren_html.value = '这个人很懒，什么都没有留下。';
    }
    if(tab.value == 'tab2'){
      await loadingPractice();
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
});

const hotmap = ref([]);
const practiceDataDefault = {0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: []};
const practiceData = ref(practiceDataDefault);
const practiceTotal = ref(0);
async function loadingPractice(){
  loading.value = true;
  // 加载热力图
  axios.get(ResourceURL + '/hotmap/' + user.uid + '.json').then((res) => {
    hotmap.value = res.data;
  }).catch((err) => {
    console.error(err);
    hotmap.value = [];
  });
  // 加载练习数据
  axios.get(ResourceURL + '/practice/' + user.uid + '.json').then((res) => {
    let temp = practiceDataDefault;
    let total = 0;
    for(let i in practiceData.value){
      temp[Number(i)] = res.data[i];
      total += practiceData.value[i].length;
    }
    practiceTotal.value = total;
    practiceData.value = temp;
  }).catch((err) => {
    console.error(err);
    practiceData.value = practiceDataDefault;
    practiceTotal.value = 0;
  });
  loading.value = false;
}

watch(tab, async (value) => {
  if(value == 'tab2'){
    await loadingPractice();
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

a{
  text-decoration: none; /* 去掉下划线 */
  color: rgb(0,150,136);        /* 设置链接颜色 */
  transition: color .3s cubic-bezier(.4,0,.2,1);
  -webkit-transition: color .3s cubic-bezier(.4,0,.2,1);
}
a:hover{
  color: #00695C;        /* 设置链接颜色 */
}
</style>