<template>
    <section class="visual-examples" v-if="data" :style="{ backgroundColor: data.background_color }">
        <!-- <pre>{{ data }}</pre> -->
        <div class="container">
            <div class="row">
                <div class="col-md-12 section-title text-center">
                    <h2 v-if="data.title">{{ data.title }}</h2>
                    <p v-if="data.sub_title">{{ data.sub_title }}</p>
                    <div class="divide-separator divide-center"></div>
                </div>
            </div>
            <div class="row" v-if="data.images && data.images.length">
                <div class="col-md-12">
                    <div class="visual-examples-wrapper">
                        <div class="grid-wrapper">
                            <div
                                v-for="(example, exampleKey) in data.images"
                                :key="exampleKey"
                                :class="[example.css_class_name, { 'hide-overlay': isDragging }]"
                            >
                                <ImgComparisonSlider
                                    class="coloured-slider"
                                    @input="handleMove"
                                    @mousedown="startDrag"
                                    @touchstart="startDrag"
                                    @mouseup="stopDrag"
                                    @touchend="stopDrag"
                                    @mouseleave="stopDrag"
                                >
                                    <!-- eslint-disable -->
                                    <figure slot="first" class="before">
                                        <img
                                            slot="first"
                                            style="object-fit: cover; width: 100%"
                                            :src="example.before_image"
                                        />
                                        <figcaption>Before</figcaption>
                                    </figure>
                                    <figure slot="second" class="after">
                                        <img
                                            slot="second"
                                            style="object-fit: cover; width: 100%"
                                            :src="example.after_image"
                                        />
                                        <figcaption>After</figcaption>
                                    </figure>
                                    <div slot="handle">
                                        <div class="bf-circle">
                                            <i class="bi bi-caret-left-fill"></i>
                                            <i class="bi bi-caret-right-fill"></i>
                                        </div>
                                    </div>
                                    <!-- eslint-enable -->
                                </ImgComparisonSlider>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
<script>
import { ImgComparisonSlider } from "@img-comparison-slider/vue";
export default {
    props: ["data"],
    components: {
        ImgComparisonSlider,
    },
    data() {
        return {
            dragTimeout: null,
            isDragging: false,
            beforeImg: `https://i0.wp.com/cutoutpartner.com/wp-content/uploads/2021/04/IMG_3313-After.jpg?w=800&ssl=1`,
            afterImg: `https://i0.wp.com/cutoutpartner.com/wp-content/uploads/2021/04/IMG_3313-Before.jpg?w=800&ssl=1`,
        };
    },
    methods: {
        startDrag() {
            this.isDragging = true;
            if (this.dragTimeout) clearTimeout(this.dragTimeout);
        },
        handleMove() {
            this.isDragging = true;
            if (this.dragTimeout) clearTimeout(this.dragTimeout);
            // Automatically stop hiding overlay after 500ms of no movement
            this.dragTimeout = setTimeout(() => {
                this.isDragging = false;
            }, 500);
        },
        stopDrag() {
            if (this.dragTimeout) clearTimeout(this.dragTimeout);
            this.dragTimeout = setTimeout(() => {
                this.isDragging = false;
            }, 150);
        },
    },
};
</script>
<style scoped>
/* Main CSS */
.visual-examples {
    background-color: #effdff;
}
.grid-wrapper > div {
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
}
.grid-wrapper img {
    width: 100%;
}
.grid-wrapper > div > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 5px;
}
.grid-wrapper {
    display: grid;
    grid-gap: 15px;
    grid-template-columns: repeat(auto-fit, minmax(252px, 1fr));
    grid-auto-rows: auto;
    grid-auto-flow: dense;
    cursor: pointer;
    height: 600px;
}
.grid-wrapper .wide {
    grid-column: span 2;
}
.grid-wrapper .tall {
    grid-row: span 2;
}
.grid-wrapper .big {
    grid-column: span 2;
    grid-row: span 2;
}
.bf-circle {
    border: 3px solid #fff;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    box-shadow: 0 0 12px rgba(51, 51, 51, 0.5);
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    outline-width: 3px;
    outline-color: transparent;
    background-color: #2ebcd4;
}
.bf-circle i {
    color: #fff;
}

.before figcaption,
.after figcaption {
    display: none;
}

.grid-wrapper .ve-1:hover .before figcaption {
    display: block;
}

.grid-wrapper .ve-1:hover .after figcaption {
    display: block;
}

.grid-wrapper .ve-2:hover .before figcaption {
    display: block;
}

.grid-wrapper .ve-2:hover .after figcaption {
    display: block;
}

.grid-wrapper .ve-3:hover .before figcaption {
    display: block;
}

.grid-wrapper .ve-3:hover .after figcaption {
    display: block;
}

.grid-wrapper .ve-4:hover .before figcaption {
    display: block;
}

.grid-wrapper .ve-4:hover .after figcaption {
    display: block;
}

.grid-wrapper .ve-5:hover .before figcaption {
    display: block;
}

.grid-wrapper .ve-5:hover .after figcaption {
    display: block;
}

.grid-wrapper .ve-6:hover .before figcaption {
    display: block;
}

.grid-wrapper .ve-6:hover .after figcaption {
    display: block;
}

.grid-wrapper .ve-7:hover .before figcaption {
    display: block;
}

.grid-wrapper .ve-7:hover .after figcaption {
    display: block;
}

.grid-wrapper .ve-8:hover .before figcaption {
    display: block;
}

.grid-wrapper .ve-8:hover .after figcaption {
    display: block;
}

.before figcaption {
    background: #5e5e5eb5;
    border: none;
    color: #fff;
    opacity: 0.8;
    padding: 12px;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    line-height: 100%;
}

.after figcaption {
    background: #5e5e5eb5;
    border: none;
    color: #fff;
    opacity: 0.8;
    padding: 12px;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    line-height: 100%;
}

.before figcaption {
    left: 12px;
}

.after figcaption {
    right: 13px;
}

.before-after {
    padding: 0;
    cursor: pointer;
}
figure {
    margin: 0;
}

.coloured-slider {
    outline: none;
    position: relative;
}

.same-size figure {
    /* width : 265px; */

    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
}

.visual-examples-wrapper {
    max-width: 1140px;
    margin: 0 auto;
}

/* Overlay effect for each image container */
.grid-wrapper > div {
    position: relative;
    overflow: hidden;
}

/* Overlay layer */
.grid-wrapper > div::after {
    content: "";
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: 5; /* Above the slider images */
}

/* Show overlay on hover */
.grid-wrapper > div:hover::after {
    opacity: 1;
}

/* Ensure figcaption text appears above overlay */

/* Ensure grid item is relative container */
.grid-wrapper > div {
    position: relative;
}

/* Overlay layer */
.grid-wrapper > div::after {
    content: "";
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.55);
    opacity: 0;
    transition: opacity 0.35s ease;
    z-index: 5;
    pointer-events: none; /* 🚀 makes slider & handle clickable */
}

.grid-wrapper > div:hover::after {
    opacity: 1;
}

/* Captions styling (non-blocking) */
.before figcaption,
.after figcaption {
    position: absolute;
    z-index: 6;
    transition: opacity 0.3s ease;
    opacity: 0;
    pointer-events: none; /* 🧠 keeps slider handle clickable */
}

/* Show captions on hover */
.grid-wrapper > div:hover .before figcaption,
.grid-wrapper > div:hover .after figcaption {
    opacity: 1;
}

/* Caption positioning */
.before figcaption {
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
}

.after figcaption {
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
}

/* Hide overlay + captions when dragging */
.hide-overlay::after {
    opacity: 0 !important;
}

.hide-overlay .before figcaption,
.hide-overlay .after figcaption {
    opacity: 0 !important;
}

.hide-overlay::after {
    opacity: 0 !important;
}
.hide-overlay .before figcaption,
.hide-overlay .after figcaption {
    opacity: 0 !important;
}

/* Ensure 'Before' and 'After' texts are always visible above handle */
.before figcaption,
.after figcaption {
    z-index: 999 !important; /* lift captions above slider handle & split bar */
    mix-blend-mode: normal;
}

/* optional: small shadow behind text for better readability */
.before figcaption,
.after figcaption {
    text-shadow: 0 2px 6px rgba(0, 0, 0, 0.6);
}

.before figcaption {
    left: 20px !important; /* move inside from the left edge */
    transform: translateY(-50%);
}

/* (optional) add small shadow for readability */
.before figcaption,
.after figcaption {
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}
</style>
