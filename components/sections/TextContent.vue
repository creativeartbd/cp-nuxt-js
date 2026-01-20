<template>
    <div class="text-content" :style="{ backgroundColor: data.background_color }">
        <div class="container">
            <div class="row">
                <div class="col-md-12 p-5" v-if="data.text_content" v-html="data.text_content"></div>
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
};
</script>
<style>
.text-content h2 {
    margin-bottom: 30px;
    margin-top: 10px;
}
</style>
