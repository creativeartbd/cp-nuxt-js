<template>
    <div class="editing-services" v-if="data">
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
                                    <div
                                        class="ods-mini-wrapper"
                                        v-for="(image, imageIndex) in tab.tab_images"
                                        :key="imageIndex"
                                    >
                                        <div class="ods-mini-img">
                                            <img :src="image.image" @click="handleImageClick(image)" />
                                            <h6 @click="handleImageClick(image)">
                                                {{ image.title || `Image ${imageIndex + 1}` }}
                                            </h6>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="before-after" v-if="beforeImg && afterImg">
                                        <ImgComparisonSlider class="coloured-slider">
                                            <div class="overlay"></div>
                                            <figure slot="first" class="before">
                                                <div class="overlay"></div>
                                                <img
                                                    slot="first"
                                                    style="width: 100%"
                                                    :src="beforeImg"
                                                    @load="imageLoaded"
                                                />
                                                <figcaption>Before</figcaption>
                                            </figure>
                                            <figure slot="second" class="after">
                                                <div class="overlay"></div>
                                                <img
                                                    slot="second"
                                                    style="width: 100%"
                                                    :src="afterImg"
                                                    @load="imageLoaded"
                                                />
                                                <figcaption>After</figcaption>
                                            </figure>
                                            <div slot="handle">
                                                <div class="bf-circle">
                                                    <i class="bi bi-caret-left-fill"></i>
                                                    <i class="bi bi-caret-right-fill"></i>
                                                </div>
                                            </div>
                                        </ImgComparisonSlider>
                                        <div v-if="isImageLoading" class="loading-indicator">
                                            <div class="spinner-border" role="status">
                                                <span class="visually-hidden">Loading...</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="before-after-message" v-else>
                                        <p>Click on an image to view before/after comparison (if available)</p>
                                    </div>

                                    <div class="before-after-bottom">
                                        <a href="#">Discover this service</a>
                                        <a href="#">Contact Us</a>
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
            isLoading: false,
            beforeImg: null,
            afterImg: null,
            isImageLoading: false,
        };
    },
    computed: {
        hasValidTabs() {
            return this.data && this.data.tabs && Array.isArray(this.data.tabs) && this.data.tabs.length > 0;
        },
    },
    mounted() {
        this.preloadImages();
        this.setInitialImage();
    },
    methods: {
        preloadImages() {
            if (!this.hasValidTabs) return;

            this.data.tabs.forEach((tab) => {
                if (tab.tab_images) {
                    tab.tab_images.forEach((image) => {
                        this.preloadImage(image.image);
                        if (image.before_image) {
                            this.preloadImage(image.before_image);
                        }
                        if (image.after_image) {
                            this.preloadImage(image.after_image);
                        }
                    });
                }
            });
        },
        preloadImage(url) {
            const img = new Image();
            img.src = url;
        },
        handleImageClick(image) {
            if (!image) return;

            this.isImageLoading = true;

            if (image.before_image && image.after_image) {
                this.beforeImg = image.before_image;
                this.afterImg = image.after_image;
            } else {
                this.beforeImg = null;
                this.afterImg = null;
            }
        },
        imageLoaded() {
            this.isImageLoading = false;
        },
        setInitialImage() {
            if (!this.hasValidTabs) return;

            // Find first tab with images
            const firstTab = this.data.tabs.find((tab) => tab.tab_images && tab.tab_images.length > 0);

            if (firstTab) {
                // Find first image with before/after
                const firstImageWithComparison = firstTab.tab_images.find(
                    (img) => img && img.before_image && img.after_image
                );

                if (firstImageWithComparison) {
                    this.handleImageClick(firstImageWithComparison);
                }
            }
        },
    },
};
</script>

<style scoped>
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
    background-color: #fff;
    background-image: url("../../../assets/images/background.png");
    background-size: cover;
    background-position: center center;
    background-repeat: no-repeat;
    background-color: #f5feff;
    background-color: transparent;
    background-image: linear-gradient(90deg, #c3f6ff 0%, #dfddff 100%);
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
    height: 156px;
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

.before figcaption,
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
    display: none;
}

.before figcaption {
    left: 12px;
}

.after figcaption {
    right: 12px;
}

.before-after:hover figcaption {
    display: block;
}

.before-after {
    box-shadow: 0px 13px 38px 0px rgba(59.000000000000014, 190, 255, 0.16);
    padding: 0;
    cursor: pointer;
    background: #d5e7ff;
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
    --divider-width: 3px;
    position: relative;
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
    width: 156px;
    margin-right: 15px;
    padding: 0;
    display: inline-block;
}

.alert {
    padding: 20px;
    border-radius: 5px;
}

/* Responsive adjustments only */
@media (max-width: 991.98px) {
    .editing-services {
        padding-top: 80px;
        padding-bottom: 40px;
    }

    .editing-services .ods-mini-img img {
        height: 120px;
    }

    .ods-mini-wrapper {
        width: 140px;
    }
}

@media (max-width: 767.98px) {
    .editing-services {
        padding-top: 60px;
        padding-bottom: 30px;
    }

    .editing-services .ods-mini-img img {
        height: 100px;
    }

    .ods-mini-wrapper {
        width: 130px;
        margin-right: 10px;
    }

    .before-after-message {
        padding: 20px;
        font-size: 14px;
    }

    .before-after-bottom {
        flex-direction: column;
        gap: 10px;
    }
}

@media (max-width: 575.98px) {
    .editing-services {
        padding-top: 50px;
        padding-bottom: 30px;
    }

    .editing-services .ods-mini-img img {
        height: 80px;
    }

    .ods-mini-wrapper {
        width: 120px;
        margin-right: 8px;
    }

    .editing-services .ods-mini-img h6 {
        font-size: 12px;
    }

    .bf-circle {
        width: 35px;
        height: 35px;
    }
}
</style>
