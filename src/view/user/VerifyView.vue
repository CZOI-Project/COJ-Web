<template>
  <div style="padding-top:50px">
    <Transition name="mainfade" mode="out-in">
      <div class="coj-main mdui-shadow-1" v-if="step == 1">
        <v-row>
          <v-col cols="12" sm="6" style="display: flex; align-items: center;" :class="{'coj-suitable1': screenWidth >= 600}">
            <div class="coj-title">
              身份认证
              <div class="coj-subtitle">你需要对你的账号进行身份认证才能继续使用COJ。请选择认证方式进行认证。</div>
            </div>
          </v-col>
          <v-col col="12" sm="6">
            <ul class="mdui-list">
              <li class="mdui-list-item mdui-ripple" :class="{ 'mdui-list-item-active': type == 1 }" @click="type = 1">
                <div class="mdui-list-item-content">
                  <div class="mdui-list-item-title mdui-list-item-one-line">快速身份认证</div>
                  <div class="mdui-list-item-text">
                    对于往届学生，COJ可以通过确认你洛谷账号的所有权，自动完成对你的身份认证。认证完毕后将自动导入你的信息。
                  </div>
                </div>
              </li>
              <li class="mdui-list-item mdui-ripple" :class="{ 'mdui-list-item-active': type == 2 }" @click="type = 2">
                <div class="mdui-list-item-content">
                  <div class="mdui-list-item-title mdui-list-item-one-line">普通身份认证</div>
                  <div class="mdui-list-item-text">
                    你还可以通过给定的邀请码来完成身份认证。
                  </div>
                </div>
              </li>
            </ul>
            <div class="coj-clearfix coj-main-right-btns">
              <v-btn 
                  color="teal" 
                  append-icon="mdi-arrow-right" 
                  variant="flat" 
                  border="0" 
                  :loading="loading"
                  @click="verifyAction()"
              >
                下一步
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </div>
      <div class="coj-main mdui-shadow-1" style="padding: 20px" v-else-if="step == 2">
        <button class="mdui-btn mdui-btn-icon" @click="step = 1">
          <i class="mdui-icon material-icons">arrow_back</i>
        </button>
        <span style="font-weight: bold;margin-left: 5px;">快速身份验证</span>
        <div style="margin-top: 20px;margin-left: 30px;margin-right: 30px;">
          <span>① 选择你的个人信息</span>
          <div class="mdui-typo-caption" style="margin-top:5px">
            如果你的信息无法在下方列表中找到，则可能是你的信息没有被录入，或者已经完成验证。有问题请联系COJ管理员。
          </div>
          <ul class="mdui-list mdui-list-dense">
            <li v-for="item in list" class="mdui-list-item mdui-ripple" @click="choose(item.id)" :key="item.id">
              <div class="mdui-list-item-avatar">
                <img :src="'https://cdn.luogu.com.cn/upload/usericon/' + item.target + '.png'" />
              </div>
              <div class="mdui-list-item-content">
                <div class="mdui-list-item-title">{{ item.name }}</div>
                <div class="mdui-list-item-text mdui-list-item-one-line">
                  {{ item.year }}年入学
                </div>
              </div>
            </li>
            <li class="mdui-divider-inset mdui-m-y-0"></li>
          </ul>
        </div>
      </div>
      <div class="coj-main mdui-shadow-1" v-else-if="step == 3">
        <v-row dense>
          <v-col cols="12" sm="6" style="display: flex; align-items: center;" :class="{'coj-suitable1': screenWidth >= 600}">
            <div class="coj-title">
              普通身份认证
              <div class="coj-subtitle">填写你的真实姓名及邀请码完成验证。</div>
            </div>
          </v-col>
          <v-col cols="12" sm="6">
            <v-sheet class="mdui-m-t-3">
              <v-form ref="form" @submit.prevent="normalVerify()">
                <v-text-field 
                    v-model="name" 
                    :rules="validName" 
                    label="真实姓名" 
                    required 
                    :disabled="loading"
                ></v-text-field>
                <v-text-field 
                    v-model="code" 
                    :rules="validCode" 
                    class="mdui-m-t-1" 
                    label="邀请码" 
                    required
                    :disabled="loading"
                ></v-text-field>
                <div class="coj-clearfix coj-main-right-btns">
                  <v-btn 
                      @click="step = 1" 
                      :disabled="loading"
                      variant="flat" 
                      border="0" 
                  >
                    上一步
                  </v-btn>
                  <v-btn 
                      color="teal" 
                      append-icon="mdi-arrow-right" 
                      variant="flat" 
                      border="0" 
                      :loading="loading"
                      class="mdui-m-l-1" 
                      type="submit"
                  >
                    验证
                  </v-btn>
                </div>
              </v-form>
            </v-sheet>
          </v-col>
        </v-row>
      </div>
      <div class="coj-main mdui-shadow-1" style="padding: 20px" v-else-if="step == 4">
        <button class="mdui-btn mdui-btn-icon" @click="step = 2">
          <i class="mdui-icon material-icons">arrow_back</i>
        </button>
        <span style="font-weight: bold;margin-left: 5px;">快速身份验证</span>
        <div style="margin-top: 20px;margin-left: 30px;margin-right: 30px;">
          <span>② 验证你的身份</span>
          <div class="mdui-typo-caption" style="margin-top:5px">
            登录洛谷，进入个人主页，点击个人介绍旁边的“编辑”，在个人介绍的最前方加入下方给出的校验码，注意校验码前面不能存在空格等字符，然后点击“保存”。确认无误后回到本界面，点击“验证”按钮，完成身份认证。
          </div>
          <div style="text-align: center;margin-top: 40px;">
            <div class="mdui-typo-title">校验码</div>
            <div class="mdui-typo-title mdui-text-color-red" style="margin-top:10px">{{ code }}</div>
          </div>
        </div>
        <div class="coj-clearfix coj-main-right-btns">
          <v-btn 
              color="teal" 
              append-icon="mdi-arrow-right" 
              variant="flat" 
              border="0" 
              :loading="loading"
              @click="quickVerify()"
          >
            验证
          </v-btn>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts" name="UserVerifyView">
/* global mdui */
import { onMounted, onUnmounted, reactive, type Ref, ref } from 'vue'
import { useUserStore } from '@/store/user';
import router from '@/router';
import { VerifyDTO } from '@/entify/user';
import { userGetVerifyList, userQuickVerify, userQuickVerifyGetCode, userVerify } from '@/api/user';

const userStore = useUserStore()

const screenWidth = ref(window.innerWidth);
const handleResize = () => {
  screenWidth.value = window.innerWidth;
};

onMounted(() => {
  window.addEventListener('resize', handleResize);
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});

let loading = ref(false);
let step = ref(1);
let type = ref(1);
let list = reactive([] as VerifyDTO[]);
let target_id = ref();
let code = ref('');
let name = ref('');

const validName = [(text: string) => {
  if (text == "") {
    return "真实姓名不能为空。"
  }
  return true;
}]
const validCode = [(text: string) => {
  if (text == "") {
    return "邀请码不能为空。"
  }
  return true;
}]

async function verifyAction() {
  if (type.value == 1) {
    loading.value = true;
    try {
      list = await userGetVerifyList();
    } catch (err) {
      console.log(err)
    }
    loading.value = false;
    step.value = 2;
  } else {
    step.value = 3;
  }
}
async function choose(target: number) {
  code.value = await userQuickVerifyGetCode(target);
  step.value = 4;
  target_id.value = target;
}
async function quickVerify() {
  loading.value = true;
  try {
    await userQuickVerify(target_id.value)
    mdui.snackbar({
      message: userStore.entry.name + "，您好！欢迎回来！"
    });
    //然后跳到主页
    router.push("/")
  } catch (err) {
    console.log(err)
  }
  loading.value = false;
}

let form:Ref = ref(null)
async function normalVerify() {
  const { valid } = await form.value.validate();
  if (!valid) {
    return;
  }

  loading.value = true;
  try {
    await userVerify(code.value, name.value);
    mdui.snackbar({
      message: userStore.entry.name + "，您好！欢迎回来！"
    });
    //然后跳到主页
    router.push("/")
  } catch (err) {
    console.log(err)
  }
  loading.value = false;
}
</script>

<style scoped>
.coj-main {
  max-width: 780px;
  background-color: white;
  border-radius: 20px;
  margin: 0 auto;
  padding: 0px;
  padding: 50px;
  overflow: hidden;
}

.coj-title {
  font-size: 40px;
}

.coj-main-left {
  box-sizing: border-box;
  padding-top: 70px;
  padding-right: 10px;
  width: 50%;
  float: left;
  overflow: visible;
}

.coj-main-right {
  width: 50%;
  float: right;
}

.coj-subtitle {
  margin-top: 20px;
  font-size: 16px;
}

.coj-clearfix::after {
  content: '';
  display: block;
  clear: both;
}

.coj-main-right-btns {
  float: right;
  margin-top: 60px;
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