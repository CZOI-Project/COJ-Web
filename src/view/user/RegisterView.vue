<template>
  <div style="padding-top:50px">
    <div class="coj-main mdui-shadow-1">
      <v-row>
        <v-col cols="12" sm="6" style="display: flex; align-items: center;" :class="{'coj-suitable2': screenWidth >= 600 && step == 1, 'coj-suitable06': screenWidth >= 600 && step == 2}">
          <div class="coj-title">
            创建账号
            <div class="coj-subtitle" v-if="step == 1">使用电子邮箱来创建你的COJ账号。</div>
            <div class="coj-subtitle" v-if="step == 2">我们向你发送了一封带有验证码的电子邮件，请填写你收到的验证码。</div>
          </div>
        </v-col>
        <v-col cols="12" sm="6">
          <transition name="mainfade" mode="out-in">
            <div v-if="step == 1" key="1">
              <v-sheet class="mdui-m-t-5">
                <v-form ref="form" @submit.prevent="sendCode()">
                  <v-text-field
                      v-model="registerData.email"
                      :rules="validEmail"
                      label="邮件地址"
                      required
                      :disabled="loading"
                  ></v-text-field>
                  <v-text-field
                      class="mdui-m-t-1"
                      v-model="registerData.password"
                      :rules="validText"
                      label="密码"
                      required
                      type="password"
                      :disabled="loading"
                  ></v-text-field>
                  <v-text-field
                      class="mdui-m-t-1"
                      v-model="registerData.password_"
                      :rules="validTextAgain"
                      label="再次输入密码"
                      required
                      type="password"
                      :disabled="loading"
                  ></v-text-field>
                  <div class="coj-clearfix coj-main-right-btns">
                    <v-btn
                        @click="router.push('/user/login')" 
                        variant="flat"
                        border="0" 
                        :disabled="loading"
                    >
                      已有账号
                    </v-btn>
                    <v-btn
                        color="teal"
                        append-icon="mdi-send"
                        variant="flat"
                        border="0"
                        class="mdui-m-l-1"
                        :loading="loading"
                        type="submit"
                    >
                      发送验证码
                    </v-btn>
                  </div>
                </v-form>
              </v-sheet>
            </div>
            <div v-else-if="step == 2" key="2">
              <v-sheet class="mdui-m-t-3">
                <v-form ref="form1" @submit.prevent="registerAction()">
                  <v-text-field
                      v-model="registerData.code"
                      :rules="validCode"
                      label="验证码"
                      required
                      :disabled="loading"
                  ></v-text-field>
                  <div class="coj-clearfix coj-main-right-btns">
                    <v-btn
                        @click="step=1"
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
                        class="mdui-m-l-1"
                        :loading="loading"
                        type="submit"
                    >
                      下一步
                    </v-btn>
                  </div>
                </v-form>
              </v-sheet>
            </div>
          </transition>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script setup lang="ts" name="UserRegisterView">
import { ref, reactive, onMounted, onUnmounted, type Ref} from 'vue'
import { userSendEmail, userRegister, userLogin } from '@/api/user';
import router from '@/router';

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


let registerData = reactive({
  email: "",
  code: "",
  password: "",
  password_: ""
})

const step = ref(1)
const loading = ref(false)

const validEmail = [(email: string) => {
  if(email == ""){
    return "邮件地址不能为空。"
  }
  let re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if(!re.test(email)){
    return "邮件地址格式不正确。"
  }
  return true;
}]
const validText = [(text: string) => {
  if(text == ""){
    return "密码不能为空。"
  }
  return true;
}]
const validCode = [(text: string) => {
  if(text == ""){
    return "验证码不能为空"
  }
  return true;
}]
const validTextAgain = [(text: string) => {
  if(text == ""){
    return "密码不能为空。"
  }
  if(registerData.password_ != registerData.password){
    return "两次输入的密码不正确。"
  }
  return true;
}]

let form:Ref = ref(null)
async function sendCode() {
  const {valid} = await form.value.validate();
  if(!valid){
    return;
  }
  loading.value = true;
  try {
    await userSendEmail(registerData.email);
    step.value = 2;
  } catch (err) {
    console.log(err)
  }
  loading.value = false;
}

let form1:Ref = ref(null)
async function registerAction() {
  const {valid} = await form1.value.validate();
  if(!valid){
    return;
  }
  loading.value = true;
  try {
    await userRegister(registerData.email, registerData.password, registerData.code);
    // 然后登录，之后跳到验证页
    await userLogin(registerData.email, registerData.password);
    router.push("/user/verify");
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
