let productModal = null;
let delProductModal = null;

const app = Vue.createApp({
    data() {
        return {
            apiUrl: 'https://vue3-course-api.hexschool.io/v2',
            apiPath: 'eden',
            isNew: false,
            // 全部產品資料
            products: [],
            tempProduct: {
                imagesUrl: []
            }
        }
    },
    methods: {
        checkAdmin() {
            const url = `${this.apiUrl}/api/user/check`;
            axios.post(url)
                .then((res) => {
                    this.getData();
                })
                .catch((err) => {
                    Swal.fire({
                        icon: "error",
                        title: "驗證錯誤",
                        text: "請重新登入"
                    });
                    location.href = 'login.html';
                })
        },
        getData() {
            const url = `${this.apiUrl}/api/${this.apiPath}/admin/products/all`;
            axios.get(url)
                .then((res) => {
                    this.products = res.data.products;
                })
                .catch((err) => {
                    Swal.fire(err);
                })
        },
        openModal(isNew, product) {
            if (isNew === 'create') {
                this.tempProduct = {
                    imagesUrl: [],
                };
                this.isNew = true;
                productModal.show();
            } else if (isNew === 'edit') {
                this.tempProduct = { ...product };
                this.isNew = false;
                productModal.show();
            } else if (isNew === 'delete') {
                this.tempProduct = { ...product };
                delProductModal.show();
            }
        },
        updateProduct() {
            let url = `${this.apiUrl}/api/${this.apiPath}/admin/product`;
            let http = 'post';

            if (!this.isNew) {
                url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;
                http = 'put'
            }

            axios[http](url, { data: this.tempProduct })
                .then((res) => {
                    Swal.fire(res.data.message);
                    productModal.hide();
                    this.getData();
                })
                .catch((err) => {
                    Swal.fire('欄位不得為空');
                })
        },
        delProduct() {
            const url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;

            axios.delete(url)
                .then((res) => {
                    Swal.fire("刪除成功");
                    delProductModal.hide();
                    this.getData();
                })
                .catch((err) => {
                    Swal.fire(err);
                })
        },
        createImages() {
            this.tempProduct.imagesUrl = [];
            this.tempProduct.imagesUrl.push('');
        }
    },
    mounted() {
        productModal = new bootstrap.Modal(document.getElementById('productModal'), {
            keyboard: false,
            backdrop: 'static'
        });
        delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'), {
            keyboard: false,
            backdrop: 'static'
        });

        const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
        axios.defaults.headers.common.Authorization = token;

        this.checkAdmin();
    },
}).mount('#app');