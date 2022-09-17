import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import VueAwesomePaginate from "vue-awesome-paginate";
import "vue-awesome-paginate/dist/style.css";

const app = createApp(App);

app.use(VueAwesomePaginate).use(router).mount("#app");
