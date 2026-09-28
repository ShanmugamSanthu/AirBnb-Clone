import { createApp } from "vue";
import Router from "./router.js";
import Route from "./route.vue";

// create
const app = createApp(Route);
app.use(Router);

//mount to html
app.mount("#app");
