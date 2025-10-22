const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Booking must belong to a user']
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: [true, 'Booking must be for an event']
  },
  status: {
    type: String,
    enum: ['confirmed', 'cancelled', 'completed', 'no-show'],
    default: 'confirmed'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded', 'failed'],
    default: 'pending'
  },
  paymentIntent: {
    type: String
  },
  amount: {
    type: Number,
    required: [true, 'Booking must have an amount']
  },
  cancelledAt: Date,
  cancellationReason: String,
  attended: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  review: {
    type: String,
    maxlength: [500, 'Review cannot exceed 500 characters']
  }
}, {
  timestamps: true
});

// Compound index to prevent duplicate bookings
bookingSchema.index({ user: 1, event: 1 }, { unique: true });
bookingSchema.index({ event: 1, status: 1 });
bookingSchema.index({ user: 1, status: 1 });

// Pre-save middleware to update event attendee count
bookingSchema.pre('save', async function(next) {
  if (this.isNew && this.status === 'confirmed') {
    const Event = mongoose.model('Event');
    await Event.findByIdAndUpdate(this.event, {
      $inc: { currentAttendees: 1 },
      $push: { attendees: { user: this.user, joinedAt: new Date() } }
    });
  }
  next();
});

// Static method to cancel booking
bookingSchema.statics.cancelBooking = async function(bookingId) {
  const booking = await this.findById(bookingId);
  if (!booking) {
    throw new Error('Booking not found');
  }
  
  if (booking.status === 'cancelled') {
    throw new Error('Booking is already cancelled');
  }
  
  booking.status = 'cancelled';
  booking.cancelledAt = new Date();
  
  // Update event attendee count
  const Event = mongoose.model('Event');
  await Event.findByIdAndUpdate(booking.event, {
    $inc: { currentAttendees: -1 },
    $pull: { attendees: { user: booking.user } }
  });
  
  await booking.save();
  return booking;
};

module.exports = mongoose.model('Booking', bookingSchema);
