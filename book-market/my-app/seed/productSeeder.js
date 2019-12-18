const Product = require('../models/product');
const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/bookmarket", { useNewUrlParser: true });

var products = [
	new Product({
		imagePath: "https://images-na.ssl-images-amazon.com/images/I/51-ohnIK-ZL.jpg",
		title: "Your Perfect Year: A Novel",
		author: "Charlotte Lucas",
		description: "A man consumed by a meaningless life is going to do something he’s never considered doing before. He’s going to enjoy the day…",
		price: 11
	}),
	new Product({
		imagePath: "https://images-na.ssl-images-amazon.com/images/I/519bMSxDvPL.jpg",
		title: "Bloody Genius",
		author: "John Sandford",
		description: "At the local state university, two feuding departments have faced off on the battleground of science and medicine. Each carries their views to extremes that may seem absurd, but highly educated people of sound mind and good intentions can reasonably disagree, right?",
		price: 20
	}),
	new Product({
		imagePath: "https://images-na.ssl-images-amazon.com/images/I/41RkHpiGAbL.jpg",
		title: "Land of Wolves",
		author: "Craig Johnson",
		description: "Recovering from his harrowing experiences in Mexico, Sheriff Walt Longmire returns to Absaroka County, Wyoming, to lick his wounds and try once again to maintain justice in a place with grudges that go back generations. When a shepherd is found dead, Longmire suspects it could be suicide. But the shepherd's connection to the Extepares, a powerful family of Basque ranchers with a history of violence, leads the sheriff into an intricate investigation of a possible murder.",
		price: 17
	}),
	new Product({
		imagePath: "https://images-na.ssl-images-amazon.com/images/I/51kJv5cjgGL.jpg",
		title: "Dark of the Moon",
		author: "John Sandford",
		description: "“Virgil Flowers, introduced in bestseller Sandford’s Prey series, gets a chance to shine...The thrice-divorced, affable member of the Minnesota Bureau of Criminal Apprehension (BCA), who reports to Prey series hero Lucas Davenport, operates pretty much on his own..”*",
		price: 18
	}),
	new Product({
		imagePath: "https://images-na.ssl-images-amazon.com/images/I/51kJv5cjgGL.jpg",
		title: "Masked Prey",
		author: "John Sandford",
		description: "Lucas Davenport returns to the cutthroat quagmire of Washington, D.C., in the stunning new novel in the #1 New York Times bestselling Prey series.",
		price: 23
	}),
	new Product({
		imagePath: "https://images-na.ssl-images-amazon.com/images/I/51kJv5cjgGL.jpg",
		title: "Robert B. Parker's The Bitterest Pill",
		author: "Reed Farrel Coleman",
		description: "“Virgil Flowers, introduced in bestseller Sandford’s Prey series, gets a chance to shine...The thrice-divorced, affable member of the Minnesota Bureau of Criminal Apprehension (BCA), who reports to Prey series hero Lucas Davenport, operates pretty much on his own..”*",
		price: 9
	})
]

var productsSaved = 0; 
for (var i = 0; i < products.length; i++) {
	products[i].save((err,result)=>{
		productsSaved++;
		if (productsSaved === products.length) {
			exit();
		}
	});
}

function exit () {
	mongoose.disconnect();
}