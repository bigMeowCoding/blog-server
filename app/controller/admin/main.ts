"use strict";

import { createPlaceHolderImage } from "./createPlaceHolderImage";
import { ArticleImage } from "interface/article";
const Controller = require("egg").Controller;

class MainController extends Controller {
  async index() {
    //首页的文章列表数据
    this.ctx.body = "hi api";
  }

  //判断用户名密码是否正确
  async checkLogin() {
    let userName = this.ctx.request.body.userName;
    let password = this.ctx.request.body.password;
    const sql =
      " SELECT userName FROM admin_user WHERE userName = '" +
      userName +
      "' AND password = '" +
      password +
      "'";

    // @ts-ignore
    const res = await this.app.mysql.query(sql);
    if (res.length > 0) {
      //登录成功,进行session缓存
      let openId = new Date().getTime();
      this.ctx.session.openId = { openId: openId };
      this.ctx.body = { data: "登录成功", openId: openId };
    } else {
      this.ctx.body = { data: "登录失败" };
    }
  }

  //后台文章分类信息
  async getTypeInfo() {
    // @ts-ignore
    const resType = await this.app.mysql.select("type");
    this.ctx.body = { data: resType };
  }

  // 增加文章
  async addArticle() {
    let tmpArticle = this.ctx.request.body;

    // @ts-ignore
    const result = await this.app.mysql.insert("article", tmpArticle);
    const insertSuccess = result.affectedRows === 1;
    const insertId = result.insertId;
    const images = await this.getArticleImagesByArticleId(0);
    for (const image of images) {
      // @ts-ignore
      image.articleId = insertId;
      // @ts-ignore
      await this.app.mysql.update("article_image", image);
    }
    this.ctx.body = {
      isScuccess: insertSuccess,
      insertId: insertId,
    };
  }

  // 增加文章图片
  async addArticleImage() {
    let tmpImage = this.ctx.request.body;
    // @ts-ignore
    const result = await this.app.mysql.insert("article_image", tmpImage);
    const insertSuccess = result.affectedRows === 1;
    const insertId = result.insertId;

    this.ctx.body = {
      isSuccess: insertSuccess,
      insertId: insertId,
    };
  }
  // 增加文章图片
  async delArticleImageByArticleId(articleId: number) {
    // @ts-ignore
    const images = await this.getArticleImagesByArticleId(articleId);
    for (const image of images) {
      await this.app.mysql
        .delete("article_image", { id: image.id })
        .catch((e: Error) => {
          this.ctx.body = {
            data: e,
          };
        });
    }
    this.ctx.body = { data: "删除文章关联图片成功" };
  }
  // 查找文章图片
  async getArticleImage() {
    let id = this.ctx.params.id;
    let sql =
      "SELECT article_image.id as id," +
      "article_image.content as content " +
      "FROM article_image " +
      "WHERE article_image.id=" +
      id;
    // @ts-ignore
    const result = await this.app.mysql.query(sql).catch(() => {
      const { type, stream } = createPlaceHolderImage();
      this.ctx.response.type = type;
      this.ctx.body = stream;
      return;
    });
    if (result && result.length) {
      const image = result[0];
      let { content } = image;
      const reg = /^data:image\/(\w+);base64,/;
      let type = "image/png";
      const regArr = reg.exec(content);
      if (regArr && regArr[1]) {
        type = "image/" + regArr[1];
      }
      content = content.replace(reg, ""); //去掉base64位头部
      const imageBufferData = Buffer.from(content, "base64");
      this.ctx.response.type = type;
      this.ctx.body = imageBufferData;
    } else {
      const { type, stream } = createPlaceHolderImage();
      this.ctx.response.type = type;
      this.ctx.body = stream;
    }
  }

  async getArticleImagesByArticleId(
    articleId: number
  ): Promise<ArticleImage[]> {
    let sql =
      "SELECT article_image.id as id," +
      "article_image.content as content " +
      "FROM article_image " +
      "WHERE article_image.articleId=" +
      articleId;
    // @ts-ignore
    const result: ArticleImage[] = await this.app.mysql.query(sql);
    if (result && result.length) {
      return Array.from(result);
    } else {
      return [];
    }
  }

  //修改文章
  async updateArticle() {
    let tmpArticle = this.ctx.request.body;
    // @ts-ignore
    const result = await this.app.mysql.update("article", tmpArticle);
    const updateSuccess = result.affectedRows === 1;
    this.ctx.body = {
      isScuccess: updateSuccess,
    };
  }

  //获得文章列表
  async getArticleList() {
    let sql =
      "SELECT article.id as id," +
      "article.title as title," +
      "article.introduce as introduce," +
      "FROM_UNIXTIME(article.addTime,'%Y-%m-%d' ) as addTime," +
      "type.typeName as typeName " +
      "FROM article LEFT JOIN type ON article.type_id = type.Id " +
      "ORDER BY article.id DESC ";

    // @ts-ignore
    const resList = await this.app.mysql.query(sql);
    this.ctx.body = { list: resList };
  }

  async delArticle() {
    let id = this.ctx.params.id;
    // @ts-ignore
    const res = await this.app.mysql.delete("article", { id: id });
    await this.delArticleImageByArticleId(id);
    this.ctx.body = { data: res };
  }

  //根据文章ID得到文章详情，用于修改文章
  async getArticleById() {
    let id = this.ctx.params.id;

    let sql =
      "SELECT article.id as id," +
      "article.title as title," +
      "article.introduce as introduce," +
      "article.article_content as article_content," +
      "FROM_UNIXTIME(article.addTime,'%Y-%m-%d' ) as addTime," +
      "article.view_count as view_count ," +
      "type.typeName as typeName ," +
      "type.id as typeId " +
      "FROM article LEFT JOIN type ON article.type_id = type.Id " +
      "WHERE article.id=" +
      id;
    // @ts-ignore
    const result = await this.app.mysql.query(sql);
    this.ctx.body = { data: result[0] };
  }
}

module.exports = MainController;
