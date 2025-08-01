<template>
    <section class="contact-address" v-if="data">
        <div class="container">
            <div class="row">
                <div class="col-md-6">
                    <div class="contact-info">
                        <p v-if="data.sub_title">{{ data.sub_title }}</p>
                        <h2 class="mb-3" v-if="data.title">{{ data.title }}</h2>
                        <div class="divide-separator"></div>
                        <img v-if="data.feature_image" :src="data.feature_image" alt="" class="mt-5" />
                    </div>
                </div>
                <div class="col-md-6">
                    <get-started-form is-home="true"></get-started-form>
                </div>
            </div>
            <div class="row" v-if="data.contact_methods">
                <div class="col-md-3" v-for="(methods, index) in data.contact_methods" :key="index">
                    <div class="contact-box">
                        <i :class="methods.icon_class"></i>
                        <div class="contact-details">
                            <h6 v-if="methods.title">{{ methods.title }}</h6>
                            <p v-if="methods.address">{{ methods.address }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
<script>
import GetStartedForm from "@/components/form/GetStartedForm.vue";
export default {
    props: ["data"],
    components: {
        GetStartedForm,
    },
};
</script>
<style scoped>
.contact-box {
    display: flex;
    align-items: center;
    margin-bottom: 40px;
    background-color: #fbfbfb;
    padding: 25px;
    border-radius: 10px;
    box-shadow: 1px 1px 1px #ddd;
    margin-top: 100px;
    transition: all ease-in 0.3s;
    border-bottom: 4px solid #2ebcd4;
}

.contact-box:hover {
    cursor: pointer;
    transform: scale(1.06);
}

.contact-info {
    margin-right: 100px;
}

.contact-details {
    margin-left: 10px;
}

.contact-details p {
    margin-bottom: 0;
}

.contact-box h5 {
    font-weight: normal;
}

.contact-box i {
    color: #00bcd4;
    font-size: 30px;
}

@media (max-width: 768px) {
    .contact-box {
        margin-top: 15px;
        margin-bottom: 15px;
    }

    .get-started-form {
        margin-top: 50px;
        margin-bottom: 50px;
    }

    .contact-info {
        margin-right: 15px;
    }
}
</style>
