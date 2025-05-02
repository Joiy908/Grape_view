<template>
  <div :class="messageClass">
    <div :class="avatarClass">
      <i :class="avatarIconClass"></i>
    </div>
    <!-- 用 v-html 渲染 agent 消息 -->
    <div class="messageContent" v-if="isAgent" v-html="renderedContent"></div>
    <!-- 用户消息仍使用纯文本 -->
    <div class="messageContent" v-else>
      {{ props.message.content }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import MarkdownIt from 'markdown-it'

interface Message {
  role: 'user' | 'agent'
  content: string
}

const props = defineProps<{ message: Message }>()
const md = new MarkdownIt()

const isAgent = computed(() => props.message.role === 'agent')

const messageClass = computed(() =>
  isAgent.value ? 'message agentMessage' : 'message userMessage',
)

const avatarClass = computed(() => (isAgent.value ? 'avatar agentAvatar' : 'avatar userAvatar'))

const avatarIconClass = computed(() => (isAgent.value ? 'pi pi-desktop' : 'pi pi-user'))

// 渲染 agent 消息 markdown
const renderedContent = computed(() => {
  return md.render(props.message.content)
})
</script>

<style scoped>
.message {
  display: flex;
  align-items: flex-start;
  margin: 10px 0;
}

.messageContent {
  max-width: 80%;
  background-color: white;
  padding: 10px 15px;
  border-radius: 10px;
  word-wrap: break-word;
}

/* 用户样式 */
.userMessage .messageContent {
  background-color: #e0f7fa;
}
.userAvatar {
  background-color: #00acc1;
}

/* Agent 样式 */
.agentMessage .messageContent {
  background-color: #e8eaf6;
}
.agentAvatar {
  background-color: #3949ab;
}

/* Avatar icons */
.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  margin-right: 10px;
}

.pi {
  font-style: normal;
}
.pi-user::before {
  content: '👤';
}
.pi-desktop::before {
  content: '💻';
}

/* 可选：Markdown 样式增强 */
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
