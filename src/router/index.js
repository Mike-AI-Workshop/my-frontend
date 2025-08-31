//导入必备的工具
import { createRouter, createWebHistory } from "vue-router";
//导入创建的所有页面
import AboutView from "../views/AboutView.vue"
import ArticleDetailView from "../views/ArticleDetailView.vue"
import BlogView from "../views/BlogView.vue"
import HomeView from "../views/HomeView.vue"
import ProjectDetailView from "../views/ProjectDetailView.vue"
import ProjectsView from "../views/ProjectsView.vue"

//定义路由规则数组
const routes = [
    {
        path:'/',
        name:'home',
        component: HomeView
    },
    {
        path:'/about',
        name:'about',
        component: AboutView
    },
    {
        path:'/projects',
        name:'projects',
        component: ProjectsView
    },
    {
        path:'/projects/:slug',
        name:'project-detail',
        component: ProjectDetailView
    },
    {
        path:'/blog',
        name:'blog',
        component: BlogView 
    },
    {
        path:'/blog/:slug',
        name:'article-detail',
        component: ArticleDetailView
    }
]

//创建路由实例
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

//导出路由实例
export default router