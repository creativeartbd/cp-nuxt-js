<template>
    <div class="home-slider" v-if="data">
        <swiper
            :slides-per-view="1"
            :space-between="50"
            :autoplay="{
                delay: 2500,
            }"
            @swiper="onSwiper"
            @slideChange="onSlideChange"
            :modules="modules"
            :effect="'fade'"
        >
            <swiper-slide v-for="(slider, index) in data.sliders" :key="index">
                <div class="container slider-container" v-if="slider.is_disable === 'no'">
                    <div class="row align-items-center g-5">
                        <div class="col-lg-6 col-md-12">
                            <div class="slider-content">
                                <h2 v-if="slider.slider_title">{{ slider.slider_title }}</h2>
                                <p v-if="slider.slider_sub_title">{{ slider.slider_sub_title }}</p>
                                <NuxtLink class="order-btn" :to="slider.button_url" v-if="slider.button_label">
                                    {{ slider.button_label }}
                                </NuxtLink>
                            </div>
                        </div>
                        <div class="col-lg-6 col-md-12">
                            <img v-if="slider.slider_image" :src="slider.slider_image" />
                        </div>
                    </div>
                </div>
            </swiper-slide>
        </swiper>
    </div>
</template>

<script>
// Import Swiper Vue.js components
import { Swiper, SwiperSlide } from "swiper/vue";
import { Autoplay, EffectFade } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-fade";

export default {
    props: ["data"],
    components: {
        Swiper,
        SwiperSlide,
    },
    setup() {
        const onSwiper = (swiper) => {
            console.log(swiper);
        };
        const onSlideChange = (swiper) => {
            // Access the active slide and its styles
            const activeSlide = swiper.slides[swiper.activeIndex];

            // Dynamically change the background image
            activeSlide.style.setProperty(
                "background-image",
                "url('../../../assets/images/slider-01.jpg')",
                "important"
            );
        };
        return {
            onSwiper,
            onSlideChange,
            modules: [Autoplay, EffectFade],
        };
    },
};
</script>

<style scoped>
.slider-content h2 {
    line-height: 1.2;
    margin-bottom: 30px;
    font-weight: 700;
    font-size: 300%;
    color: #000;
}

.slider-content p {
    color: #000;
    line-height: 150%;
}

.swiper-wrapper {
    height: 100vh;
}

.swiper-wrapper img {
    width: 100%;
    height: auto;
    object-fit: cover;
    object-position: center;
    /* position: absolute; */
    z-index: -1;
}

/* CSS */
.order-btn {
    background: linear-gradient(282deg, rgb(6 188 212) 0%, rgb(22 175 195) 100%);
    border-radius: 999px;
    box-sizing: border-box;
    color: #ffffff;
    cursor: pointer;
    font-family: Inter, Helvetica, "Apple Color Emoji", "Segoe UI Emoji", NotoColorEmoji, "Noto Color Emoji",
        "Segoe UI Symbol", "Android Emoji", EmojiSymbols, -apple-system, system-ui, "Segoe UI", Roboto, "Helvetica Neue",
        "Noto Sans", sans-serif;
    font-weight: 600;
    line-height: 24px;
    opacity: 1;
    outline: 0 solid transparent;
    padding: 18px 30px;
    user-select: none;
    -webkit-user-select: none;
    touch-action: manipulation;
    width: fit-content;
    word-break: break-word;
    border: 0;
    margin-top: 25px;
    text-decoration: none;
    display: inline-block;
}

.order-btn:hover {
    background: linear-gradient(282deg, rgb(22 175 195) 0%, rgb(6 188 212) 100%);
}
</style>
