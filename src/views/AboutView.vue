<template>
  <div class="markdown-typer">
    <div v-html="typedHtml"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import MarkdownIt from 'markdown-it'

const md = new MarkdownIt()
const markdownText = `
# 打字机效果演示

这是 **Markdown-it** 与 **Vue 3** 结合的打字机效果！

> 引用

- 支持列表
- 加粗
- 代码块
`

const htmlContent = md.render(markdownText)
const typedHtml = ref('')
let index = 0

const typeWriter = () => {
  if (index < htmlContent.length) {
    typedHtml.value += htmlContent[index]
    index++
    setTimeout(typeWriter, 10) // 控制打字速度
  }
}

onMounted(() => {
  typeWriter()
})
</script>

<style scoped>
.markdown-typer {
  font-family: 'Courier New', monospace;
  white-space: pre-wrap;
  line-height: 1.6;
}
/* 引用块的样式 */
:deep(blockquote) {
  display: block;
  padding-left: 16px;
  padding-right: 16px;
  margin: 0 0 24px;
  border-left: 8px solid #dddfe4;
  background-color: #eef0f4;
  overflow: auto;
  word-break: normal;
}
</style>
