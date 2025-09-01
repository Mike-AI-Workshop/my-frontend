//导入 axios 库
import axios from "axios";

//创建一个自定义的 axios 实例
const apiClient = axios.create({
    //设置基础URL
    baseURL:"http://localhost:1337/api",

    //还可以在这里添加其他的全局配置
    headers:{
        'Content-Type':'application/json',
    }
})

export default apiClient;