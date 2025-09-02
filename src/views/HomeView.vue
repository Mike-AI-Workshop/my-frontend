<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const titleRef = ref(null);
const subtitleRef = ref(null);
const buttonRef = ref(null);
let ctx;

onMounted(() => {
    ctx = gsap.context(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: titleRef.value,
                start: "top 80%",
                toggleActions: "play none none none",
            }
        });

        tl.from(titleRef.value, { opacity: 0, y: 50, duration: 0.8 })
          .from(subtitleRef.value, { opacity: 0, y: 30, duration: 0.6 }, "-=0.4")
          .from(buttonRef.value, { opacity: 0, y: 20, duration: 0.5 }, "-=0.3");
    });
});

onUnmounted(() => {
    if (ctx) {
        ctx.revert();
    }
});
</script>

<template>
    <div class="home-view">
        <h1 ref="titleRef">欢迎来到我的数字空间</h1>
        <p ref="subtitleRef">探索我的项目与思考</p>
        <button ref="buttonRef" class="cta-button">联系我</button>
    </div>
</template>

<style scoped>
.home-view {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    min-height: 80vh;
    padding: 2rem;
}

h1 {
    font-size: 3rem;
    margin-bottom: 1rem;
}

p {
    font-size: 1.5rem;
    color: #666;
    margin-bottom: 2rem;
}

.cta-button {
    padding: 1rem 2rem;
    font-size: 1.2rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.cta-button:hover {
    background-color: #0056b3;
}
</style>