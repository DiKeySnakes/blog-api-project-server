import { Schema, Types, model } from 'mongoose';

// Create an interface representing a document in MongoDB.
interface IBlog {
  title: string;
  description: string;
  content: string;
  comments: [Types.ObjectId];
  published: boolean;
}

// Create a Schema corresponding to the document interface.
const blogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    content: { type: String, required: true },
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    published: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Create a Model.
const Blog = model<IBlog>('Blog', blogSchema);

export default Blog;
