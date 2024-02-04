import pagination from "./pagination.js";
import ProductModal from "./ProductModal.js";
import DelProductModal from "./DelProductModal.js";

const apiUrl = 'https://vue3-course-api.hexschool.io/v2';
const apiPath = 'eden';

const app = Vue.createApp({
    data() {
        return {
            isNew: false,
            // 全部產品資料
            products: [],
            tempProduct: {
                imagesUrl: []
            },
            pages: {},
        }
    },
    methods: {
        checkAdmin() {
            const url = `${apiUrl}/api/user/check`;
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
                    window.location = 'login.html';
                })
        },
        getData(page = 1) {  // 參數預設值為1
            const url = `${apiUrl}/api/${apiPath}/admin/products?page=${page}`; // 分頁
            axios.get(url)
                .then((res) => {
                    this.products = res.data.products;
                    this.pages = res.data.pagination;
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
                this.$refs.pModal.openModal();
            } else if (isNew === 'edit') {
                this.tempProduct = { ...product };
                this.isNew = false;
                this.$refs.pModal.openModal();
            } else if (isNew === 'delete') {
                this.tempProduct = { ...product };
                this.$refs.dModal.openModal();
            }
        },
        updateProduct() {
            let url = `${apiUrl}/api/${apiPath}/admin/product`;
            let http = 'post';

            if (!this.isNew) {
                url = `${apiUrl}/api/${apiPath}/admin/product/${this.tempProduct.id}`;
                http = 'put'
            }

            axios[http](url, { data: this.tempProduct })
                .then((res) => {
                    Swal.fire(res.data.message);
                    this.$refs.pModal.closeModal();
                    this.getData();
                })
                .catch((err) => {
                    Swal.fire('欄位不得為空');
                })
        },
        delProduct() {
            const url = `${apiUrl}/api/${apiPath}/admin/product/${this.tempProduct.id}`;

            axios.delete(url)
                .then((res) => {
                    Swal.fire("刪除成功");
                    this.$refs.dModal.closeModal();
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
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
        axios.defaults.headers.common.Authorization = token;

        this.checkAdmin();
    },
    components: {
        pagination,
        ProductModal,
        DelProductModal,
    }
}).mount('#app');