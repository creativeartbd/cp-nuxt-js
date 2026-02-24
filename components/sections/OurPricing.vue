<template>
    <section class="pricing-table" v-if="data" :style="{ backgroundColor: data.background_color }">
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
                            <!-- Removed the "All" tab button -->
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
                        <!-- Removed the "All" tab content -->
                        <div
                            class="tab-pane fade"
                            :class="{ 'show active': activeTab === pricing.tab_name }"
                            :id="'nav-' + pricing_index"
                            role="tabpanel"
                            :aria-labelledby="'nav-tab-' + pricing_index"
                            v-for="(pricing, pricing_index) in data.tabs"
                            :key="pricing_index"
                        >
                            <div class="row align-items-stretch g-3">
                                <div
                                    class="col-sm-6 col-md-6 col-lg-3"
                                    v-for="(innerPricing, innerIndex) in pricing.prices"
                                    :key="innerIndex"
                                    v-if="pricing.prices && Array.isArray(pricing.prices)"
                                >
                                    <div class="price-table">
                                        <img v-if="innerPricing.price_image" :src="innerPricing.price_image" loading="lazy" />
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
            activeTab: "", // Changed from "All" to empty string
            allPricing: [],
        };
    },
    methods: {
        setActiveTab(tabTitle) {
            this.activeTab = tabTitle;
        },
        setDefaultActiveTab() {
            // Set the first category as active by default
            if (this.data && this.data.tabs && Array.isArray(this.data.tabs) && this.data.tabs.length > 0) {
                this.activeTab = this.data.tabs[0].tab_name;
            }
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

        // Set the first category as active by default
        this.setDefaultActiveTab();
    },
    // Add a watcher to handle data changes after initial mount
    watch: {
        data: {
            handler(newData) {
                if (newData && !this.activeTab) {
                    this.setDefaultActiveTab();
                }
            },
            immediate: true,
        },
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
}
</style>
