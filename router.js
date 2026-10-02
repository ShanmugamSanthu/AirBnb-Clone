import { createRouter, createWebHistory } from "vue-router";
import listings from "./views/listings.vue";
import loginpage from "./views/loginpage.vue";
import listingById from "./views/displayById.vue";
import editPageRender from "./views/editPage.vue";
import createForm from "./views/createForm.vue";
import reviewForm from "./views/reviewForm.vue";
import signup from "./views/signup.vue";
import about from "./views/about.vue";
import myBookings from "./views/myBookings.vue";
import manageBookings from "./views/manageBookings.vue";
import policyPage from "./views/policyPage.vue";

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
    {
      path: "/user/signuppage",
      component: signup,
    },
    {
      path: "/aboutpage",
      component: about,
    },
    {
      path: "/mybookings",
      component: myBookings,
    },
    {
      path: "/managebookings",
      component: manageBookings,
    },
    {
      path: "/cancellationPage",
      component: policyPage,
    },
  ],
});

export default router;
