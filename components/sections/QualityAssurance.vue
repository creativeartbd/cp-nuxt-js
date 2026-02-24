<template>
    <div class="pro-approach" v-if="data" :style="{ backgroundColor: data.background_color }">
        <div class="container">
            <div class="row">
                <div class="col-lg-4 col-md-4 col-sm-12">
                    <div class="d-flex justify-content-center align-items-center h-100" v-if="data.image">
                        <img :src="data.image" :alt="data.title" width="150" loading="lazy" />
                    </div>
                </div>
                <div class="col-lg-8 col-md-8 col-sm-12">
                    <h2 v-if="data.title">{{ data.title }}</h2>
                    <p class="mb-3" v-if="data.sub_title">{{ data.sub_title }}</p>
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
    margin-bottom: 0;
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
</style>
