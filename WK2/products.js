const app = {
    data() {
        return {
            apiUrl: 'https://vue3-course-api.hexschool.io/v2',
            apiPath: 'eden',
            products: [],
            temp: {}
        };
    },
    methods: {
        checkLogin() {
            axios.post(`${this.apiUrl}/api/user/check`)
                .then((res) => {
                    this.getData();
                })
                .catch((err) => {
                    console.log(err)
                    Swal.fire({
                        icon: "error",
                        title: "驗證錯誤",
                        text: "請重新登入"
                    });
                    location.href = 'login.html';
                })
        },
        getData() {
            axios.get(`${this.apiUrl}/api/${this.apiPath}/admin/products`)
                .then((res) => {
                    this.products = res.data.products;
                })
                .catch((err) => {
                    console.log(err)
                })
        },
        checkProduct(item) {
            this.temp = item;
        }
    },
    mounted() {
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
        axios.defaults.headers.common.Authorization = token;

        this.checkLogin()
    },
};

Vue.createApp(app).mount("#app");