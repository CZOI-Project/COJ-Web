<template>
  <div>
    <div class="main">
      <div class="mdui-typo-headline">状态信息</div>
      <v-row dense class="mdui-m-t-2">
        <v-col cols="12" sm="6" v-for="(judger, index) in data">
          <v-card>
            <v-card-item :title="judger.name">
              <template v-slot:subtitle>
                上次更新：{{ getTimeText(judger.updateTime) }}前
              </template>
            </v-card-item>

            <div class="py-3">
              <v-list-item
                  density="compact"
                  prepend-icon="mdi-identifier"
              >
                <v-list-item-title>JID</v-list-item-title>
                <v-list-item-subtitle>{{ judger.jid }}</v-list-item-subtitle>
              </v-list-item>
              <v-list-item
                  density="compact"
                  prepend-icon="mdi-timer"
              >
                <v-list-item-title>上次更新时间</v-list-item-title>
                <v-list-item-subtitle>{{ judger.updateTime }}</v-list-item-subtitle>
              </v-list-item>
              <v-list-item
                  density="compact"
                  prepend-icon="mdi-account-multiple"
              >
                <v-list-item-title>已注册robot数量</v-list-item-title>
                <v-list-item-subtitle>{{ judger.robots.length }}</v-list-item-subtitle>
              </v-list-item>
            </div>
            <v-divider></v-divider>
            <v-card-actions>
              <v-btn
                  v-if="userStore.entry.type >= 3"
                  color="teal"
                  prepend-icon="mdi-plus"
                  text="添加Robot"
                  @click="add(judger.jid)"
              ></v-btn>
              <v-btn
                  v-if="userStore.entry.type >= 3"
                  color="teal"
                  prepend-icon="mdi-playlist-edit"
                  text="Robot列表"
                  @click="show(index)"
              ></v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </div>
    <v-dialog style="max-width:500px" v-model="show_1" persistent>
      <v-card :title="'添加Robot - '+form.jid">
        <v-card-text>
          <v-sheet>
            <v-form ref="form1">
              <v-text-field
                  v-model="form.username"
                  :rules="validUsername"
                  label="用户名"
                  required
                  :disabled="loading"
              ></v-text-field>
              <v-text-field
                  class="mdui-m-t-1"
                  v-model="form.password"
                  :rules="validPassword"
                  label="密码"
                  required
                  type="password"
                  :disabled="loading"
              ></v-text-field>
            </v-form>
          </v-sheet>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
              text="取消"
              @click="show_1 = false"
              :disabled="loading"
          ></v-btn>
          <v-btn
              text="添加"
              :loading="loading"
              @click="add_action()"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog style="max-width:500px" v-model="show_2" persistent>
      <v-card :title="'需要验证 - '+form.username">
        <v-card-text>
          <v-sheet>
            <img :src="code_url" @click="refresh_code()"/>
            <v-form ref="form2">
              <v-text-field
                  v-model="form.code"
                  :rules="validCode"
                  label="验证码"
                  required
                  :disabled="loading"
              ></v-text-field>
            </v-form>
          </v-sheet>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
              text="取消"
              :disabled="loading"
              @click="cancel_verify()"
          ></v-btn>
          <v-btn
              text="提交"
              :loading="loading"
              @click="verify_action()"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog style="max-width:400px" v-model="show_3" persistent>
      <v-card title="真的要删除吗？">
        <v-card-text>
          您将要删除{{ form.username }} - {{ form.uuid }}，删除后无法恢复。
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
              text="取消"
              @click="show_3 = false"
              :disabled="loading"
          ></v-btn>
          <v-btn
              text="提交"
              :loading="loading"
              @click="delete_action()"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="show_4">
      <v-card :title="'Robot列表 - ' + data[select].name">
        <div class="mdui-table-fluid mdui-shadow-0"
             style="border: 0;border-top: 1px solid rgba(0, 0, 0, 0.12);">
          <table class="mdui-table mdui-table-hoverable">
            <thead>
            <tr>
              <th>#</th>
              <th>用户名</th>
              <th>UUID</th>
              <th style="min-width: 100px">状态</th>
              <th v-show="userStore.entry.type>=3">操作</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(robot,index2) in data[select].robots">
              <td>{{ index2 + 1 }}</td>
              <td>{{ robot.username }}</td>
              <td>{{ robot.uuid }}</td>
              <td style="min-width: 50px">{{ getRobotStatusText(robot.status) }}</td>
              <td v-show="userStore.entry.type>=3">
                <button @click="remove(data[select].jid,robot.uuid)"
                        class="mdui-btn mdui-btn-icon mdui-btn-dense mdui-ripple">
                  <i class="mdui-icon material-icons">delete</i>
                </button>
              </td>
            </tr>
            </tbody>
          </table>
        </div>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
              text="取消"
              @click="show_4 = false"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts" name="State">
import {onMounted, onUpdated, reactive, ref, onUnmounted} from 'vue';
import {useUserStore} from '@/store/user';
import {getRobotStatusText, getTimeText} from '@/utils';
import router from '@/router';
import request from '@/api'
import {toGetParams} from '@/utils';
import type {Judger} from "@/entry";
import {COJConfig} from "@/config";
import {cancel_subscribe, connect, subscribe} from "@/api/ws";

const userStore = useUserStore()
let data = reactive([] as Judger[])

let loading = ref(false)
let show_1 = ref(false)
let show_2 = ref(false)
let show_3 = ref(false)
let show_4 = ref(false)
let select = ref(0)

async function refresh() {
  try {
    Object.assign(data, await request.get('/robot/list'));
  } catch (err) {
    console.log(err);
    router.push("/error")
  }
}

const validUsername = [(text: string) => {
  if(text == ""){
    return "用户名不能为空。"
  }
  return true;
}]
const validPassword = [(text: string) => {
  if(text == ""){
    return "密码不能为空。"
  }
  return true;
}]
const validCode = [(text: string) => {
  if(text == ""){
    return "验证码不能为空。"
  }
  return true;
}]

onMounted(async () => {
  mdui.mutation();
  await refresh();
  await connect();
  subscribe("robot", "",(obj: any) => {
    let flag = false;
    for(let i = 0; i < data.length; i++) {
      if(data[i].jid == obj.data.jid){
        flag = true;
        data[i] = obj.data;
        break;
      }
    }
    if(!flag){
      data.push(obj.data);
    }
    //console.log(data);
  });
})

onUnmounted(() => {
  cancel_subscribe("robot", "");
})

onUpdated(() => {
  mdui.mutation();
})

let form = reactive({
  option: 1,
  jid: "",
  username: "",
  password: "",
  uuid: "",
  code: ""
});

let code_url = ref('');

async function add(jid: string) {
  form.jid = jid;
  show_1.value = true;
}
async function remove(jid: string, uuid: string) {
  form.jid = jid;
  form.uuid = uuid;
  show_3.value = true;
}
async function show(index: number) {
  select.value = index
  show_4.value = true;
}
async function refresh_code() {
  loading.value = true;
  try {
    form.option = 2;
    let data: any = await request.get("/robot/create", toGetParams(form));
    code_url.value = data.img;
  }catch(err){console.log(err)}
  loading.value = false;
}

async function delete_action() {
  loading.value = true;
  try {
    await request.get("/robot/delete", toGetParams(form));
    await refresh();
    show_3.value = false;
  } catch (err) {
    console.log(err)
  }
  loading.value = false;
}

let form1:any = ref(null)
async function add_action() {
  const {valid} = await form1.value.validate();
  if(!valid){
    return;
  }

  loading.value = true;
  try {
    // 创建得到robot实体
    form.option = 1;
    let data1: any = await request.get("/robot/create", toGetParams(form));
    // 再次请求
    form.uuid = data1.uuid;
    form.option = 2;
    let data2: any = await request.get("/robot/create", toGetParams(form));
    if (data2.img == undefined) {
      await refresh();
      mdui.snackbar({
        message: '创建成功。'
      });
      show_1.value = false;
    } else {
      code_url.value = data2.img;
      show_1.value = false;
      show_2.value = true;
    }
  } catch (err) {
    console.log(err)
  }
  loading.value = false;
}

async function cancel_verify() {
  try {
    await request.get("/robot/delete", toGetParams(form));
  } catch (err) {
    console.log(err)
  }
  show_2.value = false;
}

let form2:any = ref(null)
async function verify_action() {
  const {valid} = await form2.value.validate();
  if(!valid){
    return;
  }
  loading.value = true;
  try {
    form.option = 3;
    await request.get("/robot/create", toGetParams(form));
    await refresh();
    mdui.snackbar({
      message: '创建成功。'
    });
    show_2.value = false;
  } catch (err) {
    await refresh_code();
    console.log(err)
  }
  loading.value = false;
}
</script>

<style scoped>
.main {
  padding-top: 10px;
  padding-left: 5px;
  padding-right: 5px;
}

.title {
  font-size: 15px;
  font-weight: bold;
  line-height: 35px;
}

</style>