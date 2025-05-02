<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import ChatMessage from './ChatMessage.vue'

interface Message {
  role: 'user' | 'agent'
  content: string
}

const clientId = Date.now()
const ws = ref<WebSocket | null>(null)
const inputText = ref('')
const messages = ref<Message[]>([])
const chatBox = ref<HTMLDivElement | null>(null)

onMounted(() => {
  ws.value = new WebSocket(`ws://localhost:8000/ws/${clientId}`)

  ws.value.onmessage = (event) => {
    const rawData = event.data
    const type = rawData[0]
    const data = rawData.slice(2)

    if (type === '0') {
      // stream token
      if (
        messages.value.length === 0 ||
        messages.value[messages.value.length - 1].role !== 'agent'
      ) {
        // 如果当前没有agent消息，就新建一条
        messages.value.push({ role: 'agent', content: '' })
      }
      // remove ```
      messages.value[messages.value.length - 1].content += data.replace(/```/g, '')
      scrollToBottom()
    } else if (type === '1') {
      // tool call result
      messages.value.push({
        role: 'agent',
        content: `[Tool Result]: ${data}`,
      })
      messages.value.push({ role: 'agent', content: '' })
      scrollToBottom()
    } else if (type === '3') {
      // message end
      // 什么都不用做，流式消息已经在列表里了
      scrollToBottom()
    }
  }
})

function sendMessage() {
  if (inputText.value.trim() !== '') {
    ws.value?.send(inputText.value)
    messages.value.push({
      role: 'user',
      content: inputText.value,
    })
    inputText.value = ''
    scrollToBottom()
  }
}

function scrollToBottom() {
  nextTick(() => {
    if (chatBox.value) {
      chatBox.value.scrollTop = chatBox.value.scrollHeight
    }
  })
}
</script>

<template>
  <div class="chat-container">
    <h2>
      Your ID: <span>{{ clientId }}</span>
    </h2>

    <div id="chatArea" ref="chatBox" class="chat-box">
      <ChatMessage v-for="(message, index) in messages" :key="index" :message="message" />
    </div>

    <form @submit.prevent="sendMessage" class="input-area">
      <input v-model="inputText" type="text" placeholder="Type a message..." autocomplete="off" />
      <button type="submit">Send</button>
    </form>
  </div>
</template>

<style scoped>
.chat-container {
  /* max-width: 600px; */
  /* margin: 20px auto; */
  font-family: Arial, sans-serif;
}

.chat-box {
  border: 1px solid #ccc;
  height: 75vh;
  overflow-y: auto;
  padding: 10px;
  background: #f9f9f9;
  margin-bottom: 10px;
}

.input-area {
  display: flex;
  gap: 10px;
}

input[type='text'] {
  flex-grow: 1;
  padding: 8px;
}

button {
  padding: 8px 16px;
}
</style>
