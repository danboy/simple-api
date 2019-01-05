if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

module.exports = {
  'development': {
    'username': process.env.DB_USER,
    'password': process.env.DB_PASSWORD,
    'database': process.env.DB_NAME,
    'host': process.env.DB_HOST,
    'port': process.env.DB_PORT,
    'dialect': process.env.DB_DIALECT,
    'define': {
      'timestamps': true,
      'underscored': true
    }
  },
  'test': {
    'username': process.env.DB_USER,
    'password': process.env.DB_PASSWORD,
    'database': 'thecrowd_test',
    'host': process.env.DB_HOST,
    'port': process.env.DB_PORT,
    'dialect': process.env.DB_DIALECT,
    'logging': false,
    'define': {
      'timestamps': true,
      'underscored': true
    }
  },
  'production': {
    'username': process.env.DB_USER,
    'password': process.env.DB_PASSWORD,
    'database': process.env.DB_NAME,
    'host': process.env.DB_HOST,
    'dialect': process.env.DB_DIALECT,
    'define': {
      'timestamps': true,
      'underscored': true
    }
  }
}
