<template>
    <div class="common-questions" :style="{ backgroundColor: data.background_color }" v-if="data">
        <div class="container">
            <div class="row">
                <div class="col-lg-6 col-md-12 section-title">
                    <div class="questions-intro">
                        <h2 v-if="data.title">{{ data.title }}</h2>
                        <p v-if="data.sub_title">{{ data.sub_title }}</p>
                        <!-- <div class="divide-separator divide-center"></div> -->
                        <img v-if="data.section_image" :src="data.section_image" alt="FAQ illustration" />
                    </div>
                </div>
                <div class="col-lg-6 col-md-12">
                    <div class="accordion-wrapper">
                        <div class="accordion" id="accordionExample" v-if="data.questions && data.questions.length">
                            <div class="accordion-item" v-for="(question, index) in data.questions" :key="index">
                                <h2 class="accordion-header" :id="'heading' + index">
                                    <button
                                        class="accordion-button"
                                        :class="{ collapsed: index !== 0 }"
                                        type="button"
                                        data-bs-toggle="collapse"
                                        :data-bs-target="'#collapse' + index"
                                        :aria-expanded="index === 0"
                                        :aria-controls="'collapse' + index"
                                    >
                                        {{ question.question }}
                                    </button>
                                </h2>
                                <div
                                    :id="'collapse' + index"
                                    class="accordion-collapse collapse"
                                    :class="{ show: index === 0 }"
                                    :aria-labelledby="'heading' + index"
                                    data-bs-parent="#accordionExample"
                                >
                                    <div class="accordion-body" v-html="question.answer"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "CommonQuestions",
    props: {
        color: {
            type: String,
            default: "#fbfbfb",
        },
        data: {
            type: Object,
            required: true,
            validator(value) {
                return value && (value.title || value.questions);
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
.common-questions {
    padding-top: 100px;
    padding-bottom: 100px;
    background-color: #fbfbfb;
}

.questions-intro {
    height: 100%;
    display: flex;
    flex-direction: column;
    /* justify-content: center; */
}

.accordion-wrapper {
    height: 100%;
    display: flex;
    align-items: center;
}

.common-questions .accordion-header button {
    background-color: #00bcd4;
    color: #fff;
}

.common-questions .accordion-body {
    color: #999;
}

.common-questions img {
    width: 50%;
    margin: 35px auto 0 auto;
    display: block;
    max-width: 100%;
    height: auto;
}

/* Responsive Design */
@media (max-width: 991.98px) {
    .common-questions {
        padding-top: 80px;
        padding-bottom: 80px;
    }

    .questions-intro {
        margin-bottom: 3rem;
        text-align: center;
    }

    .accordion-wrapper {
        align-items: flex-start;
    }

    .common-questions img {
        width: 40%;
        margin: 25px auto 0 auto;
    }
}

@media (max-width: 767.98px) {
    .common-questions {
        padding-top: 60px;
        padding-bottom: 60px;
    }

    .questions-intro h2 {
        font-size: 1.8rem;
    }

    .questions-intro {
        margin-bottom: 2.5rem;
    }

    .common-questions img {
        width: 60%;
        margin: 20px auto 0 auto;
    }

    .common-questions .accordion-header button {
        font-size: 0.95rem;
        padding: 1rem 1.25rem;
    }

    .common-questions .accordion-body {
        font-size: 0.9rem;
        padding: 1rem 1.25rem;
    }
}

@media (max-width: 575.98px) {
    .common-questions {
        padding-top: 50px;
        padding-bottom: 50px;
    }

    .questions-intro h2 {
        font-size: 1.5rem;
    }

    .questions-intro p {
        font-size: 0.95rem;
    }

    .questions-intro {
        margin-bottom: 2rem;
    }

    .common-questions img {
        width: 70%;
        margin: 15px auto 0 auto;
    }

    .common-questions .accordion-header button {
        font-size: 0.9rem;
        padding: 0.875rem 1rem;
        line-height: 1.4;
    }

    .common-questions .accordion-body {
        font-size: 0.85rem;
        padding: 0.875rem 1rem;
        line-height: 1.5;
    }

    .accordion-item {
        margin-bottom: 0.5rem;
    }
}

@media (max-width: 480px) {
    .common-questions img {
        width: 80%;
    }

    .common-questions .accordion-header button {
        font-size: 0.85rem;
        padding: 0.75rem 0.875rem;
    }

    .common-questions .accordion-body {
        font-size: 0.8rem;
        padding: 0.75rem 0.875rem;
    }
}
</style>
