<template>
  <div class="main">
    <template v-if="globalStore.error_message.detail.length > 0 && !def">
      <div class="mdui-typo-subheading">加载时出现错误</div>
      <div class="mdui-typo-display-2">{{ globalStore.error_message.detail }}</div>
    </template>
    <template v-else>
      <div class="mdui-typo-display-2">加载失败</div>
      <div class="mdui-typo-subheading mdui-m-t-1">
        可能存在的原因：
        <div class="mdui-typo">
          <ul>
            <li>网络连接异常，请检查网络连接状况。</li>
            <li>COJ内部出现了异常。</li>
            <li>其他异常。</li>
          </ul>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts" name="ErrorPage">
import {useGlobalStore} from "@/store/global";
import router from "@/router";
import {ref} from "vue";

const globalStore = useGlobalStore();
let def = ref(false);

if(router.currentRoute.value.query['default'] == '1'){
  def.value = true;
}
</script>

<style scoped>
.main {
  padding: 50px;
}
</style>