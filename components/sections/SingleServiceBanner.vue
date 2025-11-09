<template>
    <section
        class="top-quality-services"
        v-if="data"
        :style="{
            backgroundImage: `url(${data.background_image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        }"
    >
        <div class="container">
            <div class="banner-wrapper">
                <div class="banner-text">
                    <h2 class="mb-3" v-if="data.title">{{ data.title }}</h2>
                    <p v-if="data.sub_title">{{ data.sub_title }}</p>
                    <div class="button-group" v-if="data.buttons.length">
                        <router-link
                            v-for="(button, index) in data.buttons"
                            :key="index"
                            :to="button.button_url ? button.button_url : null"
                            class="btn btn-default"
                        >
                            {{ button.button_name }}
                        </router-link>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
export default {
    props: ["data"],
};
</script>

<style scoped>
.banner-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.banner-wrapper .banner-text {
    width: 50%;
}

.banner-wrapper .banner-image {
    width: 40%;
}

.top-quality-services {
    position: relative;
    padding-top: 150px;
    padding-bottom: 150px;
    /* background: rgb(0, 107, 212);
    background-image: linear-gradient(90deg, #c3f6ff 0%, #dfddff 100%); */
}

.top-quality-services img {
    width: 500px;
    float: right;
}

.top-quality-services h2,
p {
    color: #292f34;
}

.top-quality-services .free-trial,
.get-started {
    background-color: #fff;
    color: #027dd4;
    border: none;
}

.top-quality-services .free-trial {
    margin-right: 10px;
    color: #27b4ca;
}

.top-quality-services .get-started {
    margin-right: 10px;
    color: #fff;
    background-color: #00364b;
}

.top-quality-services .button-group {
    margin-top: 30px;
    display: flex;
}

.top-quality-services .button-group a {
    margin-right: 10px;
}

/* Responsive Styles - Bootstrap 5.3.3 Compatible */

/* Large devices (desktops, 992px and up) */
@media (min-width: 992px) {
    .banner-wrapper .banner-text {
        width: 50%;
    }

    .banner-wrapper .banner-image {
        width: 40%;
    }
}

/* Medium devices (tablets, 768px and up) */
@media (max-width: 991.98px) {
    .banner-wrapper {
        flex-direction: column;
        text-align: center;
    }

    .banner-wrapper .banner-text {
        width: 100%;
        margin-bottom: 2rem;
    }

    .banner-wrapper .banner-image {
        width: 80%;
    }

    .top-quality-services {
        padding-top: 100px;
        padding-bottom: 100px;
    }

    .top-quality-services img {
        width: 100%;
        max-width: 400px;
        float: none;
        display: block;
        margin: 0 auto;
    }
}

/* Small devices (landscape phones, 576px and up) */
@media (max-width: 767.98px) {
    .top-quality-services {
        padding-top: 80px;
        padding-bottom: 80px;
    }

    .banner-wrapper .banner-text h2 {
        font-size: 1.75rem;
    }

    .banner-wrapper .banner-text p {
        font-size: 0.95rem;
    }

    .top-quality-services .button-group {
        flex-direction: column;
        align-items: center;
        gap: 15px;
        margin-top: 25px;
    }

    .top-quality-services .button-group a {
        margin-right: 0;
        width: 100%;
        max-width: 250px;
        text-align: center;
        padding: 12px 20px;
    }

    .banner-wrapper .banner-image {
        width: 100%;
    }

    .top-quality-services img {
        width: 100%;
        max-width: 300px;
    }
}

/* Extra small devices (portrait phones, less than 576px) */
@media (max-width: 575.98px) {
    .top-quality-services {
        padding-top: 60px;
        padding-bottom: 60px;
    }

    .banner-wrapper .banner-text h2 {
        font-size: 1.5rem;
        margin-bottom: 1rem !important;
    }

    .banner-wrapper .banner-text p {
        font-size: 0.9rem;
        line-height: 1.5;
    }

    .top-quality-services .button-group {
        margin-top: 20px;
    }

    .top-quality-services .button-group a {
        padding: 10px 15px;
        font-size: 0.9rem;
    }

    .top-quality-services img {
        max-width: 280px;
    }
}

/* Extra responsiveness for very small screens */
@media (max-width: 360px) {
    .top-quality-services {
        padding-top: 40px;
        padding-bottom: 40px;
    }

    .banner-wrapper .banner-text h2 {
        font-size: 1.25rem;
    }

    .banner-wrapper .banner-text p {
        font-size: 0.85rem;
    }

    .top-quality-services .button-group a {
        padding: 8px 12px;
        font-size: 0.85rem;
    }
}

/* Ensure container padding is responsive */
@media (max-width: 575.98px) {
    .container {
        padding-left: 15px;
        padding-right: 15px;
    }
}
</style>
