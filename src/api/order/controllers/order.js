//'use strict'

const stripe = require('stripe')('sk_test_51MZJbVEfAVGiIMFW5pyxPw8g053xWhdcVyXwkd5BRjqxfhatHAQ2skZYJc0I66BVcV89DBKq0gOmMYCKq58amnzq00W6aBhOI0');
const { createCoreController } = require('@strapi/strapi').factories;

/**
 * order controller
 */


module.exports = createCoreController('api::order.order', ({ strapi }) =>  ({
    async create(ctx){
        const {name, total, items, stripeTokenId} = ctx.request.body.data;
        const {id} = ctx.state.user;

        const charge = await stripe.charges.create({
            // Transform cents to dollars.
            amount: total * 100,
            currency: "usd",
            description: `Order ${new Date()} by ${ctx.state.user.id}`,
            source: stripeTokenId,
        });

        const order = await strapi.service('api::order.order').create({

            data: {
                name: name,
                user: id,
                charge_id: charge.id,
                amount: total * 100,
                items: items
            }
        });

        return order;
    }
}));