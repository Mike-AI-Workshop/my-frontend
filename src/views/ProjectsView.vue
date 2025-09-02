<script setup>

//引入依赖
import {ref, onMounted, onUnmounted, nextTick} from 'vue';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
import apiClient from '../api'; //引入我们配置好的 api
//导入了我们创建的 ProjectCard 组件
import ProjectCard from '../components/ProjectCard.vue';
//定义一个响应式变量来储存数据
// ref([]) 表示 projects 的初始值是一个空数组
const projects = ref([]);
const isLoading = ref(true);//用于追踪加载状态
const error = ref(null);//用于存储错误信息

const titleRef = ref(null);
const gridRef = ref(null);
let ctx;

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
onMounted(async () =>{
    await fetchProjects();
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
    <div class="projects-view">
        <h1 ref="titleRef"> 我的精选项目集 </h1>
        <div v-if="isLoading" class="loading">正在加载中...</div>
        <div v-else-if="error" class="error">{{ error }}</div>

        <div v-else-if="projects.length > 0" class="project-grid" ref="gridRef">
            <RouterLink 
            v-for="project in projects" 
            :key="project.id"
            :to="'/projects/' + project.slug"
            class="project-link"
            >
            <ProjectCard :project="project" />
            </RouterLink>
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
/* 去掉链接默认的下划线和颜色 */
.project-link {
  text-decoration: none;
  color: inherit;
}
</style>