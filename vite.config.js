import vue from "@vitejs/plugin-vue";

export default {
  plugins: [vue()],

  server: {
    proxy: {
      "/vue": {
        target: "http://localhost:8080",
        rewrite: (path) => path.replace(/^\/vue/, ""),
      },
    },
  },
};
