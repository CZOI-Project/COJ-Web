<template>
  <div class="main" v-if="!globalStore.loading">
    <div class="mdui-typo-headline">设置</div>
    <v-card class="mdui-m-t-2">
      <v-tabs
          v-model="tab"
          color="primary"
      >
        <v-tab text="我" value="tab1"></v-tab>
      </v-tabs>

      <v-tabs-window v-model="tab">
        <v-tabs-window-item value="tab1">
          <v-card flat>
            <v-card-text>
              <div class="mdui-typo-title">头像</div>
              <v-avatar class="mdui-m-t-2" size="100">
                <v-img :src="ResourceURL + '/avatar/' + userStore.entry.uid + '.png'"></v-img>
              </v-avatar>
              <v-form ref="avatarForm">
                <v-file-input
                    class="mdui-m-t-2"
                    :rules="avatarRules"
                    accept="image/png"
                    label="选取头像"
                    placeholder="选取头像"
                    prepend-icon="mdi-camera"
                    :disabled="loading && loadingTarget == 1"
                    v-model="avatarFile"
                ></v-file-input>
              </v-form>
              <v-btn
                  color="teal"
                  append-icon="mdi-upload-outline"
                  variant="flat"
                  border="0"
                  class="mdui-m-t-1"
                  :loading="loading && loadingTarget == 1"
                  @click="updateAvatar()"
              >
                更新头像
              </v-btn>
              <div class="mdui-typo-title mdui-m-t-3">背景图片</div>
              <v-img
                  style="border-radius: 2px;"
                  width="100%"
                  height="200px"
                  cover
                  :src="ResourceURL + '/background/' + userStore.entry.uid + '.png'"
                  class="mdui-m-t-1"
              ></v-img>
              <v-form ref="backForm">
                <v-file-input
                    class="mdui-m-t-2"
                    :rules="backRules"
                    accept="image/png"
                    label="选取背景图片"
                    placeholder="选取背景图片"
                    prepend-icon="mdi-camera"
                    :disabled="loading && loadingTarget == 3"
                    v-model="backFile"
                ></v-file-input>
              </v-form>
              <v-btn
                  color="teal"
                  append-icon="mdi-upload-outline"
                  variant="flat"
                  border="0"
                  class="mdui-m-t-1"
                  :loading="loading && loadingTarget == 3"
                  @click="updateBack()"
              >
                更新背景图片
              </v-btn>
              <div class="mdui-typo mdui-m-t-1 mdui-m-b-2">
                <hr/>
              </div>
              <div class="mdui-typo-title mdui-clas">签名</div>
              <v-textarea
                  label="个人签名"
                  row-height="20"
                  rows="2"
                  variant="filled"
                  auto-grow
                  class="mdui-m-t-2"
                  :disabled="loading && loadingTarget == 2"
                  v-model="data.sign"
              ></v-textarea>
              <div class="mdui-typo-title mdui-clas">个人介绍</div>
              <COJEditor v-model="data.introduce" class="mdui-m-t-1"></COJEditor>
              <v-btn
                  color="teal"
                  variant="flat"
                  border="0"
                  class="mdui-m-t-2"
                  :loading="loading && loadingTarget == 2"
                  @click="update()"
              >
                更新
              </v-btn>
            </v-card-text>
          </v-card>
        </v-tabs-window-item>
      </v-tabs-window>
    </v-card>
  </div>
</template>

<script setup lang="ts" name="SettingView">
/* global mdui */
import {onBeforeMount, reactive, ref} from "vue";
import { useUserStore } from "@/store/user";
import { ResourceURL } from "@/config";
import { useGlobalStore } from "@/store/global";
import router from "@/router";
import type {UserDetailDTO} from "@/entify/user";
import { userAvatarUpdate, userBackgroundUpdate, userDetail, userUpdate } from "@/api/user";
import COJEditor from "@/component/coj-editor.vue";


let tab = ref();
let userStore = useUserStore();
let globalStore = useGlobalStore();
globalStore.loading = true;
let loading = ref(false);
const loadingTarget = ref(0);
const data = reactive({} as UserDetailDTO);

// let sign = ref(userStore.entry.sign);

onBeforeMount(async () => {
  try{
    Object.assign(data, await userDetail(userStore.entry.uid));
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const avatarRules = [(value: any) => {
    if(value && value.length){
      if(value[0].size < 2000000){
        return true;
      }else{
        return '头像文件大小需要小于2MB。';
      }
    }else{
      return "头像不能为空。";
    }
}];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const backRules = [(value: any) => {
  if(value && value.length){
    if(value[0].size < 2000000){
      return true;
    }else{
      return '背景图片文件大小需要小于2MB。';
    }
  }else{
    return "背景图片不能为空。";
  }
}];

const avatarFile = ref();
const avatarForm = ref()
const updateAvatar = async () => {
  console.log("aaa")
  const {valid} = await avatarForm.value.validate();
  if(!valid){
    console.log("aaddda")
    return;
  }

  loading.value = true;
  loadingTarget.value = 1;
  try{
    await userAvatarUpdate(avatarFile.value);
    mdui.snackbar({
      message: "更新成功"
    });
  }catch(err){console.log(err)}
  loading.value = false;
}

async function update(){
  loading.value = true;
  loadingTarget.value = 2;
  try{
    await userUpdate(data.sign, data.introduce);
    mdui.snackbar({
      message: "更新成功"
    });
  }catch(err){console.log(err)}
  loading.value = false;
}

const backForm = ref();
const backFile = ref();
async function updateBack(){
  const {valid} = await backForm.value.validate();
  if(!valid){
    return;
  }
  loading.value = true;
  loadingTarget.value = 3;
  try{
    await userBackgroundUpdate(backFile.value);
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
</style>