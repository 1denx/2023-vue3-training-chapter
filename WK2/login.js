import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';
const baseUrl = 'https://vue3-course-api.hexschool.io/v2';
const apiPath = 'eden';

createApp({
    data() {
        return {
            user: {
                username: '',
                password: '',
            },
        };
    },
    methods: {
        login() {
            axios.post(`${baseUrl}/admin/signin`, this.user)
                .then((res) => {
                    const { token, expired } = res.data;
                    document.cookie = `hexToken=${token}; expires=${new Date(
                        expired
                    )};`;
                    location.href = 'products.html'; // 登入成功後跳轉至產品頁面
                })
                .catch((err) => {
                    Swal.fire({
                        icon: "error",
                        title: "登入失敗",
                        text: "請重新登入"
                    });
                })
        }
    }
}).mount("#app");