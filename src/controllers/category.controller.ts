import { Request, Response } from "express";
import { getRepository } from "typeorm";
import Category from "../entities/Category";
import { Like } from "typeorm";

class CateforyController {
  static getAllCategoris = async (req: Request, res: Response) => {
    const {
      sortBy = "name",
      itemPerPage,
      pageIndex=0,
      orderBy = "ASC",
      searchPhase = ""
    } = req.query;

    let obj = {};
    obj[`${sortBy}`] = orderBy === "DESC" ? -1 : 1;

    obj = orderBy ? obj : {};

    try {
      let categoryRepository = getRepository(Category);
      const category = await categoryRepository.find({
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
        totalItem: category.length,
        result: category
      }

      res.json(resp);
    } catch (error) {
      res.status(400).json(error);
    }
  };

  static getProductById = async (req: Request, res: Response) => {
    const { categoryId } = req.params;
    try {
      let categoryRepository = getRepository(Category);
      const categoryById = await categoryRepository.findOne(categoryId);

      if (!categoryById) {
        res.json({
          message: "No categoryId found !!",
          status: 404,
        });

        return;
      }

      res.json(categoryById);
    } catch (error) {
      res.status(400).json(error);
    }
  };

  static create = async (req: Request, res: Response) => {
    let body = req.body;

    try {
      const category = new Category(body);

      category
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
    const { categoryId, categoryParams } = req.body;
    const categoryRepository = getRepository(Category);
    let category = await categoryRepository.findOne(categoryId);

    if (category) {
      category.name = categoryParams.name;
      category.description = categoryParams.description;

      categoryRepository
        .save(category)
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
    const categoryId = req.params.id;
    const categoryRepository = getRepository(Category);

    const category = await categoryRepository.findOne(categoryId);

    if (category) {
      categoryRepository
        .delete(categoryId)
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

export default CateforyController;
