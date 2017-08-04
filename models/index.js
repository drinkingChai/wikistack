var Sequelize = require('sequelize');
var db = new Sequelize(process.env.DATABASE_URL);

// helper
// change name, should generate unique strings as well if url already exists
const urlize = (text) => {
	return !text ? text : text.replace(/[^\w\s]/g, '').replace(/\s+/g, '_');
}


const Page = db.define('page', {
	title: {
		type: Sequelize.STRING,
		allowNull: false,
		set(val) {
			this.setDataValue('title', val);
			this.urlTitle = val;
		}
	},
	urlTitle: {
		type: Sequelize.STRING,
		allowNull: false
	},
	// urlTitle: {
	// 	type: Sequelize.STRING,
	// 	allowNull: false,
	// 	unique: true,
	// 	get() {
	// 		return this.getDataValue('urlTitle');
	// 	}
	// },
	content: {
		type: Sequelize.TEXT,
		allowNull: false
	},
	status: {
		type: Sequelize.ENUM('open', 'closed'),
		defaultValue: 'open'
	},
	date: {
		type: Sequelize.DATE,
		defaultValue: Sequelize.NOW
	}
}, {
	getterMethods: {
		urlTitle() {
			console.log(`This is our url: ${this.getDataValue('urlTitle')}`);
			return this.getDataValue('urlTitle');
		}
	},
	setterMethods: {
		urlTitle(val) {
			this.setDataValue('urlTitle', urlize(this.getDataValue('title')));
		}
	}
})

const User = db.define('user', {
	name: {
		type: Sequelize.STRING,
		allowNull: false
	},
	email: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			isEmail: true
		}
	},
})


module.exports = {
	db,
	Page,
	User
}
