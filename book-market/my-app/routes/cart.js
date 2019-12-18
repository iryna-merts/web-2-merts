const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

const Product = require("../models/product");
const Cart = require("../models/cart");
const Order = require("../models/order");

router.get("/", (req, res, next) => {
	if (!req.session.cart) {
		return res.render("shop/cart", { products: null });
	}
	var cart = new Cart(req.session.cart);
	res.render("shop/cart", {
		title: "Shopping Cart",
		products: cart.generateArray(),
		totalPrice: cart.totalPrice
	});
});

router.get("/increase/:id", (req, res, next) => {
	var productId = req.params.id;
	var cart = new Cart(req.session.cart ? req.session.cart : {});
	cart.increaseByOne(productId);
	req.session.cart = cart;
	res.redirect("/cart");
});
router.get("/reduce/:id", (req, res, next) => {
	var productId = req.params.id;
	var cart = new Cart(req.session.cart ? req.session.cart : {});
	cart.reduceByOne(productId);
	req.session.cart = cart;
	res.redirect("/cart");
});
router.get("/remove/:id", (req, res, next) => {
	var productId = req.params.id;
	var cart = new Cart(req.session.cart ? req.session.cart : {});
	cart.removeItem(productId);
	req.session.cart = cart;
	res.redirect("/cart");
});
router.get("/remove-all", (req, res, next) => {
	var cart = new Cart(req.session.cart ? req.session.cart : {});
	cart.removeAll();
	req.session.cart = cart;
	res.redirect("/cart");
});

router.get("/checkout", (req, res, next) => {
	if (!req.session.cart) {
		return res.redirect("shop/cart");
	}
	var cart = new Cart(req.session.cart);

	var date = new Date();
	if (req.user) {
		var email = req.user.email;
		var name = req.user.name;
		var adress = req.user.adress;
		var birth_date = req.user.birth_date;
	}
	res.render("shop/checkout", {
		title: "Checkout",
		total: cart.totalPrice,
		year: date.getFullYear(),
		email: email || null,
		name: name || null,
		adress: adress || null,
		birth_date: birth_date || null
	});
});

router.post("/checkout", (req, res, next) => {
	var cart = new Cart(req.session.cart);
	var order = new Order({
		user: req.user,
		time: new Date(),
		cart: cart,
		adress: req.body.adress,
		name: req.body.name,
		payment: {
			card_number: req.body.card_number,
			expiry_month: req.body.expiry_month,
			expiry_year: req.body.expiry_year,
			card_cvv: req.body.card_cvv
		}
	});
	order.save((err, resut) => {});
	books = cart.generateArray();
	cart.removeAll();
	req.session.cart = cart;
	var messege =
		"<h3>Dear " +
		req.body.name +
		",</h3><h2>You succesfully made a charge in our store!</h2><hr>";
	for (var i = 0; i < books.length; i++) {
		var sale =
			' <strong style="color: red"> -' +
			books[i].item.sale +
			"%!</strong></h3>";
		messege +=
			'<img src="' +
			books[i].item.imagePath +
			'" style="max-height: 100px;float: left;margin-right: 9px;">' +
			'<div style="overflow: hidden"><h3 style="margin:0">Title: ' +
			books[i].item.title +
			(books[i].item.sale ? sale : "") +
			"<h4>Author: " +
			books[i].item.author +
			"</h4>" +
			"<strong>Price: " +
			Math.round(books[i].price * 100) / 100 +
			"</strong>" +
			"<strong> Amount: " +
			books[i].qty +
			"</strong>" +
			"</div><hr>";
	}
	messege += "<p></p><h3>Total Price: " + cart.totalPrice + "</h3>";
	var transporter = nodemailer.createTransport({
		host: "smtp.gmail.com",
		port: 465,
		secure: true,
		auth: {
			user: "bookmarket777@gmail.com",
			pass: "WebLearn34"
		}
	});
	var mailOptions = {
		to: req.body.email,
		subject: "Buying books on BookMarket",
		text: "You succesfully bought some books!",
		html: messege
	};
	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			return console.log(error);
		}
		console.log("Message %s sent: %s", info.messageId, info.response);
	});
	res.redirect("/");
});

module.exports = router;
