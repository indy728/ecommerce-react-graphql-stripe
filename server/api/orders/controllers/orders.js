'use strict';
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async create(ctx) {
    const {address, amount, brews, postalCode, token, city, confirmationEmailAddress} = ctx.request.body


    try {
      const charge = await stripe.charges.create({
        amount: amount * 100,
        currency: 'usd',
        description: `Order ${new Date(Date.now())} - User ${ctx.state.user._id}`,
        source: token
      });
    // Create order in database
    const order = await strapi.services.orders.create({
      user: ctx.state.user._id,
      address,
      amount,
      brews,
      postalCode,
      city,
      confirmationEmailAddress
    })

    return order;
    } catch (err) {
      console.log('[orders] err: ', err)
    }

  }
};
