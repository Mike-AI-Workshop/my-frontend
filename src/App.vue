<script setup>
import TheFooter from './components/TheFooter.vue';
import TheHeader from './components/TheHeader.vue';
</script>

<template>
    <div id="app-container">
        <TheHeader />

        <main id="main-container">
            <router-view /> 
        </main>

        <TheFooter />
    </div>
</template>

<style scoped>
#app-container{
    display:flex;
    flex-direction: column;
    min-height: 100vh;
}
.main-container{
    flex-grow:1;
}
</style>
