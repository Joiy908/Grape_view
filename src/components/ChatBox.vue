<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import ChatMessage from './ChatMessage.vue'
import type { Message } from '../types'
import type { ScrollbarInstance } from 'element-plus'

const scrollbarRef = ref<ScrollbarInstance>()
const clientId = Date.now()
const ws = ref<WebSocket | null>(null)
const inputText = ref('')
const temp_json = {
  success: true,
  data: `📁 Metadata:\n- file_path: D:\\Joiy\\on_work\\AIGC_APP\\data\\grape.md\n- header_path: /第七章 葡萄病虫害防治/\n📝 Text:\n ## 66. 如何防治葡萄裂果病？\n **症状**：葡萄裂果病属于生理性病害，主要发生在浆果成熟期。其原因是在果实生长后期土壤水分变化过大，久旱逢雨或大水漫灌，根从土壤中吸收大量水分，输送到果实内，使果实膨压骤增，果皮纵向裂开。葡萄裂果病与品种特性、栽培技术有关，具有裂果特性的品种，如果栽培技术得当可以防止裂果，如里扎马特、乍娜等，但也受栽培技术和气候（特别是雨量分布）的影响。患葡萄裂果病的葡萄在接近采收时，果皮开裂，随即果粒腐烂。发病轻者，穗形不整齐，降低商品价值。在浆果成熟期控制灌水、套袋、设防雨罩等措施，可防止或减轻葡萄裂果病。\n**发生规律**：由于土壤水分失调而引起的。葡萄生长前期如果土壤过于干旱，果皮形成的机械组织伸缩性较小，果实进入转色期后，细胞内含糖量增高，渗透压增大，在这个时候如果给土壤灌水，根部就从土壤中吸收大量的水分，使果粒内水分急骤增多，靠近果刷的细胞分裂和生理活动加快，而靠近果皮的细胞活动缓慢，由于果实吸收的水分多，压力增大，而果皮伸张性较小，使果粒顺果刷的方向纵向开裂。土壤条件差、地势低、土壤黏重的地方发生严重。\n**防治方法**：\n1. 果园覆草覆膜，均衡土壤水分供应。既可防止根系吸收过多的雨水，又可防止地面水分蒸发，减少土壤水分变化。干旱时，要把覆盖与灌水结合起来。\n2. 适时灌水，低洼地要及时排水，经常疏松土壤，做到排灌舒畅，保持地面土壤湿润。同时，通过深翻和施有机肥、石灰等改善土壤物理性状，以减少土壤水分变化。\n3. 调节结果量。葡萄着色不良的树，发生裂果尤多。要通过疏穗、疏粒、掐穗，调整好结果量，减少裂果。\n4. 抬高架面，提高果穗离地面的高度。\n5. 坐果后、成熟前喷施氯化钙、氨基酸钙。接近成熟期，要适当控制氮肥和水分，减缓果实增大速度。\n6. 架面设置遮雨棚和果穗套袋防雨。葡萄果面直接吸收雨水，或从根部吸收水分以后，果实产生膨胀压，导致引起裂果。雨天采取遮雨措施，能有效防止裂果，果穗套袋可收到良好的效果。\n7. 防治病虫害。葡萄病虫危害的伤口，是葡萄裂果重要因素。及时做好葡萄病虫害的防治工作极为重要。彻底清除枯枝、落叶，将病叶、病果烧掉或深埋。萌发前喷布5波美度石硫合剂。白粉病发生时，可喷25%粉锈宁1500倍液，或70%甲基托布津可湿性粉剂1000倍液，连喷2～3次，或退菌特800倍液防治。`,
  message: '',
  format: 'markdown',
  call: "get_grape_docs(query='葡萄裂果的防治方法')",
}

const ass = `
Thought: 用户想了解防治葡萄裂果的方法，我可以使用get_grape_docs工具获取相关文档信息。\n
Action: get_grape_docs\n
Action Input: {"query": "葡萄裂果的防治方法"}`

const ass1 = `
Thought: I can answer without using any more tools.\n
Answer: 葡萄出现裂果可能是患了葡萄裂果病，这属于生理性病害，主要发生在浆果成熟期，原因是在果实生长后期土壤水分变化过大，久旱逢雨或大水漫灌，根从土壤中吸收大量水分，输送到果实内，使果实膨压骤增，果皮纵向裂开，也与品种特性、栽培技术有关。以下是一些防治方法：\n
\n
1. 果园覆草覆膜，均衡土壤水分供应。既可防止根系吸收过多的雨水，又可防止地面水分蒸发，减少土壤水分变化。干旱时，要把覆盖与灌水结合起来。\n
2. 适时灌水，低洼地要及时排水，经常疏松土壤，做到排灌舒畅，保持地面土壤湿润。同时，通过深翻和施有机肥、石灰等改善土壤物理性状，以减少土壤水分变化。\n
3. 调节结果量。葡萄着色不良的树，发生裂果尤多。要通过疏穗、疏粒、掐穗，调整好结果量，减少裂果。\n
4. 抬高架面，提高果穗离地面的高度。\n
5. 坐果后、成熟前喷施氯化钙、氨基酸钙。接近成熟期，要适当控制氮肥和水分，减缓果实增大速度。\n
6. 架面设置遮雨棚和果穗套袋防雨。葡萄果面直接吸收雨水，或从根部吸收水分以后，果实产生膨胀压，导致引起裂果。雨天采取遮雨措施，能有效防止裂果，果穗套袋可收到良好的效果。\n
7. 防治病虫害。葡萄病虫危害的伤口，是葡萄裂果重要因素。及时做好葡萄病虫害的防治工作极为重要。彻底清除枯枝、落叶，将病叶、病果烧掉或深埋。萌发前喷布5波美度石硫合剂。白粉病发生时，可喷25%粉锈宁1500倍液，或70%甲基托布津可湿性粉剂1000倍液，连喷2 - 3次，或退菌特800倍液防治。\n
`
const messages = ref<Message[]>([
  { role: 'user', content: '葡萄有裂果怎么办？' },
  { role: 'agent', content: ass },
  { role: 'toolcallResult', content: JSON.stringify(temp_json) },
  { role: 'agent', content: ass1 },
])

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
      messages.value[messages.value.length - 1].content += data
      scrollToBottom()
    } else if (type === 'a') {
      // tool call result
      messages.value.push({
        role: 'toolcallResult',
        content: data,
      })
      messages.value.push({ role: 'agent', content: '' })
      scrollToBottom()
    } else if (type === 'd') {
      // message end
      // 什么都不用做，流式消息已经在列表里了
      scrollToBottom()
    }
  }
  scrollToBottom()
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
    const el = scrollbarRef.value
    if (el) {
      el.setScrollTop(el.wrapRef.scrollHeight)
    }
  })
}
</script>

<template>
  <div class="chat-container">
    <!-- <h3>
      Your ID: <span>{{ clientId }}</span>
    </h3> -->

    <el-scrollbar ref="scrollbarRef">
      <template v-for="(message, index) in messages" :key="index">
        <ChatMessage :message="message" />
        <!-- 👇 Spacer，仅在最后一条消息后插入 -->
        <div v-if="index === messages.length - 1" class="message-spacer" />
      </template>
    </el-scrollbar>

    <form ref="inputAreaRef" @submit.prevent="sendMessage" class="input-area">
      <input
        v-model="inputText"
        type="text"
        placeholder="询问任何有关葡萄的问题..."
        autocomplete="off"
      />
      <button type="submit">Send</button>
    </form>
  </div>
</template>

<style scoped>
.chat-container {
  background: #fff;
  display: flex;
  flex-direction: column;
  height: 100%;
}
.message-spacer {
  height: 80px; /* 根据你希望的底部留白高度调整 */
}

.input-area {
  /* height: 50px; */
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;

  margin: 0 10vw 15px 15vw;

  background: white;
  padding: 10px;
  padding: 10px 20px;
  border-top: 1px solid #ccc;
  display: flex;
  gap: 10px;
  z-index: 1000;
  border-radius: 5px;
}

input[type='text'] {
  flex-grow: 1;
  padding: 8px;
}

button {
  padding: 8px 16px;
}
</style>
