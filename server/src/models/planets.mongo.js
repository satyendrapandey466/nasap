import mongoose, { Schema } from "mongoose";
const planetSchema = new Schema({
  keplerName: {type: String,
  required: true,}
});
const planetModel = mongoose.model("Planet",planetSchema);
export {
  planetModel
}