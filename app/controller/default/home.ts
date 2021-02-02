"use strict";

import { MenuType } from "@/libs/interface";
import { makeMenuTree } from "@/libs/utils";
import { HttpStatus } from "@/libs/interface/http";
import { Article } from "@/interface/article";

const Controller = require("egg").Controller;

class HomeController extends Controller {
  async getArticleList() {
    const results = await this.app.mysql.select("article");
    this.ctx.body = {
      data: results,
    };
  }

  async getArticleById() {
    const params: {
      id: string;
    } = this.ctx.params;
    let { id } = params;
    const result = await this.app.mysql.get("article", { id });
    this.ctx.body = { data: result };
  }

  async getTypeInfo() {
    let menuList: MenuType[] = await this.app.mysql.select("type");
    menuList = makeMenuTree(menuList);
    this.ctx.body = {
      code: HttpStatus.ok,
      data: menuList,
    };
  }
  async getTypeInfoById() {
    const params: {
      id: string;
    } = this.ctx.params;
    let { id } = params;
    let menuList: MenuType[] = await this.app.mysql.select("type");
    this.ctx.body = {
      code: HttpStatus.ok,
      data:
        id != null
          ? menuList.find((menu) => {
              return menu.id === parseInt(id);
            })
          : null,
    };
  }
  async getListById() {
    let id = this.ctx.params.id;
    if (id) {
      id = parseInt(id);
    }
    let result = await this.app.mysql.select("article");
    if (Array.isArray(result)) {
      result = result.filter((article: Article) => {
        return article.type_id === id;
      });
    }
    this.ctx.body = { data: result };
  }
}

module.exports = HomeController;
