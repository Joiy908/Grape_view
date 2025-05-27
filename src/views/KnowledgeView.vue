<template>
  <div class="markdown-typer">
    <div v-html="typedHtml"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import MarkdownIt from 'markdown-it'

const md = new MarkdownIt({ breaks: true })
const typedHtml = ref('')
const markdownUrl = '/grape.md' // Replace with your actual Markdown file URL

const fetchMarkdown = async () => {
  try {
    const response = await fetch(markdownUrl)
    if (!response.ok) {
      throw new Error(`Failed to fetch Markdown file: ${response.statusText}`)
    }
    const markdownText = await response.text()
    typedHtml.value = md.render(markdownText)
  } catch (error) {
    console.error('Error fetching Markdown:', error)
    typedHtml.value = '<p>Error loading Markdown content. Please try again later.</p>'
  }
}

onMounted(() => {
  fetchMarkdown()
})
</script>

<style scoped>
.markdown-typer {
  font-family: 'Courier New', monospace;
  line-height: 1.6;
}
blockquote {
  border-left: 4px solid #212020;
  padding: 1rem;
}
</style>
