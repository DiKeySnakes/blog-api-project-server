import { Schema, model } from 'mongoose';

// Create an interface representing a document in MongoDB.
interface IBlog {
  title: string;
  description: string;
  content: string;
  comments: [Schema.Types.ObjectId];
  published: boolean;
}

// Create a Schema corresponding to the document interface.
const userSchema = new Schema<IBlog>(
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
const Blog = model<IBlog>('Blog', userSchema);

export default Blog;
