<template>
    <section class="contact-address" v-if="data" :style="{ backgroundColor: data.background_color }">
        <div class="container">
            <div class="row">
                <div class="col-md-6">
                    <div class="contact-info section-title">
                        <h2 v-if="data.title">{{ data.title }}</h2>
                        <p v-if="data.sub_title">{{ data.sub_title }}</p>
                        <!-- <div class="divide-separator"></div> -->
                        <img v-if="data.feature_image" :src="data.feature_image" alt="" class="mt-5" />
                    </div>
                </div>
                <div class="col-md-6">
                    <get-started-form
                        is-home="true"
                        :service="service"
                        :button-name="data.form_submit_button_text"
                    ></get-started-form>
                </div>
            </div>
            <div class="row" v-if="data.contact_methods">
                <div class="col-md-6 col-lg-3" v-for="(methods, index) in data.contact_methods" :key="index">
                    <template v-if="methods.contact_type === 'email'">
                        <a :href="'mailto:' + methods.address">
                            <div class="contact-box">
                                <i :class="methods.icon_class"></i>
                                <div class="contact-details">
                                    <h6 v-if="methods.title">{{ methods.title }}</h6>
                                    <p v-if="methods.address">{{ methods.address }}</p>
                                </div>
                            </div>
                        </a>
                    </template>
                    <template v-else-if="methods.contact_type === 'whatsapp'">
                        <a :href="'https://wa.me/' + methods.address" target="_new">
                            <div class="contact-box">
                                <i :class="methods.icon_class"></i>
                                <div class="contact-details">
                                    <h6 v-if="methods.title">{{ methods.title }}</h6>
                                    <p v-if="methods.address">{{ methods.address }}</p>
                                </div>
                            </div>
                        </a>
                    </template>
                    <template v-else-if="methods.contact_type === 'mobile'">
                        <a :href="'tel:' + methods.address" target="_new">
                            <div class="contact-box">
                                <i :class="methods.icon_class"></i>
                                <div class="contact-details">
                                    <h6 v-if="methods.title">{{ methods.title }}</h6>
                                    <p v-if="methods.address">{{ methods.address }}</p>
                                </div>
                            </div>
                        </a>
                    </template>
                    <template v-else-if="methods.contact_type === 'team'">
                        <a :href="'https://teams.microsoft.com/l/chat/0/0?users=' + methods.address" target="_new">
                            <div class="contact-box">
                                <i :class="methods.icon_class"></i>
                                <div class="contact-details">
                                    <h6 v-if="methods.title">{{ methods.title }}</h6>
                                    <p v-if="methods.address">{{ methods.address }}</p>
                                </div>
                            </div>
                        </a>
                    </template>
                </div>
            </div>
        </div>
    </section>
</template>
<script>
import GetStartedForm from "@/components/form/GetStartedForm.vue";
export default {
    props: ["data", "service", "buttonName"],
    components: {
        GetStartedForm,
    },
};
</script>
<style scoped>
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
    word-break: break-all;
}

.contact-box h6 {
    font-size: 14px;
    color: #7d888a;
}

.contact-box i {
    color: #00bcd4;
    font-size: 30px;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 1px 1px 1px #06bcd4;
}
</style>
