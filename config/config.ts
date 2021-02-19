/* eslint valid-jsdoc: "off" */

"use strict";

import { EggAppConfig, EggAppInfo, PowerPartial } from "egg";

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
export default (appInfo: EggAppInfo) => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = {} as PowerPartial<EggAppConfig>;

  // use for cookie sign key, should change to your own and keep security

  // add your middleware config here
  config.middleware = [];

  // add your user config here
  // const userConfig = {
  //   // myAppName: 'egg',
  // };
  // mysql配置
  config.mysql = {
    // database configuration
    client: {
      // host
      host: "localhost",
      // port
      port: "3306",
      // username
      user: "root",
      // password
      password: "zyj5632403",
      // database
      database: "react_blog",
    },
    // load into app, default is open
    app: true,
    // load into agent, default is close
    agent: false,
  };
  config.security = {
    csrf: {
      enable: false,
    },
    domainWhiteList: ["*"],
  };
  config.cors = {
    credentials: true,
    origin: (ctx) => ctx.get("origin"),
  };
  const bizConfig = {
    sourceUrl: `https://github.com/eggjs/examples/tree/master/${appInfo.name}`,
  };
  config.keys = appInfo.name + "_1586172996609_2814";
  const result: PowerPartial<EggAppConfig> & { sourceUrl: string } = {
    ...config,
    ...bizConfig,
  };

  return result;
};
