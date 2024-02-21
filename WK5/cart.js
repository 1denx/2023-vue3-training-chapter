const { createApp } = Vue
const apiUrl = 'https://vue3-course-api.hexschool.io/v2';
const apiPath = 'eden';

const { Form, Field, ErrorMessage, defineRule, configure } = VeeValidate;
const { required, email, min } = VeeValidateRules;
const { localize, loadLocaleFromURL } = VeeValidateI18n;

defineRule("required", required);
defineRule("email", email);
defineRule("min", min);

loadLocaleFromURL(
    "https://unpkg.com/@vee-validate/i18n@4.12.4/dist/locale/zh_TW.json"
);
configure({
    generateMessage: localize("zh_TW"),
    validateOnInput: true,
});

const userModal = {
    props: ['tempProduct', 'addCart'],
    data() {
        return {
            productModal: null,
            qty: 1,
        }
    },
    methods: {
        open() {
            this.productModal.show()
        },
        close() {
            this.productModal.hide()
        }
    },
    // 讓 qty 的值重置
    watch: {
        tempProduct() {
            this.qty = 1;
        }
    },
    template: '#userProductModal',
    mounted() {
        this.productModal = new bootstrap.Modal(this.$refs.modal)
    }
}

const app = createApp({
    data() {
        return {
            products: [],
            tempProduct: {},
            status: {
                addCartLoading: '',
                cartQtyLoading: '',
            },
            carts: {},
            form: {
                user: {
                    name: "",
                    email: "",
                    tel: "",
                    address: "",
                },
                message: "",
            },
        };
    },
    methods: {
        getProducts() {
            const url = `${apiUrl}/api/${apiPath}/products/all`
            axios.get(url)
                .then(res => {
                    console.log(res)
                    this.products = res.data.products
                })
        },
        openModal(product) {
            this.tempProduct = product;
            this.$refs.userModal.open();
        },
        addCart(product_id, qty = 1) {
            const url = `${apiUrl}/api/${apiPath}/cart`
            const order = {
                product_id,
                qty
            };
            this.status.addCartLoading = product_id;
            axios.post(url, { data: order })
                .then(res => {
                    console.log(res)
                    this.status.addCartLoading = '';
                    this.getCart();
                    this.$refs.userModal.close();
                })
        },
        changeCartQty(item, qty = 1) {
            const url = `${apiUrl}/api/${apiPath}/cart/${item.id}`
            const order = {
                product_id: item.product_id,
                qty
            };
            this.status.cartQtyLoading = item.id;
            axios.put(url, { data: order })
                .then(res => {
                    console.log(res)
                    this.status.cartQtyLoading = "";
                    this.getCart();
                })
        },
        removeCartItem(id) {
            this.status.cartQtyLoading = id;
            const url = `${apiUrl}/api/${apiPath}/cart/${id}`
            axios.delete(url)
                .then(res => {
                    this.status.cartQtyLoading = "";
                    this.getCart();
                })
        },
        getCart() {
            const url = `${apiUrl}/api/${apiPath}/cart`

            axios.get(url)
                .then(res => {
                    this.carts = res.data.data
                    console.log(this.carts)
                })
        },
        createOrder() {
            if (!this.carts.carts.length) {
                alert("購物車內沒有商品，無法送出訂單");
                return;
            }

            const url = `${apiUrl}/api/${apiPath}/order`;
            const order = this.form;
            axios.post(url, { data: order })
                .then((res) => {
                    alert(res.data.message);
                    this.$refs.form.resetForm();
                    this.getCart();
                })
                .catch((err) => {
                    alert(err.res.data.message);
                });
        }
    },
    components: {
        userModal,
        VForm: Form,
        VField: Field,
        ErrorMessage: ErrorMessage,
        loading: VueLoading.Component,
    },
    mounted() {
        this.getProducts();
        this.getCart();
    },
})
app.mount('#app')