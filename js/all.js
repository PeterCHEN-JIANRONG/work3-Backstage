//  新增、刪除視窗 Model
let productModel = null;

const app = {
    data() {
        return {
            apiPath: api_path,
            apiBaseUrl: api_base_url,
            products: [],
            isAdd: false,
            tempProduct: {
                imagesUrl: []
            }
        }
    },
    methods: {
        getLoginToken() {
            // get token from cookie, set axios default headers
            const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
            if (!token) {
                alert("尚未登入");
                window.location = "login.html";
                return
            }
            axios.defaults.headers.common['Authorization'] = token;
        },
        getProducts(page = 1) {
            const url = `${this.apiBaseUrl}/api/${this.apiPath}/admin/products?page=${page}`;
            axios.get(url)
                .then(res => {
                    if (res.data.success) {
                        this.products = res.data.products;
                    } else {
                        alert(res.data.message);
                        window.location = "login.html";
                        return
                    }
                })
                .catch(err => {
                    console.dir(err);
                })
        },
        deleteData(productId) {
            axios.delete(`${this.apiBaseUrl}/api/${this.apiPath}/admin/product/${productId}`)
                .then(res => {
                    if (res.data.success) {
                        const product = this.products.find(item => item.id === productId);
                        alert(`${res.data.message}，產品名稱：${product.title}`);
                        this.getProducts();
                    } else {
                        alert(res.data.message);
                    }
                })
        },
        updateData() {
            // default: 新增 method
            let url = `${this.apiBaseUrl}/api/${this.apiPath}/admin/product`;
            let method = 'post';
            // 修改 method
            if (!this.isAdd) {
                url = `${this.apiBaseUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`
                method = 'put';
            }
            axios[method](url, { data: this.tempProduct })
                .then(res => {
                    if (res.data.success) {
                        alert(res.data.message)
                        productModal.hide();
                        this.getProducts();
                    } else {
                        alert(res.data.message);
                    }
                })
        },
        openModal(option, item) {
            // add & edit modal、delete modal
            switch (option) {
                case 'add':
                    this.isAdd = true; //新增add
                    this.tempProduct = {
                        imagesUrl: []
                    }
                    productModal.show();
                    break;
                case 'edit':
                    this.isAdd = false; //修改edit
                    // this.tempProduct = { ...item };  //因為tempProduct.imagesUrl可能會有傳參考問題, 改用深拷貝
                    this.tempProduct = JSON.parse(JSON.stringify(item));
                    productModal.show();
                    break;
                case 'delete':
                    console.log("delete");
                    console.log(item);
                    break;
            }

        },
        createImages() {
            this.tempProduct.imagesUrl = [];
            this.tempProduct.imagesUrl.push('');
        },
        toThousand(num) {
            // 千分位
            let temp = num.toString().split(".");
            temp[0] = temp[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            return temp.join(".");
        },
    },
    created() {
        // setting axios header token
        this.getLoginToken();
        // get products
        this.getProducts();
    },
    mounted() {
        productModal = new bootstrap.Modal(document.querySelector('#productModal'), {
            keyboard: false
        });
    },
}

Vue.createApp(app).mount('#app');