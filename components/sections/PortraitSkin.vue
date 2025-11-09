<template>
    <section class="portrait-skin" v-if="data" :style="{ backgroundColor: data.background_color }">
        >
        <div class="container">
            <div class="row">
                <div class="col-md-8">
                    <div class="section-title">
                        <h2 v-if="data.title">
                            {{ data.title }}
                        </h2>
                        <p v-if="data.sub_title">
                            {{ data.sub_title }}
                        </p>
                        <!-- <div class="divide-separator"></div> -->
                    </div>

                    <div v-if="data.content" v-html="data.content"></div>
                    <div class="animated-border-quote" v-if="data.user_review">
                        <blockquote class="skin-review">
                            <img src="@/assets/images/quote.png" class="quote" alt="Quote" />
                            <p>{{ data.user_review }}</p>
                        </blockquote>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="portrait-skin-image">
                        <ImgComparisonSlider>
                            <!-- eslint-disable -->
                            <figure slot="first" class="before">
                                <img slot="first" :src="data.before_image" />
                                <figcaption>Before</figcaption>
                            </figure>
                            <figure slot="second" class="after">
                                <img slot="second" :src="data.after_image" />
                                <figcaption>After</figcaption>
                            </figure>
                            <div slot="handle">
                                <div class="bf-circle">
                                    <i class="bi bi-caret-left-fill"></i>
                                    <i class="bi bi-caret-right-fill"></i>
                                </div>
                            </div>
                            <!-- eslint-enable -->
                        </ImgComparisonSlider>

                        <div class="button-group">
                            <router-link
                                class="place-order"
                                :to="data.order_button_url ? data.order_button_url : null"
                                v-if="data.order_button_text"
                                >{{ data.order_button_text }}</router-link
                            >
                            <router-link
                                class="free-trial"
                                :to="data.trial_button_url ? data.trial_button_url : null"
                                v-if="data.trial_button_text"
                                >{{ data.trial_button_text }}</router-link
                            >
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import { ImgComparisonSlider } from "@img-comparison-slider/vue";
export default {
    props: ["data", "color"],
    data() {
        return {
            bgColor: this.color,
            beforeImg:
                "https://i0.wp.com/cutoutpartner.com/wp-content/uploads/2021/04/1S7A3520-Before.jpg?fit=600%2C686&ssl=1",
            afterImg:
                "https://i0.wp.com/cutoutpartner.com/wp-content/uploads/2021/04/1S7A3520-After.jpg?fit=600%2C686&ssl=1",
        };
    },
    components: {
        ImgComparisonSlider,
    },
};
</script>
<style scoped>
.skin-review {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    text-align: left;
    gap: 20px;
}
blockquote.skin-review img {
    float: left;
}
.portrait-skin-image {
    margin-left: 62px;
}

.portrait-skin-image .before figcaption,
.portrait-skin-image .after figcaption {
    display: none;
}

.portrait-skin-image:hover .before figcaption {
    display: block;
}

.portrait-skin-image:hover .after figcaption {
    display: block;
}

.portrait-skin-image .before figcaption,
.portrait-skin-image .after figcaption {
    background: #5e5e5eb5;
    border: none;
    color: #fff;
    opacity: 0.8;
    padding: 12px;
    position: absolute;
    top: 10%;
    transform: translateY(-50%);
    line-height: 100%;
}

.portrait-skin-image .before figcaption {
    left: 12px;
}

.portrait-skin-image .after figcaption {
    right: 37px;
}

.portrait-skin-image:focus {
    outline: 0;
}

.portrait-skin-image img {
    width: 353px;
    height: 403px;
    max-width: 100%;
    object-fit: cover;
}

.portrait-comments {
    background-color: #00bcd4;
    padding: 20px;
    border-radius: 20px;
    color: #fff;
    box-shadow: rgba(0, 188, 212, 0.4) 5px 5px;
    font-style: italic;
    margin-top: 50px;
    width: 600px;
    max-width: 100%;
    font-size: 17px;
}

.portrait-skin ul {
    padding: 0;
}

.portrait-skin ul li {
    list-style-position: inside;
    line-height: 200%;
}

.portrait-skin .button-group {
    display: flex;
    justify-content: space-between;
    margin-top: 15px;
    text-align: center;
}

.portrait-skin .button-group .place-order {
    width: calc(50% - 10px);
}

.portrait-skin .button-group .free-trial {
    width: calc(50% - 10px);
}

.place-order,
.free-trial {
    border: none;
    border-radius: 25px;
    color: #fff;
    padding: 12px 0;
    font-size: 15px;
    /* box-shadow: #45465a 0 10px 20px -10px; */
}

.place-order {
    background-color: #00bcd4;
}

.free-trial {
    background-color: #45465a;
}

.animated-border-quote {
    display: inline-block;
    margin: 1em;
    overflow: hidden;
    margin-top: 50px;
}
.animated-border-quote blockquote {
    background-color: #fff;
    border: solid 15px #00bcd4;
    display: inline-block;
    margin: 0 3rem;
    padding: 1em;
    position: relative;
    text-align: center;
}
@keyframes clockwise {
    0% {
        transform: rotate(0);
    }
    100% {
        transform: rotate(360deg);
    }
}
@keyframes counter {
    0% {
        transform: rotate(0);
    }
    100% {
        transform: rotate(-360deg);
    }
}
.animated-shadow-quote {
    display: inline-block;
    margin: 1em;
    max-width: 20em;
    position: relative;
}
.animated-shadow-quote blockquote {
    animation: shadows 2s linear infinite alternate;
    display: inline-block;
    margin: 0;
    padding: 1em;
}
.animated-shadow-quote blockquote cite {
    display: block;
    font-style: italic;
    text-align: right;
}
.animated-shadow-quote blockquote cite:before {
    content: "- ";
}

.bf-circle {
    border: 3px solid #fff;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    box-shadow: 0 0 12px rgba(51, 51, 51, 0.5);
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    outline-width: 3px;
    outline-color: transparent;
    background-color: #2ebcd4;
}

.bf-circle i {
    color: #fff;
}

@keyframes shadows {
    0% {
        box-shadow: 0 2px 4px -2px rgba(0, 0, 0, 0.75);
        transform: scale(0.95);
    }
    100% {
        box-shadow: 0 0 4px 2px rgba(0, 0, 0, 0.75);
        transform: scale(1);
    }
}

.rendered:focus {
    outline: 0 !important;
}
</style>
