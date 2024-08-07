<!-- 为原始的mdui的button组件增加圆形指示器 -->
<template>
    <button :disabled="loading">
        <div class="mdui-spinner mdui-text-color-teal" style="top:4px" v-show="loading"></div>
        <slot v-if="!loading"></slot>
    </button>
</template>

<script setup lang="ts" name="COJButton">
    import {onMounted} from 'vue'
    defineProps(['loading'])
</script>

<style scoped>
</style>