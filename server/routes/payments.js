const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Booking = require('../models/Booking');

/**
 * @route   POST /api/payments/webhook
 * @desc    Handle Stripe webhook events
 * @access  Public (Stripe)
 */
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.log(`⚠️  Webhook signature verification failed.`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log(`💰 PaymentIntent ${paymentIntent.id} was successful!`);
      
      // Update booking payment status
      try {
        await Booking.findOneAndUpdate(
          { paymentIntentId: paymentIntent.id },
          { 
            paymentStatus: 'completed',
            paidAt: new Date()
          }
        );
      } catch (error) {
        console.error('Error updating booking:', error);
      }
      break;

    case 'payment_intent.payment_failed':
      const failedPaymentIntent = event.data.object;
      console.log(`❌ Payment failed: ${failedPaymentIntent.id}`);
      
      // Update booking payment status to failed
      try {
        await Booking.findOneAndUpdate(
          { paymentIntentId: failedPaymentIntent.id },
          { paymentStatus: 'failed' }
        );
      } catch (error) {
        console.error('Error updating booking:', error);
      }
      break;

    case 'charge.refunded':
      const refund = event.data.object;
      console.log(`💸 Refund processed: ${refund.id}`);
      
      // Update booking refund status
      try {
        await Booking.findOneAndUpdate(
          { paymentIntentId: refund.payment_intent },
          { 
            refundStatus: 'completed',
            refundedAt: new Date()
          }
        );
      } catch (error) {
        console.error('Error updating booking refund:', error);
      }
      break;

    case 'charge.dispute.created':
      const dispute = event.data.object;
      console.log(`⚠️  Dispute created: ${dispute.id}`);
      // Handle dispute - could send email notifications here
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  res.json({ received: true });
});

/**
 * @route   GET /api/payments/config
 * @desc    Get Stripe publishable key
 * @access  Public
 */
router.get('/config', (req, res) => {
  res.json({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY
  });
});

module.exports = router;
