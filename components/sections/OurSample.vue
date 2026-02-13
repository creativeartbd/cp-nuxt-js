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
                    <div class="sample-work">
                        <div
                            class="nav flex-column nav-pills"
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
                                        class="col-12 col-sm-12 col-md-6 col-lg-4"
                                        v-for="(image, index) in frontImages.slice(0, displayedFrontImagesCount)"
                                        :key="index"
                                    >
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
                                        class="col-12 col-sm-12 col-md-6 col-lg-4"
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

            <!-- Loading spinner -->
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
// FIXED: Don't destructure fetchSettings - it doesn't exist
const { siteSettings } = useSiteSettings();

// --- STATE ---
const activeTab = ref("All");
const allImages = ref([]);
const frontImages = ref([]);
const popupImgSrc = ref(null);
const isPopupVisible = ref(false);
const isImgLoaded = ref(false);
const preloadedImages = ref(new Set());
const loadingTimeout = ref(null);

// --- COMPUTED PROPERTIES ---
// FIXED: Removed .value - siteSettings is auto-unwrapped in templates
const displayedFrontImagesCount = computed(() => {
    // Provide fallback value
    return siteSettings.value?.all_fields?.number_of_images_to_be_shown_on_all_tab || 6;
});

const shouldShowLoadMoreButton = computed(() => {
    return frontImages.value && displayedFrontImagesCount.value < frontImages.value.length;
});

// --- METHODS ---
const markAsPreloaded = (imageKey) => {
    preloadedImages.value.add(imageKey);
};

const setImgLoad = () => {
    if (loadingTimeout.value) clearTimeout(loadingTimeout.value);
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
    if (loadingTimeout.value) clearTimeout(loadingTimeout.value);
};

const handleImgClick = (image) => {
    changeImage(image);
    isPopupVisible.value = true;
};

const setActiveTab = (tabTitle) => {
    activeTab.value = tabTitle;
};

const preloadAdjacentImages = (currentIndex) => {
    const imagesToPreload = [];
    if (currentIndex > 0) imagesToPreload.push(allImages.value[currentIndex - 1]);
    if (currentIndex < allImages.value.length - 1) imagesToPreload.push(allImages.value[currentIndex + 1]);

    imagesToPreload.forEach((image) => {
        if (!preloadedImages.value.has(image.key)) {
            const img = new Image();
            img.onload = () => markAsPreloaded(image.key);
            img.onerror = () => markAsPreloaded(image.key);
            img.src = image.popup_image;
        }
    });
};

// Keyboard navigation
const handleKeydown = (e) => {
    if (!isPopupVisible.value) return;
    if (e.key === "ArrowLeft") handlePrev(popupImgSrc.value.index);
    else if (e.key === "ArrowRight") handleNext(popupImgSrc.value.index);
    else if (e.key === "Escape") closePopup();
};

// --- WATCHERS ---
watch(popupImgSrc, (newVal) => {
    if (newVal && isPopupVisible.value) {
        preloadAdjacentImages(newVal.index);
    }
});

// Watch for changes in the `data` prop to process images
watch(
    () => props.data,
    (newData) => {
        if (!newData || !newData.tabs) return;

        let uniqueIndex = 0;
        const newAllImages = [];
        const newFrontImages = [];

        newData.tabs.forEach((tab) => {
            tab.images.forEach((image) => {
                image.key = uniqueIndex++;
                newAllImages.push(image);
                if (image.is_front === "true") {
                    newFrontImages.push(image);
                }
            });
        });

        allImages.value = newAllImages;
        frontImages.value = newFrontImages;
        activeTab.value = "All";
    },
    { immediate: true }
);

// --- LIFECYCLE ---
onMounted(() => {
    document.addEventListener("keydown", handleKeydown);

    // Debug logging
    console.log("🔍 OurSample.vue Debug:");
    console.log("  Site Settings:", siteSettings.value);
    console.log("  Display Count:", displayedFrontImagesCount.value);
});

onUnmounted(() => {
    document.removeEventListener("keydown", handleKeydown);
    if (loadingTimeout.value) clearTimeout(loadingTimeout.value);
});
</script>

<style scoped>
/* All your original styles */
.sample-page {
    background-color: #ddd;
}
.sample-work .nav-pills .nav-link.active,
.nav-pills .show > .nav-link {
    background-color: #00bcd4;
    border: none;
}
.sample-work .nav-link {
    color: #333;
    text-align: left;
    border: 1px solid #06bcd4;
    border-radius: 0;
    background: #fff;
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
.arrows i.disabled {
    opacity: 0.3;
    cursor: not-allowed;
}
.image-popup .spinner-grow {
    width: 3rem;
    height: 3rem;
    color: #00bcd4;
}
.loading-container {
    min-height: 300px;
}
.image-title {
    position: absolute;
    bottom: -32px;
    color: #fff;
    display: flex;
    justify-content: space-between;
    width: 100%;
}
</style>
