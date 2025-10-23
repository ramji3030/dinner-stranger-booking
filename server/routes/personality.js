const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');

/**
 * @route   POST /api/personality/quiz
 * @desc    Submit personality quiz answers
 * @access  Private
 */
router.post('/quiz', protect, async (req, res) => {
  try {
    const { personalityTraits } = req.body;

    // Update user's personality traits
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { personalityTraits },
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route   GET /api/personality/matches/:eventId
 * @desc    Get personality-matched attendees for an event
 * @access  Private
 */
router.get('/matches/:eventId', protect, async (req, res) => {
  try {
    const Event = require('../models/Event');
    const event = await Event.findById(req.params.eventId)
      .populate('attendees.user', 'name personalityTraits');

    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }

    const currentUser = await User.findById(req.user.id);
    
    // Simple matching algorithm based on personality traits
    // In production, this would call a more sophisticated Python ML service
    const matches = event.attendees
      .filter(attendee => attendee.user._id.toString() !== req.user.id)
      .map(attendee => {
        const user = attendee.user;
        let compatibilityScore = 0;

        // Calculate compatibility based on personality traits
        if (currentUser.personalityTraits && user.personalityTraits) {
          const currentTraits = currentUser.personalityTraits;
          const otherTraits = user.personalityTraits;

          // Simple scoring: count matching traits
          Object.keys(currentTraits).forEach(trait => {
            if (currentTraits[trait] === otherTraits[trait]) {
              compatibilityScore += 20;
            }
          });
        }

        return {
          user: {
            id: user._id,
            name: user.name
          },
          compatibilityScore,
          matchLevel: compatibilityScore > 60 ? 'high' : 
                     compatibilityScore > 30 ? 'medium' : 'low'
        };
      })
      .sort((a, b) => b.compatibilityScore - a.compatibilityScore);

    res.status(200).json({
      success: true,
      count: matches.length,
      data: matches
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route   GET /api/personality/compatibility/:userId
 * @desc    Get compatibility score with another user
 * @access  Private
 */
router.get('/compatibility/:userId', protect, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    const otherUser = await User.findById(req.params.userId);

    if (!otherUser) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    let compatibilityScore = 0;
    const breakdown = {};

    if (currentUser.personalityTraits && otherUser.personalityTraits) {
      const currentTraits = currentUser.personalityTraits;
      const otherTraits = otherUser.personalityTraits;

      Object.keys(currentTraits).forEach(trait => {
        const match = currentTraits[trait] === otherTraits[trait];
        breakdown[trait] = {
          match,
          yourValue: currentTraits[trait],
          theirValue: otherTraits[trait]
        };
        if (match) {
          compatibilityScore += 20;
        }
      });
    }

    res.status(200).json({
      success: true,
      data: {
        compatibilityScore,
        matchLevel: compatibilityScore > 60 ? 'high' : 
                   compatibilityScore > 30 ? 'medium' : 'low',
        breakdown
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
