export default defineNuxtConfig({
  devServer: {
    port: 4433,
  },
  modules: ["../src/module"],
  contentlyOptions: {
    secretKey: import.meta.env.SECRET_KEY,
    databasePath: import.meta.env.DATABASE_PATH,
    uploadsPath: import.meta.env.UPLOADS_FOLDER,
    userLogin: import.meta.env.USER_LOGIN,
    userPassword: import.meta.env.USER_PASSWORD,
  },
  devtools: {
    enabled: true,
  },
});
