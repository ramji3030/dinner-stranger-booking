const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Booking = require('../models/Booking');
const Event = require('../models/Event');
const { protect } = require('../middleware/auth');

/**
 * @route   GET /api/bookings
 * @desc    Get all bookings for logged in user
 * @access  Private
 */
router.get('/', protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('event')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route   GET /api/bookings/:id
 * @desc    Get single booking
 * @access  Private
 */
router.get('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('event')
      .populate('user', 'name email');

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    // Make sure user is booking owner or admin
    if (booking.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to access this booking'
      });
    }

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route   POST /api/bookings/create-payment-intent
 * @desc    Create a Stripe payment intent for booking
 * @access  Private
 */
router.post('/create-payment-intent', protect, async (req, res) => {
  try {
    const { eventId, numberOfSeats } = req.body;

    // Get event
    const event = await Event.findById(eventId);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }

    // Check if seats are available
    if (event.availableSeats < numberOfSeats) {
      return res.status(400).json({
        success: false,
        error: 'Not enough seats available'
      });
    }

    // Calculate total amount
    const totalAmount = event.price * numberOfSeats;

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount * 100, // Stripe expects amount in cents
      currency: 'usd',
      metadata: {
        eventId: eventId,
        userId: req.user.id,
        numberOfSeats: numberOfSeats
      }
    });

    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      amount: totalAmount
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route   POST /api/bookings
 * @desc    Create booking after successful payment
 * @access  Private
 */
router.post('/', protect, async (req, res) => {
  try {
    const { eventId, numberOfSeats, paymentIntentId } = req.body;

    // Verify payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({
        success: false,
        error: 'Payment not completed'
      });
    }

    // Get event
    const event = await Event.findById(eventId);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }

    // Check if seats are still available
    if (event.availableSeats < numberOfSeats) {
      return res.status(400).json({
        success: false,
        error: 'Not enough seats available'
      });
    }

    // Calculate total amount
    const totalAmount = event.price * numberOfSeats;

    // Create booking
    const booking = await Booking.create({
      event: eventId,
      user: req.user.id,
      numberOfSeats,
      totalAmount,
      paymentIntentId,
      paymentStatus: 'completed'
    });

    // Update event attendees and available seats
    for (let i = 0; i < numberOfSeats; i++) {
      event.attendees.push({
        user: req.user.id,
        booking: booking._id
      });
    }
    await event.save();

    res.status(201).json({
      success: true,
      data: booking
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route   PUT /api/bookings/:id/cancel
 * @desc    Cancel a booking and process refund
 * @access  Private
 */
router.put('/:id/cancel', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    // Make sure user is booking owner
    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to cancel this booking'
      });
    }

    // Check if booking is already cancelled
    if (booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        error: 'Booking is already cancelled'
      });
    }

    // Get event to check cancellation policy
    const event = await Event.findById(booking.event);
    const eventDate = new Date(event.date);
    const now = new Date();
    const hoursUntilEvent = (eventDate - now) / (1000 * 60 * 60);

    // Only allow cancellation if more than 24 hours before event
    if (hoursUntilEvent < 24) {
      return res.status(400).json({
        success: false,
        error: 'Cannot cancel booking less than 24 hours before event'
      });
    }

    // Process refund through Stripe
    const refund = await stripe.refunds.create({
      payment_intent: booking.paymentIntentId
    });

    // Update booking status
    booking.status = 'cancelled';
    booking.refundId = refund.id;
    booking.refundStatus = refund.status;
    await booking.save();

    // Remove user from event attendees
    event.attendees = event.attendees.filter(
      attendee => attendee.booking.toString() !== booking._id.toString()
    );
    await event.save();

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
