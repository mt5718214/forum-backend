import { Request, Response } from "express"

import { categoryService } from '../../services/categoryService'

export const categoryController = {
  getCategories: (req: Request, res: Response) => {
    categoryService.getCategories(req, res, (data) => {
      return res.json(data)
    })
  },
  postCategory: (req: Request, res: Response) => {
    categoryService.postCategory(req, res, (data) => {
      return res.json(data)
    })
  },
  putCategory: (req: Request, res: Response) => {
    categoryService.putCategory(req, res, (data) => {
      return res.json(data)
    })
  },
  deleteCategory: (req: Request, res: Response) => {
    categoryService.deleteCategory(req, res, (data) => {
      return res.json(data)
    })
  }
}