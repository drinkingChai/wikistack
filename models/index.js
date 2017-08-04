const Sequelize = require('sequelize');
const marked = require('marked');
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
	},
	tags: {
		type: Sequelize.ARRAY(Sequelize.STRING),
		defaultValue: [],
		get() {
			// return this.getDataValue('tags').join(' ');
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
			// detect [[ ]]
			// find matching page title
			// replace with (text)[/wiki/urlTitle]
			// fix!
			var content = this.getDataValue('content').replace(/\[\[(.*?)\]\]/g, substr=> {
				console.log(substr);
			})
			return marked(content);
		}
	}
})

Page.findByTag = tags=> {
	return Page.findAll({
		attributes: [ 'urlTitle', 'title' ],
		where: { tags: { $overlap: tags.split(' ') }}
	});
};

Page.findSimilar = urlTitle=> {
	return Page.findOne({
		attributes: [ 'tags' ],
		where: { urlTitle: urlTitle }
	}).then(page=> {
		return Page.findAll({
			attributes: [ 'urlTitle', 'title' ],
			where: {
				tags: { $overlap: page.tags },
				urlTitle: { $ne: urlTitle }
			}
		})
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
