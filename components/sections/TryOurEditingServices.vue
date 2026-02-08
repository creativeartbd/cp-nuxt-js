<template>
    <div class="get-started" :style="{ backgroundColor: data.background_color }">
        <div class="container">
            <div class="row">
                <div class="col-lg-6 col-md-6 section-title" v-if="data">
                    <div class="get-started-details">
                        <h2 v-if="data.title">{{ data.title }}</h2>
                        <p v-if="data.sub_title">{{ data.sub_title }}</p>
                        <!-- <div class="divide-separator divide-center"></div> -->
                        <div v-if="data.content" v-html="data.content"></div>
                    </div>
                </div>
                <div class="col-lg-6 col-md-6">
                    <div class="form-wrapper">
                        <get-started-form
                            is-home="true"
                            :service="service"
                            :button-name="data.form_submit_button_text"
                        ></get-started-form>
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
        },
        service: {
            type: Object,
            default: {},
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
</style>
