import express from 'express';

import mongoose from 'mongoose';
import { uploadFiles } from '../../middleware/multerMiddleware.js';
import {
  createBlog,
  deleteBlog,
  getAllBlogs,
  getBlog,
  updateBlog,
} from '../../controllers/admin/blogsController.js';
import Blog from '../../models/admin/blogsModel.js';

const blogsRouter = express.Router();

blogsRouter.param('id', async (req, res, next, id) => {
  try {
    const isValidId = mongoose.Types.ObjectId.isValid(id);
    const blog = isValidId
      ? await Blog.findById(id)
      : await Blog.findOne({ slug: id });
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    next();
  } catch (error) {
    // next(error);
    return res.status(404).json({ message: 'Fail', error: error.message });
  }
});

blogsRouter
  .route('/')
  .get(getAllBlogs)
  .post(
    uploadFiles([
      { name: 'imageCover', maxCount: 1 },
      { name: 'images', maxCount: 10 },
    ]),
    createBlog
  );
blogsRouter
  .route('/:id')
  .get(getBlog)
  .patch(
    uploadFiles([
      { name: 'imageCover', maxCount: 1 },
      { name: 'images', maxCount: 10 },
    ]),
    updateBlog
  )
  .delete(deleteBlog);

export default blogsRouter;
