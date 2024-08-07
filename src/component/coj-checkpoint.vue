<template>
  <v-tooltip :text="_props.message" :disabled="_props.message == ''">
    <template v-slot:activator="{ props }">
      <v-card
          hover
          v-bind="props"
          class="checkpoint"
          :color="getStateColor(_props.state)"
      >
        <span class="nth" v-if="_props.state != '0' && _props.state != '1' && _props.state != '11'">#{{ _props.nth }}</span>
        <i v-if="_props.state == '0'" class="mdui-icon material-icons icon">access_alarms</i>
        <v-progress-circular indeterminate v-if="_props.state == '1'" size="36"></v-progress-circular>
        <div v-if="_props.state != '0' && _props.state != '1'" class="state" style="margin-top: -2px">
          {{ _props.state != '11'? getStateText(_props.state).toUpperCase():'#'+_props.nth }}
          <div class="info" v-show="_props.info != ''">{{ _props.info }}</div>
        </div>
      </v-card>
    </template>
  </v-tooltip>
</template>
<script setup lang="ts" name="coj-checkpoint">
    import { onMounted,onUpdated } from 'vue';
    import {getStateColor, getStateText} from '@/utils';
    const _props = defineProps({
        nth: {
            type: Number
        },
        state: {
            type: String
        },
        info: {
            type: String,
            default: ""
        },
        message: {
            type: String,
            default: ""
        }
    });

    onMounted(()=>{
        mdui.mutation();
    })
    onUpdated(()=>{
        mdui.mutation();
    })
</script>
<style scoped>
.checkpoint{
    width: 95px;
    height: 95px;
    padding: 4px;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
}
.nth{
    font-size: 12px;
    position: absolute;
    top: 2px;
    left: 7px;
}
.state{
    font-size: 20px;
    font-weight: 400;
    text-align: center;
    margin-top: 10px;
}

.info{
    font-size: 12px;
    word-wrap:break-word;
    word-break:break-all;
    line-height: 12px;
    opacity: 0.8;
}

.checkpoint .mdui-spinner{
    width: 36px;
    height: 36px;
}

.icon{
    font-size: 36px;
    color: rgba(0,0,0,0.5);
}
</style>