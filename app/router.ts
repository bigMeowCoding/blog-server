import defaultRouter from "./router/default";
import adminRouter from "./router/admin";


/**
 * @param {Egg.Application} app - egg application
 */
module.exports = (app) => {
  defaultRouter(app);
  adminRouter(app);
};
