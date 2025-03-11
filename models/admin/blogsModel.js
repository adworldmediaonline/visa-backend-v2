import mongoose, { Schema } from 'mongoose';

const blogSchema = new Schema(
  {
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },

    title: {
      type: String,
      required: [true, 'Meta title is required'],
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      required: [true, 'Meta Description is required'],
    },

    excerpt: {
      type: String,
      trim: true,
      required: [true, 'Excerpt is required'],
    },

    content: {
      type: String,
      trim: true,
      required: [true, 'Content is required'],
    },

    slug: {
      type: String,
      required: [true, 'Slug is required'],
      trim: true,
      index: { unique: true },
    },

    imageCover: {
      type: String,
      required: [true, 'Image cover is required'],
    },

    imageCoverAlt: {
      type: String,
      trim: true,
      required: [true, 'Image cover alt is required'],
    },

    imageCoverCaption: {
      type: String,
      trim: true,
      required: [true, 'Image cover caption is required'],
    },

    imageCoverDescription: {
      type: String,
      trim: true,
      required: [true, 'Image description is required'],
    },

    focusKeyword: {
      type: String,
      trim: true,
    },

    count: {
      type: Number,
      default: 0,
    },

    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    timestamps: true,
  }
);

const Blog = mongoose.model('Blog', blogSchema);
export default Blog;
