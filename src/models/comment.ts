import { Schema, Types, model } from 'mongoose';

// Create an interface representing a document in MongoDB.
interface IComment {
  content: string;
  blog: Types.ObjectId;
  user: Types.ObjectId;
}

// Create a Schema corresponding to the document interface.
const commentSchema = new Schema<IComment>(
  {
    content: { type: String, required: true },
    blog: { type: Schema.Types.ObjectId, ref: 'Blog', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  {
    timestamps: true,
  }
);

// Create a Model.
const Comment = model<IComment>('Comment', commentSchema);

export default Comment;
