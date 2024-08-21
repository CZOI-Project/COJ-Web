<template>
  <div>
    <div class="coj-main">
      <div class="coj-clearfix">
        <div class="mdui-typo-headline" style="float: left">题库</div>
        <v-btn
            variant="flat"
            prepend-icon="mdi-plus"
            color="rgba(0,0,0,0)"
            style="float: left; margin-left: 10px;"
            v-if="userAdmin(userStore.entry)"
            href="/problem/update/0"
            @click.prevent="router.push('/problem/update/0')"
        >
          创建题目
        </v-btn>
      </div>
      <!-- 筛选 -->
      <div class="mdui-shadow-2 mdui-m-t-2 mdui-color-white">
        <!-- 标签 -->
        <div class="mdui-p-l-3 mdui-p-r-3 mdui-p-t-3 mdui-p-b-1">
          <div style="font-weight: bold;" class="mdui-m-b-2">标签</div>
          <COJTags edit v-model="form.tags"></COJTags>
        </div>
        <div class="mdui-typo"><hr/></div>
        <!-- 难度 -->
        <div class="mdui-p-l-3 mdui-p-r-3 mdui-p-t-3 mdui-p-b-1">
          <div style="font-weight: bold;" class="mdui-m-b-2">难度</div>
          <v-chip-group
              v-model="form.difficulty"
              column
              multiple
          >
            <v-chip
                v-for="item in DifficultyList"
                :key="item.title"
                :text="item.title"
                variant="outlined"
                filter
                :color="item.color"
            ></v-chip>
          </v-chip-group>
          <div class="coj-clearfix">
            <div style="float: right;margin-top: 20px;" >
              <v-btn
                  variant="flat"
                  prepend-icon="mdi-checkbox-multiple-blank-circle-outline"
                  @click="reverseDifficulty()"
              >
                反选
              </v-btn>
              <v-btn
                  variant="flat"
                  prepend-icon="mdi-check-all"
                  @click="allDifficulty()"
              >
                全选
              </v-btn>
            </div>
          </div>
        </div>
        <div class="mdui-typo"><hr/></div>
        <!-- 搜索关键字 -->
        <div class="mdui-p-l-3 mdui-p-r-3 mdui-p-t-3 mdui-p-b-3">
          <v-sheet>
            <v-form @submit.prevent="searchAction()">
              <v-text-field
                  hint="将会找到题目名称中连续包含所输入的关键字的题目"
                  label="关键字"
                  v-model="form.key"
                  persistent-hint
              ></v-text-field>
              <div class="coj-clearfix">
                <div style="font-weight: bold; float:left" class="mdui-m-t-2">
                  将关键字用于搜索题号
                  <div class="mdui-typo-caption mdui-m-t-1">启用后将搜索在题目编号中含有指定关键字的题目</div>
                </div>
                <v-switch class="mdui-m-t-2" style="float: right;" v-model="enablePid" color="teal"></v-switch>
              </div>
              <div class="coj-clearfix">
                <div style="float: right; margin-top: 26px;">
                  <v-btn
                      icon="mdi-magnify"
                      size="large"
                      color="teal"
                      :loading="loading"
                      type="submit"
                  ></v-btn>
                </div>
              </div>
            </v-form>
          </v-sheet>
        </div>
      </div>

      <!-- 上部分页器 -->
      <div class="mdui-m-t-2 coj-clearfix">
        <div style="float: left;font-weight: bold;line-height: 36px;vertical-align: middle; color: rgb(80,80,80)">
          {{ problemCount }} 个题目，共 {{ total }} 页。
        </div>
        <COJPagination :callback="pageCallback" style="float: right" class="mdui-color-white mdui-shadow-2"
                       :total="total" :now="form.page">
        </COJPagination>
      </div>

      <!-- 题目列表 -->
      <div class="mdui-table-fluid mdui-m-t-2" style="margin-left: -1px;">
        <table class="mdui-table mdui-table-hoverable">
          <thead>
          <tr>
            <th>状态</th>
            <th>
              题号
              <button @click="sortPidAction()" :class="{'mdui-btn-active': form.sortPid!=0, 'mdui-btn-reserve': form.sortPid==2}"
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
                      :class="{'mdui-btn-active': form.sortDifficulty!=0, 'mdui-btn-reserve': form.sortDifficulty==2}"
                      class="mdui-btn mdui-btn-icon mdui-btn-dense mdui-ripple">
                <i class="mdui-icon material-icons">sort</i>
              </button>
            </th>
            <th>通过率</th>
          </tr>
          </thead>
          <tbody>
            <tr 
                v-for="item in problemList"
                :key="item.pid"
                @click="router.push('/problem/detail/'+item.pid)"
                style="cursor: pointer;"
            >
              <td>
                <i 
                    class="mdui-icon material-icons"
                    :class="'mdui-text-color-' + ProblemStatusList[item.status.status].color"
                >
                  {{ ProblemStatusList[item.status.status].icon }}
                </i>
              </td>
              <td style="color: rgb(117,117,117)">{{ item.pid }}</td>
              <td>
                <div style="font-size: 16px;font-weight: bold;" class="text-teal">{{ item.title }}</div>
                <div class="mdui-typo-caption mdui-text-color-grey" style="line-height: 14px;">{{ item.origin }}</div>
              </td>
              <td><COJTags v-show="showTag" v-model="item.tags"></COJTags></td>
              <td>
                <div v-show="showDifficulty" style="font-weight: bold;" :class="'mdui-text-color-' + DifficultyList[item.difficulty].color">
                  {{ DifficultyList[item.difficulty].title }}
                </div>
              </td>
              <td>
                {{ getNumText(item.accepted) }}/{{ getNumText(item.submitted) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 下部分页器 -->
      <div class="mdui-m-t-2 coj-clearfix">
        <COJPagination :callback="pageCallback" style="float: right" class="mdui-color-white mdui-shadow-2"
                       :total="total" :now="form.page">
        </COJPagination>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts" name="ProblemList">
/*global mdui*/
import { onUpdated, onMounted, ref, reactive, onBeforeMount } from 'vue'
import COJPagination from '@/component/coj-pagination.vue'
import { getNumText, arrayToText } from '@/utils';
import router from '@/router'
import COJTags from '@/component/COJTags.vue';
import { DifficultyList, ProblemStatusList } from '@/config/problem';
import { type ProblemQuery, type ProblemSummaryDTO } from '@/entify/problem';
import { ProblemListSize } from '@/config/index';
import { problemSearch } from "@/api/problem";
import { userAdmin } from "@/config/user";
import { useUserStore } from "@/store/user";

const userStore = useUserStore();

// 表单数据 
const form = reactive({
  tags: [] as number[],
  difficulty: [] as number[],
  key: "",
  enablePid: false,
  sortDifficulty: 0,
  sortPid: 0,
  page: 1
});

//是否正在加载
let loading = ref(false);
//总页数
let total = ref(1);
//关键字用于pid
let enablePid = ref(false);
//命中题目数量
let problemCount = ref(0);
//题目列表
let problemList = ref([] as ProblemSummaryDTO[]);
//展示
let showDifficulty = ref(false);
let showTag = ref(false);

onBeforeMount(async () => {
  // 应用url中的数据
  const _query = router.currentRoute.value.query;
  // 标签
  if(_query['tid'] != null){
    const url_tags: string[] = (<string>_query['tid']).replace(/\s+/g, '').split(',');
    for(const tag of url_tags){
      form.tags.push(Number(tag));
    }
  }
  // 难度
  if(_query['diff'] != null){
    const url_diff: string[] = (<string>_query['diff']).replace(/\s+/g, '').split(',');
    for(const tag of url_diff){
      form.difficulty.push(Number(tag));
    }
  }
  // 关键字
  if(_query['key'] != null){
    form.key = _query['key'] as string;
  }
  if(_query['pid'] != null){
    const pid = _query['pid'];
    form.enablePid = pid != '0';
  }
  // 排序
  if(_query['sortd'] != null){
    form.sortDifficulty = Number(_query['sortd']);
  }
  if(_query['sortp'] != null){
    form.sortPid = Number(_query['sortp']);
  }
  // 页号
  if(_query['page'] != null){
    form.page = Number(_query['page']);
  }
  //console.log("aaa");
  if(form.difficulty.length == 0) reverseDifficulty();
  await searchAction(false);
})

onMounted(() => {
  mdui.mutation();
})

onUpdated(() => {
  mdui.mutation();
})

function reverseDifficulty() {
  let arr: number[] = [];
  for(let i = 0; i < DifficultyList.length; i++) {
    if(!form.difficulty.includes(i)) arr.push(i);
  }
  form.difficulty = arr;
}
function allDifficulty() {
  if(form.difficulty.length == DifficultyList.length) form.difficulty = [];
  else{
    let tmp: number[] = []
    for(let i=0; i < DifficultyList.length; i++){
      tmp.push(i);
    }
    form.difficulty = tmp;
  }
}
function toggleShowDifficulty() {
  showDifficulty.value = !showDifficulty.value;
}
function toggleShowTag() {
  showTag.value = !showTag.value;
}

async function searchAction(refresh = true) {
  let index = form.page;
  if (refresh) index = 1;
  //初始参数
  const query: ProblemQuery = { index: index, count: ProblemListSize, order: 0, pid: form.enablePid? 1:0 }
  //order
  if (form.sortPid == 1) query.order = 1;
  if (form.sortPid == 2) query.order = 2;
  if (form.sortDifficulty == 1) query.order = 3;
  if (form.sortDifficulty == 2) query.order = 4;
  // 难度
  if (form.difficulty.length == 0) {
    mdui.snackbar({
      message: '至少选择一个难度。'
    });
    return;
  }
  if (form.difficulty.length != DifficultyList.length) {
    query.difficulty = arrayToText(form.difficulty);
  }
  //key
  if (form.key != '') {
    query.key = form.key;
  }
  //tag
  if (form.tags.length != 0) {
    query.tags = arrayToText(form.tags);
  }
  buildURL(query);
  loading.value = true;
  try {
    //启动请求
    const res = await problemSearch(query);
    //更新分页信息
    if (refresh) form.page = 1;
    if (res[0] == 0) total.value = 1;
    else total.value = Math.ceil(res[0] / ProblemListSize);
    problemList.value = res[1];
    problemCount.value = res[0];
    //console.log(res);
  } catch (err) {
    console.log(err)
  }

  loading.value = false;
  mdui.mutation()
}

async function sortDifficultyAction() {
  if (form.sortPid != 0) {
    form.sortPid = 0;
  }
  if (form.sortDifficulty == 0) {
    form.sortDifficulty = 1;
  } else if (form.sortDifficulty == 1) {
    form.sortDifficulty = 2;
  } else if (form.sortDifficulty == 2) {
    form.sortDifficulty = 0;
  }
  await searchAction();
}

async function sortPidAction() {
  if (form.sortDifficulty != 0) {
    form.sortDifficulty = 0;
  }
  if (form.sortPid == 0) {
    form.sortPid = 1;
  } else if (form.sortPid == 1) {
    form.sortPid = 2;
  } else if (form.sortPid == 2) {
    form.sortPid = 0;
  }

  await searchAction();
}

async function pageCallback(type:number, target:number) {
  if (type == 1) {
    form.page = 1;
  }
  if (type == 2) {
    form.page--;
  }
  if (type == 3) {
    form.page = target;
  }
  if (type == 4) {
    form.page++;
  }
  if (type == 5) {
    form.page = total.value;
  }
  await searchAction(false);
}

// 构造地址栏的地址
function buildURL(data: ProblemQuery) {
  let url = "/problem?page=" + data.index;
  if(data.tags != undefined){
    url += "&tid=" + data.tags;
  }
  if(data.difficulty != undefined){
    url += "&diff=" + data.difficulty;
  }
  //console.log(data.difficulty)
  if(data.key != undefined){
    url += "&key=" + data.key;
  }
  if(data.pid){
    url += "&pid=1";
  }
  if(data.order == 1){
    url += "&sortp=1";
  }
  if(data.order == 2){
    url += "&sortp=2";
  }
  if(data.order == 3){
    url += "&sortd=1";
  }
  if(data.order == 4){
    url += "&sortd=2";
  }
  router.push(url);
}
</script>

<style scoped>
/* 表格顶部按钮的行为 */
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
</style>