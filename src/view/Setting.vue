<template>
  <div class="main">
    <div class="mdui-typo-headline">设置</div>
    <v-card class="mdui-m-t-2">
      <div style="display: flex">
        <v-tabs
            v-model="tab"
            color="primary"
            direction="vertical"
        >
          <v-tab prepend-icon="mdi-account" text="我" value="tab1"></v-tab>
          <v-tab prepend-icon="mdi-lock" text="Option 2" value="tab2"></v-tab>
          <v-tab prepend-icon="mdi-access-point" text="Option 3" value="tab3"></v-tab>
        </v-tabs>

        <v-tabs-window v-model="tab" style="flex: 1">
          <v-tabs-window-item value="tab1">
            <v-card flat>
              <v-card-text>
                <div class="mdui-typo-title">头像设置</div>
                <v-avatar class="mdui-m-t-2" size="100">
                  <v-img :src="COJConfig.resourceURL + '/avatar/' + userStore.entry.uid + '.png'"></v-img>
                </v-avatar>
                <v-file-input
                    class="mdui-m-t-2"
                    :rules="avatarRules"
                    accept="image/png"
                    label="选取头像"
                    placeholder="选取头像"
                    prepend-icon="mdi-camera"
                    ref="file"
                ></v-file-input>
                <v-btn
                    color="teal"
                    append-icon="mdi-upload-outline"
                    variant="flat"
                    border="0"
                    class="mdui-m-t-1"
                    :loading="loading"
                    @click="updateAvatar()"
                >
                  更新头像
                </v-btn>
                <div class="mdui-typo mdui-m-t-1 mdui-m-b-2">
                  <hr/>
                </div>
                <v-sheet class="mdui-m-t-5">
                  <v-form ref="form">
                    <div class="mdui-typo-title mdui-clas">签名</div>

                  </v-form>
                </v-sheet>
                <div class="mdui-typo-title">Title</div>
              </v-card-text>
            </v-card>
          </v-tabs-window-item>

          <v-tabs-window-item value="tab2">
            <v-card flat>
              <v-card-text>
                <p>
                  Morbi nec metus. Suspendisse faucibus, nunc et pellentesque egestas, lacus ante convallis tellus, vitae iaculis lacus elit id tortor. Sed mollis, eros et ultrices tempus, mauris ipsum aliquam libero, non adipiscing dolor urna a orci. Curabitur ligula sapien, tincidunt non, euismod vitae, posuere imperdiet, leo. Nunc sed turpis.
                </p>

                <p>
                  Suspendisse feugiat. Suspendisse faucibus, nunc et pellentesque egestas, lacus ante convallis tellus, vitae iaculis lacus elit id tortor. Proin viverra, ligula sit amet ultrices semper, ligula arcu tristique sapien, a accumsan nisi mauris ac eros. In hac habitasse platea dictumst. Fusce ac felis sit amet ligula pharetra condimentum.
                </p>

                <p>
                  Sed consequat, leo eget bibendum sodales, augue velit cursus nunc, quis gravida magna mi a libero. Nam commodo suscipit quam. In consectetuer turpis ut velit. Sed cursus turpis vitae tortor. Aliquam eu nunc.
                </p>

                <p>
                  Etiam ut purus mattis mauris sodales aliquam. Ut varius tincidunt libero. Aenean viverra rhoncus pede. Duis leo. Fusce fermentum odio nec arcu.
                </p>

                <p class="mb-0">
                  Donec venenatis vulputate lorem. Aenean viverra rhoncus pede. In dui magna, posuere eget, vestibulum et, tempor auctor, justo. Fusce commodo aliquam arcu. Suspendisse enim turpis, dictum sed, iaculis a, condimentum nec, nisi.
                </p>
              </v-card-text>
            </v-card>
          </v-tabs-window-item>

          <v-tabs-window-item value="tab3">
            <v-card flat>
              <v-card-text>
                <p>
                  Fusce a quam. Phasellus nec sem in justo pellentesque facilisis. Nam eget dui. Proin viverra, ligula sit amet ultrices semper, ligula arcu tristique sapien, a accumsan nisi mauris ac eros. In dui magna, posuere eget, vestibulum et, tempor auctor, justo.
                </p>

                <p class="mb-0">
                  Cras sagittis. Phasellus nec sem in justo pellentesque facilisis. Proin sapien ipsum, porta a, auctor quis, euismod ut, mi. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nam at tortor in tellus interdum sagittis.
                </p>
              </v-card-text>
            </v-card>
          </v-tabs-window-item>
        </v-tabs-window>
      </div>
    </v-card>
  </div>
</template>

<script setup lang="ts" name="Setting">
import {ref,reactive} from "vue";
import {COJConfig} from "@/config";
import {useUserStore} from "@/store/user";

let tab = ref();
let userStore = useUserStore();
let loading = ref(false);
let sign = ref(userStore.entry.sign);

const avatarRules = [(value: any) => {
    if(value && value.length){
      if(value[0].size < 2000000){
        return true;
      }else{
        return '头像文件大小需要小于2MB。';
      }
    }else{
      return "头像不能为空。";
    }
}];

let file: any = ref();
const updateAvatar = async () => {
  const {valid} = await file.value.validate();
  if(!valid){
    return;
  }

}

</script>

<style scoped>
.main {
  padding-top: 10px;
  padding-left: 5px;
  padding-right: 5px;
}
</style>