<script setup>
// 目前这里不需要写任何逻辑
</script>

<template>
  <header class="header">
    <div class="container">
      <div class="logo">MyPortfolio</div>
      <nav>
        <a href="/">首页</a>
        <a href="/projects">项目</a>
        <a href="/blog">博客</a>
        <a href="/about">关于</a>
      </nav>
    </div>
  </header>
</template>

<style scoped>
/* "scoped" 表示这里的样式只对当前组件生效，不会影响到其他组件 */
.header {
  background-color: #f8f9fa;
  padding: 1rem 0;
  border-bottom: 1px solid #e7e7e7;
}
.container {
  max-width: 960px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.logo {
  font-weight: bold;
  font-size: 1.5rem;
}
nav a {
  margin-left: 1.5rem;
  text-decoration: none;
  color: #333;
}
nav a:hover {
  color: #007bff;
}
</style>