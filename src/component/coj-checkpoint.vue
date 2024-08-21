<template>
  <v-tooltip :text="_props.message" :disabled="_props.message == ''">
    <template v-slot:activator="{ props }">
      <v-card
          hover
          v-bind="props"
          class="checkpoint"
          :color="CheckpointStatusList[_props.state].color"
      >
        <span class="nth" v-if="_props.state != 0 && _props.state != 1 && _props.state != 11">#{{ _props.nth }}</span>
        <i v-if="_props.state == 0" class="mdui-icon material-icons icon">access_alarms</i>
        <v-progress-circular indeterminate v-if="_props.state == 1" size="36"></v-progress-circular>
        <div v-if="_props.state != 0 && _props.state != 1" class="state" style="margin-top: -2px">
          {{ _props.state != 11 ? CheckpointStatusList[_props.state].text.toUpperCase() : '#' + _props.nth }}
          <div class="info" v-show="_props.info != ''">{{ _props.info }}</div>
        </div>
      </v-card>
    </template>
  </v-tooltip>
</template>
<script setup lang="ts" name="coj-checkpoint">
import {CheckpointStatusList} from "@/config/problem";

const _props = defineProps({
  nth: {
    type: Number,
    required: true
  },
  state: {
    type: Number,
    required: true
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
</script>
<style scoped>
.checkpoint {
  width: 95px;
  height: 95px;
  padding: 4px;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.nth {
  font-size: 12px;
  position: absolute;
  top: 2px;
  left: 7px;
}

.state {
  font-size: 20px;
  font-weight: 400;
  text-align: center;
  margin-top: 10px;
}

.info {
  font-size: 12px;
  word-wrap: break-word;
  word-break: break-all;
  line-height: 12px;
  opacity: 0.8;
}

.checkpoint .mdui-spinner {
  width: 36px;
  height: 36px;
}

.icon {
  font-size: 36px;
  color: rgba(0, 0, 0, 0.5);
}
</style>