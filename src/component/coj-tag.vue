<!--标签组件-->
<template>
    <!--将内联样式提取出来变css会出现错误，暂时不明，可能是选择器优先级问题-->
    <div @click="props.callback(props.tid)" style="display: inline-block;border-radius: 4px;padding-left: 4px;padding-right: 4px;margin: 2px" class="mdui-shadow-1 mdui-ripple" :class="color_class">
        <div style="padding-top: 4px;padding-bottom:4px;margin-right:2px;display: inline-block;font-size: 14px;"><slot></slot></div>
        <div v-if="type=='2'" style="height: 14px;width: 14px;display: inline-block;cursor: pointer;"><i class="mdui-icon material-icons" style="font-size: 14px;">close</i></div>
    </div>
</template>

<script setup lang="ts" name="coj-tag">
    import { reactive,watch,onMounted } from 'vue';
    let color_class = reactive(['mdui-color-grey-400']);
    const props = defineProps({
        type:{
            type: String,
            default: "0"
        },
        callback:{
            type: Function,
            default: ()=>{}
        },
        color:{
            type: String
        },
        tid:{
            type: Number
        }
    });
    //type=1时，为灰色 type=2时，颜色设置为color，并加入删除按钮，删除按钮按下后触发回调 type=3时同2但不加删除按钮
    onMounted(()=>{
        if(props.type=="1"){
            color_class.pop();
            color_class.push('mdui-color-grey-400');
        }else{
            color_class.pop();
            color_class.push(props.color);
        }
    })
    
    watch(props,()=>{
        if(props.type=="1"){
            color_class.pop();
            color_class.push('mdui-color-grey-400');
        }else{
            //console.log(props.color);
            color_class.pop();
            color_class.push(props.color);
        }
    })


</script>

<style scoped>
</style>