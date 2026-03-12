<template>
    <div class="text-content" :style="{ backgroundColor: data.background_color }">
        <div class="container">
            <div class="row">
                <div class="col-md-12 p-5" v-if="data.text_content" v-html="processedContent"></div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "GetStarted",
    props: {
        data: {
            type: Object,
            required: true,
        },
    },
    computed: {
        processedContent() {
            if (!this.data?.text_content) return "";
            // Rewrite absolute internal links so they stay on the current domain
            return this.data.text_content.replace(/https?:\/\/cutoutpartner-api\.com\/v2\//g, "/");
        },
    },
};
</script>
<style>
.text-content h2 {
    margin-bottom: 30px;
    margin-top: 10px;
}
</style>
