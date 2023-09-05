import mongoose, { Schema, models } from "mongoose";
//user favourited care homes
const favouriteSchema = new Schema(
  {
    isFavourite: {
      type: Boolean,
      required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      careHome: {
        type: Schema.Types.ObjectId,
        ref: "CareHome",
        required: true,
      },
  },
  { timestamps: true }
);

const Favourite = models.Favourite || mongoose.model("Favourite", favouriteSchema);
export default Favourite;