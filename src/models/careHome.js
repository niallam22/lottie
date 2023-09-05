import mongoose, { Schema, models } from "mongoose";

const careHomeSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    lat: {
      type: Number,
      required: true,
    },
    lng: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    cost: {
        type: Number,
        required: true,
      },
    cloudinaryImgId: {type: String},
    cloudinaryImgUrl: {type: String},
  },
  { timestamps: true }
);

const CareHome = models.CareHome || mongoose.model("CareHome", careHomeSchema);
export default CareHome;