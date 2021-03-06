import { Application } from "egg";

export default (app: Application) => {
  const { router, controller } = app;
  router.get("/default/getArticleList", controller.default.home.getArticleList);
  router.get(
    "/default/getArticleById/:id",
    controller.default.home.getArticleById
  );
  router.get("/default/getTypeInfo", controller.default.home.getTypeInfo);
  router.get("/default/getListById/:id", controller.default.home.getListById);
  router.get(
    "/default/getTypeInfoById/:id",
    controller.default.home.getTypeInfoById
  );
};
