<template>
  <div>
    <div class="main">
      <div class="mdui-typo-headline">题库</div>

      <div class="mdui-shadow-2 mdui-m-t-2 mdui-color-white">
        <div class="mdui-p-l-3 mdui-p-r-3 mdui-p-t-3 mdui-p-b-1">
          <div style="font-weight: bold;" class="mdui-m-b-2">标签</div>
          <div v-if="count_0 + count_1 + count_2 == 0" class="mdui-typo-caption">没有选择标签，点击下方<i
              class="mdui-icon material-icons">add</i>可以对“算法”、“来源”等条件进行选择。
          </div>
          <template v-else>
            <template v-for="tag in chosenTag">
              <v-chip
                  style="margin: 2px"
                  :color="tag.color"
                  @click="deleteTag(tag.tid)"
              >
                {{ tag.name }}
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

              <v-dialog>
                <template v-slot:activator="{ props: activatorProps }">
                  <v-tooltip text="添加标签">
                    <template v-slot:activator="{ props }">
                      <button class="mdui-btn mdui-btn-icon mdui-btn-dense mdui-ripple" v-bind="mergeProps(props, activatorProps)">
                        <i class="mdui-icon material-icons">add</i>
                      </button>
                    </template>
                  </v-tooltip>
                </template>

                <template v-slot:default="{ isActive }">
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
                          <template v-for="tag in chosenTag" v-if="count_0 != 0">
                            <v-chip
                                :color="tag.color"
                                style="margin: 2px"
                                v-if="tag.group == 0"
                                @click="deleteTag(tag.tid)"
                            >
                              {{ tag.name }}
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
                                  v-if="chosenTid.includes(tag.tid)"
                                  @click="deleteTag(tag.tid)"
                              >
                                {{ tag.name }}
                              </v-chip>
                              <v-chip
                                  color="grey"
                                  style="margin: 2px"
                                  v-if="!chosenTid.includes(tag.tid)"
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
                          <template v-for="tag in chosenTag" v-if="count_1 != 0">
                            <v-chip
                                :color="tag.color"
                                style="margin: 2px"
                                v-if="tag.group == 1"
                                @click="deleteTag(tag.tid)"
                            >
                              {{ tag.name }}
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
                                  v-if="chosenTid.includes(tag.tid)"
                                  @click="deleteTag(tag.tid)"
                              >
                                {{ tag.name }}
                              </v-chip>
                              <v-chip
                                  color="grey"
                                  style="margin: 2px"
                                  v-if="!chosenTid.includes(tag.tid)"
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
                          <template v-for="tag in chosenTag" v-if="count_2 != 0">
                            <v-chip
                                :color="tag.color"
                                style="margin: 2px"
                                v-if="tag.group == 2"
                                @click="deleteTag(tag.tid)"
                            >
                              {{ tag.name }}
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
                                  v-if="chosenTid.includes(tag.tid)"
                                  @click="deleteTag(tag.tid)"
                              >
                                {{ tag.name }}
                              </v-chip>
                              <v-chip
                                  color="grey"
                                  style="margin: 2px"
                                  v-if="!chosenTid.includes(tag.tid)"
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
                      <button class="mdui-btn mdui-ripple mdui-text-color-black" @click="clearTag()">清空标签</button>
                      <button class="mdui-btn mdui-ripple mdui-text-color-black" @click="isActive.value = false">确定</button>
                    </template>
                  </v-card>
                </template>
              </v-dialog>
            </div>
          </div>
        </div>
        <div class="mdui-typo">
          <hr/>
        </div>
        <div class="mdui-p-l-3 mdui-p-r-3 mdui-p-t-3 mdui-p-b-1">
          <div style="font-weight: bold;" class="mdui-m-b-2">难度</div>
          <v-chip-group
              v-model="difficulty"
              column
              multiple
          >
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
          <div class="coj-clearfix">
            <div style="float: right;margin-top: 20px;" >
              <button class="mdui-btn mdui-ripple" @click="reverseDifficulty()">反选</button>
              <button class="mdui-btn mdui-ripple" @click="allDifficulty()">全选</button>
            </div>
          </div>
        </div>
        <div class="mdui-typo">
          <hr/>
        </div>
        <div class="mdui-p-l-3 mdui-p-r-3 mdui-p-t-3 mdui-p-b-3">
          <v-text-field
              hint="将会找到题目名称中连续包含所输入的关键字的题目"
              label="关键字"
              v-model="key"
              persistent-hint
          ></v-text-field>
          <div class="coj-clearfix">
            <div style="font-weight: bold; float:left" class="mdui-m-t-2">
              将关键字用于搜索题号
              <div class="mdui-typo-caption mdui-m-t-1">启用后将直接搜索指定题号的题目，其他筛选条件将失效</div>
            </div>
            <v-switch class="mdui-m-t-2" style="float: right;" v-model="enablePid" color="teal"></v-switch>
          </div>
          <div class="coj-clearfix">
            <div style="float: right; margin-top: 26px;">
              <v-btn icon="mdi-magnify" size="large" color="teal" :loading="loading" @click="searchAction()"></v-btn>
            </div>
          </div>
        </div>
      </div>

      <div class="mdui-m-t-2 coj-clearfix">
        <div style="float: left;font-weight: bold;line-height: 36px;vertical-align: middle; color: rgb(80,80,80)">
          {{ problemCount }} 个题目，共 {{ total }} 页。
        </div>
        <COJPagination :callback="pageCallback" style="float: right" class="mdui-color-white mdui-shadow-2"
                       :total="total" :now="now">
        </COJPagination>
      </div>
      <div class="mdui-table-fluid mdui-m-t-2" style="margin-left: -1px;">
        <table class="mdui-table mdui-table-hoverable">
          <thead>
          <tr>
            <th>状态</th>
            <th>
              题号
              <button @click="sortPidAction()" :class="{'mdui-btn-active': sortPid!=0, 'mdui-btn-reserve': sortPid==2}"
                      class=" mdui-btn mdui-btn-icon mdui-btn-dense mdui-ripple">
                <i class="mdui-icon material-icons">sort</i>
              </button>
            </th>
            <th style="min-width: 250px;">题目名称</th>
            <th :class="{'coj-min-300': showTag}">
              算法
              <button class="mdui-btn mdui-btn-icon mdui-btn-dense mdui-ripple" @click="toggleShowTag()">
                <i class="mdui-icon material-icons">{{ showTag ? 'visibility' : 'visibility_off' }}</i>
              </button>
            </th>
            <th>
              难度
              <button class="mdui-btn mdui-btn-icon mdui-btn-dense mdui-ripple" @click="toggleShowDifficulty()">
                <i class="mdui-icon material-icons">{{ showDifficulty ? 'visibility' : 'visibility_off' }}</i>
              </button>
              <button @click="sortDifficultyAction()"
                      :class="{'mdui-btn-active': sortDifficulty!=0, 'mdui-btn-reserve': sortDifficulty==2}"
                      class="mdui-btn mdui-btn-icon mdui-btn-dense mdui-ripple">
                <i class="mdui-icon material-icons">sort</i>
              </button>
            </th>
            <th>通过率</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="item in problemList" @click="router.push('/problem/detail/'+item.pid)" style="cursor: pointer;">
            <td><i class="mdui-icon material-icons"
                   :class="{'mdui-text-color-grey': item.status.status==0,'mdui-text-color-red': item.status.status==1,'mdui-text-color-green': item.status.status==2,'mdui-text-color-blue': item.status.status == 3}">
              {{ item.status.status == 0 ? 'remove' : (item.status.status == 1 ? 'clear' : 'check') }}
            </i></td>
            <td style="color: rgb(117,117,117)">{{ item.pid }}</td>
            <td>
              <div style="font-size: 16px;font-weight: bold;" class="text-teal">{{ item.title }}</div>
              <div class="mdui-typo-caption mdui-text-color-grey" style="line-height: 14px;">{{ item.origin }}</div>
            </td>
            <td>
              <template v-for="tid in item.tags">
                <v-chip
                    size="small"
                    style="margin: 2px"
                    :color="COJConfig.tags_index.get(tid).color"
                    v-show="showTag && filterTag(tid)"
                >
                  {{ COJConfig.tags_index.get(tid).name }}
                </v-chip>
              </template>
            </td>
            <td>
              <div v-show="showDifficulty" style="font-weight: bold;" :class="getDifficultyColor(item.difficulty)">
                {{ getDifficultyText(item.difficulty) }}
              </div>
            </td>
            <td>
              {{ getNumText(item.accepted) }}/{{ getNumText(item.submitted) }}
            </td>
          </tr>
          </tbody>
        </table>
      </div>
      <div class="mdui-m-t-2 coj-clearfix">
        <COJPagination :callback="pageCallback" style="float: right" class="mdui-color-white mdui-shadow-2"
                       :total="total" :now="now">
        </COJPagination>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="Problem">
import {onUpdated, onMounted, ref, reactive, mergeProps} from 'vue'
import COJTag from '@/component/coj-tag.vue';
import {COJConfig} from '@/config';
import COJButton from '@/component/coj-button.vue';
import COJPagination from '@/component/coj-pagination.vue'
import request from '@/api'
import {getNumText, getDifficultyColor, getDifficultyText, toGetParams, arrayToText, filterTag} from '@/utils';
import router from '@/router'
import type { Problem } from '@/entry';

//筛选标签的时候的tab组件实例
let tab = ref(null);
//chosenTag大概包含这些字段 {color: , name: , group: ,tid: }
interface chosen_tag {color: string, name: string, group: number, tid: number};
let chosenTag = ref([] as chosen_tag[]);
//已经选中的标签的tid
let chosenTid = ref([] as number[]);
//每个组有多少个标签被选中了，用于判断是否显示没有选中标签的信息
let count_0 = ref(0);
let count_1 = ref(0);
let count_2 = ref(0);
//是否正在加载
let loading = ref(false);
//选中的难度
let difficulty = ref([0,1,2,3,4,5,6,7]);

//0为默认，1为从上到下依次从大到小，2为从上到下依次从小到大
let sortDifficulty = ref(0);
//同上，但不能双条件排序
let sortPid = ref(0);
//总页数
let total = ref(1);
//当前页面
let now = ref(1);
//当前
let key = ref('');
//关键字用于pid
let enablePid = ref(false);
//命中题目数量
let problemCount = ref(0);
//题目列表
let problemList = ref([] as Problem[]);
//展示
let showDifficulty = ref(false);
let showTag = ref(false);

onMounted(() => {
  searchAction();
  mdui.mutation();
})

function deleteTag(tid: number) {
  chosenTid.value = chosenTid.value.filter((target) => {
    return target != tid;
  });
  chosenTag.value = chosenTag.value.filter((target) => {
    return target.tid != tid;
  });
  let obj = COJConfig.tags_index.get(tid);
  if (obj.group == 0) count_0.value--;
  if (obj.group == 1) count_1.value--;
  if (obj.group == 2) count_2.value--;
  //console.log(chosenTid.value);
  //console.log("delete",tid);
}

function addTag(tid: number) {
  //console.log("add",tid);
  chosenTid.value.push(tid);
  let obj = COJConfig.tags_index.get(tid);
  chosenTag.value.push({color: obj.color, name: obj.name, group: obj.group, tid: tid});
  if (obj.group == 0) count_0.value++;
  if (obj.group == 1) count_1.value++;
  if (obj.group == 2) count_2.value++;
}

function clearTag() {
  chosenTag.value = [];
  chosenTid.value = [];
  count_0.value = 0;
  count_1.value = 0;
  count_2.value = 0;
  console.log(difficulty);
}

function reverseDifficulty() {
  let arr: number[] = [];
  for(let i = 0; i < 8; i++) {
    if(!difficulty.value.includes(i)) arr.push(i);
  }
  difficulty.value = arr;
}

function allDifficulty() {
  if(difficulty.value.length == 8) difficulty.value = [];
  else difficulty.value = [0,1,2,3,4,5,6,7];
}

function toggleShowDifficulty() {
  showDifficulty.value = !showDifficulty.value;
}

function toggleShowTag() {
  showTag.value = !showTag.value;
}

async function searchAction(refresh = true) {
  //初始参数
  let index = now.value;
  if (refresh) index = 1;
  let data = {count: COJConfig.list_size, index: index, order: 0};

  //order
  if (sortPid.value == 1) data.order = 1;
  if (sortPid.value == 2) data.order = 2;
  if (sortDifficulty.value == 1) data.order = 3;
  if (sortDifficulty.value == 2) data.order = 4;

  if (difficulty.value.length == 0) {
    mdui.snackbar({
      message: '至少选择一个难度。'
    });
    return;
  }
  if (difficulty.value.length != 8) {
    data = Object.assign(data, {difficulty: arrayToText(difficulty.value)});
  }

  //key
  if (key.value != '') {
    if (enablePid.value) {
      data = Object.assign(data, {pid: key.value});
    } else {
      data = Object.assign(data, {key: key.value});
    }
  }

  //tag
  if (chosenTid.value.length != 0) {
    data = Object.assign(data, {tag: arrayToText(chosenTid.value)});
  }

  loading.value = true;
  try {
    //启动请求
    interface result{count:number,problems:Problem[]}
    let res:result = await request.get("/problem/list", toGetParams(data));
    //更新分页信息
    if (refresh) {
      now.value = 1;
      if (res.count == 0) total.value = 1;
      else total.value = Math.ceil(res.count / COJConfig.list_size);
    }
    problemList.value = res.problems;
    problemCount.value = res.count;
    //console.log(res);
  } catch (err) {
    console.log(err)
  }

  loading.value = false;
  mdui.mutation()
}

async function sortDifficultyAction() {
  if (sortPid.value != 0) {
    sortPid.value = 0;
  }
  if (sortDifficulty.value == 0) {
    sortDifficulty.value = 1;
  } else if (sortDifficulty.value == 1) {
    sortDifficulty.value = 2;
  } else if (sortDifficulty.value == 2) {
    sortDifficulty.value = 0;
  }
  await searchAction();
}

async function sortPidAction() {
  if (sortDifficulty.value != 0) {
    sortDifficulty.value = 0;
  }
  if (sortPid.value == 0) {
    sortPid.value = 1;
  } else if (sortPid.value == 1) {
    sortPid.value = 2;
  } else if (sortPid.value == 2) {
    sortPid.value = 0;
  }

  await searchAction();
}

async function pageCallback(type:number, target:number) {
  if (type == 1) {
    now.value = 1;
  }
  if (type == 2) {
    now.value--;
  }
  if (type == 3) {
    now.value = target;
  }
  if (type == 4) {
    now.value++;
  }
  if (type == 5) {
    now.value = total.value;
  }
  await searchAction(false);
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

.mdui-btn.mdui-btn-active {
  color: black;
  background-color: rgb(209, 209, 209);
}

.mdui-btn.mdui-btn-reserve {
  transform: rotateX(180deg);
}

.mdui-btn-group .mdui-btn {
  padding: 0 0 !important;
  min-width: 36px;
}

.coj-min-250 {
  min-width: 250px;
}

.coj-min-300 {
  min-width: 300px;
}
</style>