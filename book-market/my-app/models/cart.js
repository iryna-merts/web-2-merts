module.exports = function Cart(oldCart) {
	this.items = oldCart.items || {};
	this.totalQty = oldCart.totalQty || 0;
	this.totalPrice = oldCart.totalPrice || 0;

	this.add = (item, id) => {
		var storedItem = this.items[id];
		if (!storedItem) {
			storedItem = this.items[id] = {
				item: item,
				qty: 0,
				price: 0
			};
		}
		storedItem.qty++;
		storedItem.price =
			storedItem.item.price *
			(storedItem.qty - (storedItem.item.sale || 0) / 100);
		this.totalQty++;
		this.totalPrice +=
			storedItem.item.price * (1 - (storedItem.item.sale || 0) / 100);
	};

	this.increaseByOne = id => {
		this.items[id].qty++;
		this.items[id].price +=
			this.items[id].item.price *
			(1 - (this.items[id].item.sale || 0) / 100);
		this.totalQty++;
		this.totalPrice +=
			this.items[id].item.price *
			(1 - (this.items[id].item.sale || 0) / 100);
	};

	this.reduceByOne = id => {
		this.items[id].qty--;
		this.items[id].price -=
			this.items[id].item.price *
			(1 - (this.items[id].item.sale || 0) / 100);
		this.totalQty--;
		this.totalPrice -=
			this.items[id].item.price *
			(1 - (this.items[id].item.sale || 0) / 100);
		if (this.items[id].qty <= 0) {
			delete this.items[id];
		}
	};

	this.removeItem = id => {
		this.totalQty -= this.items[id].qty;
		this.totalPrice -= this.items[id].price;
		delete this.items[id];
	};

	this.removeAll = () => {
		this.totalQty = 0;
		this.totalPrice = 0;
		this.items = {};
	};

	this.generateArray = () => {
		var arr = [];
		for (var id in this.items) {
			arr.push(this.items[id]);
		}
		return arr;
	};
};
