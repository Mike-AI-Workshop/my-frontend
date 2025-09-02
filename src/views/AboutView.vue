<script setup>
import { ref, onMounted, computed } from 'vue';
import { marked } from 'marked';
import apiClient from '../api';

const aboutData = ref(null);
const isLoading = ref(true);
const error = ref(null);

// Helper function to convert Strapi's JSON content to a Markdown string
const strapiJsonToMarkdown = (content) => {
  if (typeof content === 'string') {
    return content;
  }
  if (!Array.isArray(content)) return '';

  let markdown = '';
  content.forEach(element => {
    if (element.type === 'paragraph') {
      element.children.forEach(child => {
        let text = child.text;
        if (child.bold) text = `**${text}**`;
        if (child.italic) text = `*${text}*`;
        markdown += text;
      });
      markdown += '\n\n';
    } else if (element.type === 'heading') {
      markdown += `${'#'.repeat(element.level)} ${element.children.map(c => c.text).join('')}\n\n`;
    } else if (element.type === 'list') {
      const listChar = element.format === 'ordered' ? '1.' : '-';
      element.children.forEach(listItem => {
        markdown += `${listChar} ${listItem.children.map(c => c.text).join('')}\n`;
      });
      markdown += '\n';
    }
  });
  return markdown;
};

const fetchAboutData = async () => {
  try {
    const response = await apiClient.get('/about-me');
    aboutData.value = response.data.data;
  } catch (err) {
    console.error('Failed to fetch about data:', err);
    error.value = '无法加载页面内容，请稍后再试。';
  } finally {
    isLoading.value = false;
  }
};

const renderedStoryHtml = computed(() => {
  if (aboutData.value && aboutData.value.story) {
    const markdownText = strapiJsonToMarkdown(aboutData.value.story);
    return marked(markdownText);
  }
  return '';
});

onMounted(() => {
  fetchAboutData();
});
</script>

<template>
  <div class="about-view">
    <div v-if="isLoading" class="loading-state">
      <p>正在加载...</p>
    </div>
    <div v-else-if="error" class="error-state">
      <p>{{ error }}</p>
    </div>
    <div v-else-if="aboutData" class="about-content">
      <h1>{{ aboutData.title }}</h1>
      <a v-if="aboutData.email" :href="`mailto:${aboutData.email}`" class="email-link">{{ aboutData.email }}</a>
      <div class="story-content" v-html="renderedStoryHtml"></div>
    </div>
  </div>
</template>

<style scoped>
.about-view {
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.loading-state,
.error-state {
  text-align: center;
  padding: 4rem;
  color: #666;
}

.about-content h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.email-link {
  display: block;
  color: #007bff;
  text-decoration: none;
  margin-bottom: 2rem;
  font-weight: 500;
}
.email-link:hover {
  text-decoration: underline;
}

.story-content :deep(h2) {
  font-size: 1.8rem;
  margin-top: 2.5rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 0.5rem;
}

.story-content :deep(p) {
  line-height: 1.8;
  margin-bottom: 1.2rem;
  font-size: 1.1rem;
}

.story-content :deep(ul),
.story-content :deep(ol) {
  padding-left: 2rem;
  margin-bottom: 1.2rem;
}

.story-content :deep(li) {
  line-height: 1.8;
  margin-bottom: 0.5rem;
}
</style>