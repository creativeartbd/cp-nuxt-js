<template>
    <div class="our-passion" v-if="data" :style="{ backgroundColor: data.background_color }">
        <div class="container">
            <div class="row">
                <div class="col-12 text-center section-title">
                    <h2 v-if="data.title">{{ data.title }}</h2>
                    <p v-if="data.sub_title">{{ data.sub_title }}</p>
                    <div class="divide-separator divide-center"></div>
                </div>
                <template v-if="data.sections.length">
                    <div
                        class="col-lg-4 col-md-6 col-sm-12 mb-4"
                        v-for="(section, index) in data.sections"
                        :key="index"
                    >
                        <div class="out-passion-image" :class="{ 'middle-section': index === 1 }">
                            <h4 v-if="section.section_title" class="mb-3">{{ section.section_title }}</h4>
                            <div v-html="section.section_content" v-if="section.section_content"></div>

                            <img v-if="section.section_image" :src="section.section_image" alt="" />
                            <NuxtLink
                                class="btn btn-default mt-2"
                                :class="{ 'center-button': index === 0 || index === 2 }"
                                :to="section.section_button_url"
                            >
                                {{ section.section_button }}
                            </NuxtLink>
                        </div>
                    </div>
                </template>
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
.our-passion {
    position: relative;
    overflow: hidden;
    background-color: #f6f9ff;
    padding-top: 100px;
    padding-bottom: 120px;
}

.our-passion .our-passion-box {
    background-color: #fff;
    padding: 20px;
    text-align: center;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: 1px solid #fff;
    -webkit-box-shadow: -11px 6px 78px -11px rgba(0, 0, 0, 0.18);
    -moz-box-shadow: -11px 6px 78px -11px rgba(0, 0, 0, 0.18);
    box-shadow: -11px 6px 78px -11px rgba(0, 0, 0, 0.18);
}

.out-passion-image {
    position: relative;
}

.out-passion-image img {
    height: 570px;
    object-fit: cover;
    width: 100%;
}

.out-passion-image h3 {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #2ebcd4;
    color: #000;
    padding: 15px 30px;
    width: 90%;
    text-align: center;
    cursor: pointer;
    font-weight: normal;
    border-radius: 25px;
    background-color: #f6f9ffb0;
}

.out-passion-image h3:hover {
    border: 1px solid #fff;
    background-color: transparent;
    color: #000;
}

.btn {
    text-decoration: none;
}

/* Center button for 1st and 3rd objects */
.center-button {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 10;
    white-space: nowrap;
    border: 1px solid #fff;
}

/* Middle section (index 1) - all content centered */
.middle-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    height: 570px;
    background-color: #fff;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.04) 0px 10px 10px -5px;
    padding: 25px;
}

.middle-section h3 {
    position: static;
    transform: none;
    background-color: transparent;
    color: inherit;
    padding: 0;
    width: auto;
    margin-bottom: 20px;
    font-weight: bold;
}

.middle-section p {
    margin-bottom: 20px;
}

.middle-section img {
    height: auto;
    max-height: 200px;
    width: auto;
    max-width: 100%;
    margin-bottom: 20px;
}

.middle-section .btn {
    position: static;
    transform: none;
}

/* Responsive adjustments */
@media (max-width: 991.98px) {
    .our-passion {
        padding-top: 80px;
        padding-bottom: 100px;
    }

    .out-passion-image img {
        height: 450px;
    }

    .out-passion-image h3 {
        font-size: 15px;
        padding: 12px 25px;
    }

    .middle-section {
        height: 450px;
    }

    .middle-section img {
        max-height: 150px;
    }
}

@media (max-width: 767.98px) {
    .our-passion {
        padding-top: 60px;
        padding-bottom: 80px;
    }

    .out-passion-image img {
        height: 350px;
    }

    .out-passion-image h3 {
        font-size: 14px;
        padding: 10px 20px;
        width: 95%;
    }

    .section-title h2 {
        font-size: 1.8rem;
    }

    .section-title p {
        font-size: 0.95rem;
    }

    .middle-section {
        height: 350px;
    }

    .middle-section img {
        max-height: 120px;
    }
}

@media (max-width: 575.98px) {
    .our-passion {
        padding-top: 50px;
        padding-bottom: 60px;
    }

    .out-passion-image img {
        height: 280px;
    }

    .out-passion-image h3 {
        font-size: 13px;
        padding: 8px 15px;
        width: 95%;
    }

    .section-title h2 {
        font-size: 1.5rem;
    }

    .section-title p {
        font-size: 0.9rem;
    }

    .mb-4 {
        margin-bottom: 2rem !important;
    }

    .middle-section {
        height: 280px;
    }

    .middle-section img {
        max-height: 100px;
    }
}
</style>
