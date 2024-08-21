<template>
  <div>
    <!-- 没有标签时提示 -->
    <div v-if="!total" class="mdui-typo-caption">
      <template v-if="props.edit">
        没有选择标签，点击下方
        <i class="mdui-icon material-icons">add</i>
        可以对“算法”、“来源”等条件进行选择。
      </template>
      <template v-else>
        无标签
      </template>
    </div>
    <!-- 存在标签时 -->
    <template v-else>
      <template v-if="edit">
        <template v-for="tid in chosen" :key="tid">
          <v-chip 
              v-if="(TagsIndex.get(tid) as TagIndex).show"
              style="margin: 2px"
              :color="(TagsIndex.get(tid) as TagIndex).color"
              @click="deleteTag(tid)"
          >
            {{ (TagsIndex.get(tid) as TagIndex).name }}
          </v-chip>
        </template>
      </template>
      <template v-else>
        <template v-for="tid in chosen" :key="tid">
          <v-chip
              size="small"
              style="margin: 2px"
              :color="(TagsIndex.get(tid) as TagIndex).color"
              v-if="(TagsIndex.get(tid) as TagIndex).show"
          >
            {{ (TagsIndex.get(tid) as TagIndex).name }}
          </v-chip>
        </template>
      </template>
    </template>
    <div class="coj-clearfix" v-if="edit">
      <div style="float: right;margin-top: 20px;">
        <v-btn
            @click="clearTag()"
            prepend-icon="mdi-delete"
            :loading="loading"
            variant="flat"
        >
          清空
        </v-btn>

        <v-dialog scrollable>
          <template v-slot:activator="{ props: activatorProps }">
            <v-btn
                :disabled="loading"
                prepend-icon="mdi-plus"
                v-bind="activatorProps"
                variant="flat"
            >
              添加
            </v-btn>
          </template>

          <template v-slot:default="{ isActive }">
            <v-card title="选择标签">
              <v-tabs v-model="tab" color="teal">
                <template v-for="(g, i) in TagsList" :key="i">
                  <v-tab :value="'tab' + i" v-if="g.onTab">
                    {{ g.title }}
                  </v-tab>
                </template>
              </v-tabs>

              <v-card-text>
                <v-tabs-window v-model="tab">
                  <template v-for="(g, i) in TagsList" :key="i">
                    <v-tabs-window-item :value="'tab' + i" v-if="g.onTab">
                      <div class="mdui-typo-subheading-opacity mdui-m-b-1">已选标签</div>
                      <div class="mdui-typo-caption mdui-m-t-1" v-if="count[i] == 0">无</div>
                      <template v-else>
                        <template v-for="tid in chosen" :key="tid">
                          <v-chip
                              :color="g.color"
                              style="margin: 2px"
                              v-if="i == (TagsIndex.get(tid) as TagIndex).group"
                              @click="deleteTag(tid)"
                          >
                            {{ (TagsIndex.get(tid) as TagIndex).name }}
                          </v-chip>
                        </template>
                      </template>
                      <template v-for="group in g.groups" :key="group.title">
                        <div class="mdui-typo">
                          <hr />
                        </div>
                        <div class="mdui-typo-subheading-opacity mdui-m-b-1 mdui-m-t-2">
                          {{ group.title }}
                        </div>
                        <template v-for="tag in group.items" :key="tag.tid">
                          <v-chip 
                            :color="g.color" 
                            style="margin: 2px" 
                            v-if="chosen.includes(tag.tid)"
                            @click="deleteTag(tag.tid)"
                          >
                            {{ tag.name }}
                          </v-chip>
                          <v-chip 
                            color="grey" 
                            style="margin: 2px" 
                            v-else
                            @click="addTag(tag.tid)"
                          >
                            {{ tag.name }}
                          </v-chip>
                        </template>
                      </template>
                    </v-tabs-window-item>
                  </template>
                </v-tabs-window>
              </v-card-text>
              <template v-slot:actions>
                <v-btn
                    @click="clearTag()"
                    :loading="loading"
                >
                  清空标签
                </v-btn>
                <v-btn
                    @click="isActive.value = false"
                    :disabled="loading">
                  确定
                </v-btn>
              </template>
            </v-card>
          </template>
        </v-dialog>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup name="COJTagsSelector">
import { TagsList, TagsIndex, type TagIndex } from '@/config/tags';
import {computed, reactive, ref, watch, type ModelRef} from 'vue';
import { onMounted } from 'vue';
const tab = ref()
const props = defineProps({
  loading: {
    type: Boolean, 
    default: false
  },
  edit: {
    type: Boolean,
    default: false
  }
});
const chosen: ModelRef<number[]> = defineModel();
const emit = defineEmits(['add', 'delete']);
const count = reactive([] as number[]); // 每个组选了多少个
const total = ref(0); // 总共选了多少个 
onMounted(() => {
  //console.log(TagsIndex);
  for(let i=0; i<TagsList.length; i++){
    count.push(0);
  }
  for(let i=0; i < chosen.value.length; i++){
    let obj = TagsIndex.get(chosen.value[i]);
    if(!obj.show) continue;
    count[obj.group] ++;
    total.value ++;
  }
})
function deleteTag(tid: number){
  chosen.value = chosen.value.filter((target) => {
    return target != tid;
  });
  emit("delete", tid);
}
function addTag(tid: number){
  chosen.value.push(tid);
  emit("add", tid);
}
function clearTag(){
  const tmp = chosen.value;
  for(let i=0; i<tmp.length; i++){
    //console.log("delete", tmp[i]);
    emit("delete", tmp[i]);
  }
  chosen.value = [];
}
// 一个防止watch前后值相同的技巧
const chosenNew = computed(() => JSON.parse(JSON.stringify(chosen.value)));
watch(chosenNew, (new_v, old_v) => {
  //console.log("new_v", new_v, "old_v", old_v);
  if(new_v == old_v){
    old_v = []
  }
  //console.log("new_v", new_v, "old_v", old_v);
  //console.log("start", count);
  for(let i of old_v){
    if(!new_v.includes(i)){
      // 原来存在，现在不存在
      let obj = TagsIndex.get(i) as TagIndex;
      if(!obj.show) continue;
      count[obj.group] --;
      total.value --;
    }
  }
  for(let i of new_v){
    if(!old_v.includes(i)){
      // 现在存在，原来不存在
      let obj = TagsIndex.get(i) as TagIndex;
      if(!obj.show) continue;
      count[obj.group] ++;
      total.value ++;
    }
  }
  console.log("end", count);
},{
  deep:true
})
</script>
<style scope></style>