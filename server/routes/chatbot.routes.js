const express = require('express');
const router = express.Router();
const chatbotService = require('../services/chatbot.service');
const ChatLog = require('../models/chatLog.model');

/**
 * POST /api/chatbot/chat
 * Process text chat messages
 */
router.post('/chat', async (req, res) => {
  try {
    const { message, sessionId } = req.body;
    
    if (!message || !sessionId) {
      return res.status(400).json({ 
        error: 'Message and sessionId are required' 
      });
    }
    
    // Get response from Dialogflow
    const response = await chatbotService.detectIntent(message, sessionId);
    
    // Log conversation to database
    await ChatLog.create({
      sessionId,
      userMessage: message,
      botResponse: response.text,
      intent: response.intent,
      confidence: response.confidence,
      channel: 'web',
      timestamp: new Date()
    });
    
    res.json({
      text: response.text,
      intent: response.intent,
      confidence: response.confidence
    });
  } catch (error) {
    console.error('Chat processing error:', error);
    res.status(500).json({ 
      error: 'Failed to process message',
      text: 'Sorry, I encountered an error. Please try again later.'
    });
  }
});

/**
 * GET /api/chatbot/history/:sessionId
 * Get chat history for a session
 */
router.get('/history/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const history = await ChatLog.find({ sessionId })
      .sort({ timestamp: 1 })
      .limit(50);
    
    res.json({ history });
  } catch (error) {
    console.error('History fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

/**
 * POST /api/chatbot/webhook
 * Dialogflow fulfillment webhook
 */
router.post('/webhook', async (req, res) => {
  try {
    const intentName = req.body.queryResult.intent.displayName;
    const parameters = req.body.queryResult.parameters;
    
    let response = {
      fulfillmentText: 'I can help you with that!'
    };
    
    // Handle different intents
    switch (intentName) {
      case 'Book Dinner':
        const { city, date } = parameters;
        response.fulfillmentText = `Great! I'm looking for dinner events in ${city} on ${date}. Let me check availability for you.`;
        break;
        
      case 'Check Booking':
        response.fulfillmentText = 'To check your booking, please provide your email address or booking ID.';
        break;
        
      default:
        response.fulfillmentText = 'How can I assist you today?';
    }
    
    res.json(response);
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

module.exports = router;
