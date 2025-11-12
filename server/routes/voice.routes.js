const express = require('express');
const router = express.Router();
const twilio = require('twilio');
const VoiceResponse = twilio.twiml.VoiceResponse;
const chatbotService = require('../services/chatbot.service');
const ChatLog = require('../models/chatLog.model');

/**
 * POST /api/voice/incoming
 * Handle incoming phone calls
 */
router.post('/incoming', (req, res) => {
  const twiml = new VoiceResponse();
  
  twiml.say({
    voice: 'alice',
    language: 'en-US'
  }, 'Welcome to Dinner Stranger Booking! How can I help you today?');
  
  twiml.gather({
    input: 'speech',
    action: '/api/voice/process',
    method: 'POST',
    timeout: 3,
    speechTimeout: 'auto'
  });
  
  res.type('text/xml');
  res.send(twiml.toString());
});

/**
 * POST /api/voice/process
 * Process speech input from caller
 */
router.post('/process', async (req, res) => {
  const twiml = new VoiceResponse();
  const speechResult = req.body.SpeechResult;
  const callSid = req.body.CallSid;
  
  try {
    // Get chatbot response
    const response = await chatbotService.detectIntent(speechResult, callSid);
    
    // Log the conversation
    await ChatLog.create({
      sessionId: callSid,
      userMessage: speechResult,
      botResponse: response.text,
      intent: response.intent,
      confidence: response.confidence,
      channel: 'voice',
      timestamp: new Date()
    });
    
    twiml.say({
      voice: 'alice',
      language: 'en-US'
    }, response.text);
    
    // Ask if they need more help
    twiml.gather({
      input: 'speech',
      action: '/api/voice/process',
      method: 'POST',
      timeout: 3
    });
    
    twiml.say('Is there anything else I can help you with?');
  } catch (error) {
    console.error('Voice processing error:', error);
    twiml.say('I apologize, but I encountered an error. Please try again later.');
  }
  
  res.type('text/xml');
  res.send(twiml.toString());
});

/**
 * POST /api/voice/status
 * Handle call status callbacks
 */
router.post('/status', (req, res) => {
  const { CallStatus, CallSid } = req.body;
  console.log(`Call ${CallSid} status: ${CallStatus}`);
  res.sendStatus(200);
});

module.exports = router;
