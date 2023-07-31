import { Schema, model } from 'mongoose';

// Create an interface representing a document in MongoDB.
interface IUser {
  username: string;
  email: string;
  password: string;
  roles: [string];
  active: boolean;
  banned: boolean;
}

// Create a Schema corresponding to the document interface.
const userSchema = new Schema<IUser>(
  {
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    roles: {
      type: [String],
      default: ['User'],
    },
    active: {
      type: Boolean,
      default: true,
    },
    banned: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Create a Model.
const User = model<IUser>('User', userSchema);

export default User;
