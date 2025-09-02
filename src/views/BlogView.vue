<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
import apiClient from '../api';
import ArticleCard from '../components/ArticleCard.vue';

const articles = ref([]);
const isLoading = ref(true);
const error = ref(null);

const titleRef = ref(null);
const gridRef = ref(null);
let ctx;

const fetchArticles = async () => {
  try {
    const response = await apiClient.get('/articles?populate=cover_image');
    articles.value = response.data.data;
  } catch (err) {
    console.error('Failed to fetch articles:', err);
    error.value = '无法加载文章，请稍后再试。';
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  await fetchArticles();
  await nextTick();

  ctx = gsap.context(() => {
    if (titleRef.value && gridRef.value) {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: titleRef.value,
                start: "top 80%",
                toggleActions: "play none none none",
            }
        });

        tl.from(titleRef.value, { opacity: 0, y: 50, duration: 0.8 })
          .from(gridRef.value.children, {
              opacity: 0,
              y: 30,
              duration: 0.6,
              stagger: 0.1
          }, "-=0.4");
    }
  });
});

onUnmounted(() => {
    if (ctx) {
        ctx.revert();
    }
});
</script>

<template>
  <div class="blog-view">
    <h1 ref="titleRef">我的博客文章</h1>

    <div v-if="isLoading" class="loading-state">
      <p>正在加载文章...</p>
    </div>

    <div v-else-if="error" class="error-state">
      <p>{{ error }}</p>
    </div>

    <div v-else-if="articles.length > 0" class="article-grid" ref="gridRef">
      <RouterLink
        v-for="article in articles"
        :key="article.id"
        :to="'/blog/' + article.slug"
        class="article-link"
      >
        <ArticleCard :article="article" />
      </RouterLink>
    </div>

    <div v-else class="empty-state">
      <p>暂时还没有文章哦。</p>
    </div>
  </div>
</template>

<style scoped>
.blog-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  text-align: center;
  margin-bottom: 2rem;
}

.article-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.article-link {
  text-decoration: none;
  color: inherit;
  display: block; /* Make the link a block to contain the card properly */
  height: 100%;
}

.loading-state,
.error-state,
.empty-state {
  text-align: center;
  padding: 3rem;
  color: #666;
}
</style>