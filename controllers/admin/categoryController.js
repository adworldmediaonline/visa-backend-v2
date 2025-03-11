import mongoose from 'mongoose';
import Category from '../../models/admin/categoryModel.js';

const getAllCategory = async (req, res, next) => {
  try {
    const category = await Category.find().sort({ createdAt: -1 });

    res.status(200).json({
      message: 'success',
      results: category.length,
      data: category,
    });
  } catch (error) {
    // next(error);
    res.status(404).json({ message: 'Fail', error: error.message });
  }
};

const getCategory = async (req, res, next) => {
  try {
    const id = req.params.id;
    const isValidId = mongoose.Types.ObjectId.isValid(id);
    const category = isValidId
      ? await Category.findById(id).populate('products')
      : await Category.findOne({ name: id }).populate('products');
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res
      .status(200)
      .json({ message: `get category by id ${id}`, data: category });
  } catch (error) {
    // next(error);
    res.status(404).json({ message: 'Fail', error: error.message });
  }
};

const createCategory = async (req, res, next) => {
  const newCategoryData = { ...req.body };

  try {
    const category = await Category.create({
      ...newCategoryData,
    });

    res.status(201).json({ message: 'success', data: category });
  } catch (error) {
    res.status(404).json({ message: 'Fail', error: error.message });
    // next(error);
  }
};

const updateCategory = async (req, res, next) => {
  const { id } = req.params;
  const newCategoryData = { ...req.body };
  try {
    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    await Category.findByIdAndUpdate(id, {
      ...newCategoryData,
    });

    res.status(200).json({ message: `Category updated ${id}` });
  } catch (error) {
    // next(error);
    res.status(404).json({ message: 'Fail', error: error.message });
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const id = req.params.id;
    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json({ message: `Category deleted ${id}` });
  } catch (error) {
    // next(error);
    res.status(404).json({ message: 'Fail', error: error.message });
  }
};

export {
  getAllCategory,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};
