var mongoose = require("mongoose");
// const {
//   TrustProductsEvaluationsInstance,
// } = require("twilio/lib/rest/trusthub/v1/trustProducts/trustProductsEvaluations");
var ObjectId = require("mongodb").ObjectId;
const db = mongoose
  .connect("mongodb+srv://teammentoons:eEzejQHHVjXBGVCp@cluster0.vgz24ei.mongodb.net/", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database connected!"))
  .catch((err) => console.log(err));
