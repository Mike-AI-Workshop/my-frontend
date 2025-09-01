<script setup>
import { computed } from 'vue';

//定义组件期望接收的 props
//我们期望从父组件（ProjectsView.vue）那里接收一个名为 'project' 的对象
const props = defineProps({
    project: {
    type: Object, // 它的类型是对象
    required: true // 它是必需的
  }
});

//创建一个计算属性来处理封面图的 URL
//这是一个很好的实践，可以把模板里的逻辑保持得更干净
const coverImageUrl = computed(() => {

    // 从 Strapi 获取的媒体文件数据结构比较深
    const coverImage = props.project.cover_image && props.project.cover_image.data;

    // 检查是否有封面图数据
    if (coverImage) {
        const imageUrl = coverImage.attributes.url;
        // Strapi 返回的 URL 可能是一个相对路径，如 /uploads/image.jpg
        // 我们需要将它和 Strapi 的基础 URL 拼接起来
        // 注意：这里的 'http://localhost:1337' 是你本地 Strapi 的地址
        return `http://localhost:1337${imageUrl}`;
    }

    // 如果没有封面图，可以返回一个默认的占位图
    return 'https://via.placeholder.com/400x200.png?text=No+Image';
});
</script>

<template>
    <div class="project-card">
        <img :src="coverImageUrl" alt="Project cover image" class="card-image">
        <div v-if="props.project && props.project.attributes" class="card-content">
            <h3 class="card-title">{{ props.project.attributes.title }}</h3>
            <p v-if="props.project.attributes.summary" class="card-summary">
                {{ props.project.attributes.summary }}
            </p>
        </div>
    </div>
</template>

<style scoped>
/* "scoped" 确保这些样式只作用于当前组件，不会污染全局 */
.project-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden; /* 确保图片圆角生效 */
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
}

.project-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.card-image {
  width: 100%;
  height: 200px; /* 固定高度，防止图片大小不一导致卡片错位 */
  object-fit: cover; /* 保证图片不变形，并填满容器 */
  background-color: #f0f0f0; /* 图片加载前的背景色 */
}

.card-content {
  padding: 1rem;
  flex-grow: 1;
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