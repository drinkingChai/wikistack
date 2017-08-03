var Sequelize = require('sequelize');
var db = new Sequelize(process.env.DATABASE_URL);


const Page = db.define('page', {
	title: Sequelize.STRING,
	urlTitle: Sequelize.STRING,
	content: Sequelize.STRING,
	status: {
		type: Sequelize.ENUM('open', 'closed'),
		defaultValue: 'open'
	}
})

const User = db.define('user', {
	name: Sequelize.STRING,
	email: Sequelize.STRING
})