const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);

const productSchema = new mongoose.Schema({
  title: String,
  slug: {
    type: String,
    slug: "title",
    unique: true
  },
  category_id: String,
  description: String,
  price: Number,
  discountPercentage: Number,
  stock: Number,
  createdBy: String,
  createdAt: Date,
  updatedBy: String,
  updatedAt: Date,
  thumbnail: String,
  status: String,
  position: Number,
  deleted: {
    type: Boolean,
    default: false
  },
  deletedBy: String,
  deletedAt: Date,
});

const Product = mongoose.model('Product', productSchema, 'products');

module.exports = Product;