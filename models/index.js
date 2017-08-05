const Sequelize = require('sequelize');
const marked = require('marked');
var db = new Sequelize(process.env.DATABASE_URL, {
	logging: false
});

// helper
const generateUrl = (text) => {
	// making titles unique....
	return !text ? text : `${text.replace(/[^\w\s]/g, '').replace(/\s+/g, '_')}`;
}


const Page = db.define('page', {
	title: {
		type: Sequelize.STRING,
		allowNull: false,
		unique: true,
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
	},
	tags: {
		type: Sequelize.ARRAY(Sequelize.STRING),
		defaultValue: [],
		get() {
			return this.getDataValue('tags');
		},
		set(tagstr) {
			// middleware will send null if the string is empty..
			if (tagstr) this.setDataValue('tags', tagstr.split(' '));
		}
	}
}, {
	getterMethods: {
		route() {
			return `/wiki/${this.getDataValue('urlTitle')}`;
		},
		renderedContent() {
			var content = this.getDataValue('content').replace(/\[\[(.*?)\]\]/g, (match, pageName)=> {
				return `[${pageName}](${generateUrl(pageName)})`;
			})
			return marked(content);
		}
	}
})

Page.findByTag = tags=> {
	return Page.findAll({
		attributes: [ 'urlTitle', 'title' ],
		where: { tags: { $overlap: tags.split(' ') }},
	});
};

Page.prototype.findSimilar = function() {
	return Page.findAll({
		attributes: [ 'urlTitle', 'title' ],
		where: {
			tags: { $overlap: this.tags },
			urlTitle: { $ne: this.urlTitle }
		}
	})
}

const User = db.define('user', {
	name: {
		type: Sequelize.STRING,
		allowNull: false
	},
	email: {
		type: Sequelize.STRING,
		allowNull: false,
		unique: true,
		validate: {
			isEmail: true
		}
	},
})

Page.belongsTo(User);
User.hasMany(Page);


module.exports = {
	db,
	seed,
	Page,
	User
}

// seed
function seed() {
	return User.create({
		name: 'John Smith',
		email: 'john@john.com'
	}).then(user=> {
  	return Page.create({
  		title: 'Test Page',
  		content: 'Cool Stuff [[Test Page 2]]',
  		tags: 'very cool stuff'
  	}).then(page=> {
  		page.setUser(user)
  	}).then(() => {
  		return Page.create({
	  		title: 'Test Page 2',
	  		content: 'Cool Stuff [[Unknown Page]] and [[Test Page]]',
	  		tags: 'very awesome'
	  	})
  	}).then(page=> {
  		page.setUser(user)
  	})
	})
}
