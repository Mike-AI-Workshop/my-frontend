<script setup>
import gsap from 'gsap';
import TheFooter from './components/TheFooter.vue';
import TheHeader from './components/TheHeader.vue';

// GSAP Animation Hooks
const onEnter = (el, done) => {
  gsap.fromTo(el, 
    { opacity: 0 }, 
    { opacity: 1, duration: 0.5, onComplete: done }
  );
};

const onLeave = (el, done) => {
  gsap.to(el, 
    { opacity: 0, duration: 0.5, onComplete: done }
  );
};
</script>

<template>
  <div id="app-container">
    <TheHeader />

    <main class="main-container">
      <RouterView v-slot="{ Component }">
        <Transition mode="out-in" @enter="onEnter" @leave="onLeave">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>

    <TheFooter />
  </div>
</template>

<style scoped>
#app-container{
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}
.main-container{
    flex-grow: 1;
}
</style>
