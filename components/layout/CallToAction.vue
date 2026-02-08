<template>
    <div class="call-in-action" v-if="data">
        <div class="container-fluid">
            <div class="row">
                <div class="col-md-12">
                    <div class="cta-section">
                        <h2 v-if="data.title">{{ data.title }}</h2>
                        <p v-if="data.content">{{ data.content }}</p>
                        <NuxtLink
                            v-if="data.button_location && data.button_label"
                            :to="data.button_location"
                            class="btn btn-dark-default call-in-action-btn"
                        >
                            {{ data.button_label }}
                        </NuxtLink>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "CallToAction",
    props: {
        data: {
            type: Object,
            required: true,
        },
    },
};
</script>

<style scoped>
.call-in-action h2,
.call-in-action p {
    color: #fff;
}

.call-in-action-btn {
    margin-top: 30px;
    margin-bottom: 20px;
    border: none;
    border-radius: 25px;
    /* background-color: #00364b; */
    padding: 15px 50px;
    color: #171b26;
    text-decoration: none;
    display: inline-block;
    transition: all 0.3s ease;
    background: #fff;
}

.call-in-action-btn:hover {
    background-color: #ff9a9a;
    color: #fff;
    text-decoration: none;
}

.action-title {
    display: flex;
    align-items: center;
    height: 100%;
}

.action-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100%;
}

.action-content p {
    margin-bottom: 2rem;
}

.cta-section {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    flex-direction: column;
}
</style>
