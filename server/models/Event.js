const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Event must have a title'],
    trim: true,
    minlength: [5, 'Title must be at least 5 characters'],
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Event must have a description'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  restaurant: {
    name: {
      type: String,
      required: [true, 'Restaurant name is required']
    },
    address: {
      type: String,
      required: [true, 'Restaurant address is required']
    },
    cuisine: {
      type: String,
      required: [true, 'Cuisine type is required']
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        required: true
      }
    }
  },
  date: {
    type: Date,
    required: [true, 'Event date is required'],
    validate: {
      validator: function(value) {
        return value > new Date();
      },
      message: 'Event date must be in the future'
    }
  },
  time: {
    type: String,
    required: [true, 'Event time is required'],
    match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Please provide time in HH:MM format']
  },
  maxAttendees: {
    type: Number,
    default: 6,
    min: [2, 'Event must have at least 2 attendees'],
    max: [12, 'Event cannot have more than 12 attendees']
  },
  currentAttendees: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    required: [true, 'Event must have a price'],
    min: [0, 'Price must be a positive number']
  },
  attendees: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }],
  status: {
    type: String,
    enum: ['upcoming', 'full', 'in-progress', 'completed', 'cancelled'],
    default: 'upcoming'
  },
  imageUrl: {
    type: String,
    default: 'https://via.placeholder.com/600x400'
  },
  tags: [{
    type: String,
    trim: true
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for geospatial queries
eventSchema.index({ 'restaurant.location': '2dsphere' });
eventSchema.index({ date: 1, status: 1 });
eventSchema.index({ createdBy: 1 });

// Virtual for availability
eventSchema.virtual('spotsAvailable').get(function() {
  return this.maxAttendees - this.currentAttendees;
});

// Virtual to check if event is full
eventSchema.virtual('isFull').get(function() {
  return this.currentAttendees >= this.maxAttendees;
});

// Update status to full when max attendees reached
eventSchema.pre('save', function(next) {
  if (this.currentAttendees >= this.maxAttendees && this.status === 'upcoming') {
    this.status = 'full';
  }
  next();
});

module.exports = mongoose.model('Event', eventSchema);
