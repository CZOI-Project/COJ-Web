<!-- 小型分页器 -->
<template>
  <div>
    <div class="mdui-btn-group">
      <button type="button" class="mdui-btn" :disabled="props.now == 1" @click="props.callback(1,null)">
        <i class="mdui-icon material-icons">first_page</i>
      </button>
      <button type="button" class="mdui-btn" :disabled="props.now == 1" @click="props.callback(2,null)">
        <i class="mdui-icon material-icons">keyboard_arrow_left</i>
      </button>
      <button
          v-for="i in range(l,r)"
          type="button"
          class="mdui-btn"
          :class="{'mdui-btn-active': i == props.now}"
          @click="props.callback(3,i)"
          :key="i"
      >
        {{ i }}
      </button>
      <button type="button" class="mdui-btn" :disabled="props.now == props.total" @click="props.callback(4,null)">
        <i class="mdui-icon material-icons">keyboard_arrow_right</i>
      </button>
      <button type="button" class="mdui-btn" :disabled="props.now == props.total" @click="props.callback(5,null)">
        <i class="mdui-icon material-icons">last_page</i>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts" name="coj-pagination">
import {onMounted, watch, onUnmounted, ref} from 'vue'

const props = defineProps({
  total: {
    type: Number,
    required: true
  },
  now: {
    type: Number,
    required: true
  },
  callback: {
    type: Function,
    default: () => {
    }
  }
})

//最多允许的按钮数量
let maxn = ref(0);
//页数的区间范围
let l = ref(0);
let r = ref(0);


// 7 3 1 3
// 6 3 1 2
function update() {
  if (maxn.value >= props.total) {
    l.value = 1;
    r.value = props.total;
    return;
  }
  //都这里保证能撑开
  let p = Math.floor(maxn.value / 2);
  //先计算理想情况
  if (maxn.value % 2 == 0) {
    l.value = props.now - p + 1;
    r.value = props.now + p;
  } else {
    l.value = props.now - p;
    r.value = props.now + p;
  }
  //边界触碰情况
  if (l.value < 1) {
    l.value = 1;
    r.value = maxn.value;
  }
  if (r.value > props.total) {
    r.value = props.total;
    l.value = props.total - maxn.value + 1;
  }
}

let resizeCallback = () => {
  if (document.body.clientWidth <= 422) {
    maxn.value = 1;
  }
  if (document.body.clientWidth > 422) {
    maxn.value = 2;
  }
  if (document.body.clientWidth > 488) {
    maxn.value = 3;
  }
  if (document.body.clientWidth >= 522) {
    maxn.value = 4;
  }
  if (document.body.clientWidth >= 560) {
    maxn.value = 5;
  }
  if (document.body.clientWidth >= 600) {
    maxn.value = 6;
  }
  if (document.body.clientWidth >= 636) {
    maxn.value = 7;
  }
  if (document.body.clientWidth >= 672) {
    maxn.value = 8;
  }
  update();
}

onMounted(() => {
  window.addEventListener("resize", resizeCallback);
  resizeCallback();
})

onUnmounted(() => {
  window.removeEventListener("resize", resizeCallback);
})

watch(props, () => {
  update();
  //console.log(props.now);
})

function range(l: number, r: number) {
  let res = [];
  for (let i = l; i <= r; i++) res.push(i);
  return res;
}

</script>

<style scoped>
.mdui-btn-group .mdui-btn {
  padding: 0 0 !important;
  min-width: 36px;
}
</style>