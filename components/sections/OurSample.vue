<template>
    <section class="sample-page" v-if="data" :style="{ backgroundColor: data.background_color }">
        <div class="container">
            <div class="row">
                <div class="col-md-12 section-title text-center">
                    <h2>{{ data.title }}</h2>
                    <div v-html="data.sub_title"></div>
                    <div class="divide-separator divide-separator-3 divide-center"></div>
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
                                    <div
                                        class="col-sm-6 col-md-4"
                                        v-for="(image, index) in frontImages.slice(0, displayedFrontImagesCount)"
                                        :key="index"
                                    >
                                        <div class="single-sample" @click.prevent="handleImgClick(image)">
                                            <img class="active-image" :src="image.before_image" alt="" />
                                            <img class="hover-image" :src="image.after_image" alt="" />
                                        </div>
                                    </div>
                                </div>
                                <!-- <div class="row" v-if="shouldShowLoadMoreButton">
                                    <div class="col-12 text-center">
                                        <button class="btn btn-primary" @click="loadMoreImages">
                                            {{ siteSettings.value?.all_fields?.load_more_button_text || "Load More" }}
                                        </button>
                                    </div>
                                </div> -->
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

<script setup>
// --- PROPS ---
const props = defineProps(["data"]);

// --- COMPOSABLES ---
const { $api } = useNuxtApp();

// --- STATE ---
const siteSettings = useState("siteSettings", () => null);

const activeTab = ref("All");
const allImages = ref([]);
const frontImages = ref([]);
const displayedFrontImagesCount = ref(2); // Default value
const popupImgSrc = ref(null);
const isPopupVisible = ref(false);
const isImgLoaded = ref(false);
const preloadedImages = ref(new Set());
const loadingTimeout = ref(null);

// --- COMPUTED PROPERTIES ---
/**
 * Determines if the "Load More" button should be visible.
 * It's true if there are more images to show than are currently displayed.
 */
const shouldShowLoadMoreButton = computed(() => {
    // Add a check to ensure frontImages is not null/undefined before accessing .length
    return frontImages.value && displayedFrontImagesCount.value < frontImages.value.length;
});

// --- METHODS ---
const markAsPreloaded = (imageKey) => {
    preloadedImages.value.add(imageKey);
};

const setImgLoad = () => {
    if (loadingTimeout.value) {
        clearTimeout(loadingTimeout.value);
    }
    isImgLoaded.value = true;
};

const handleImageError = () => {
    console.warn("Image failed to load");
    setImgLoad();
};

const handlePrev = (currentIndex) => {
    if (currentIndex === 0) return;
    const prevIndex = currentIndex - 1;
    if (allImages.value[prevIndex]) {
        changeImage(allImages.value[prevIndex]);
    }
};

const handleNext = (currentIndex) => {
    if (currentIndex === allImages.value.length - 1) return;
    const nextIndex = currentIndex + 1;
    if (allImages.value[nextIndex]) {
        changeImage(allImages.value[nextIndex]);
    }
};

const changeImage = (image) => {
    const isPreloaded = preloadedImages.value.has(image.key);

    if (isPreloaded) {
        isImgLoaded.value = true;
    } else {
        isImgLoaded.value = false;
        loadingTimeout.value = setTimeout(() => {
            isImgLoaded.value = true;
        }, 2000);
    }

    popupImgSrc.value = {
        src: image.before_image,
        popup_image_text: image.popup_image_text,
        index: image.key,
        popup_image: image.popup_image,
    };
};

const closePopup = () => {
    isPopupVisible.value = false;
    if (loadingTimeout.value) {
        clearTimeout(loadingTimeout.value);
    }
};

const handleImgClick = (image) => {
    changeImage(image);
    isPopupVisible.value = true;
};

const setActiveTab = (tabTitle) => {
    activeTab.value = tabTitle;
};

const loadMoreImages = () => {
    displayedFrontImagesCount.value += 2;
};

const preloadAdjacentImages = (currentIndex) => {
    const imagesToPreload = [];

    if (currentIndex > 0) {
        imagesToPreload.push(allImages.value[currentIndex - 1]);
    }

    if (currentIndex < allImages.value.length - 1) {
        imagesToPreload.push(allImages.value[currentIndex + 1]);
    }

    imagesToPreload.forEach((image) => {
        if (!preloadedImages.value.has(image.key)) {
            const img = new Image();
            img.onload = () => markAsPreloaded(image.key);
            img.onerror = () => markAsPreloaded(image.key);
            img.src = image.popup_image;
        }
    });
};

// --- WATCHERS ---
watch(popupImgSrc, (newVal) => {
    if (newVal && isPopupVisible.value) {
        preloadAdjacentImages(newVal.index);
    }
});

// --- LIFECYCLE ---
onMounted(async () => {
    // Only fetch if siteSettings is not already loaded
    if (!siteSettings.value) {
        try {
            const data = await $api.getSiteSettings();
            if (data) {
                siteSettings.value = data;
                // Update the displayedFrontImagesCount after siteSettings is loaded
                displayedFrontImagesCount.value =
                    siteSettings.value?.all_fields?.number_of_images_to_be_shown_on_all_tab || 2;
            }
        } catch (error) {
            console.error("Site settings load error:", error);
        }
    } else {
        // If siteSettings is already loaded, update the count
        displayedFrontImagesCount.value = siteSettings.value?.all_fields?.number_of_images_to_be_shown_on_all_tab || 2;
    }

    let uniqueIndex = 0;
    if (props.data && props.data.tabs && Array.isArray(props.data.tabs)) {
        props.data.tabs.forEach((tab) => {
            tab.images.forEach((image) => {
                image.key = uniqueIndex++;
                allImages.value.push(image);

                // Add to frontImages if is_front === "true" (string comparison)
                if (image.is_front === "true") {
                    frontImages.value.push(image);
                }
            });
        });
    }

    const handleKeydown = (e) => {
        if (isPopupVisible.value) {
            if (e.key === "ArrowLeft") {
                handlePrev(popupImgSrc.value.index);
            } else if (e.key === "ArrowRight") {
                handleNext(popupImgSrc.value.index);
            } else if (e.key === "Escape") {
                closePopup();
            }
        }
    };

    document.addEventListener("keydown", handleKeydown);

    onUnmounted(() => {
        document.removeEventListener("keydown", handleKeydown);
        if (loadingTimeout.value) {
            clearTimeout(loadingTimeout.value);
        }
    });
});
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
    border: 1px solid #06bcd4;
    border-radius: 0;
    background: #fff;
}

.sample-work .nav button {
    width: 250px;
    margin-bottom: 10px;
}

.sample-work .nav button:hover {
    background-color: #2ebcd4;
    color: #fff;
    border: none;
    border: 1px solid #2ebcd4;
}

.single-sample {
    box-shadow: 1px 1px 1px #ddd;
    margin-bottom: 15px;
    cursor: pointer;
    margin-bottom: 25px;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px;
}

.divide-separator-3 {
    border: 1px solid #5becff;
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
    min-height: 300px;
    min-width: 400px;
}

.image-popup p {
    margin-bottom: 0;
}

.image-popup img {
    max-width: 100%;
    height: auto;
    display: block;
    border-radius: 5px;
    min-height: 200px;
}

.image-popup .cross {
    position: absolute;
    top: -30px;
    right: 0px;
    cursor: pointer;
    z-index: 1001;
}

.image-popup .cross i {
    color: #fff;
    font-size: 24px;
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

.btn-primary {
    background-color: #00bcd4;
    border-color: #00bcd4;
    color: #fff;
    padding: 10px 30px;
    margin-top: 20px;
}

.btn-primary:hover {
    background-color: #0097a7;
    border-color: #0097a7;
}
</style>
