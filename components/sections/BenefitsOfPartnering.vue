<template>
    <div class="benefit-with-us" :style="{ backgroundColor: data.background_color }">
        <div class="container" v-if="data">
            <div class="row gy-5">
                <div class="col-12 text-center section-title">
                    <h2 v-if="data.title">{{ data.title }}</h2>
                    <p v-if="data.sub_title">{{ data.sub_title }}</p>
                    <div class="divide-separator divide-center"></div>
                </div>
            </div>
            <div class="row gy-5" v-if="data.services">
                <div class="col-md-4 text-center" v-for="(data, index) in data.services" :key="index">
                    <img :src="data.image" alt="" loading="lazy" />
                    <h3 class="mt-0">{{ data.title }}</h3>
                    <div v-html="data.content"></div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: ["color", "data"],
    data() {
        return {
            bgColor: this.color,
        };
    },
};
</script>
<style scoped>
.benefit-with-us {
    padding-top: 100px;
    padding-bottom: 100px;
    position: relative;
    background-color: #fff;
}

.benefit-with-us img {
    margin-bottom: 15px;
    width: 75px;
    height: 75px;
}

.benefit-with-us h3 {
    margin-bottom: 15px;
}
</style>
