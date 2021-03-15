import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Like } from "typeorm";
import Product from "../entities/Product";

class ProductController {
  static getAllProducts = async (req: Request, res: Response) => {
    const {
      sortBy = "name",
      itemPerPage,
      pageIndex = 0,
      orderBy = "ASC",
      searchPhase = "",
    } = req.query;

    let obj = {};
    obj[`${sortBy}`] = orderBy === "DESC" ? -1 : 1;

    obj = orderBy ? obj : {};

    try {
      let procductRepository = getRepository(Product);
      const product = await procductRepository.find({
        where: {
          name: Like(`%${searchPhase}%`),
        },
        skip: Number(pageIndex),
        take: Number(itemPerPage),
        order: obj,
      });

      const resp = {
        itemPerPage: itemPerPage,
        pageIndex: pageIndex,
        totalItem: product.length,
        result: product,
      };

      res.json(resp);
    } catch (error) {
      res.status(400).json(error);
    }
  };

  static getProductByCategory = async (req: Request, res: Response) => {
    const { categoryId } = req.params;
    const {
      sortBy = "name",
      itemPerPage,
      pageIndex = 0,
      orderBy = "ASC",
      searchPhase = "",
    } = req.query;

    let obj = {};
    obj[`${sortBy}`] = orderBy === "DESC" ? -1 : 1;

    obj = orderBy ? obj : {};

    try {
      let productRepository = getRepository(Product);
      const productByCategory = await productRepository.find({
        where: {
          category: categoryId,
          name: Like(`%${searchPhase}%`),
        },
        skip: Number(pageIndex),
        take: Number(itemPerPage),
        order: obj,
      });

      if (!productByCategory.length) {
        res.json({
          message: "No categoryId found !!",
          status: 404,
        });

        return;
      }

      const resp = {
        itemPerPage,
        pageIndex: pageIndex,
        totalItem: productByCategory.length,
        result: productByCategory,
      };

      res.json(resp);
    } catch (error) {
      res.status(400).json(error);
    }
  };

  static getProductById = async (req: Request, res: Response) => {
    const { productId } = req.params;
    try {
      let procductRepository = getRepository(Product);
      const productById = await procductRepository.findOne(productId);

      if (!productById) {
        res.json({
          message: "No productId found !!",
          status: 404,
        });

        return;
      }

      res.json(productById);
    } catch (error) {
      res.status(400).json(error);
    }
  };

  static create = async (req: Request, res: Response) => {
    let body = req.body;

    try {
      const product = new Product(body);

      product
        .save()
        .then(() => {
          const status = {
            message: "Create Product Successfully !!",
            status: "OK",
          };

          res.json(status);
        })
        .catch((err) => res.json(err));
    } catch (error) {
      const status = {
        message: "Create Product Fail !!",
        status: 400,
      };

      res.status(400).json(status);
    }
  };

  static update = async (req: Request, res: Response) => {
    const { productId, productParams, categoryId } = req.body;
    const productRepository = getRepository(Product);
    let product = await productRepository.findOne(productId);

    if (product) {
      product.name = productParams.name;
      product.description = productParams.description;
      product.price = productParams.price;
      product.image = productParams.image;
      product.category = categoryId;

      productRepository
        .save(product)
        .then(() => {
          const status = {
            message: "Update Product Successfully !!",
            status: "0K",
          };

          res.json(status);
        })
        .catch((err) => res.json(err));
    } else {
      const status = {
        message: "No Product Found !!",
        status: 404,
      };

      res.status(404).json(status);
    }
  };

  static delete = async (req: Request, res: Response) => {
    const productId = req.params.id;
    const productRepository = getRepository(Product);

    const product = await productRepository.findOne(productId);

    if (product) {
      productRepository
        .delete(productId)
        .then(() => {
          const status = {
            message: "Delete User Successfully !!",
            status: "OK",
          };

          res.json(status);
        })
        .catch((err) => res.json(err));
    } else {
      const status = {
        message: "No Product Found !!",
        status: 404,
      };

      res.status(404).json(status);
    }
  };
}

export default ProductController;
