<template>
    <div class="main">
        <div class="mdui-typo-display-2">加载失败</div>
        <div class="mdui-typo-subheading mdui-m-t-1">
            可能存在的原因：
            <div class="mdui-typo">
                <ul>
                    <li>网络连接异常，请检查网络连接状况。</li>
                    <li>请求的题目、比赛、题单等资源不存在。</li>
                    <li>权限不足，无法访问目标资源。</li>
                    <li>其他异常。</li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts" name="ErrorPage">

</script>

<style scoped>
.main{
    padding: 50px;
}
</style>