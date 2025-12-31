<template>
    <div class="footer-logo-section" v-if="data">
        {{ data }}
    </div>
</template>
<script>
export default {
    name: "FooterLogo",
    props: {
        data: {
            type: Object,
            required: false,
        },
    },
};
</script>
