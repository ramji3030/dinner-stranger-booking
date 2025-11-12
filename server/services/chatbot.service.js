const dialogflow = require('@google-cloud/dialogflow');
const { v4: uuid } = require('uuid');

/**
 * Chatbot Service for Dialogflow Integration
 * Handles natural language processing for customer inquiries
 */
class ChatbotService {
  constructor() {
    this.projectId = process.env.DIALOGFLOW_PROJECT_ID;
    this.sessionClient = new dialogflow.SessionsClient({
      keyFilename: process.env.DIALOGFLOW_CREDENTIALS
    });
  }

  /**
   * Detect user intent and get bot response
   * @param {string} text - User's message
   * @param {string} sessionId - Unique session identifier
   * @returns {Promise<Object>} Bot response with text, intent, and confidence
   */
  async detectIntent(text, sessionId) {
    const sessionPath = this.sessionClient.projectAgentSessionPath(
      this.projectId,
      sessionId
    );

    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: text,
          languageCode: 'en-US',
        },
      },
    };

    try {
      const responses = await this.sessionClient.detectIntent(request);
      const result = responses[0].queryResult;
      
      return {
        text: result.fulfillmentText,
        intent: result.intent.displayName,
        confidence: result.intentDetectionConfidence,
        parameters: result.parameters
      };
    } catch (error) {
      console.error('Dialogflow error:', error);
      throw new Error('Failed to process message');
    }
  }

  /**
   * Handle booking-related intents
   * @param {Object} parameters - Extracted parameters from Dialogflow
   */
  async handleBookingIntent(parameters) {
    // Add custom booking logic here
    return {
      success: true,
      message: 'Booking processed successfully'
    };
  }
}

module.exports = new ChatbotService();
