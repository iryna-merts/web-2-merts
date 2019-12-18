const express = require("express");
const router = express.Router();

const Cart = require("../models/cart");
const Product = require("../models/product");

router.get("/", (req, res, next) => {
	res.redirect("/pages/1");
});

router.get("/pages/:page", (req, res, next) => {
	console.log(req.sessionID);
	var page = parseInt(req.params.page);
	function finding(err, prods) {
		if (err) {
			return res.redirect("/pages/1");
		}
		if (page != 1 && !prods.length) {
			return res.redirect("/pages/" + (page - 1));
		}
		admin_condition =
			(req.user && req.user.email == "admin@book.market") || false;
		res.render("shop/index", {
			title: "BookMarket",
			products: prods,
			userIsAdmin: admin_condition,
			next: page + 1,
			previous: page - 1
		});
	}
	if (page == 1) {
		Product.find(finding).limit(5);
	} else {
		Product.find(finding)
			.skip(5 * (page - 1))
			.limit(5);
	}
});

router.get("/add-to-cart/:id", (req, res, next) => {
	var productId = req.params.id;
	var cart = new Cart(req.session.cart ? req.session.cart : {});

	Product.findById(productId, (err, product) => {
		if (err) {
			return res.redirect("/");
		}
		cart.add(product, product.id);
		req.session.cart = cart;
		res.redirect("/");
	});
});

router.get("/remove-item/:id", (req, res, next) => {
	if (!req.user || !(req.user.email == "admin@book.market")) {
		return res.redirect("/");
	}
	var productId = req.params.id;
	Product.remove({ _id: productId }, (err, result) => {
		res.redirect("/");
	});
});

router.get("/edit/:id", (req, res, next) => {
	if (!req.user || !(req.user.email == "admin@book.market")) {
		return res.redirect("/");
	}
	var productId = req.params.id;
	Product.findById(productId, (err, result) => {
		res.render("shop/edit", {
			title: "Edit product info",
			id: productId,
			imagePath: result.imagePath,
			bookTitle: result.title,
			author: result.author,
			description: result.description,
			price: result.price
		});
	});
});
router.post("/edit/:id", (req, res, next) => {
	var productId = req.params.id;
	var info = {
		imagePath: req.body.img,
		title: req.body.title,
		description: req.body.description,
		author: req.body.author,
		price: req.body.price
	};
	Product.findOneAndUpdate(
		{
			_id: productId
		},
		{
			$set: info
		},
		(err, result) => {
			res.redirect("/");
		}
	);
});

router.post("/add-sale/:id", (req, res, next) => {
	var productId = req.params.id;
	Product.findOneAndUpdate(
		{
			_id: productId
		},
		{
			$set: { sale: req.body.sale }
		},
		(err, result) => {
			res.redirect("/");
		}
	);
});
router.get("/remove-sale/:id", (req, res, next) => {
	if (!req.user || !(req.user.email == "admin@book.market")) {
		return res.redirect("/");
	}
	var productId = req.params.id;
	Product.findOneAndUpdate(
		{
			_id: productId
		},
		{
			$set: { sale: 0 }
		},
		(err, result) => {
			res.redirect("/");
		}
	);
});

router.get("/add", (req, res, next) => {
	if (!req.user || !(req.user.email == "admin@book.market")) {
		return res.redirect("/");
	}
	res.render("shop/edit", {
		title: "Add product",
		id: null,
		imagePath: "",
		bookTitle: "",
		author: "",
		description: "",
		price: ""
	});
});

router.post("/add", (req, res, next) => {
	var info = {
		imagePath: req.body.img,
		title: req.body.title,
		description: req.body.description,
		author: req.body.author,
		price: req.body.price
	};
	var product = new Product(info);
	product.save((err, result) => {
		res.redirect("/");
	});
});

module.exports = router;
