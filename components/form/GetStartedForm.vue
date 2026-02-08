<template>
    <div class="get-started-form">
        <div class="container">
            <form>
                <div class="row g-3 mb-3">
                    <div class="col-lg-6 col-md-6 col-sm-12">
                        <label for="yourName" class="form-label" v-if="!isHome">Your name</label>
                        <input type="text" class="form-control" id="yourName" placeholder="Enter your name" />
                    </div>
                    <div class="col-lg-6 col-md-6 col-sm-12">
                        <label for="yourPhone" class="form-label" v-if="!isHome">Your phone number</label>
                        <input type="tel" class="form-control" id="yourPhone" placeholder="Enter your phone number" />
                    </div>
                </div>
                <div class="row g-3 mb-3">
                    <div class="col-lg-6 col-md-6 col-sm-12">
                        <label for="yourEmail" class="form-label" v-if="!isHome">Your email id</label>
                        <input type="email" class="form-control" id="yourEmail" placeholder="Enter your email" />
                    </div>
                    <div class="col-lg-6 col-md-6 col-sm-12">
                        <label for="yourWebsite" class="form-label" v-if="!isHome">Your website URL</label>
                        <input type="url" class="form-control" id="yourWebsite" placeholder="Enter your website URL" />
                    </div>
                </div>
                <div class="mt-3">
                    <label for="selectServices" class="form-label" v-if="!isHome">Select services</label>
                    <select id="selectServices" class="form-select" v-model="selectedService">
                        <option disabled value="">Select a service</option>
                        <option v-for="(item, index) in service" :key="index" :value="item.value">
                            {{ item.label }}
                        </option>
                    </select>
                </div>
                <div class="mt-3">
                    <label for="yourMessage" class="form-label" v-if="!isHome">Your message</label>
                    <textarea class="form-control" id="yourMessage" rows="2" placeholder="Your message"></textarea>
                </div>
                <div class="mt-3">
                    <div class="drag-area form-control" @dragover.prevent="dragOverHandler" @drop.prevent="dropHandler">
                        <p>Drag and drop files here Or <b>Browse files</b></p>
                        <input
                            type="file"
                            id="fileInput"
                            multiple
                            style="display: none"
                            @change="fileInputHandler"
                            ref="fileInput"
                        />
                        <button type="button" class="btn btn-primary btn-sm get-started-btn" @click="browseFiles">
                            Browse
                        </button>
                    </div>
                    <small class="file-info"
                        >If the size is more than 25 MB, share your image via cloud (Google Drive, Dropshare or
                        WeTransfer)</small
                    >
                </div>
                <div class="mt-3">
                    <label for="pasteLink" class="form-label" v-if="!isHome">Paste the link here</label>
                    <input type="url" class="form-control" id="pasteLink" placeholder="Paste the link here" />
                </div>
                <div class="mt-3">
                    <button type="submit" class="btn btn-default">{{ buttonName }}</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
export default {
    name: "GetStartedForm",
    data() {
        return {
            selectedService: [],
        };
    },
    props: {
        buttonName: {
            type: String,
            default: "Send Message",
        },
        isHome: {
            type: [String, Boolean],
            default: false,
        },
        service: {
            type: [Array, Object],
            default: false,
        },
    },
    mounted() {
        if (this.service) {
            this.selectedService = this.service;
        }
    },
    methods: {
        dragOverHandler() {
            // Handle the drag over event
        },
        dropHandler(event) {
            const files = event.dataTransfer.files;
            this.handleFiles(files);
        },
        browseFiles() {
            this.$refs.fileInput.click();
        },
        fileInputHandler(event) {
            const files = event.target.files;
            this.handleFiles(files);
        },
        handleFiles(files) {
            // for (let i = 0; i < files.length; i++) {
            //     console.log(`... file[${i}].name = ${files[i].name}`);
            //     // Process files here (e.g., uploading to a server)
            // }
        },
    },
};
</script>

<style scoped>
.drag-area {
    border: 2px dashed #ddd;
    border-radius: 5px;
    padding: 20px;
    text-align: center;
    cursor: pointer;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}

.drag-area:hover {
    background-color: #f8f9fa;
}

.get-started-form {
    padding: 25px 15px 20px 15px;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 8px 9px 24px #ececec;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.04) 0px 10px 10px -5px;
}

/* Chrome, Safari, Opera 15+ */
::-webkit-input-placeholder {
    color: #909090;
    font-size: 12px;
}

/* Firefox 19+ */
::-moz-placeholder {
    color: #909090;
    font-size: 12px;
    opacity: 1; /* Firefox lowers the opacity of the placeholder by default */
}

/* Internet Explorer and Edge */
:-ms-input-placeholder {
    color: #909090;
    font-size: 12px;
}

/* Standard syntax */
::placeholder {
    color: #909090;
    font-size: 12px;
}

input::placeholder,
textarea::placeholder {
    color: #909090; /* Placeholder text color */
    font-size: 14px;
}

.btn-default {
    width: 100%;
    margin-top: 30px;
    margin-bottom: 10px;
}

.btn-primary {
    background-color: #333;
    border: none;
}

.file-info {
    color: #7d7777;
}

.get-started-btn {
    margin-top: 10px !important;
}
</style>
