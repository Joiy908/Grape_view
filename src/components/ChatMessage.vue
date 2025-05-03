<template>
  <div :class="messageWrapperClass">
    <!-- Agent/toolcallResult 消息 -->
    <div class="messageContent" v-if="isAgentOrTool">
      <!-- toolcallResult：用 el-collapse 展示 call + markdown -->
      <el-collapse v-if="isToolcallResult" accordion>
        <el-collapse-item :title="toolResponse?.call || 'Tool Result'" name="1">
          <div v-html="renderedContent"></div>
        </el-collapse-item>
      </el-collapse>

      <!-- agent 消息：直接渲染 markdown -->
      <div v-else v-html="renderedContent"></div>
    </div>

    <!-- 用户消息 -->
    <div class="messageContent" v-else>
      {{ props.message.content }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import MarkdownIt from 'markdown-it'
import type { Message, ToolResponse } from '../types'

const props = defineProps<{ message: Message }>()
const md = new MarkdownIt({ breaks: true })

const isUser = computed(() => props.message.role === 'user')
const isToolcallResult = computed(() => props.message.role === 'toolcallResult')
const isAgentOrTool = computed(
  () => props.message.role === 'agent' || props.message.role === 'toolcallResult',
)
const toolResponse = computed(() => {
  if (isToolcallResult.value) {
    return JSON.parse(props.message.content) as ToolResponse
  }
  return null
})

// 渲染 agent/toolcallResult 消息 markdown
const renderedContent = computed(() => {
  if (props.message.role === 'toolcallResult') {
    if (toolResponse.value.success) {
      return md.render(toolResponse.value.data)
    } else {
      return md.render(toolResponse.value.message)
    }
  }
  return md.render(props.message.content)
})

// 外层 message class，决定消息方向
const messageWrapperClass = computed(() => {
  return isUser.value ? 'message message-right' : 'message message-left'
})
</script>

<style scoped>
.message {
  display: flex;
  margin: 10px 0;
  max-width: 100%;
}

.message-right {
  justify-content: flex-end;
}

.message-left {
  justify-content: flex-start;
}

.messageContent {
  max-width: 80%;
  padding: 10px 15px;
  border-radius: 10px;
  word-wrap: break-word;
  background-color: #f5f5f5;
}

/* 用户消息样式 */
.message-right .messageContent {
  background-color: #d1ecf1;
  text-align: right;
  margin-right: 10px;
}

/* Agent/toolcallResult 消息样式 */
.message-left .messageContent {
  background-color: #e8eaf6;
  text-align: left;
}

/* Markdown 样式增强 */
.messageContent h1,
.messageContent h2 {
  margin: 0.5em 0;
}
.messageContent pre {
  background: #333;
  color: #fff;
  padding: 10px;
  border-radius: 5px;
  overflow-x: auto;
}
.messageContent code {
  background: #eee;
  padding: 2px 4px;
  border-radius: 4px;
}
</style>
