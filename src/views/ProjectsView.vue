<script setup>

//引入依赖
import {ref,onMounted} from 'vue';
import apiClient from '../api'; //引入我们配置好的 api
//导入了我们创建的 ProjectCard 组件
import ProjectCard from '../components/ProjectCard.vue';
//定义一个响应式变量来储存数据
// ref([]) 表示 projects 的初始值是一个空数组
const projects = ref([]);
const isLoading = ref(true);//用于追踪加载状态
const error = ref(null);//用于存储错误信息

//定义一个函数来获取数据
const fetchProjects = async() =>{
    try{
        //使用apiClient发布请求
        //apiClient会自动在'/projects'前面加上基础的 url
        const response = await apiClient.get('/projects?populate=cover_image');

        // Strapi v4 的数据结构是 { data: [...], meta: {...} }
        // 我们需要的是 data 属性里的那个数组       
        projects.value = response.data.data; 
    }catch(err){
        // 如果请求失败，捕获错误
        console.error('获取项目数据失败:', err);
        error.value = '无法加载项目列表，请稍后再试。';
    }finally{
        // 无论成功还是失败，最后都将加载状态设置为 false
        isLoading.value = false;
    }
};

// 使用 onMounted 生命周期钩子
// onMounted 里的代码会在组件第一次渲染到屏幕上之后执行
// 这是发起初始数据请求的理想位置
onMounted(() =>{
    fetchProjects();
});

</script>

<template>
    <div class="projects-view">
        <h1> 我的精选项目集 </h1>
        <div v-if="isLoading" class="loading">正在加载中...</div>
        <div v-else-if="error" class="error">{{ error }}</div>

        <div v-else-if="projects.length > 0" class="project-grid">
        <ProjectCard 
            v-for="project in projects" 
            :key="project.id"
            :project="project"
        />
        </div>

        <div v-else class="no-projects">没有找到项目</div>
    </div>
</template> 

<style scoped>
.projects-view {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}
.loading, .error, .no-projects {
  text-align: center;
  margin-top: 2rem;
  color: #666;
}
.project-list {
  list-style: none;
  padding: 0;
}
.project-list li {
  background-color: #f4f4f4;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 4px;
}
.project-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}
</style>