const environment = {
    development: {
        mysql: {
            username: 'bang',
            password: 'bang',
            database: 'nft_project'
        },

        sequelize: {
            force: false
        },
	
	env: {
	    SECRET_KEY: 'bang'
	}
    },

    test: {
        mysql: {
            username: 'bang',
            password: 'bang',
            database: 'nft_project'
        },
        
        sequelize: {
            force: true
        },
	
	env: {
	    SECRET_KEY: 'bang'
	}
    },

    production: {

    }
}

const nodeEnv = process.env.NODE_ENV || 'development';

module.exports = environment[nodeEnv];
