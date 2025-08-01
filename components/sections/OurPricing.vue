<template>
    <section class="pricing-table" v-if="data">
        <div class="container">
            <div class="row">
                <div class="col-md-12 section-title text-center">
                    <h2 v-if="data.title">{{ data.title }}</h2>
                    <p v-if="data.sub_title">{{ data.sub_title }}</p>
                    <div class="divide-separator divide-center"></div>
                </div>
            </div>
            <div class="row" v-if="data.tabs">
                <div class="col-md-12">
                    <nav class="pricing-tab">
                        <div class="nav nav-tabs" id="nav-tab" role="tablist">
                            <button
                                class="nav-link"
                                :class="{ active: activeTab === 'All' }"
                                id="nav-home-tab"
                                data-bs-toggle="tab"
                                data-bs-target="#nav-home"
                                type="button"
                                role="tab"
                                aria-controls="nav-home"
                                aria-selected="true"
                                @click="setActiveTab('All')"
                            >
                                All
                            </button>

                            <button
                                class="nav-link"
                                :class="{ active: activeTab === category.tab_name }"
                                :id="'nav-tab-' + index"
                                data-bs-toggle="tab"
                                :data-bs-target="'#nav-' + index"
                                type="button"
                                role="tab"
                                :aria-controls="'nav-' + index"
                                :aria-selected="activeTab === category.tab_name"
                                v-for="(category, index) in data.tabs"
                                :key="index"
                                @click="setActiveTab(category.tab_name)"
                            >
                                {{ category.tab_name }}
                            </button>
                        </div>
                    </nav>
                    <div class="tab-content pricing-tab-content" id="nav-tabContent">
                        <div
                            class="tab-pane fade show"
                            :class="{ 'show active': activeTab === 'All' }"
                            id="nav-home"
                            role="tabpanel"
                            aria-labelledby="nav-home-tab"
                        >
                            <div class="row">
                                <div
                                    class="col-md-6 col-lg-3"
                                    v-for="(pricing, pricing_index) in allPricing"
                                    :key="pricing_index"
                                >
                                    <div class="price-table">
                                        <img v-if="pricing.price_image" :src="pricing.price_image" />
                                        <div
                                            v-if="pricing.price_content"
                                            v-html="pricing.price_content"
                                            class="pricing-table-list"
                                        ></div>
                                        <router-link
                                            v-if="pricing.button_label && pricing.button_url"
                                            :to="pricing.button_url"
                                            class="btn btn-default order-now"
                                            >{{ pricing.button_label }}</router-link
                                        >
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div
                            class="tab-pane fade"
                            :class="{ 'show active': activeTab === pricing.tab_name }"
                            :id="'nav-' + pricing_index"
                            role="tabpanel"
                            :aria-labelledby="'nav-tab-' + pricing_index"
                            v-for="(pricing, pricing_index) in data.tabs"
                            :key="pricing_index"
                        >
                            <div class="row">
                                <div
                                    class="col-md-6 col-lg-3"
                                    v-for="(innerPricing, innerIndex) in pricing.prices"
                                    :key="innerIndex"
                                    v-if="pricing.prices && Array.isArray(pricing.prices)"
                                >
                                    <div class="price-table">
                                        <img v-if="innerPricing.price_image" :src="innerPricing.price_image" />
                                        <div
                                            v-if="innerPricing.price_content"
                                            v-html="innerPricing.price_content"
                                            class="pricing-table-list"
                                        ></div>
                                        <router-link
                                            v-if="innerPricing.button_label && innerPricing.button_url"
                                            :to="innerPricing.button_url"
                                            class="btn btn-default order-now"
                                            >{{ innerPricing.button_label }}</router-link
                                        >
                                    </div>
                                </div>
                                <div v-else-if="pricing.prices === false" class="col-12 text-center">
                                    <p class="text-muted">No pricing available for this category.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
<script>
export default {
    props: ["data"],
    data() {
        return {
            activeTab: "All",
            allPricing: [],
        };
    },
    methods: {
        setActiveTab(tabTitle) {
            this.activeTab = tabTitle;
        },
    },
    mounted() {
        let uniqueIndex = 0; // Initialize a counter for unique indices
        if (this.data && this.data.tabs && Array.isArray(this.data.tabs)) {
            this.data.tabs.forEach((tab) => {
                if (tab.prices && Array.isArray(tab.prices)) {
                    tab.prices.forEach((pricing) => {
                        pricing.key = uniqueIndex++;
                        this.allPricing.push(pricing);
                    });
                }
            });
        }
    },
};
</script>
<style scoped>
.pricing-table {
    background: radial-gradient(
        circle,
        rgba(0, 188, 212, 1) 0%,
        rgba(255, 255, 255, 1) 0%,
        rgba(0, 188, 212, 0.055081407563025264) 52%,
        rgba(255, 255, 255, 1) 100%
    );

    /* background: radial-gradient(
            43.91% 38.55% at 46.3% -6.67%,
            rgba(226, 242, 255, 0.4) 15%,
            rgba(225, 241, 255, 0.4) 50.41%,
            rgba(255, 255, 255, 0) 100%
        ),
        radial-gradient(43.62% 36.72% at 61.93% 32.9%, rgba(218, 242, 229, 0.42) 22.41%, rgba(255, 255, 255, 0) 100%),
        radial-gradient(
            47.13% 32.19% at 5.26% 46.89%,
            rgba(225, 241, 255, 0.5) 6.98%,
            rgba(225, 241, 255, 0.35) 29.18%,
            rgba(255, 255, 255, 0) 100%
        ),
        #fff; */
}
.pricing-table .section-title {
    padding-left: 10%;
    padding-right: 10%;
}

.pricing-table .free-trial {
    margin: 20px 0;
    box-shadow: none;
    display: block;
    color: #00bcd4;
}

.pricing-table .price-table {
    background-color: #fff;
    padding: 20px;
    margin-bottom: 50px;
    transition: all 0.5s ease-in;
    border: 1px solid #e3e3e3;
    width: 100%;
}

.pricing-table .price-table img {
    margin-bottom: 25px;
    width: 100%;
}

.pricing-table .price-table .price-start-from h2 {
    margin-bottom: 0;
}

.pricing-table .price-table .price-start-from p {
    margin-bottom: 0;
}

.pricing-table .order-now {
    display: inline-block;
    margin-top: 10px;
    width: 100%;
    background-color: transparent;
    border: 1px solid #000;
    color: #000;
}

.pricing-table .price-table:hover {
    -webkit-box-shadow: 0px 8px 13px 0px #0000000f !important;
    -moz-box-shadow: 0px 8px 13px 0px #0000000f !important;
    box-shadow: 0px 8px 13px 0px #0000000f !important;
    border-radius: 10px;
    transform: scale(1.02, 1.02);
    cursor: pointer;
    transition: all ease-in 0.3s;
    border: 1px solid #00bcd4;
}

.pricing-table .price-table.best-price {
    -webkit-box-shadow: 0px 2px 101px -38px #c7c7c7;
    -moz-box-shadow: 0px 2px 101px -38px #c7c7c7;
    box-shadow: 0px 2px 101px -38px #c7c7c7;
    cursor: pointer;
    transition: all ease-in 0.3s;
}

.price-table:hover .order-now {
    background-color: #00364b !important;
    color: #fff !important;
}

.pricing-tab {
    margin-bottom: 15px;
    display: flex;
    justify-content: center;
    border-bottom: 1px solid #00bcd4;
}

.pricing-tab .nav-link {
    color: #000;
    border: none;
}

.pricing-tab .nav-link.active {
    color: #fff;
    background-color: #00bcd4;
    /* background-image: linear-gradient(90deg, #00bcd4 0%, #0dd1ff 100%); */
}
</style>
