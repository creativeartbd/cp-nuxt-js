<template>
    <div class="pro-approach" v-if="data">
        <div class="container">
            <div class="row">
                <div class="col-lg-6 col-md-6 col-sm-12 section-title mb-4 mb-md-0">
                    <h2 v-if="data.title">{{ data.title }}</h2>
                    <p v-if="data.sub_title">{{ data.sub_title }}</p>
                    <!-- <div class="divide-separator"></div> -->
                </div>
                <div class="col-lg-6 col-md-6 col-sm-12">
                    <div class="section-content" v-if="data.content" v-html="data.content"></div>
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
.pro-approach {
    padding-top: 100px;
    padding-bottom: 100px;
    background-color: #fbfbfb;
}

.section-title h2 {
    margin-bottom: 20px;
    line-height: 1.3;
    font-weight: 600;
}

.section-title p {
    margin-bottom: 30px;
    line-height: 1.6;
    opacity: 0.9;
}

.divide-separator {
    width: 60px;
    height: 3px;
    background-color: #007bff;
    margin-bottom: 0;
    border-radius: 2px;
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
    font-weight: 600;
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
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.section-content :deep(blockquote) {
    border-left: 4px solid #007bff;
    padding-left: 1rem;
    margin: 1rem 0;
    font-style: italic;
    opacity: 0.9;
    background-color: rgba(0, 123, 255, 0.05);
    padding: 1rem;
    border-radius: 4px;
}

.section-content :deep(a) {
    color: #007bff;
    text-decoration: none;
    transition: color 0.3s ease;
}

.section-content :deep(a:hover) {
    color: #0056b3;
    text-decoration: underline;
}

.section-content :deep(strong),
.section-content :deep(b) {
    font-weight: 600;
}

.section-content :deep(code) {
    background-color: #f8f9fa;
    padding: 0.2rem 0.4rem;
    border-radius: 3px;
    font-size: 0.9em;
    color: #e83e8c;
}

.section-content :deep(pre) {
    background-color: #f8f9fa;
    padding: 1rem;
    border-radius: 6px;
    overflow-x: auto;
    margin: 1rem 0;
    border: 1px solid #e9ecef;
}

/* Tablet Styles */
@media (max-width: 991.98px) {
    .pro-approach {
        padding-top: 80px;
        padding-bottom: 80px;
    }

    .section-title h2 {
        font-size: 1.8rem;
        margin-bottom: 15px;
    }

    .section-title p {
        font-size: 1rem;
        margin-bottom: 25px;
    }

    .divide-separator {
        width: 50px;
        height: 2px;
    }
}

/* Mobile Styles */
@media (max-width: 767.98px) {
    .pro-approach {
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
        margin-bottom: 20px;
    }

    .divide-separator {
        width: 40px;
        height: 2px;
        margin: 0 auto 0 auto;
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

    .section-content :deep(blockquote) {
        padding: 0.8rem;
        margin: 0.8rem 0;
    }
}

/* Small Mobile Styles */
@media (max-width: 575.98px) {
    .pro-approach {
        padding-top: 50px;
        padding-bottom: 50px;
    }

    .section-title h2 {
        font-size: 1.4rem;
        margin-bottom: 10px;
    }

    .section-title p {
        font-size: 0.9rem;
        margin-bottom: 15px;
    }

    .divide-separator {
        width: 35px;
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
        padding: 0.6rem;
        font-size: 0.9rem;
    }

    .section-content :deep(pre) {
        padding: 0.8rem;
        font-size: 0.85rem;
    }

    .section-content :deep(code) {
        font-size: 0.85em;
    }
}

/* Extra Small Mobile Styles */
@media (max-width: 375px) {
    .pro-approach {
        padding-top: 40px;
        padding-bottom: 40px;
    }

    .section-title h2 {
        font-size: 1.3rem;
    }

    .section-title p {
        font-size: 0.85rem;
        margin-bottom: 12px;
    }

    .divide-separator {
        width: 30px;
    }

    .section-content :deep(p) {
        font-size: 0.85rem;
    }

    .section-content :deep(h1),
    .section-content :deep(h2),
    .section-content :deep(h3) {
        font-size: 1.2rem;
    }

    .section-content :deep(h4),
    .section-content :deep(h5),
    .section-content :deep(h6) {
        font-size: 1rem;
    }
}

/* Landscape Mobile */
@media (max-width: 767.98px) and (orientation: landscape) {
    .pro-approach {
        padding-top: 40px;
        padding-bottom: 40px;
    }

    .section-title {
        margin-bottom: 20px;
    }

    .section-title p {
        margin-bottom: 15px;
    }
}

/* High DPI / Retina Displays */
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
    .divide-separator {
        height: 3px;
    }
}

/* Print Styles */
@media print {
    .pro-approach {
        padding-top: 20px;
        padding-bottom: 20px;
        background-color: transparent !important;
        color: #000 !important;
    }

    .section-title h2,
    .section-title p,
    .section-content {
        color: #000 !important;
    }

    .divide-separator {
        background-color: #000 !important;
        width: 40px;
        height: 2px;
    }

    .section-content :deep(blockquote) {
        background-color: #f5f5f5 !important;
        border-color: #000 !important;
    }

    .section-content :deep(a) {
        color: #000 !important;
        text-decoration: underline !important;
    }
}
</style>
