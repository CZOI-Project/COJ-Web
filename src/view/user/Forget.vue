<template>
  <div style="padding-top:50px">
    <div class="coj-main mdui-shadow-1">
      <v-row dense>
        <v-col cols="12" sm="6" style="display: flex; align-items: center" :class="{'coj-suitable2': screenWidth >= 600 && step == 1, 'coj-suitable1': screenWidth >= 600 && step == 2}">
          <div class="coj-title">
            <div>忘记密码</div>
            <div class="coj-subtitle" v-if="step == 1">使用电子邮箱来找回你的COJ账号。</div>
            <div class="coj-subtitle" v-if="step == 2">我们向你发送了一封带有验证码的电子邮件，请填写你收到的验证码。</div>
          </div>
        </v-col>
        <v-col cols="12" sm="6">
          <transition name="mainfade" mode="out-in">
            <div v-if="step == 1" key="1">
              <div class="mdui-textfield" id="email" style="margin-top: 50px">
                <label class="mdui-textfield-label">电子邮件地址</label>
                <input v-model="forgetData.email" class="mdui-textfield-input" type="email" required :disabled="loading" />
                <div class="mdui-textfield-error">邮箱格式错误</div>
              </div>
              <div class="mdui-textfield" id="pwd1">
                <label class="mdui-textfield-label">密码</label>
                <input v-model="forgetData.password" class="mdui-textfield-input" type="password" required
                  :disabled="loading" />
                <div class="mdui-textfield-error">密码不能为空</div>
              </div>
              <div class="mdui-textfield" id="pwd2">
                <label class="mdui-textfield-label">再次输入密码</label>
                <input v-model="forgetData.password_" class="mdui-textfield-input" type="password" required
                  :disabled="loading" />
                <div class="mdui-textfield-error">两次密码不一致</div>
              </div>
              <div class="coj-clearfix coj-main-right-btns">
                <COJButton class="mdui-btn mdui-color-teal mdui-ripple" style="margin-left:5px" :loading="loading"
                  @click="sendCode()">
                  <i class="mdui-icon mdui-icon-right material-icons">arrow_forward</i>
                  下一步
                </COJButton>
              </div>
            </div>
            <div v-else-if="step == 2" key="2">
              <div class="mdui-textfield" id="code" style="margin-top: 50px">
                <label class="mdui-textfield-label">验证码</label>
                <input v-model="forgetData.code" class="mdui-textfield-input" type="text" required :disabled="loading" />
                <div class="mdui-textfield-error">验证码不能为空</div>
              </div>
              <div class="coj-clearfix coj-main-right-btns">
                <button @click="step = 1" class="mdui-btn mdui-ripple" :disabled="loading">上一步</button>
                <COJButton class="mdui-color-teal mdui-ripple mdui-btn" style="margin-left:5px" :loading="loading"
                  @click="forgetAction()">
                  <i class="mdui-icon mdui-icon-right material-icons">arrow_forward</i>
                  下一步
                </COJButton>
              </div>
            </div>
          </transition>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script setup lang="ts" name="Forget">
import { onBeforeMount, onUpdated, onMounted, ref, reactive, onUnmounted } from 'vue'
import COJButton from '@/component/coj-button.vue'
import { userEmailService, userLoginService, userForgetService } from '@/api/user';
import router from '@/router';
import { useUserStore } from '@/store/user';

const userStore = useUserStore()

const screenWidth = ref(window.innerWidth);
const handleResize = () => {
  screenWidth.value = window.innerWidth;
};

onMounted(() => {
  mdui.mutation();
  window.addEventListener('resize', handleResize);
})

onUpdated(() => {
  mdui.mutation();
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});

let forgetData = reactive({
  email: "",
  code: "",
  password: "",
  password_: ""
})

const step = ref(1)
const loading = ref(false)

async function sendCode() {
  let re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  let a = document.getElementById("email");
  let b = document.getElementById("pwd1");
  let c = document.getElementById("pwd2");
  let d = false;
  if (forgetData.email == "" || !re.test(forgetData.email)) {
    if (!a.classList.contains("mdui-textfield-invalid-html5")) {
      a.classList.add("mdui-textfield-invalid-html5")
      mdui.mutation()
    }
    d = true;
  }
  if (forgetData.password == "") {
    if (!b.classList.contains("mdui-textfield-invalid-html5")) {
      b.classList.add("mdui-textfield-invalid-html5")
      mdui.mutation()
    }
    d = true;
  }
  if (forgetData.password != forgetData.password_) {
    if (!c.classList.contains("mdui-textfield-invalid-html5")) {
      c.classList.add("mdui-textfield-invalid-html5")
      mdui.mutation()
    }
    d = true;
  }
  if (d) {
    return;
  }
  loading.value = true;
  mdui.mutation();
  try {
    await userEmailService(forgetData.email);
    step.value = 2;
  } catch (err) { console.log(err) }
  loading.value = false;
}

async function forgetAction() {
  let a = document.getElementById("code");
  if (forgetData.code == "") {
    if (!a.classList.contains("mdui-textfield-invalid-html5")) {
      a.classList.add("mdui-textfield-invalid-html5")
      mdui.mutation()
    }
    return;
  }
  loading.value = true;
  mdui.mutation();

  try {
    await userForgetService(forgetData);
    //密码修改成功，该登录了
    await userLoginService(forgetData);
    mdui.snackbar({
      message: userStore.entry.name + "，您好！欢迎回来！"
    });
    if (userStore.entry.type == 1) {
      //没有验证用户需要跳到验证界面
      router.push("/user/verify")
    } else {
      router.push("/")
    }
  } catch (err) { console.log(err) }

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
