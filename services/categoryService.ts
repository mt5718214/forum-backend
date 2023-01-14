import { Request, Response } from "express"
const db = require('../models')
const Category = db.Category

const getCategories = (req: Request, res: Response, callback: (data: any) => void) => {
  return Category.findAll().then((categories: any) => {
    if (req.params.id) {
      Category.findByPk(req.params.id)
        .then((category: any) => {
          return res.render('admin/categories', { categories, category })
        })
    } else {
      callback({ categories })
    }
  })
}

const postCategory = (req: Request, _res: Response, callback: (data: any) => void) => {
  if (!req.body.name) {
    callback({ status: 'error', message: 'name didn\'t exist' })
  }

  return Category.create({
    name: req.body.name
  })
    .then((category: any) => {
      callback({
        status: 'success',
        message: 'category was successfully created',
        categoryId: category.id
      })
    })
}

const putCategory = (req: Request, _res: Response, callback: (data: any) => void) => {
  if (!req.body.name) {
    callback({ status: 'error', message: 'name didn\'t exist' })
  }

  return Category.findByPk(req.params.id)
    .then((category: any) => {
      category.update(req.body)
        .then((category: any) => {
          callback({
            status: 'success',
            message: 'category was successfully updated',
            categoryId: category.id
          })
        })
    })
}

const deleteCategory = (req: Request, _res: Response, callback: (data: any) => void) => {
  return Category.findByPk(req.params.id)
    .then((category: any) => {
      category.destroy()
        .then((_category: any) => {
          callback({ status: 'success', message: '' })
        })
    })
}

export const categoryService =  {
  getCategories,
  postCategory,
  putCategory,
  deleteCategory
}

