<template>
    <div class="common-questions" :style="{ backgroundColor: data.background_color }" v-if="data">
        <div class="container">
            <div class="row">
                <div class="col-lg-6 col-md-12 section-title">
                    <div class="questions-intro">
                        <h2 v-if="data.title">{{ data.title }}</h2>
                        <p v-if="data.sub_title">{{ data.sub_title }}</p>
                        <!-- <div class="divide-separator divide-center"></div> -->
                        <img v-if="data.section_image" :src="data.section_image" alt="FAQ illustration" loading="lazy" />
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
    background: linear-gradient(
        191deg,
        rgba(0, 188, 212, 1) 0%,
        rgba(115, 209, 225, 1) 0%,
        rgb(6 188 212) 51%,
        rgba(6, 188, 212, 1) 100%
    );
    color: #fff;
}

.common-questions .accordion-body {
    color: #999;
}
</style>
