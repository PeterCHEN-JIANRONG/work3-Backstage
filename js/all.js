const app = {
    data() {
        return {
            apiPath: api_path,
            apiBaseUrl: api_base_url,
            products: [],
        }
    },
    methods: {
        getLoginToken() {
            // get token, add token to headers
            const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
            if (!token) {
                alert("尚未登入");
                window.location = "login.html";
                return
            }
            axios.defaults.headers.common['Authorization'] = token;
        },
        getData() {
            axios.get(`${this.apiBaseUrl}/api/${this.apiPath}/admin/products?page=:page`)
                .then(res => {
                    console.log(res.data);
                    if (res.data.success) {
                        this.products = res.data.products;
                    } else {
                        alert(res.data.message);
                        window.location = "login.html";
                        return
                    }
                })
        },
        deleteData(productId) {
            axios.delete(`${this.apiBaseUrl}/api/${this.apiPath}/admin/product/${productId}`)
                .then(res => {
                    if (res.data.success) {
                        const product = this.products.find(item => item.id === productId);
                        alert(`${res.data.message}，產品名稱：${product.title}`);
                        this.getData();
                    } else {
                        alert(res.data.message);
                    }
                })
        },
        toThousand(num) {
            let temp = num.toString().split(".");
            temp[0] = temp[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            return temp.join(".");
        },
    },
    created() {
        // setting axios header token
        this.getLoginToken();
        // get products
        this.getData();
    },
}

Vue.createApp(app).mount('#app');