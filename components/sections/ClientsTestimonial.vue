<template>
    <div class="happy-clients" v-if="data" :style="{ backgroundColor: data.background_color }">
        <div class="container">
            <div class="row">
                <div class="col-lg-6 col-md-12">
                    <div class="happy-clients-details">
                        <div class="section-title">
                            <p class="section-top-sub" v-if="data.title">{{ data.title }}</p>
                            <h2 v-if="data.sub_title">{{ data.sub_title }}</h2>
                        </div>

                        <swiper
                            :pagination="{ clickable: true }"
                            :slides-per-view="1"
                            :space-between="50"
                            :autoplay="{
                                delay: 3500,
                            }"
                            @swiper="onSwiper"
                            @slideChange="onSlideChange"
                            :modules="modules"
                            v-if="data.reviews && data.reviews.length"
                        >
                            <swiper-slide v-for="(review, index) in data.reviews" :key="index">
                                <div class="happy-client">
                                    <img src="@/assets/images/quote.png" class="quote" alt="Quote" loading="lazy" />
                                    <p v-if="review.review_content">{{ review.review_content }}</p>
                                    <div class="said-by-wrapper">
                                        <div class="said-by-image" v-if="review.reviewer_image">
                                            <img :src="review.reviewer_image" class="rounded-circle" alt="Reviewer" loading="lazy" />
                                        </div>
                                        <div class="said-by-info">
                                            <h6 v-if="review.review_by">{{ review.review_by }}</h6>
                                            <small v-if="review.reviewer_country">{{ review.reviewer_country }}</small>
                                        </div>
                                    </div>
                                </div>
                            </swiper-slide>
                        </swiper>
                    </div>
                </div>
                <div class="col-lg-6 col-md-12" v-if="data.youtube_video">
                    <div class="video-wrapper">
                        <iframe
                            width="100%"
                            height="315"
                            :src="data.youtube_video"
                            title="YouTube video player"
                            frameborder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowfullscreen
                        ></iframe>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
// Import Swiper Vue.js components
import { Swiper, SwiperSlide } from "swiper/vue";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

export default {
    name: "HappyClients",
    props: {
        data: {
            type: Object,
            required: true,
            validator(value) {
                return value && (value.reviews || value.youtube_video);
            },
        },
    },
    components: {
        Swiper,
        SwiperSlide,
    },
    setup() {
        const onSwiper = () => {};
        const onSlideChange = () => {};
        return {
            onSwiper,
            onSlideChange,
            modules: [Autoplay, EffectFade, Pagination],
        };
    },
};
</script>

<style scoped>
.happy-clients {
    padding-top: 150px;
    padding-bottom: 150px;
    /* background-color : #fff; */
    /* background-image: url(https://themeim.com/wp/cliper/wp-content/uploads/2021/11/Group-5762.png); */
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
}

.happy-clients .happy-client {
    /* background-color : #fff; */
    height: 100%;
    position: relative;
    margin-top: 30px;
}

.said-by-wrapper {
    display: flex;
    align-items: center;
}

.said-by-wrapper .said-by-image {
    margin-right: 20px;
    flex-shrink: 0;
}

.said-by-wrapper .said-by-image img {
    width: 60px;
    height: 60px;
    object-fit: cover;
}

.said-by-wrapper .said-by-info h6 {
    margin-bottom: 0;
}

.happy-clients-details {
    padding-right: 50px;
    /* background: #fff; */
}

.video-wrapper {
    position: relative;
    width: 100%;
    height: 0;
    padding-bottom: 56.25%; /* 16:9 aspect ratio */
}

.video-wrapper iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

quote::after {
    content: open-quote;
    font-size: 50px;
}

img.quote {
    width: 50px;
    margin-bottom: 20px;
}

/* Responsive Design */
@media (max-width: 991.98px) {
    .happy-clients {
        padding-top: 100px;
        padding-bottom: 100px;
    }

    .happy-clients-details {
        padding-right: 0;
        margin-bottom: 3rem;
    }

    .video-wrapper {
        padding-bottom: 56.25%;
    }
}

@media (max-width: 767.98px) {
    .happy-clients {
        padding-top: 80px;
        padding-bottom: 80px;
    }

    .happy-clients .happy-client {
        margin-top: 20px;
    }

    .happy-clients-details h2 {
        font-size: 1.8rem;
    }

    .said-by-wrapper .said-by-image {
        margin-right: 15px;
    }

    .said-by-wrapper .said-by-image img {
        width: 50px;
        height: 50px;
    }

    img.quote {
        width: 40px;
        margin-bottom: 15px;
    }
}

@media (max-width: 575.98px) {
    .happy-clients {
        padding-top: 60px;
        padding-bottom: 60px;
    }

    .happy-clients .happy-client {
        margin-top: 15px;
    }

    .happy-clients-details h2 {
        font-size: 1.5rem;
    }

    .happy-clients-details {
        text-align: center;
    }

    .said-by-wrapper {
        justify-content: center;
        margin-top: 20px;
    }

    .said-by-wrapper .said-by-image {
        margin-right: 12px;
    }

    .said-by-wrapper .said-by-image img {
        width: 45px;
        height: 45px;
    }

    img.quote {
        width: 35px;
        margin-bottom: 12px;
    }

    .video-wrapper {
        margin-top: 2rem;
    }
}
</style>
