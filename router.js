import { createRouter, createWebHistory } from "vue-router";
import listings from "./views/listings.vue";
import loginpage from "./views/loginpage.vue";
import listingById from "./views/displayById.vue";
import editPageRender from "./views/editPage.vue";
import createForm from "./views/createForm.vue";
import reviewForm from "./views/reviewForm.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: listings,
    },
    {
      path: "/user/loginpage",
      component: loginpage,
    },
    {
      path: "/listing/:id",
      component: listingById,
    },
    {
      path: "/listing/edit/:id",
      component: editPageRender,
    },
    {
      path: "/listing/new",
      component: createForm,
    },
    {
      path: "/review/new/:id",
      component: reviewForm,
    },
  ],
});

export default router;
