<template>
    <div class="who-we-are" v-if="data" :style="{ backgroundColor: data.background_color }">
        <div class="container">
            <div class="row">
                <div class="col-lg-8 col-md-8 col-sm-12 section-title mb-4 mb-md-0">
                    <h2 v-if="data.title">{{ data.title }}</h2>
                    <p class="mb-3" v-if="data.sub_title">{{ data.sub_title }}</p>
                    <div class="section-content" v-html="data.content"></div>
                    <!-- <div class="divide-separator"></div> -->
                </div>
                <div class="col-lg-4 col-md-4 col-sm-12">
                    <div class="d-flex justify-content-center align-items-center h-100">
                        <img
                            src="http://cutoutpartner-api.com/wp-content/uploads/2025/12/management.png"
                            alt=""
                            width="200"
                        />
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
.who-we-are {
    padding-top: 100px;
    padding-bottom: 100px;
}

.section-title h2 {
    margin-bottom: 0;
    line-height: 1.3;
    font-weight: 600;
}

.section-title p {
    margin-bottom: 0;
    line-height: 1.6;
    opacity: 0.9;
}

.section-content {
    line-height: 1.7;
}

.section-content :deep(h1),
.section-content :deep(h2),
.section-content :deep(h3),
.section-content :deep(h4),
.section-content :deep(h5),
.section-content :deep(h6) {
    margin-top: 0;
    margin-bottom: 1rem;
    line-height: 1.4;
}

.section-content :deep(p) {
    margin-bottom: 1rem;
    line-height: 1.7;
}

.section-content :deep(ul),
.section-content :deep(ol) {
    margin-bottom: 1rem;
    padding-left: 1.5rem;
}

.section-content :deep(li) {
    margin-bottom: 0.5rem;
    line-height: 1.6;
}

.section-content :deep(img) {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    margin: 1rem 0;
}

.section-content :deep(blockquote) {
    border-left: 4px solid #007bff;
    padding-left: 1rem;
    margin: 1rem 0;
    font-style: italic;
    opacity: 0.9;
}

.about-us-logo {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
}

.about-us-logo img {
    width: 300px;
    height: auto;
    max-width: 100%;
}

/* Tablet Styles */
@media (max-width: 991.98px) {
    .who-we-are {
        padding-top: 80px;
        padding-bottom: 80px;
    }

    .section-title h2 {
        font-size: 1.8rem;
        margin-bottom: 15px;
    }

    .section-title p {
        font-size: 1rem;
    }

    .about-us-logo img {
        width: 250px;
    }
}

/* Mobile Styles */
@media (max-width: 767.98px) {
    .who-we-are {
        padding-top: 60px;
        padding-bottom: 60px;
    }

    .section-title {
        text-align: center;
        margin-bottom: 30px;
    }

    .section-title h2 {
        font-size: 1.6rem;
        margin-bottom: 12px;
    }

    .section-title p {
        font-size: 0.95rem;
        margin-bottom: 0;
    }

    .section-content {
        text-align: left;
    }

    .section-content :deep(h1),
    .section-content :deep(h2),
    .section-content :deep(h3) {
        font-size: 1.4rem;
    }

    .section-content :deep(h4),
    .section-content :deep(h5),
    .section-content :deep(h6) {
        font-size: 1.2rem;
    }

    .section-content :deep(p) {
        font-size: 0.95rem;
        margin-bottom: 1rem;
    }

    .about-us-logo {
        margin-top: 20px;
    }

    .about-us-logo img {
        width: 200px;
    }
}

/* Small Mobile Styles */
@media (max-width: 575.98px) {
    .who-we-are {
        padding-top: 50px;
        padding-bottom: 50px;
    }

    .section-title h2 {
        font-size: 1.4rem;
        margin-bottom: 10px;
    }

    .section-title p {
        font-size: 0.9rem;
    }

    .section-content :deep(h1),
    .section-content :deep(h2),
    .section-content :deep(h3) {
        font-size: 1.3rem;
    }

    .section-content :deep(h4),
    .section-content :deep(h5),
    .section-content :deep(h6) {
        font-size: 1.1rem;
    }

    .section-content :deep(p) {
        font-size: 0.9rem;
    }

    .section-content :deep(ul),
    .section-content :deep(ol) {
        padding-left: 1.2rem;
    }

    .section-content :deep(blockquote) {
        padding-left: 0.8rem;
        font-size: 0.9rem;
    }

    .about-us-logo img {
        width: 180px;
    }
}

/* Extra Small Mobile Styles */
@media (max-width: 375px) {
    .who-we-are {
        padding-top: 40px;
        padding-bottom: 40px;
    }

    .section-title h2 {
        font-size: 1.3rem;
    }

    .section-title p {
        font-size: 0.85rem;
    }

    .section-content :deep(p) {
        font-size: 0.85rem;
    }

    .section-content :deep(h1),
    .section-content :deep(h2),
    .section-content :deep(h3) {
        font-size: 1.2rem;
    }

    .about-us-logo img {
        width: 150px;
    }
}

/* Landscape Mobile */
@media (max-width: 767.98px) and (orientation: landscape) {
    .who-we-are {
        padding-top: 40px;
        padding-bottom: 40px;
    }

    .section-title {
        margin-bottom: 20px;
    }
}

/* Print Styles */
@media print {
    .who-we-are {
        padding-top: 20px;
        padding-bottom: 20px;
        color: #000 !important;
    }

    .section-title h2,
    .section-title p,
    .section-content {
        color: #000 !important;
    }

    .about-us-logo img {
        max-width: 200px;
    }
}
</style>
