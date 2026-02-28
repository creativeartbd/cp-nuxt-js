<template>
    <div class="editing-services" v-if="data" :style="{ backgroundColor: data.background_color }">
        <div class="container">
            <div class="d-flex justify-content-center" v-if="isLoading">
                <div class="spinner-grow" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>

            <div class="row" v-else>
                <div class="col-12 text-center section-title">
                    <h2 v-if="data.title">{{ data.title }}</h2>
                    <p v-if="data.sub_title">{{ data.sub_title }}</p>
                    <div class="divide-separator divide-center"></div>
                </div>

                <div class="col-12" v-if="hasValidTabs">
                    <ul class="nav nav-tabs" id="myTab" role="tablist">
                        <li class="nav-item" role="presentation" v-for="(tab, index) in data.tabs" :key="index">
                            <button
                                class="nav-link"
                                :class="{ active: index === 0 }"
                                :id="`tab-${index}`"
                                data-bs-toggle="tab"
                                :data-bs-target="`#content-${index}`"
                                type="button"
                                role="tab"
                                :aria-controls="`content-${index}`"
                                :aria-selected="index === 0"
                            >
                                {{ tab.tab_name }}
                            </button>
                        </li>
                    </ul>

                    <div class="tab-content" id="myTabContent">
                        <div
                            class="tab-pane fade"
                            :class="{ 'show active': index === 0 }"
                            :id="`content-${index}`"
                            role="tabpanel"
                            :aria-labelledby="`tab-${index}`"
                            v-for="(tab, index) in data.tabs"
                            :key="`content-${index}`"
                        >
                            <div class="row">
                                <div class="col-md-8">
                                    <!-- use getImages(tab) helper so it's always an array -->
                                    <div class="ods-mini-wrapper">
                                        <div
                                            class="ods-mini-img"
                                            v-for="(image, imageIndex) in loadedTabs.has(index) ? getImages(tab) : []"
                                            :key="imageIndex"
                                        >
                                            <img
                                                :src="image.image"
                                                loading="lazy"
                                                @click="handleImageClick(image, image.choose_a_service)"
                                            />
                                            <h6>
                                                <NuxtLink
                                                    @click="handleImageClick(image, image.choose_a_service)"
                                                    v-if="image.choose_a_service"
                                                    :to="'/' + image.choose_a_service"
                                                >
                                                    {{ image.title || `Image ${imageIndex + 1}` }}
                                                </NuxtLink>
                                                <NuxtLink v-else>
                                                    {{ image.title || `Image ${imageIndex + 1}` }}
                                                </NuxtLink>
                                            </h6>
                                        </div>
                                    </div>
                                </div>

                                <div class="col-md-4">
                                    <div
                                        class="before-after"
                                        v-if="beforeImg && afterImg"
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
                                                <img style="object-fit: cover; width: 100%" :src="beforeImg" loading="lazy" />
                                            </figure>

                                            <figure slot="second" class="after">
                                                <img style="object-fit: cover; width: 100%" :src="afterImg" loading="lazy" />
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

                                    <div class="before-after-bottom">
                                        <template v-if="currentServiceLink">
                                            <NuxtLink :to="'/' + currentServiceLink">{{
                                                data.discover_button_text
                                            }}</NuxtLink>
                                        </template>

                                        <template v-if="data.contact_button_level && data.contact_button_url">
                                            <NuxtLink :to="data.contact_button_url">{{
                                                data.contact_button_level
                                            }}</NuxtLink>
                                        </template>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-12" v-else>
                    <div class="alert alert-info">No editing services data available at the moment.</div>
                </div>
            </div>
        </div>
    </div>
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
            isDragging: false,
            isLoading: false,
            isImageLoading: false,
            currentServiceLink: null,
            beforeImg: null,
            afterImg: null,
            loadedTabs: new Set(),
            tabImagesState: {},
        };
    },
    created() {
        // Set initial before/after images from first tab's data on both server and client,
        // so SSR renders the correct image and avoids the placeholder flash on mount.
        if (!this.hasValidTabs) return;
        const firstTab = this.data.tabs[0];
        const images = this.getImages(firstTab);
        if (!images.length) return;
        const chosen = images.find((i) => i.before_image && i.after_image) || images[0];
        this.beforeImg = chosen.before_image || chosen.image || null;
        this.afterImg = chosen.after_image || chosen.image || null;
        this.currentServiceLink = chosen.choose_a_service || null;
        this.tabImagesState[0] = {
            before: this.beforeImg,
            after: this.afterImg,
            link: this.currentServiceLink,
        };
        this.loadedTabs.add(0);
    },
    computed: {
        hasValidTabs() {
            return this.data && Array.isArray(this.data.tabs) && this.data.tabs.length > 0;
        },
    },
    mounted() {
        this.activateTab(0);
        this.fixBootstrapTabs();
    },
    methods: {
        fixBootstrapTabs() {
            const tabEl = document.getElementById("myTab");
            if (!tabEl) return;

            tabEl.addEventListener("shown.bs.tab", (event) => {
                const id = event.target.getAttribute("id"); // tab-2
                const index = Number(id.split("-")[1]);

                this.activateTab(index);

                this.$nextTick(() => {
                    window.dispatchEvent(new Event("resize"));
                });
            });
        },
        activateTab(index) {
            this.activeTabIndex = index;

            if (!this.loadedTabs.has(index)) {
                const tab = this.data.tabs[index];
                if (!tab) return;

                const images = this.getImages(tab);
                images.forEach((img) => {
                    this.preload(img.image);
                    this.preload(img.before_image);
                    this.preload(img.after_image);
                });

                this.setInitialTabImage(index);
                this.loadedTabs.add(index);
            }

            this.applyTabImage(index);
        },
        setInitialTabImage(index) {
            const tab = this.data.tabs[index];
            if (!tab) return;

            const images = this.getImages(tab);
            if (!images.length) return;

            const firstWithBoth = images.find((i) => i.before_image && i.after_image);
            const chosen = firstWithBoth || images[0];

            this.tabImagesState[index] = {
                before: chosen.before_image || chosen.image,
                after: chosen.after_image || chosen.image,
                link: chosen.choose_a_service,
            };

            this.applyTabImage(index);
        },
        applyTabImage(index) {
            const state = this.tabImagesState[index];
            if (!state) return;

            this.beforeImg = state.before;
            this.afterImg = state.after;
            this.currentServiceLink = state.link;
        },
        // normalize tab.tab_images into an array
        getImages(tab) {
            if (!tab) return [];
            const imgs = tab.tab_images;
            if (!imgs) return [];
            return Array.isArray(imgs) ? imgs : [imgs];
        },

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

        preloadImage() {
            if (!this.hasValidTabs) return;

            // iterate tabs safely
            this.data.tabs.forEach((tab) => {
                const images = this.getImages(tab);
                images.forEach((image) => {
                    if (image?.image) this.preloadImage(image.image);
                    if (image?.before_image) this.preloadImage(image.before_image);
                    if (image?.after_image) this.preloadImage(image.after_image);
                });
            });
        },

        preloadImage(url) {
            if (!url) return;
            const img = new Image();
            img.src = url;
        },

        async handleImageClick(image, serverLink) {
            const before = image.before_image || image.image;
            const after = image.after_image || image.image;

            await Promise.all([this.preload(before), this.preload(after)]);

            this.tabImagesState[this.activeTabIndex] = {
                before,
                after,
                link: serverLink,
            };

            this.applyTabImage(this.activeTabIndex);
        },

        preload(url) {
            return new Promise((resolve, reject) => {
                if (!url) return resolve();

                const img = new Image();

                img.onload = () => resolve(url);
                img.onerror = () => resolve(url); // never block UI if image fails

                img.src = url;
            });
        },

        imageLoaded() {
            this.isImageLoading = false;
        },

        setInitialImage() {
            if (!this.hasValidTabs) return;

            // find first tab with images
            const firstTab = this.data.tabs.find((tab) => this.getImages(tab).length > 0);
            if (!firstTab) return;

            // find first image with both before and after; fallback to first image otherwise
            const images = this.getImages(firstTab);
            const firstWithBoth = images.find((img) => img.before_image && img.after_image);

            const chosen = firstWithBoth || images[0];

            if (chosen) {
                this.beforeImg = chosen.before_image || chosen.image || this.beforeImg;
                this.afterImg = chosen.after_image || chosen.image || this.afterImg;
                this.currentServiceLink = chosen.choose_a_service;
            }
        },
    },
};
</script>
<style>
.loading-indicator {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 10;
}
:host(:focus) {
    outline: none !important;
}

.editing-services {
    padding-top: 100px;
    padding-bottom: 50px;
}

.editing-services ul li {
    margin-bottom: 0;
}

.editing-services .nav-item button {
    color: #000;
}

.editing-services .ods-mini-img {
    box-shadow: 0px 0px 30px 0px rgba(43.00000000000019, 27, 154, 0.08);
    border-radius: 3px;
    margin-bottom: 15px;
    background-color: #fff;
    padding: 3px;
}

.editing-services .ods-mini-img img {
    transition: transform 0.4s ease-in-out;
    margin-bottom: 10px;
    object-fit: cover;
    width: 100%;
    height: auto;
    cursor: pointer;
}

.editing-services .ods-mini-img img:hover {
    transform: scale(1.06);
}

.editing-services .ods-mini-img:hover h6 {
    color: #00bcd4;
    cursor: pointer;
}

.before,
.after {
    margin: 0;
}

/* .before-after {
    padding: 0;
    cursor: pointer;
    position: relative;
    height: 495px;
    overflow: hidden;
}

.before-after img {
    height: 495px;
    object-fit: contain;
} */

.before-after {
    position: relative;
    width: 100%;
}

.before-after img {
    width: 100%;
    height: auto;
    object-fit: contain;
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

.ods-mini-wrapper {
    display: flex;
    column-gap: 15px;
    flex-wrap: wrap;
}

.alert {
    padding: 20px;
    border-radius: 5px;
}

.editing-services .ods-mini-img h6 {
    margin-top: 0;
    margin-bottom: 5px;
    text-align: center;
    font-weight: normal;
}

.editing-services .ods-mini-img h6 a {
    color: #000;
}

.editing-services .ods-mini-img h6 a:hover {
    color: #00bcd4;
}

/* --- FINAL FIX: Slider and Caption Styling --- */

/* --- Overlay and NEW Label Styling --- */
.comparison-label {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(0, 0, 0, 0.25);
    color: #fff;
    padding: 7px 15px; /* Consistent padding for same size */
    border-radius: 4px;
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: 9999; /* Above everything */
    pointer-events: none; /* Allows clicking through to the slider */
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
.before-after:hover .comparison-label {
    opacity: 1;
}

/* Hide labels when dragging for a better user experience */
.hide-overlay .comparison-label {
    opacity: 0 !important;
}

.tab-pane {
    transition: opacity 0.25s ease;
}
.tab-pane:not(.show) {
    display: block !important;
    height: 0;
    overflow: hidden;
    opacity: 0;
}
.tab-pane.show {
    height: auto;
    opacity: 1;
}
</style>
