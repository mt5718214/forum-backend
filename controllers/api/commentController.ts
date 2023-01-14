import { Request, Response } from 'express'
import { commentService } from '../../services/commentService'

export const commentController = {
  postComment: (req: Request, res: Response) => {
    commentService.postComment(req, res, (data) => {
      return res.json(data)
    })
  },
  deleteComment: (req: Request, res: Response) => {
    commentService.deleteComment(req, res, (data) => {
      return res.json(data)
    })
  }
}
