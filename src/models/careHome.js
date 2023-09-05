import mongoose, { Schema, models } from "mongoose";

const careHomeSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    position: {
      type: String,
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
    cloudinaryId: {type: String}
  },
  { timestamps: true }
);

const CareHome = models.CareHome || mongoose.model("CareHome", careHomeSchema);
export default CareHome;