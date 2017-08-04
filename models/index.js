var Sequelize = require('sequelize');
var db = new Sequelize(process.env.DATABASE_URL);

// helper
const generateUrl = (text) => {
	// generates unique-ish.. url
	return !text ? text : `${text.replace(/[^\w\s]/g, '').replace(/\s+/g, '_')}_${Math.floor(Math.random() * 5000)}`;
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
		allowNull: false,
		set(val) {
			this.setDataValue('urlTitle', generateUrl(val));
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
}, {
	getterMethods: {
		route() {
			return `/wiki/${this.getDataValue('urlTitle')}`;
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

Page.belongsTo(User);
User.hasMany(Page);


module.exports = {
	db,
	Page,
	User
}
