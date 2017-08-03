var Sequelize = require('sequelize');
var db = new Sequelize(process.env.DATABASE_URL);

// helper
const urlize = (text) => {
	return !text ? text : text.replace(/[^\w\s]/g, '').replace(/\s+/g, '_');
}


const Page = db.define('page', {
	title: {
		type: Sequelize.STRING,
		allowNull: false,
		set(val) {
			this.setDataValue('title', val);
			this.setDataValue('urlTitle', urlize(this.getDataValue('title')));
		}
	},
	urlTitle: {
		type: Sequelize.STRING,
		allowNull: false,
		get() {
			return this.getDataValue('urlTitle');
		}
	},
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
