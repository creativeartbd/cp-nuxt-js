<template>
    <div class="we-can-deliver" v-if="data" :style="{ backgroundColor: data.background_color }">
        <div class="container">
            <div class="row">
                <div class="col-md-12">
                    <div class="section-title text-center">
                        <h2 v-if="data.title">{{ data.title }}</h2>
                        <p v-if="data.sub_title">{{ data.sub_title }}</p>
                        <div class="divide-separator divide-center"></div>
                    </div>
                </div>
            </div>
            <div class="row" v-if="data.steps">
                <div class="col-xl-3 col-lg-3 col-md-6 col-sm-12 mb-4" v-for="(box, index) in data.steps" :key="index">
                    <div class="deliver-item">
                        <h3 v-if="box.title">{{ box.title }}</h3>
                        <h5 v-if="box.sub_title">{{ box.sub_title }}</h5>
                        <p v-if="box.content">{{ box.content }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ["data"],
};
</script>

<style scoped>
.we-can-deliver {
    padding-top: 100px;
    padding-bottom: 100px;
    background-color: #fff;
    /* background-image: url(https://themeim.com/wp/cliper/wp-content/uploads/2021/11/counter_bg.png); */
    background-position: center center;
    background-repeat: no-repeat;
    background-size: cover;
}

.we-can-deliver .section-title {
    margin-bottom: 70px;
}

.deliver-item h3 {
    font-size: 30px;
    font-weight: normal;
    margin-bottom: 20px;
    color: #00364b;
}

.deliver-item h5 {
    margin-bottom: 20px;
    font-size: 16px;
    color: #00364b;
}
</style>
