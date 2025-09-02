<script setup>
import { computed } from 'vue';

const props = defineProps({
  article: {
    type: Object,
    required: true
  }
});

const coverImageUrl = computed(() => {
  if (props.article.cover_image && props.article.cover_image.data) {
    const imageUrl = props.article.cover_image.data.attributes.url;
    return `http://localhost:1337${imageUrl}`;
  }
  return 'https://via.placeholder.com/400x200.png?text=No+Image';
});
</script>

<template>
  <div class="article-card">
    <img :src="coverImageUrl" alt="Article cover image" class="card-image">
    <div class="card-content">
      <h3 class="card-title">{{ props.article.title }}</h3>
      <p v-if="props.article.summary" class="card-summary">
        {{ props.article.summary }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.article-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%; /* Ensure cards in a grid row have the same height */
}

.article-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.card-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  background-color: #f0f0f0;
}

.card-content {
  padding: 1rem;
  flex-grow: 1; /* Allows content to fill available space */
}

.card-title {
  margin-top: 0;
  margin-bottom: 0.5rem;
  font-size: 1.25rem;
}

.card-summary {
  font-size: 0.9rem;
  color: #666;
  line-height: 1.5;
}
</style>
