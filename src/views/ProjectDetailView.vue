<script setup>
import { useRoute } from 'vue-router';
import { ref, onMounted, computed } from 'vue';
import apiClient from '../api'; // 引入 apiClient
import { marked } from 'marked';

//调用 useRoute() 钩子，它会返回一个包含当前路由信息的对象
const route = useRoute();
const project = ref(null); // 用来存储完整的项目对象，初始值为 null
const isLoading = ref(true);
const error = ref(null);

//"翻译器"函数
const strapiJsonToMarkdown = (contentJson) => {
  if (!Array.isArray(contentJson)) return '';

  let markdownText = '';
  contentJson.forEach(element => {
    // 遍历 JSON 数组中的每个块
    if (element.type === 'paragraph') {
      element.children.forEach(child => {
        let text = child.text;
        if (child.bold) text = `**${text}**`;
        if (child.italic) text = `*${text}*`;
        markdownText += text;
      });
      markdownText += '\n\n'; // 段落后加两个换行
    } else if (element.type === 'heading') {
      const level = element.level;
      markdownText += `${'#'.repeat(level)} `; // h1 -> #, h2 -> ##, etc.
      element.children.forEach(child => {
        markdownText += child.text;
      });
      markdownText += '\n\n';
    } else if (element.type === 'list') {
      const isOrdered = element.format === 'ordered';
      element.children.forEach((listItem, index) => {
        const prefix = isOrdered ? `${index + 1}.` : '-';
        markdownText += `${prefix} `;
        listItem.children.forEach(child => {
          markdownText += child.text;
        });
        markdownText += '\n';
      });
      markdownText += '\n';
    }
    // 你可以在这里继续添加对其他块类型（如 quote, image）的处理
  });

  return markdownText;
};

//创建计算属性来生成最终的 HTML
const renderedContentHtml = computed(() => {
  if (project.value && project.value.content) {
    // 第一步：调用“翻译器”将 JSON 转换成 Markdown
    const markdownString = strapiJsonToMarkdown(project.value.content);
    // 第二步：使用 marked 将 Markdown 转换成 HTML
    return marked(markdownString);
  }
  return '';
});

//创建一个函数来获取单个项目的数据
const fetchProject = async () => {
    isLoading.value = true;
    try{
        // 关键：使用 Strapi v4 的筛选语法来获取数据
        // 我们要找到 'slug' 字段 等于 ([$eq]) route.params.slug 的项目
        const response = await apiClient.get(`/projects?filters[slug][$eq]=${route.params.slug}`);

        // Strapi 的筛选接口返回的是一个数组，即使只有一个结果
        if (response.data.data && response.data.data.length > 0){
            // 我们需要的是数组中的第一个元素
            project.value = response.data.data[0];
        }else{
            // 如果找不到项目，抛出一个错误
            throw new Error('项目未找到');
        }
    }catch(err){
        console.error('获取项目详情失败:', err);
        error.value = err.message || '无法加载项目详情。';
    }finally{
        isLoading.value = false;
    }
}

//在组件挂载后调用该函数
onMounted(() => {
    fetchProject();
})
</script>

<template>
    <div class="project-detail-view">
        <div v-if="isLoading" class="loading">
            正在加载项目数据...
        </div>

        <div v-else-if="error" class="error-message">
            <h2>加载失败</h2>
            <p>{{ error }}</p>
        </div>

        <article v-else-if="project" class="project-content">
            <h1>{{ project.title }}</h1>

            <div class="meta-info">
                <span v-if="project.publish_at">发布于: {{ new Date(project.publish_at).toLocaleDateString() }}</span>
                <a v-if="project.demo_url" :href="project.demo_url" target="_blank" class="demo-link">访问演示站点</a>
            </div>

        <div class="content-body" v-html="renderedContentHtml"></div> 
        </article>
    </div>
</template>

<style scoped>
.project-detail-view {
  max-width: 800px;
  margin: 2rem auto;
  padding: 1rem;
}

.loading, .error-message {
  text-align: center;
  padding: 4rem 0;
}

/* ... 其他样式不变 ... */
.meta-info {
  text-align: center;
  color: #666;
  margin-bottom: 2rem;
  font-size: 0.9rem;
}

.meta-info .demo-link {
  margin-left: 1rem;
  background-color: #007bff;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  text-decoration: none;
  transition: background-color 0.3s ease;
}

.meta-info .demo-link:hover {
  background-color: #0056b3;
}
/* 5. 为 v-html 渲染出来的内容添加样式 */
/* 使用 :deep() 伪类来穿透 scoped 样式的限制 */
.content-body :deep(h1),
.content-body :deep(h2),
.content-body :deep(h3) {
  margin-top: 2rem;
  margin-bottom: 1rem;
  line-height: 1.4;
}

.content-body :deep(p) {
  margin-bottom: 1rem;
  line-height: 1.8;
  font-size: 1.1rem;
}

.content-body :deep(ul),
.content-body :deep(ol) {
  padding-left: 2rem;
  margin-bottom: 1rem;
}

.content-body :deep(li) {
  margin-bottom: 0.5rem;
  line-height: 1.8;
  font-size: 1.1rem;
}
</style>