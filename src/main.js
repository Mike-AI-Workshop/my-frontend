import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

//创建应用实例
const app = createApp(App)

//在挂载到页面之前，先安装路由模块
app.use(router)

//最后再挂载到页面上
app.mount('#app')