<template>
    <section class="visual-examples" v-if="data" :style="{ backgroundColor: data.background_color }">
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
                                        <img slot="first" :src="example.before_image" alt="Before image" />
                                    </figure>
                                    <figure slot="second" class="after">
                                        <img slot="second" :src="example.after_image" alt="After image" />
                                    </figure>
                                    <div slot="handle">
                                        <div class="bf-circle">
                                            <i class="bi bi-caret-left-fill"></i>
                                            <i class="bi bi-caret-right-fill"></i>
                                        </div>
                                    </div>
                                    <!-- eslint-enable -->
                                </ImgComparisonSlider>

                                <!-- NEW: Overlay Labels positioned outside the slider -->
                                <div class="comparison-label before-label">Before</div>
                                <div class="comparison-label after-label">After</div>
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
/* --- General Layout & Section Styling --- */
.visual-examples {
    background-color: #effdff;
    padding: 60px 0;
    cursor: pointer;
}

.visual-examples-wrapper {
    max-width: 1140px;
    margin: 0 auto;
}

/* --- Grid Layout --- */
.grid-wrapper {
    display: grid;
    grid-gap: 15px;
    grid-auto-rows: 280px;
    grid-template-columns: repeat(auto-fit, minmax(252px, 1fr));
    grid-auto-flow: dense;
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

/* --- Grid Item & Slider Styling --- */
.grid-wrapper > div {
    position: relative; /* Crucial for positioning the new overlay labels */
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    height: 100%;
    border-radius: 5px;
}

.grid-wrapper .coloured-slider {
    width: 100%;
    height: 100%;
    outline: none;
}

.grid-wrapper img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

figure {
    margin: 0;
}

/* --- Slider Handle Styling --- */
.bf-circle {
    border: 3px solid #fff;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    box-shadow: 0 0 12px rgba(51, 51, 51, 0.5);
    background-color: #2ebcd4;
    position: relative;
    z-index: 10;
    display: flex;
    justify-content: center;
    align-items: center;
}

.bf-circle i {
    color: #fff;
}

/* --- Overlay & NEW Label Styling --- */

/* Overlay layer that appears on hover */
.grid-wrapper > div::after {
    content: "";
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    opacity: 0;
    transition: opacity 0.35s ease;
    z-index: 5;
    pointer-events: none;
}

/* --- FINAL FIX: Identical, Centered Overlay Labels --- */
.comparison-label {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(255, 255, 255, 0.15);
    color: #fff;
    padding: 7px 15px; /* Consistent padding for same size */
    border-radius: 4px;
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: 9999; /* Above everything */
    pointer-events: none;
    font-size: 14px;
    white-space: nowrap; /* Prevents text from wrapping */
}

/* Specific positioning for each label */
.before-label {
    left: 20px;
}

.after-label {
    right: 20px;
}

/* --- Hover & Drag State Effects --- */

/* Show overlay and labels on hover */
.grid-wrapper > div:hover::after,
.grid-wrapper > div:hover .comparison-label {
    opacity: 1;
}

/* Hide overlay and labels when dragging */
.hide-overlay::after,
.hide-overlay .comparison-label {
    opacity: 0 !important;
}
</style>
