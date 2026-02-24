<template>
    <section class="portrait-skin" v-if="data" :style="sectionStyle">
        <div class="container">
            <div class="row">
                <div class="col-md-8">
                    <div class="section-title">
                        <h2 v-if="data.title">
                            {{ data.title }}
                        </h2>
                        <p v-if="data.sub_title">
                            {{ data.sub_title }}
                        </p>
                    </div>

                    <!-- <blockquote class="skin-review">
                            <img src="@/assets/images/quote.png" class="quote" alt="Quote" />
                            <p>{{ data.user_review }}</p>
                        </blockquote> -->

                    <div v-if="data.content" v-html="data.content"></div>
                    <div class="animated-border-quote" v-if="data.user_review" v-html="data.user_review"></div>
                </div>
                <div class="col-md-4">
                    <div
                        class="before-after"
                        v-if="data.before_image && data.after_image"
                        :class="{ 'hide-overlay': isDragging }"
                    >
                        <!-- SLIDER 1 -->
                        <ImgComparisonSlider
                            class="coloured-slider"
                            @input="handleMove"
                            @mousedown="startDrag"
                            @touchstart="startDrag"
                            @mouseup="stopDrag"
                            @touchend="stopDrag"
                            @mouseleave="stopDrag"
                        >
                            <figure slot="first" class="before">
                                <img style="object-fit: cover; width: 100%" :src="data.before_image" loading="lazy" />
                            </figure>

                            <figure slot="second" class="after">
                                <img style="object-fit: cover; width: 100%" :src="data.after_image" loading="lazy" />
                            </figure>

                            <div slot="handle">
                                <div class="bf-circle">
                                    <i class="bi bi-caret-left-fill"></i>
                                    <i class="bi bi-caret-right-fill"></i>
                                </div>
                            </div>
                        </ImgComparisonSlider>

                        <!-- NEW: Overlay Labels positioned outside the slider -->
                        <div class="comparison-label before-label">Before</div>
                        <div class="comparison-label after-label">After</div>

                        <div v-if="isImageLoading" class="loading-indicator">
                            <div class="spinner-border" role="status">
                                <span class="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    </div>

                    <div class="button-group">
                        <router-link
                            class="place-order"
                            :to="data.order_button_url ? data.order_button_url : null"
                            v-if="data.order_button_text"
                            >{{ data.order_button_text }}</router-link
                        >
                        <router-link
                            class="free-trial"
                            :to="data.trial_button_url ? data.trial_button_url : null"
                            v-if="data.trial_button_text"
                            >{{ data.trial_button_text }}</router-link
                        >
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import { ImgComparisonSlider } from "@img-comparison-slider/vue";
export default {
    props: ["data", "color"],
    data() {
        return {
            bgColor: this.color,
            isDragging: false,
            beforeImg:
                "https://i0.wp.com/cutoutpartner.com/wp-content/uploads/2021/04/1S7A3520-Before.jpg?fit=600%2C686&ssl=1",
            afterImg:
                "https://i0.wp.com/cutoutpartner.com/wp-content/uploads/2021/04/1S7A3520-After.jpg?fit=600%2C686&ssl=1",
        };
    },
    components: {
        ImgComparisonSlider,
    },
    computed: {
        sectionStyle() {
            // Check if data exists and if background_color has a value
            if (this.data && this.data.background_color) {
                return { backgroundColor: this.data.background_color };
            }
            // Otherwise, return the default color
            return { backgroundColor: "#effdfe" };
        },
    },
    methods: {
        handleMove() {
            this.isDragging = true;
            if (this.dragTimeout) clearTimeout(this.dragTimeout);
            this.dragTimeout = setTimeout(() => (this.isDragging = false), 500);
        },
        startDrag() {
            this.isDragging = true;
            if (this.dragTimeout) clearTimeout(this.dragTimeout);
        },
        stopDrag() {
            if (this.dragTimeout) clearTimeout(this.dragTimeout);
            this.dragTimeout = setTimeout(() => (this.isDragging = false), 150);
        },
    },
};
</script>
<style scoped>
/* --- Your Existing Component Styles (Unchanged) --- */
.portrait-skin {
    background-color: #effdfe;
}
.skin-review {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    text-align: left;
    gap: 20px;
}
blockquote.skin-review img {
    float: left;
    width: auto;
}
.portrait-skin-image:focus {
    outline: 0;
}
.portrait-skin ul {
    padding: 0;
}
.portrait-skin ul li {
    list-style-position: inside;
    line-height: 200%;
}
.place-order,
.free-trial {
    border: none;
    border-radius: 25px;
    color: #fff;
    padding: 12px 0;
    font-size: 15px;
}
.place-order {
    background-color: #00bcd4;
}
.free-trial {
    background-color: #45465a;
}
@keyframes clockwise {
    0% {
        transform: rotate(0);
    }
    100% {
        transform: rotate(360deg);
    }
}
@keyframes counter {
    0% {
        transform: rotate(0);
    }
    100% {
        transform: rotate(-360deg);
    }
}
.animated-shadow-quote {
    display: inline-block;
    margin: 1em;
    max-width: 20em;
    position: relative;
}
.animated-shadow-quote blockquote {
    animation: shadows 2s linear infinite alternate;
    display: inline-block;
    margin: 0;
    padding: 1em;
}
.animated-shadow-quote blockquote cite {
    display: block;
    font-style: italic;
    text-align: right;
}
.animated-shadow-quote blockquote cite:before {
    content: "- ";
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
@keyframes shadows {
    0% {
        box-shadow: 0 2px 4px -2px rgba(0, 0, 0, 0.75);
        transform: scale(0.95);
    }
    100% {
        box-shadow: 0 0 4px 2px rgba(0, 0, 0, 0.75);
        transform: scale(1);
    }
}
.rendered:focus {
    outline: 0 !important;
}

/* --- FINAL FIX: Slider and Caption Styling --- */

/* Ensure the container is positioned for the overlay labels */
.portrait-skin-image {
    position: relative;
}

/* Set the dimensions for the slider itself */
.portrait-skin-image .ImgComparisonSlider {
    width: 353px;
    height: 403px;
    max-width: 100%;
}

/* Ensure images inside the slider cover the area without distortion */
.portrait-skin-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

/* --- Overlay and NEW Label Styling --- */
.comparison-label {
    position: absolute;
    top: 45%;
    transform: translateY(-50%);
    background: rgba(0, 0, 0, 0.25);
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

/* Show labels on hover */
.before-after::after {
    content: "";
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.2);
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
}

.before-after:hover::after {
    opacity: 1;
}

.hide-overlay .comparison-label {
    opacity: 0 !important;
}

.before-after.hide-overlay::after {
    opacity: 0 !important;
}

.before,
.after {
    margin: 0;
}

.before-after {
    /* box-shadow: 0px 13px 38px 0px rgba(59.000000000000014, 190, 255, 0.16); */
    padding: 0;
    cursor: pointer;
    /* background: #d5e7ff; */
    position: relative;
}

.before-after-message {
    text-align: center;
    padding: 30px;
    background: #f5f5f5;
    color: #666;
    border-radius: 4px;
    margin-bottom: 20px;
}

.coloured-slider {
    --divider-color: rgba(255, 255, 255, 1);
    --default-handle-color: rgba(255, 255, 255, 1);
    --divider-width: 4px !important;
    position: relative;
    border-width: 10px;
    outline: 0;
}

.divider:after {
    border-width: 10px;
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

.before-after-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
}

.before-after-bottom a {
    text-decoration: none;
    color: #000;
}

.before-after-bottom a:hover {
    font-style: normal;
    color: #2ebcd4;
}

/* Specific positioning for each label */
.before-label {
    left: 20px;
}

.after-label {
    right: 20px;
}

/* Show labels on hover */
.before-after:hover .comparison-label {
    opacity: 1;
}

/* Hide labels when dragging for a better user experience */
.hide-overlay .comparison-label {
    opacity: 0 !important;
}
</style>
