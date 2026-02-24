<template>
    <div class="get-started-form">
        <div class="container">
            <!-- Success Message -->
            <div v-if="successMessage" class="alert alert-success alert-dismissible fade show" role="alert">
                <i class="bi bi-check-circle-fill me-2"></i>
                {{ successMessage }}
                <button type="button" class="btn-close" @click="successMessage = ''"></button>
            </div>

            <!-- Error Message -->
            <div v-if="errorMessage" class="alert alert-danger alert-dismissible fade show" role="alert">
                <i class="bi bi-exclamation-triangle-fill me-2"></i>
                {{ errorMessage }}
                <button type="button" class="btn-close" @click="errorMessage = ''"></button>
            </div>

            <form @submit.prevent="submitForm">
                <div class="row g-3 mb-3">
                    <div class="col-lg-6 col-md-6 col-sm-12">
                        <label for="yourName" class="form-label" v-if="!isHome">Your name*</label>
                        <input
                            type="text"
                            class="form-control"
                            :class="{ 'is-invalid': errors.name }"
                            id="yourName"
                            v-model="formData.name"
                            placeholder="Enter your name"
                            required
                        />
                        <div v-if="errors.name" class="invalid-feedback">{{ errors.name }}</div>
                    </div>
                    <div class="col-lg-6 col-md-6 col-sm-12">
                        <label for="yourPhone" class="form-label" v-if="!isHome">Your phone number</label>
                        <input
                            type="tel"
                            class="form-control"
                            :class="{ 'is-invalid': errors.phone }"
                            id="yourPhone"
                            v-model="formData.phone"
                            placeholder="Enter your phone number"
                        />
                        <div v-if="errors.phone" class="invalid-feedback">{{ errors.phone }}</div>
                    </div>
                </div>
                <div class="row g-3 mb-3">
                    <div class="col-lg-6 col-md-6 col-sm-12">
                        <label for="yourEmail" class="form-label" v-if="!isHome">Your email id*</label>
                        <input
                            type="email"
                            class="form-control"
                            :class="{ 'is-invalid': errors.email }"
                            id="yourEmail"
                            v-model="formData.email"
                            placeholder="Enter your email"
                            required
                        />
                        <div v-if="errors.email" class="invalid-feedback">{{ errors.email }}</div>
                    </div>
                    <div class="col-lg-6 col-md-6 col-sm-12">
                        <label for="yourWebsite" class="form-label" v-if="!isHome">Your website URL</label>
                        <input
                            type="url"
                            class="form-control"
                            :class="{ 'is-invalid': errors.website }"
                            id="yourWebsite"
                            v-model="formData.website"
                            placeholder="Enter your website URL"
                        />
                        <div v-if="errors.website" class="invalid-feedback">{{ errors.website }}</div>
                    </div>
                </div>
                <div class="mt-3">
                    <label for="selectServices" class="form-label" v-if="!isHome">Select services*</label>
                    <select
                        id="selectServices"
                        class="form-select"
                        :class="{ 'is-invalid': errors.service }"
                        v-model="formData.selectedService"
                        required
                    >
                        <option disabled value="">Select a service</option>
                        <option v-for="(item, index) in service" :key="index" :value="item.value">
                            {{ item.label }}
                        </option>
                    </select>
                    <div v-if="errors.service" class="invalid-feedback">{{ errors.service }}</div>
                </div>
                <div class="mt-3">
                    <label for="yourMessage" class="form-label" v-if="!isHome">Your message*</label>
                    <textarea
                        class="form-control"
                        :class="{ 'is-invalid': errors.message }"
                        id="yourMessage"
                        rows="2"
                        v-model="formData.message"
                        placeholder="Your message"
                        required
                    ></textarea>
                    <div v-if="errors.message" class="invalid-feedback">{{ errors.message }}</div>
                </div>
                <div class="mt-3">
                    <div
                        class="drag-area form-control"
                        :class="{ 'drag-over': isDragOver }"
                        @dragover.prevent="dragOverHandler"
                        @dragleave="dragLeaveHandler"
                        @drop.prevent="dropHandler"
                        @click="browseFiles"
                    >
                        <i class="bi bi-cloud-upload fs-3 mb-2"></i>
                        <p>Drag and drop files here Or <b>Browse files</b></p>
                        <input
                            type="file"
                            id="fileInput"
                            multiple
                            style="display: none"
                            @change="fileInputHandler"
                            ref="fileInput"
                            accept="image/*,.pdf,.zip,.rar"
                        />
                    </div>
                    <small class="file-info"
                        >If the size is more than 25 MB, share your image via cloud (Dropbox, WeTransfer or Google
                        Drive)</small
                    >

                    <!-- File List -->
                    <div v-if="uploadedFiles.length > 0" class="uploaded-files mt-3">
                        <div
                            v-for="(file, index) in uploadedFiles"
                            :key="index"
                            class="file-item d-flex align-items-center justify-content-between mb-2"
                        >
                            <div class="d-flex align-items-center">
                                <i class="bi bi-file-earmark me-2"></i>
                                <span class="file-name">{{ file.name }}</span>
                                <small class="text-muted ms-2">({{ formatFileSize(file.size) }})</small>
                            </div>
                            <button type="button" class="btn btn-sm btn-danger" @click="removeFile(index)">
                                <i class="bi bi-x"></i>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="mt-3">
                    <label for="pasteLink" class="form-label" v-if="!isHome">Paste the cloud link here</label>
                    <input
                        type="url"
                        class="form-control"
                        id="pasteLink"
                        v-model="formData.cloudLink"
                        placeholder="Paste Dropbox/WeTransfer/Google Drive link"
                    />
                </div>
                <div class="mt-3">
                    <button type="submit" class="btn btn-default" :disabled="isSubmitting">
                        <span v-if="isSubmitting">
                            <span class="spinner-border spinner-border-sm me-2" role="status"></span>
                            Sending...
                        </span>
                        <span v-else>{{ buttonName }}</span>
                    </button>
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
            formData: {
                name: "",
                phone: "",
                email: "",
                website: "",
                selectedService: "",
                message: "",
                cloudLink: "",
            },
            uploadedFiles: [],
            errors: {},
            successMessage: "",
            errorMessage: "",
            isSubmitting: false,
            isDragOver: false,
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
            default: () => [],
        },
    },
    methods: {
        validateForm() {
            this.errors = {};

            // Name validation
            if (!this.formData.name.trim()) {
                this.errors.name = "Name is required";
            }

            // Email validation
            if (!this.formData.email.trim()) {
                this.errors.email = "Email is required";
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.formData.email)) {
                this.errors.email = "Please enter a valid email";
            }

            // Service validation
            if (!this.formData.selectedService) {
                this.errors.service = "Please select a service";
            }

            // Message validation
            if (!this.formData.message.trim()) {
                this.errors.message = "Message is required";
            }

            return Object.keys(this.errors).length === 0;
        },

        async submitForm() {
            // Reset messages
            this.successMessage = "";
            this.errorMessage = "";

            // Validate form
            if (!this.validateForm()) {
                this.errorMessage = "Please fill in all required fields correctly";
                return;
            }

            // Check file size
            const totalSize = this.uploadedFiles.reduce((sum, file) => sum + file.size, 0);
            const maxSize = 25 * 1024 * 1024; // 25MB

            if (totalSize > maxSize && !this.formData.cloudLink) {
                this.errorMessage = "Total file size exceeds 25MB. Please provide a cloud link instead.";
                return;
            }

            this.isSubmitting = true;

            try {
                // Create FormData for file upload
                const formDataToSend = new FormData();

                // Append form fields
                formDataToSend.append("name", this.formData.name);
                formDataToSend.append("email", this.formData.email);
                formDataToSend.append("phone", this.formData.phone || "");
                formDataToSend.append("website", this.formData.website || "");
                formDataToSend.append("service", this.formData.selectedService);
                formDataToSend.append("message", this.formData.message);
                formDataToSend.append("cloudLink", this.formData.cloudLink || "");

                // Append files
                this.uploadedFiles.forEach((file, index) => {
                    formDataToSend.append(`files[${index}]`, file);
                });

                // Send to WordPress REST API
                const config = useRuntimeConfig();
                const response = await $fetch(`${config.public.wordpressApiUrl}/cutout/v1/contact-form`, {
                    method: "POST",
                    body: formDataToSend,
                });

                // Success
                this.successMessage =
                    "Thank you for reaching out! You’ve successfully submitted your request. We’ll get back to you as soon as we can.";
                this.resetForm();
            } catch (error) {
                this.errorMessage =
                    error.data?.message || "Failed to send message. Please try again or contact us directly.";
            } finally {
                this.isSubmitting = false;
            }
        },

        resetForm() {
            this.formData = {
                name: "",
                phone: "",
                email: "",
                website: "",
                selectedService: "",
                message: "",
                cloudLink: "",
            };
            this.uploadedFiles = [];
            this.errors = {};

            // Reset file input
            if (this.$refs.fileInput) {
                this.$refs.fileInput.value = "";
            }
        },

        dragOverHandler(event) {
            this.isDragOver = true;
        },

        dragLeaveHandler() {
            this.isDragOver = false;
        },

        dropHandler(event) {
            this.isDragOver = false;
            const files = Array.from(event.dataTransfer.files);
            this.handleFiles(files);
        },

        browseFiles() {
            this.$refs.fileInput.click();
        },

        fileInputHandler(event) {
            const files = Array.from(event.target.files);
            this.handleFiles(files);
        },

        handleFiles(files) {
            // Filter valid files (images, PDF, ZIP, RAR)
            const validFiles = files.filter((file) => {
                const validTypes = [
                    "image/jpeg",
                    "image/jpg",
                    "image/png",
                    "image/gif",
                    "image/webp",
                    "application/pdf",
                    "application/zip",
                    "application/x-zip-compressed",
                    "application/x-rar-compressed",
                ];
                return validTypes.includes(file.type);
            });

            if (validFiles.length !== files.length) {
                this.errorMessage = "Some files were skipped. Only images, PDF, ZIP, and RAR files are allowed.";
            }

            // Add to uploaded files
            this.uploadedFiles.push(...validFiles);

            // Check total size
            const totalSize = this.uploadedFiles.reduce((sum, file) => sum + file.size, 0);
            const maxSize = 25 * 1024 * 1024; // 25MB

            if (totalSize > maxSize) {
                this.errorMessage =
                    "Total file size exceeds 25MB. Please use a cloud storage link (Dropbox, WeTransfer, Google Drive).";
            }
        },

        removeFile(index) {
            this.uploadedFiles.splice(index, 1);
        },

        formatFileSize(bytes) {
            if (bytes === 0) return "0 Bytes";
            const k = 1024;
            const sizes = ["Bytes", "KB", "MB", "GB"];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
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
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    transition: all 0.3s ease;
}

.drag-area:hover,
.drag-area.drag-over {
    background-color: #f8f9fa;
    border-color: #07b8d0;
}

.get-started-form {
    padding: 25px 15px 20px 15px;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 8px 9px 24px #ececec;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.04) 0px 10px 10px -5px;
}

.uploaded-files {
    border: 1px solid #dee2e6;
    border-radius: 5px;
    padding: 10px;
    background: #f8f9fa;
}

.file-item {
    padding: 8px;
    background: white;
    border-radius: 4px;
    border: 1px solid #e0e0e0;
}

.file-name {
    font-size: 14px;
    color: #333;
}

input::placeholder,
textarea::placeholder {
    color: #909090;
    font-size: 14px;
}

.btn-default {
    width: 100%;
    margin-top: 30px;
    margin-bottom: 10px;
    background-color: #07b8d0;
    color: white;
    border: none;
    padding: 12px;
    font-size: 16px;
    font-weight: 500;
}

.btn-default:hover:not(:disabled) {
    background-color: #069aaf;
}

.btn-default:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.file-info {
    color: #7d7777;
    display: block;
    margin-top: 5px;
}

.is-invalid {
    border-color: #dc3545;
}

.invalid-feedback {
    display: block;
    color: #dc3545;
    font-size: 12px;
    margin-top: 5px;
}

.alert {
    margin-bottom: 20px;
}

.spinner-border-sm {
    width: 1rem;
    height: 1rem;
    border-width: 0.15em;
}
</style>
