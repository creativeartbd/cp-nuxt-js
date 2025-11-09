<template>
    <section class="sample-page" v-if="data" :style="{ backgroundColor: data.background_color }">
        <div class="container">
            <div class="row">
                <div class="col-md-12 section-title text-center">
                    <h2>{{ data.title }}</h2>
                    <div v-html="data.sub_title"></div>
                    <div class="divide-separator divide-center"></div>
                </div>
                <div class="col-md-12">
                    <div class="d-flex align-items-start sample-work">
                        <div
                            class="nav flex-column nav-pills me-3"
                            id="v-pills-tab"
                            role="tablist"
                            aria-orientation="vertical"
                        >
                            <button
                                class="nav-link"
                                :class="{ active: activeTab === 'All' }"
                                id="v-pills-home-tab"
                                data-bs-toggle="pill"
                                data-bs-target="#v-pills-home"
                                type="button"
                                role="tab"
                                aria-controls="v-pills-home"
                                aria-selected="true"
                                @click="setActiveTab('All')"
                            >
                                All
                            </button>
                            <button
                                v-for="(tab, index) in data.tabs"
                                :key="index"
                                class="nav-link"
                                :class="{ active: activeTab === tab.tab_name }"
                                :id="'v-pills-' + index + '-tab'"
                                data-bs-toggle="pill"
                                :data-bs-target="'#v-pills-' + index"
                                type="button"
                                role="tab"
                                :aria-controls="'v-pills-' + index"
                                :aria-selected="activeTab === tab.tab_name"
                                @click="setActiveTab(tab.tab_name)"
                            >
                                {{ tab.tab_name }}
                            </button>
                        </div>
                        <div class="tab-content" id="v-pills-tabContent">
                            <div
                                class="tab-pane fade"
                                :class="{ 'show active': activeTab === 'All' }"
                                id="v-pills-home"
                                role="tabpanel"
                                aria-labelledby="v-pills-home-tab"
                            >
                                <div class="row">
                                    <div class="col-sm-6 col-md-4" v-for="(image, index) in allImages" :key="index">
                                        <div class="single-sample" @click.prevent="handleImgClick(image)">
                                            <img class="active-image" :src="image.before_image" alt="" />
                                            <img class="hover-image" :src="image.after_image" alt="" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div
                                v-for="(tab, index) in data.tabs"
                                :key="index"
                                class="tab-pane fade"
                                :class="{ 'show active': activeTab === tab.tab_name }"
                                :id="'v-pills-' + index"
                                role="tabpanel"
                                :aria-labelledby="'v-pills-' + index + '-tab'"
                            >
                                <div class="row">
                                    <div
                                        class="col-sm-6 col-md-4"
                                        v-for="(image, imgIndex) in tab.images"
                                        :key="imgIndex"
                                    >
                                        <div class="single-sample" @click.prevent="handleImgClick(image)">
                                            <img class="active-image" :src="image.before_image" alt="" />
                                            <img class="hover-image" :src="image.after_image" alt="" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Preload images (hidden) -->
        <div style="display: none">
            <img
                v-for="image in allImages"
                :key="'preload-' + image.key"
                :src="image.popup_image"
                @load="markAsPreloaded(image.key)"
                @error="markAsPreloaded(image.key)"
            />
        </div>

        <!-- When the single image is clicked -->
        <div class="overlay" v-if="isPopupVisible" @click="closePopup"></div>
        <div class="arrows" v-if="isPopupVisible">
            <i
                class="bi bi-arrow-left-circle"
                @click.prevent="handlePrev(popupImgSrc.index)"
                :class="{ disabled: popupImgSrc.index === 0 }"
            ></i>
            <i
                class="bi bi-arrow-right-circle"
                @click.prevent="handleNext(popupImgSrc.index)"
                :class="{ disabled: popupImgSrc.index === allImages.length - 1 }"
            ></i>
        </div>
        <div class="image-popup" v-if="isPopupVisible">
            <div class="cross" @click="closePopup">
                <i class="bi bi-x-octagon"></i>
            </div>

            <!-- Loading spinner with shorter timeout -->
            <div class="d-flex justify-content-center align-items-center loading-container" v-if="!isImgLoaded">
                <div class="spinner-grow" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>

            <!-- Main image -->
            <div class="image-container" v-show="isImgLoaded">
                <img :src="popupImgSrc.popup_image" alt="" @load="setImgLoad" @error="handleImageError" />
            </div>

            <p class="image-title">
                {{ popupImgSrc.popup_image_text }}
                <span class="image-count"> {{ popupImgSrc.index + 1 }} of {{ allImages.length }} </span>
            </p>
        </div>
    </section>
</template>

<script>
export default {
    props: ["data"],
    data() {
        return {
            activeTab: "All",
            allImages: [],
            popupImgSrc: null,
            isPopupVisible: false,
            isImgLoaded: false,
            preloadedImages: new Set(),
            loadingTimeout: null,
        };
    },
    methods: {
        markAsPreloaded(imageKey) {
            this.preloadedImages.add(imageKey);
        },

        setImgLoad() {
            if (this.loadingTimeout) {
                clearTimeout(this.loadingTimeout);
            }
            this.isImgLoaded = true;
        },

        handleImageError() {
            console.warn("Image failed to load");
            this.setImgLoad();
        },

        handlePrev(currentIndex) {
            if (currentIndex === 0) return;

            const prevIndex = currentIndex - 1;
            if (this.allImages[prevIndex]) {
                this.changeImage(this.allImages[prevIndex]);
            }
        },

        handleNext(currentIndex) {
            if (currentIndex === this.allImages.length - 1) return;

            const nextIndex = currentIndex + 1;
            if (this.allImages[nextIndex]) {
                this.changeImage(this.allImages[nextIndex]);
            }
        },

        changeImage(image) {
            const isPreloaded = this.preloadedImages.has(image.key);

            if (isPreloaded) {
                this.isImgLoaded = true;
            } else {
                this.isImgLoaded = false;
                this.loadingTimeout = setTimeout(() => {
                    this.isImgLoaded = true;
                }, 2000);
            }

            this.popupImgSrc = {
                src: image.before_image,
                popup_image_text: image.popup_image_text,
                index: image.key,
                popup_image: image.popup_image,
            };
        },

        closePopup() {
            this.isPopupVisible = false;
            if (this.loadingTimeout) {
                clearTimeout(this.loadingTimeout);
            }
        },

        handleImgClick(image) {
            this.changeImage(image);
            this.isPopupVisible = true;
        },

        setActiveTab(tabTitle) {
            this.activeTab = tabTitle;
        },

        preloadAdjacentImages(currentIndex) {
            const imagesToPreload = [];

            if (currentIndex > 0) {
                imagesToPreload.push(this.allImages[currentIndex - 1]);
            }

            if (currentIndex < this.allImages.length - 1) {
                imagesToPreload.push(this.allImages[currentIndex + 1]);
            }

            imagesToPreload.forEach((image) => {
                if (!this.preloadedImages.has(image.key)) {
                    const img = new Image();
                    img.onload = () => this.markAsPreloaded(image.key);
                    img.onerror = () => this.markAsPreloaded(image.key);
                    img.src = image.popup_image;
                }
            });
        },
    },

    watch: {
        popupImgSrc: {
            handler(newVal) {
                if (newVal && this.isPopupVisible) {
                    this.preloadAdjacentImages(newVal.index);
                }
            },
            immediate: true,
        },
    },

    mounted() {
        let uniqueIndex = 0;
        if (this.data && this.data.tabs && Array.isArray(this.data.tabs)) {
            this.data.tabs.forEach((tab) => {
                tab.images.forEach((image) => {
                    image.key = uniqueIndex++;
                    this.allImages.push(image);
                });
            });
        }

        document.addEventListener("keydown", (e) => {
            if (this.isPopupVisible) {
                if (e.key === "ArrowLeft") {
                    this.handlePrev(this.popupImgSrc.index);
                } else if (e.key === "ArrowRight") {
                    this.handleNext(this.popupImgSrc.index);
                } else if (e.key === "Escape") {
                    this.closePopup();
                }
            }
        });
    },

    beforeDestroy() {
        if (this.loadingTimeout) {
            clearTimeout(this.loadingTimeout);
        }
    },
};
</script>

<style>
/* ORIGINAL STYLES - PRESERVED */
.sample-page {
    background-color: #ddd;
}
.sample-work .nav-pills .nav-link.active,
.nav-pills .show > .nav-link {
    background-color: #00bcd4;
    /* background-image: linear-gradient(90deg, #00bcd4 0%, #0dd1ff 100%); */
    border: none;
}

.sample-work .nav-link {
    color: #333;
    text-align: left;
    border: 1px solid #333;
    border-radius: 0;
    background: #f1f1f1;
}

.sample-work .nav button {
    width: 250px;
    margin-bottom: 10px;
}

.single-sample {
    box-shadow: 1px 1px 1px #ddd;
    margin-bottom: 15px;
    cursor: pointer;
    margin-bottom: 25px;
    min-width: 327px;
}

.single-sample img {
    width: 100%;
}

.single-sample .hover-image {
    display: none;
    transition: all ease-in 0.1s;
}

.single-sample:hover .hover-image {
    display: block;
}

.single-sample:hover .active-image {
    display: none;
}

.overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    z-index: 9999 !important;
    opacity: 1 !important;
    visibility: visible !important;
}

.image-popup {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 999999;
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    min-height: 300px; /* Add minimum height */
    min-width: 400px; /* Add minimum width */
}

.image-popup p {
    margin-bottom: 0;
}

.image-popup img {
    max-width: 100%;
    height: auto;
    display: block;
    border-radius: 5px;
    min-height: 200px; /* Prevent layout shift */
}

.image-popup .cross {
    position: absolute;
    top: -30px;
    right: 0px;
    cursor: pointer;
    z-index: 1001; /* Add this line */
}

.image-popup .cross i {
    color: #fff; /* or any visible color */
    font-size: 24px; /* make it larger to see if it's there */
}

.image-popup span.image-count {
    float: right;
}

.arrows {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 9999;
    padding: 20px;
    border-radius: 10px;
    display: flex;
    width: 100%;
    justify-content: space-between;
}

.arrows i {
    color: #fff;
    font-size: 30px;
    cursor: pointer;
}

.image-popup .spinner-grow {
    width: 3rem;
    height: 3rem;
    color: #00bcd4;
}

.image-title {
    position: absolute;
    bottom: -32px;
    color: #fff;
    display: flex;
    justify-content: space-between;
    width: 100%;
}

/* NEW RESPONSIVE ADDITIONS - DO NOT MODIFY ABOVE */
@media (max-width: 768px) {
    .sample-work {
        flex-direction: column;
    }

    .sample-work .nav {
        margin-bottom: 20px;
        margin-right: 0 !important;
    }

    .sample-work .nav button {
        width: 100%;
    }

    .single-sample {
        min-width: auto;
    }

    .image-popup {
        min-width: 90vw;
        min-height: 300px;
        padding: 15px;
    }

    .arrows i {
        font-size: 28px;
    }
}

@media (max-width: 576px) {
    .image-popup {
        min-width: 95vw;
        padding: 10px;
    }

    .arrows i {
        font-size: 24px;
    }

    .arrows {
        padding: 10px;
    }
}

/* NEW OPTIMIZATION STYLES */
.loading-container {
    min-height: 200px;
}

.image-container {
    text-align: center;
}

.arrows i.disabled {
    color: #666;
    cursor: not-allowed;
    opacity: 0.5;
}

.arrows i:hover:not(.disabled) {
    color: #00bcd4;
}
</style>
