<template>
    <div class="get-started" :style="{ backgroundColor: data.background_color }">
        <div class="container">
            <div class="row">
                <div class="col-lg-6 col-md-12 section-title" v-if="data">
                    <div class="get-started-details">
                        <h2 v-if="data.title">{{ data.title }}</h2>
                        <p v-if="data.sub_title">{{ data.sub_title }}</p>
                        <!-- <div class="divide-separator divide-center"></div> -->
                        <div v-if="data.content" v-html="data.content"></div>
                    </div>
                </div>
                <div class="col-lg-6 col-md-12">
                    <div class="form-wrapper">
                        <get-started-form is-home="true"></get-started-form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import GetStartedForm from "@/components/form/GetStartedForm.vue";

export default {
    name: "GetStarted",
    props: {
        data: {
            type: Object,
            required: true,
            validator(value) {
                return value && (value.title || value.content);
            },
        },
        color: {
            type: String,
            default: "#fbfbfb",
        },
    },
    components: {
        GetStartedForm,
    },
    mounted() {},
};
</script>

<style scoped>
.get-started {
    padding: 20px 10px 10px;
    padding-top: 100px;
    padding-bottom: 100px;
    background-color: #fbfbfb;
}

.get-started ul {
    padding-left: 0;
    margin-top: 20px;
}

.get-started ul li {
    position: relative; /* Needed for absolute positioning of the pseudo-element */
    margin-bottom: 10px; /* Optional: adds space between list items */
    list-style: circle;
    list-style-position: inside;
}

.get-started-details {
    padding-right: 50px;
}

.form-wrapper {
    width: 100%;
}

/* Responsive Design */
@media (max-width: 991.98px) {
    .get-started {
        padding-top: 80px;
        padding-bottom: 80px;
    }

    .get-started-details {
        padding-right: 0;
        margin-bottom: 3rem;
        text-align: center;
    }

    .divide-separator {
        margin: 2rem auto;
    }
}

@media (max-width: 767.98px) {
    .get-started {
        padding-top: 60px;
        padding-bottom: 60px;
        padding-left: 15px;
        padding-right: 15px;
    }

    .get-started-details h2 {
        font-size: 1.8rem;
    }

    .get-started-details {
        margin-bottom: 2.5rem;
    }

    .get-started ul {
        margin-top: 15px;
    }

    .get-started ul li {
        margin-bottom: 8px;
    }
}

@media (max-width: 575.98px) {
    .get-started {
        padding-top: 50px;
        padding-bottom: 50px;
        padding-left: 10px;
        padding-right: 10px;
    }

    .get-started-details h2 {
        font-size: 1.5rem;
    }

    .get-started-details p {
        font-size: 0.95rem;
    }

    .get-started-details {
        margin-bottom: 2rem;
    }

    .get-started ul {
        margin-top: 12px;
    }

    .get-started ul li {
        margin-bottom: 6px;
        font-size: 0.9rem;
    }

    .divide-separator {
        margin: 1.5rem auto;
    }
}
</style>
