<template>
  <v-row dense v-if="props.hide==false">
    <v-col cols="12" sm="6">
      <code-mirror
          v-model="now"
          basic
          wrap
          :lang="markdown()"
          class="limit"
          tab
      />
    </v-col>
    <v-col cols="12" sm="6">
      <div class="coj-markdown limit" v-html="html" ref="preview">
      </div>
    </v-col>
  </v-row>
  <div class="coj-markdown" v-html="html" ref="preview" v-else>
  </div>
</template>

<script setup lang="ts" name="Editor">
import CodeMirror from 'vue-codemirror6';
import {nextTick, onMounted, ref, watch} from "vue";
import {markdown} from "@codemirror/lang-markdown";
import markdownit from "markdown-it";
import markdownItKatex from 'markdown-it-katex';
import katex from 'katex';
import hljs from 'highlight.js';
import markdowntable from 'markdown-it-multimd-table'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  hide: {
    type: Boolean,
    default: false
  }
});

const md = markdownit()
    .use(markdownItKatex, katex, { autoRender: false })
    .use((md) => {
      md.options.highlight = (str, lang) => {
        // 此处判断是否有添加代码语言
        if (lang && hljs.getLanguage(lang)) {
          try {
            // 得到经过highlight.js之后的html代码
            const preCode = hljs.highlight(lang, str, true).value
            // 以换行进行分割
            const lines = preCode.split(/\n/).slice(0, -1)
            // 添加自定义行号
            let html = lines.map((item, index) => {
              return '<li><span class="line-num" data-line="' + (index + 1) + '"></span>' + (item.length == 0? ' ':item) + '</li>'
            }).join('')
            html = '<ol>' + html + '</ol>'
            // 添加代码语言
            if (lines.length) {
              html += '<b class="coj-copy" data="' + str + '">复制</b>'
            }
            return '<pre class="hljs"><code>' +
                html +
                '</code></pre>'
          } catch (__) {}
        }
        // 未添加代码语言，此处与上面同理
        const preCode = md.utils.escapeHtml(str)
        const lines = preCode.split(/\n/).slice(0, -1)
        let html = lines.map((item, index) => {
          return '<li><span class="line-num" data-line="' + (index + 1) + '"></span>' + (item.length == 0? ' ':item) + '</li>'
        }).join('')
        html = '<ol>' + html + '</ol>'
        return '<pre class="hljs"><code>' +
            html +
            '<b class="coj-copy" data="' + str + '">复制</b></code></pre>'
      };
    })
    .use(markdowntable,{
      multiline:  true,
      rowspan:    true,
      headerless: true,
      multibody:  true,
      autolabel:  true,
    });
md.renderer.rules.table_open = function (tokens, idx, options, env, self) {
  // tokens[idx] 是 table_open 的 token
  return '<div class="coj-table-container">' + self.renderToken(tokens, idx, options);
};

md.renderer.rules.table_close = function (tokens, idx, options, env, self) {
  // tokens[idx] 是 table_close 的 token
  return self.renderToken(tokens, idx, options) + '</div>';
};
const emit = defineEmits(['update:modelValue']);
const now = ref(props.modelValue);
const html = ref("");
const preview: any = ref(null);

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text).then(() => {}, err => {
    console.error('Failed to copy to clipboard: ', err);
  });
}

function addCopyHandlers() {
  const copyButtons = preview.value.querySelectorAll('.coj-copy');
  copyButtons.forEach((button: any) => {
    button.addEventListener('click', () => {
      const textToCopy = button.getAttribute("data");
      copyToClipboard(textToCopy);
      button.innerHTML = "已复制"
    });
  });
}

const forceUpdateKey = ref(0);
const debounceRenderMarkdown = (value: string) => {
  //console.log(value);
  setTimeout(() => {
    html.value = md.render(value);
    forceUpdateKey.value++;
    nextTick(addCopyHandlers);
  }, 300); // 等待 500 毫秒后再重新渲染
};

onMounted(()=>{
  //console.log("onMounted", props.modelValue);
  debounceRenderMarkdown(props.modelValue);
})

// 为编辑器模式可用
watch(now, (newValue) => {
  if(props.hide == true) return;
  emit('update:modelValue', now.value);
  debounceRenderMarkdown(newValue);
});

// 传递过来的值发生变化，为渲染模式时可用
watch(() => props.modelValue, (newValue) => {
  if(props.hide == false) return;
  //console.log('Value updated:', newValue);
  debounceRenderMarkdown(newValue);
})
</script>

<style scoped>
.limit {
  max-height: 400px;
  overflow-y: scroll;
}
</style>

<style lang="scss">
// 添加行号样式
pre.hljs {
  position: relative;
  word-break: break-all;
  white-space: break-spaces;

  ol {
    margin-top: 5px;
    margin-bottom: 5px;
    margin-left: 2em;
    padding: 0;
    padding-top: 4px;
    padding-bottom: 4px;
    border: 0.5px solid blue;
    counter-reset: item;

    li {
      list-style-type: none;
      position: relative;
      padding-left: 5px;
    }
    li:before {
      content: counter(item);
      counter-increment: item;
      position: absolute;
      left: -3.4em;
      text-align: right;
      width: 3em;
      color: rgba(0,0,0,.66)
    }
  }

  b.coj-copy {
    position: absolute;
    top: 2px;
    right:8px;
    z-index: 10;
    color: #999;
    cursor: pointer;
  }
}
</style>