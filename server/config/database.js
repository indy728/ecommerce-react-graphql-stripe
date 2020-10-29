module.exports = ({ env }) => ({
  defaultConnection: 'default',
  connections: {
    default: {
      connector: 'mongoose',
      settings: {
        uri: `mongodb+srv://test-rw:Happy123@cluster0.psyjk.mongodb.net/<dbname>?retryWrites=true&w=majority`
        // host: env('DATABASE_HOST', 'cluster0.psyjk.mongodb.net'),
        // srv: env.bool('DATABASE_SRV', true),
        // port: env.int('DATABASE_PORT', 27017),
        // database: env('DATABASE_NAME', 'server'),
        // username: env('DATABASE_USERNAME', 'kyle'),
        // password: env('DATABASE_PASSWORD', 'colmin'),
      },
      options: {
        authenticationDatabase: env('AUTHENTICATION_DATABASE', null),
        ssl: env.bool('DATABASE_SSL', true),
      },
    },
  },
});
