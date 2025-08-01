<template>
    <div class="we-can-deliver" v-if="data">
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
                <div class="col-xl-3 col-lg-6 col-md-6 col-sm-12 mb-4" v-for="(box, index) in data.steps" :key="index">
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
    background-color: #fbfbfb;
    background-image: url(https://themeim.com/wp/cliper/wp-content/uploads/2021/11/counter_bg.png);
    background-position: center center;
    background-repeat: no-repeat;
    background-size: cover;
}

.we-can-deliver .section-title {
    margin-bottom: 70px;
}

.deliver-item {
    text-align: center;
    background: #fff;
    padding: 45px 20px;
    max-height: 245px;
    display: block;
    position: relative;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgb(121 215 229 / 43%), 0 3px 6px rgba(0, 0, 0, 0.06);
    border-left: 6px solid #1e6570;
}

.deliver-item h3 {
    font-size: 40px;
    font-weight: normal;
    margin-bottom: 20px;
    color: #00364b;
}

.deliver-item h5 {
    margin-bottom: 20px;
    font-size: 16px;
    color: #00364b;
}

/* Only responsive additions below - no changes to existing styles */
.divide-separator {
    width: 60px;
    height: 3px;
    background-color: #1e6570;
    border-radius: 2px;
}

.divide-center {
    margin: 0 auto;
}

/* Tablet */
@media (max-width: 991.98px) {
    .we-can-deliver {
        padding-top: 80px;
        padding-bottom: 80px;
    }

    .we-can-deliver .section-title {
        margin-bottom: 60px;
    }

    .deliver-item {
        margin-bottom: 20px;
    }
}

/* Mobile */
@media (max-width: 767.98px) {
    .we-can-deliver {
        padding-top: 60px;
        padding-bottom: 60px;
    }

    .we-can-deliver .section-title {
        margin-bottom: 50px;
    }

    .deliver-item {
        padding: 35px 15px;
        max-height: none;
        margin-bottom: 20px;
    }

    .deliver-item h3 {
        font-size: 32px;
    }

    .deliver-item h5 {
        font-size: 15px;
    }
}

/* Small Mobile */
@media (max-width: 575.98px) {
    .we-can-deliver {
        padding-top: 50px;
        padding-bottom: 50px;
    }

    .we-can-deliver .section-title {
        margin-bottom: 40px;
    }

    .deliver-item {
        padding: 30px 12px;
    }

    .deliver-item h3 {
        font-size: 28px;
    }

    .deliver-item h5 {
        font-size: 14px;
    }
}

/* Extra Small Mobile */
@media (max-width: 375px) {
    .we-can-deliver {
        padding-top: 40px;
        padding-bottom: 40px;
    }

    .deliver-item h3 {
        font-size: 24px;
    }

    .deliver-item h5 {
        font-size: 13px;
    }
}
</style>
