<template>
    <div class="how-it-works" :style="{ backgroundColor: bgColor }" v-if="data">
        <div class="container">
            <div class="row">
                <div class="col-12 section-title text-center">
                    <h2 v-if="data.title">{{ data.title }}</h2>
                    <p v-if="data.sub_title">{{ data.sub_title }}</p>
                    <div class="divide-separator divide-center"></div>
                </div>
                <div class="col-lg-6 col-md-12" v-if="data.steps">
                    <div class="steps-container">
                        <div class="how-it-works-list" v-for="(option, index) in data.steps" :key="index">
                            <div class="how-it-works-number">
                                {{ index + 1 }}
                            </div>
                            <div class="how-it-works-info">
                                <h3>{{ option.title }}</h3>
                                <p>{{ option.content }}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    class="col-lg-6 col-md-12 d-flex justify-content-center align-items-center"
                    v-if="data.feature_image"
                >
                    <div class="section-main-image">
                        <img :src="data.feature_image" alt="How it works illustration" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "HowItWorks",
    props: {
        color: {
            type: String,
            default: "#fff",
        },
        data: {
            type: Object,
            required: true,
            validator(value) {
                return value && (value.title || value.steps);
            },
        },
    },
    data() {
        return {
            bgColor: this.color,
        };
    },
};
</script>

<style scoped>
.how-it-works {
    padding-top: 100px;
    padding-bottom: 100px;
    background-color: #fff;
}

.section-main-image {
    width: 100%;
    text-align: center;
}

.section-main-image img {
    width: 80%;
    max-width: 100%;
    height: auto;
}

.how-it-works .section-title {
    margin-bottom: 50px;
}

.steps-container {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.how-it-works-list {
    position: relative;
    margin-bottom: 50px;
    display: flex;
    align-items: flex-start;
}

.how-it-works-info {
    width: 300px;
    flex: 1;
}

.how-it-works-info h3 {
    margin-bottom: 10px;
}

.how-it-works-list:nth-child(1) .how-it-works-number {
    background-color: #a0c747;
    box-shadow: 0px 6px 12px 0px rgb(210 250 255);
}

.how-it-works-list:nth-child(2) .how-it-works-number {
    background-color: #00bcd4;
    box-shadow: 0px 6px 12px 0px rgb(210 250 255);
}

.how-it-works-list:nth-child(3) .how-it-works-number {
    background-color: #f89748;
    box-shadow: 0px 6px 12px 0px rgb(210 250 255);
}

.how-it-works-number {
    width: 75px;
    height: 75px;
    border-radius: 50%;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    border: 8px solid #fff;
    margin-bottom: 20px;
    font-size: 25px;
    box-shadow: 0px 6px 12px 0px rgb(210 250 255);
    margin-right: 20px;
    flex-shrink: 0;
}

.how-it-works-bg-2 {
    background-color: #6b67ff;
    border: 8px solid #fff;
    box-shadow: 0px 6px 12px 0px rgb(107 103 255);
}

.how-it-works-bg-3 {
    background-color: #f89847;
    border: 8px solid #fff;
    box-shadow: 0px 6px 12px 0px rgb(248 153 70);
}

/* Responsive Design */
@media (max-width: 991.98px) {
    .how-it-works {
        padding-top: 80px;
        padding-bottom: 80px;
    }

    .how-it-works .section-title {
        margin-bottom: 40px;
    }

    .steps-container {
        margin-bottom: 3rem;
    }

    .section-main-image img {
        width: 70%;
    }
}

@media (max-width: 767.98px) {
    .how-it-works {
        padding-top: 60px;
        padding-bottom: 60px;
    }

    .how-it-works .section-title {
        margin-bottom: 30px;
    }

    .how-it-works .section-title h2 {
        font-size: 1.8rem;
    }

    .how-it-works-list {
        margin-bottom: 40px;
        flex-direction: column;
        text-align: center;
        align-items: center;
    }

    .how-it-works-number {
        margin-right: 0;
        margin-bottom: 15px;
    }

    .how-it-works-info {
        width: 100%;
        text-align: center;
    }

    .how-it-works-info h3 {
        font-size: 1.3rem;
    }

    .section-main-image img {
        width: 85%;
    }

    .steps-container {
        margin-bottom: 2.5rem;
    }
}

@media (max-width: 575.98px) {
    .how-it-works {
        padding-top: 50px;
        padding-bottom: 50px;
    }

    .how-it-works .section-title h2 {
        font-size: 1.5rem;
    }

    .how-it-works .section-title p {
        font-size: 0.95rem;
    }

    .how-it-works-list {
        margin-bottom: 35px;
    }

    .how-it-works-number {
        width: 60px;
        height: 60px;
        font-size: 20px;
        border: 6px solid #fff;
        margin-bottom: 12px;
    }

    .how-it-works-info h3 {
        font-size: 1.2rem;
        margin-bottom: 8px;
    }

    .how-it-works-info p {
        font-size: 0.9rem;
    }

    .section-main-image img {
        width: 95%;
    }

    .steps-container {
        margin-bottom: 2rem;
    }
}
</style>
