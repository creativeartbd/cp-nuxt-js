<template>
    <div class="call-in-action" v-if="data">
        <div class="container">
            <div class="row">
                <div class="col-lg-4 col-md-12">
                    <div class="action-title">
                        <h2 v-if="data.title">{{ data.title }}</h2>
                    </div>
                </div>
                <div class="col-lg-1 d-none d-lg-block"></div>
                <div class="col-lg-7 col-md-12">
                    <div class="action-content">
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
            validator(value) {
                return value && (value.title || value.content);
            },
        },
    },
};
</script>

<style scoped>
.call-in-action h2,
.call-in-action p {
    color: #09364b;
}

.call-in-action-btn {
    border: none;
    border-radius: 25px;
    background-color: #00364b;
    padding: 10px 50px;
    color: #fff;
    text-decoration: none;
    display: inline-block;
    transition: all 0.3s ease;
}

.call-in-action-btn:hover {
    background-color: #2ebcd4;
    color: #fff;
    text-decoration: none;
}

.call-in-action {
    padding: 70px;
    background-color: #2ebcd4;
    background-image: url("https://themeim.com/wp/cliper/wp-content/uploads/2021/11/3334703.png");
    background-attachment: fixed;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
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

/* Responsive Design */
@media (max-width: 991.98px) {
    .call-in-action {
        padding: 60px 30px;
    }

    .action-title {
        text-align: center;
        margin-bottom: 2rem;
        height: auto;
    }

    .action-content {
        text-align: center;
        height: auto;
    }

    .action-content p {
        margin-bottom: 1.5rem;
    }
}

@media (max-width: 767.98px) {
    .call-in-action {
        text-align: center;
        padding: 50px 15px;
        background-attachment: scroll;
    }

    .call-in-action h2 {
        font-size: 1.8rem;
        margin-bottom: 1rem;
    }

    .action-title {
        margin-bottom: 1.5rem;
    }

    .action-content p {
        font-size: 0.95rem;
        margin-bottom: 1.5rem;
    }

    .call-in-action-btn {
        padding: 12px 40px;
        font-size: 0.95rem;
        width: auto;
    }
}

@media (max-width: 575.98px) {
    .call-in-action {
        padding: 40px 15px;
    }

    .call-in-action h2 {
        font-size: 1.5rem;
        line-height: 1.3;
    }

    .action-content p {
        font-size: 0.9rem;
        line-height: 1.5;
        margin-bottom: 1.25rem;
    }

    .call-in-action-btn {
        padding: 10px 30px;
        font-size: 0.9rem;
        width: fit-content;
        margin: 0 auto;
    }
}

@media (max-width: 480px) {
    .call-in-action {
        padding: 35px 10px;
    }

    .call-in-action h2 {
        font-size: 1.3rem;
    }

    .action-content p {
        font-size: 0.85rem;
    }

    .call-in-action-btn {
        padding: 8px 25px;
        font-size: 0.85rem;
    }
}
</style>
