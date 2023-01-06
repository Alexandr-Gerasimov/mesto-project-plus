import mongoose, { Schema, isValidObjectId } from "mongoose";

interface Card {
  name: string;
  link: string;
  owner: Schema.Types.ObjectId;
  likes: Schema.Types.ObjectId;
  createdAt: number
}

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
  },
  owner: {
    type: Array,
    required: true,
  },
  likes: {
    type: Array,
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
});

export default mongoose.model<Card>('card', cardSchema);