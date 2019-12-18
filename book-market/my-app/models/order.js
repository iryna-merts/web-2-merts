const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var schema = new Schema({
	user: { type: Schema.Types.ObjectId, ref: "User" },
	time: { type: Date, required: true },
	cart: { type: Object, required: true },
	adress: { type: String, required: true },
	name: { type: String, required: true },
	payment: { type: Object, required: true }
});

module.exports = mongoose.model("Order", schema);
