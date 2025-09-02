<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { marked } from 'marked';
import apiClient from '../api';

const route = useRoute();
const article = ref(null);
const isLoading = ref(true);
const error = ref(null);

// Helper function to convert Strapi's content to a Markdown string
const strapiJsonToMarkdown = (content) => {
  // If content is already a string, assume it's Markdown and return it.
  if (typeof content === 'string') {
    return content;
  }

  // If content is not an array (from Rich Text Editor), return empty string.
  if (!Array.isArray(content)) return '';

  // Process the JSON array from the Rich Text Editor
  let markdown = '';
  content.forEach(element => {
    if (element.type === 'paragraph') {
      element.children.forEach(child => {
        let text = child.text;
        if (child.bold) {
          text = `**${text}**`;
        }
        if (child.italic) {
          text = `*${text}*`;
        }
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

const fetchArticle = async () => {
  try {
    const slug = route.params.slug;
    const response = await apiClient.get(`/articles?filters[slug][$eq]=${slug}`);
    
    if (response.data.data && response.data.data.length > 0) {
      article.value = response.data.data[0];
    } else {
      throw new Error('Article not found');
    }
  } catch (err) {
    console.error('Failed to fetch article:', err);
    error.value = '无法加载文章，或文章不存在。';
  } finally {
    isLoading.value = false;
  }
};

const renderedContentHtml = computed(() => {
  if (article.value && article.value.content) {
    const markdownText = strapiJsonToMarkdown(article.value.content);
    return marked(markdownText);
  }
  return '';
});

onMounted(() => {
  fetchArticle();
});
</script>

<template>
  <div class="article-detail-view">
    <div v-if="isLoading" class="loading-state">
      <p>正在加载文章...</p>
    </div>
    <div v-else-if="error" class="error-state">
      <p>{{ error }}</p>
    </div>
    <article v-else-if="article" class="article-content">
      <h1>{{ article.title }}</h1>
      <div class="meta-info" v-if="article.publish_at">
        <span>发布于：{{ new Date(article.publish_at).toLocaleDateString() }}</span>
      </div>
      
      <div class="content-body" v-html="renderedContentHtml"></div>
    </article>
  </div>
</template>

<style scoped>
.article-detail-view {
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

.article-content h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.meta-info {
  color: #888;
  font-size: 0.9rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 1rem;
}

/* Use :deep() to style content rendered by v-html */
.content-body :deep(h2) {
  font-size: 1.8rem;
  margin-top: 2.5rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 0.5rem;
}

.content-body :deep(h3) {
  font-size: 1.5rem;
  margin-top: 2rem;
  margin-bottom: 1rem;
}

.content-body :deep(p) {
  line-height: 1.8;
  margin-bottom: 1.2rem;
  font-size: 1.1rem;
}

.content-body :deep(ul),
.content-body :deep(ol) {
  padding-left: 2rem;
  margin-bottom: 1.2rem;
}

.content-body :deep(li) {
  line-height: 1.8;
  margin-bottom: 0.5rem;
}

.content-body :deep(strong) {
  font-weight: bold;
}

.content-body :deep(em) {
  font-style: italic;
}
</style>