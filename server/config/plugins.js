module.exports = ({ env }) => ({
  // ...
  email: {
    provider: 'sendgrid',
    providerOptions: {
      apiKey: env('SENDGRID_API_KEY'),
    },
    settings: {
      defaultFrom: 'kdevlinmurray@strapi.io',
      defaultReplyTo: 'no-reply@strapi.io',
    },
  },
  // ...
});