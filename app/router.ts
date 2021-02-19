import defaultRouter from "./router/default";
import adminRouter from "./router/admin";
import { Application } from "egg";

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = (app: Application) => {
  defaultRouter(app);
  adminRouter(app);
};
