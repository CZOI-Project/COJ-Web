<template>
  <div style="padding-top:50px">
    <div class="coj-main mdui-shadow-1">
      <v-row>
        <v-col cols="12" sm="6" style="display: flex; align-items: center;" :class="{'coj-suitable1': screenWidth >= 600}">
          <div class="coj-title">
            登录
            <div class="coj-subtitle">使用电子邮箱登录后可查看COJ的内容。</div>
          </div>
        </v-col>
        <v-col cols="12" sm="6">
          <button @click="router.push('/user/forget')" class="mdui-btn mdui-ripple"
                style="position: relative;left:calc(100% - 90px);top:0px;" :disabled="loading">忘记密码
          </button>
          <v-sheet class="mdui-m-t-5">
            <v-form ref="form" @submit.prevent="loginAction()">
              <v-text-field
                  v-model="loginData.email"
                  :rules="validEmail"
                  label="邮件地址"
                  required
                  :disabled="loading"
              ></v-text-field>
              <v-text-field
                  class="mdui-m-t-1"
                  v-model="loginData.password"
                  :rules="validText"
                  label="密码"
                  required
                  type="password"
                  :disabled="loading"
              ></v-text-field>
              <div class="coj-clearfix coj-main-right-btns">
                <v-btn
                    @click="router.push('/user/register')"
                    variant="flat"
                    border="0"
                    :disabled="loading"
                >
                  创建账号
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
                  登录
                </v-btn>
              </div>
            </v-form>
          </v-sheet>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script setup lang="ts" name="UserLoginView">
/* global mdui */
import { ref, reactive, onMounted, onUnmounted, Ref } from 'vue'
import { userLogin } from '@/api/user';
import router from '@/router';
import { useUserStore } from '@/store/user';
import { userPassVerify } from '@/config/user';

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

const userStore = useUserStore()

let loginData = reactive({
  email: "",
  password: ""
})

let loading = ref(false);

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

let form: Ref = ref(null)
async function loginAction() {
  const {valid} = await form.value.validate();
  if(!valid){
    return;
  }
  loading.value = !loading.value
  //当出现错误时抛出异常，后面的代码不再执行，使用try-catch处理
  try {
    await userLogin(loginData.email, loginData.password);
    if(userPassVerify(userStore.entry)){
      mdui.snackbar({
        message: userStore.entry.name + "，您好！欢迎回来！"
      })
      router.push("/");
    }else{
      //没有验证用户需要跳到验证界面
      router.push("/user/verify")
    }
  } catch (err) {
    console.log(err)
  }
  loading.value = !loading.value
}
</script>

<style scoped>
.coj-main {
  background-color: white;
  border-radius: 20px;
  margin: 0 auto;
  padding: 50px;
  overflow: hidden;
  max-width: 780px;
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
  margin-top: 10px;
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
</style>