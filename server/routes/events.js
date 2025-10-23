const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const { protect, authorize } = require('../middleware/auth');

/**
 * @route   GET /api/events
 * @desc    Get all events with filtering and pagination
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const { city, date, status, page = 1, limit = 10 } = req.query;

    // Build query
    const query = {};
    
    if (city) {
      query['location.city'] = new RegExp(city, 'i');
    }
    
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      query.date = { $gte: startDate, $lt: endDate };
    }
    
    if (status) {
      query.status = status;
    }

    // Execute query with pagination
    const events = await Event.find(query)
      .populate('host', 'name email')
      .sort({ date: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Event.countDocuments(query);

    res.status(200).json({
      success: true,
      count: events.length,
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      data: events
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route   GET /api/events/:id
 * @desc    Get single event
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('host', 'name email')
      .populate('attendees.user', 'name email');

    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }

    res.status(200).json({
      success: true,
      data: event
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route   POST /api/events
 * @desc    Create new event
 * @access  Private (Host only)
 */
router.post('/', protect, authorize('host', 'admin'), async (req, res) => {
  try {
    // Add host from authenticated user
    req.body.host = req.user.id;

    const event = await Event.create(req.body);

    res.status(201).json({
      success: true,
      data: event
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route   PUT /api/events/:id
 * @desc    Update event
 * @access  Private (Host or Admin)
 */
router.put('/:id', protect, async (req, res) => {
  try {
    let event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }

    // Make sure user is event host or admin
    if (event.host.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to update this event'
      });
    }

    event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: event
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route   DELETE /api/events/:id
 * @desc    Delete event
 * @access  Private (Host or Admin)
 */
router.delete('/:id', protect, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }

    // Make sure user is event host or admin
    if (event.host.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to delete this event'
      });
    }

    await event.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route   GET /api/events/:id/available-seats
 * @desc    Get available seats for an event
 * @access  Public
 */
router.get('/:id/available-seats', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }

    res.status(200).json({
      success: true,
      availableSeats: event.availableSeats,
      maxAttendees: event.maxAttendees,
      currentAttendees: event.attendees.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
