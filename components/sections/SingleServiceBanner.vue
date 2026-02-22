<template>
    <section
        class="top-quality-services"
        v-if="data"
        :style="{
            backgroundImage: `url(${data.background_image})`,
        }"
    >
        <div class="container">
            <div class="banner-wrapper">
                <div class="banner-text">
                    <h2 class="mb-3" v-if="data.title.title_label" :style="{ color: `${data.title.title_color}` }">
                        {{ data.title.title_label }}
                    </h2>
                    <p v-if="data.sub_title.sub_title_content" :style="{ color: `${data.sub_title.sub_title_color}` }">
                        {{ data.sub_title.sub_title_content }}
                    </p>
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

.banner-wrapper .banner-image {
    width: 40%;
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
</style>
