# Chatbot Implementation Guide

Complete guide to add text chat and voice call capabilities to the Dinner Stranger Booking application.

## Overview

This implementation adds customer engagement through:
- **Text Chat Bot**: Real-time web-based chat for customer inquiries
- **Voice Call Bot**: Automated phone system for bookings and support

## Architecture

### Text Chat Flow
```
Customer → React Chat Widget → Express Webhook → Dialogflow → MongoDB → Response
```

### Voice Call Flow
```
Customer Call → Twilio → Express Webhook → Dialogflow → TwiML Response
```

## Implementation Steps

### 1. Required Dependencies

Add to `package.json`:
```json
{
  "dependencies": {
    "twilio": "^4.19.0",
    "@google-cloud/dialogflow": "^6.0.0",
    "socket.io": "^4.6.0",
    "socket.io-client": "^4.6.0"
  }
}
```

Install:
```bash
cd server && npm install twilio @google-cloud/dialogflow socket.io
cd ../client && npm install socket.io-client
```

### 2. Environment Variables

Add to `.env`:
```bash
# Dialogflow Configuration
DIALOGFLOW_PROJECT_ID=your_project_id
DIALOGFLOW_CREDENTIALS=./dialogflow-key.json

# Twilio Configuration
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# Chatbot Settings
CHATBOT_ENABLED=true
```

### 3. Server-Side Implementation

#### A. Create Chatbot Service

Create `server/services/chatbot.service.js`:
```javascript
const dialogflow = require('@google-cloud/dialogflow');
const { v4: uuid } = require('uuid');

class ChatbotService {
  constructor() {
    this.projectId = process.env.DIALOGFLOW_PROJECT_ID;
    this.sessionClient = new dialogflow.SessionsClient({
      keyFilename: process.env.DIALOGFLOW_CREDENTIALS
    });
  }

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
        confidence: result.intentDetectionConfidence
      };
    } catch (error) {
      console.error('Dialogflow error:', error);
      throw error;
    }
  }
}

module.exports = new ChatbotService();
```

#### B. Create Chatbot Routes

Create `server/routes/chatbot.routes.js`:
```javascript
const express = require('express');
const router = express.Router();
const chatbotService = require('../services/chatbot.service');
const ChatLog = require('../models/chatLog.model');

// Text chat webhook
router.post('/chat', async (req, res) => {
  try {
    const { message, sessionId } = req.body;
    
    // Get response from Dialogflow
    const response = await chatbotService.detectIntent(message, sessionId);
    
    // Log conversation
    await ChatLog.create({
      sessionId,
      userMessage: message,
      botResponse: response.text,
      intent: response.intent,
      timestamp: new Date()
    });
    
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: 'Chat processing failed' });
  }
});

module.exports = router;
```

#### C. Create Voice Call Routes

Create `server/routes/voice.routes.js`:
```javascript
const express = require('express');
const router = express.Router();
const twilio = require('twilio');
const VoiceResponse = twilio.twiml.VoiceResponse;
const chatbotService = require('../services/chatbot.service');

// Incoming call handler
router.post('/incoming', (req, res) => {
  const twiml = new VoiceResponse();
  
  twiml.say({
    voice: 'alice',
    language: 'en-US'
  }, 'Welcome to Dinner Stranger Booking. How can I help you today?');
  
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

// Process speech input
router.post('/process', async (req, res) => {
  const twiml = new VoiceResponse();
  const speechResult = req.body.SpeechResult;
  const callSid = req.body.CallSid;
  
  try {
    // Get chatbot response
    const response = await chatbotService.detectIntent(speechResult, callSid);
    
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
  } catch (error) {
    twiml.say('I apologize, but I encountered an error. Please try again later.');
  }
  
  res.type('text/xml');
  res.send(twiml.toString());
});

module.exports = router;
```

#### D. Create Chat Log Model

Create `server/models/chatLog.model.js`:
```javascript
const mongoose = require('mongoose');

const chatLogSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    index: true
  },
  userMessage: {
    type: String,
    required: true
  },
  botResponse: {
    type: String,
    required: true
  },
  intent: {
    type: String
  },
  confidence: {
    type: Number
  },
  channel: {
    type: String,
    enum: ['web', 'voice'],
    default: 'web'
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ChatLog', chatLogSchema);
```

#### E. Update Server Index

Update `server/index.js` to include chatbot routes:
```javascript
const chatbotRoutes = require('./routes/chatbot.routes');
const voiceRoutes = require('./routes/voice.routes');

// Add routes
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/voice', voiceRoutes);
```

### 4. Client-Side Implementation

#### A. Create Chat Widget Component

Create `client/src/components/ChatWidget/ChatWidget.jsx`:
```jsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './ChatWidget.css';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sessionId] = useState(() => `session_${Date.now()}`);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      text: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    try {
      const response = await axios.post('/api/chatbot/chat', {
        message: input,
        sessionId
      });

      const botMessage = {
        text: response.data.text,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = {
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chat-widget">
      {!isOpen && (
        <button 
          className="chat-toggle"
          onClick={() => setIsOpen(true)}
        >
          💬 Chat with us
        </button>
      )}

      {isOpen && (
        <div className="chat-container">
          <div className="chat-header">
            <h3>Dinner Stranger Support</h3>
            <button onClick={() => setIsOpen(false)}>×</button>
          </div>

          <div className="chat-messages">
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`message ${msg.sender}`}
              >
                <div className="message-text">{msg.text}</div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
```

#### B. Create Chat Widget Styles

Create `client/src/components/ChatWidget/ChatWidget.css`:
```css
.chat-widget {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
}

.chat-toggle {
  background: #667eea;
  color: white;
  border: none;
  padding: 15px 25px;
  border-radius: 50px;
  cursor: pointer;
  font-size: 16px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  transition: all 0.3s;
}

.chat-toggle:hover {
  background: #5a67d8;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0,0,0,0.2);
}

.chat-container {
  width: 350px;
  height: 500px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chat-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chat-header h3 {
  margin: 0;
  font-size: 18px;
}

.chat-header button {
  background: none;
  border: none;
  color: white;
  font-size: 28px;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  line-height: 1;
}

.chat-messages {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background: #f7fafc;
}

.message {
  margin-bottom: 15px;
  display: flex;
}

.message.user {
  justify-content: flex-end;
}

.message.bot {
  justify-content: flex-start;
}

.message-text {
  max-width: 70%;
  padding: 12px 16px;
  border-radius: 18px;
  word-wrap: break-word;
}

.message.user .message-text {
  background: #667eea;
  color: white;
  border-bottom-right-radius: 4px;
}

.message.bot .message-text {
  background: white;
  color: #2d3748;
  border-bottom-left-radius: 4px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
}

.chat-input {
  display: flex;
  padding: 15px;
  border-top: 1px solid #e2e8f0;
  background: white;
}

.chat-input input {
  flex: 1;
  padding: 10px 15px;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  outline: none;
  font-size: 14px;
}

.chat-input input:focus {
  border-color: #667eea;
}

.chat-input button {
  margin-left: 10px;
  padding: 10px 20px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s;
}

.chat-input button:hover {
  background: #5a67d8;
}
```

### 5. Dialogflow Setup

#### A. Create Dialogflow Agent

1. Go to [Dialogflow Console](https://dialogflow.cloud.google.com/)
2. Create a new agent named "DinnerStrangerBot"
3. Set default language to English
4. Enable beta features and APIs

#### B. Create Intents

**Intent: Welcome**
- Training phrases:
  - "Hi"
  - "Hello"
  - "Hey there"
- Response:
  - "Welcome to Dinner Stranger Booking! I can help you book seats, answer questions about our dinners, or check your bookings. How can I assist you?"

**Intent: Book Dinner**
- Training phrases:
  - "I want to book a dinner"
  - "Book a table"
  - "Reserve a seat"
  - "Make a reservation"
- Response:
  - "Great! I'd love to help you book a dinner. What city are you interested in?"

**Intent: Check Booking**
- Training phrases:
  - "Check my booking"
  - "View my reservation"
  - "What's my booking status"
- Response:
  - "I can help you check your booking. Can you provide your email address or booking ID?"

**Intent: Pricing Info**
- Training phrases:
  - "How much does it cost"
  - "What's the price"
  - "Pricing information"
- Response:
  - "Our dinner experiences typically range from $45-75 per person, depending on the venue and menu. This includes a multi-course meal and the unique matching experience!"

**Intent: How It Works**
- Training phrases:
  - "How does this work"
  - "Explain the process"
  - "What happens next"
- Response:
  - "Here's how it works: 1) Complete our personality quiz (10 mins), 2) Choose a dinner date, 3) We match you with 5 compatible strangers, 4) Receive match details 24hrs before, 5) Enjoy your dinner! Simple and fun!"

#### C. Enable Fulfillment

1. In Dialogflow console, go to Fulfillment
2. Enable Webhook
3. Set webhook URL: `https://yourdomain.com/api/chatbot/webhook`
4. Save

#### D. Download Service Account Key

1. Go to Google Cloud Console
2. Navigate to IAM & Admin > Service Accounts
3. Create new service account with Dialogflow API access
4. Download JSON key file
5. Save as `dialogflow-key.json` in server root
6. Add to `.gitignore`

### 6. Twilio Setup

#### A. Create Twilio Account

1. Sign up at [Twilio](https://www.twilio.com/)
2. Get a phone number with voice capabilities
3. Note your Account SID and Auth Token

#### B. Configure Phone Number

1. Go to Phone Numbers in Twilio Console
2. Select your number
3. Under Voice & Fax:
   - A Call Comes In: Webhook
   - URL: `https://yourdomain.com/api/voice/incoming`
   - HTTP Method: POST
4. Save

### 7. Deployment Checklist

- [ ] Install all dependencies
- [ ] Set up Dialogflow agent with intents
- [ ] Download and configure service account key
- [ ] Set up Twilio account and phone number
- [ ] Configure all environment variables
- [ ] Create MongoDB ChatLog collection
- [ ] Test webhook endpoints
- [ ] Add ChatWidget to main App component
- [ ] Test text chat functionality
- [ ] Test voice call functionality
- [ ] Set up error monitoring
- [ ] Configure CORS for production

### 8. Testing

#### Test Text Chat
```bash
curl -X POST http://localhost:3000/api/chatbot/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello",
    "sessionId": "test_session_123"
  }'
```

#### Test Voice Endpoint
```bash
curl -X POST http://localhost:3000/api/voice/incoming \
  -d "From=+1234567890&To=+0987654321"
```

### 9. Production Considerations

#### Security
- Validate Twilio requests using signature verification
- Rate limit chatbot endpoints
- Sanitize user inputs
- Implement CSRF protection

#### Monitoring
- Log all conversations for quality assurance
- Track chatbot accuracy metrics
- Monitor response times
- Set up alerts for errors

#### Scaling
- Use Redis for session management
- Implement message queuing for high traffic
- Cache common bot responses
- Load balance webhook endpoints

### 10. Alternative Implementations

#### Option 1: Simpler Web Chat (No Dialogflow)

If you want a simpler implementation without Dialogflow:

```javascript
// Simple rule-based chatbot
const responses = {
  greeting: ['hello', 'hi', 'hey'],
  booking: ['book', 'reserve', 'table'],
  pricing: ['cost', 'price', 'how much']
};

function getResponse(message) {
  const lower = message.toLowerCase();
  
  if (responses.greeting.some(word => lower.includes(word))) {
    return "Hello! How can I help you today?";
  }
  if (responses.booking.some(word => lower.includes(word))) {
    return "I'd love to help you book! Visit our booking page.";
  }
  if (responses.pricing.some(word => lower.includes(word))) {
    return "Our dinners range from $45-75 per person.";
  }
  return "I'm not sure about that. Can you rephrase?";
}
```

#### Option 2: Third-Party Chat Widgets

**Tawk.to** (Free):
```html
<!-- Add to client/public/index.html -->
<script type="text/javascript">
var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
(function(){
var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
s1.async=true;
s1.src='https://embed.tawk.to/YOUR_PROPERTY_ID/YOUR_WIDGET_ID';
s1.charset='UTF-8';
s1.setAttribute('crossorigin','*');
s0.parentNode.insertBefore(s1,s0);
})();
</script>
```

**Intercom**:
```javascript
window.intercomSettings = {
  app_id: "YOUR_APP_ID"
};
```

### 11. Cost Estimates

- **Dialogflow**: Free up to 180 requests/min
- **Twilio Voice**: $0.0085/min for calls
- **Twilio Phone Number**: $1/month
- **Google Cloud**: ~$5-20/month for small scale

### 12. Support & Maintenance

- Regularly update intents based on user queries
- Review chat logs weekly
- Update responses for seasonal changes
- Monitor and improve bot accuracy
- Add new intents as business grows

---

## Quick Start Commands

```bash
# Install dependencies
npm run install:all

# Set up environment
cp .env.example .env
# Edit .env with your credentials

# Create Dialogflow service
mkdir -p server/services
touch server/services/chatbot.service.js

# Create routes
mkdir -p server/routes
touch server/routes/chatbot.routes.js
touch server/routes/voice.routes.js

# Create models
mkdir -p server/models
touch server/models/chatLog.model.js

# Create React component
mkdir -p client/src/components/ChatWidget
touch client/src/components/ChatWidget/ChatWidget.jsx
touch client/src/components/ChatWidget/ChatWidget.css

# Start development
npm run dev
```

## Troubleshooting

**Issue**: Dialogflow authentication fails
- Check service account key path
- Verify Dialogflow API is enabled
- Ensure key has correct permissions

**Issue**: Twilio webhooks not working
- Verify webhook URL is publicly accessible
- Check Twilio signature validation
- Review Twilio debugger logs

**Issue**: Chat widget not appearing
- Check console for errors
- Verify ChatWidget is imported in App.js
- Check CSS z-index conflicts

## Resources

- [Dialogflow Documentation](https://cloud.google.com/dialogflow/docs)
- [Twilio Voice Documentation](https://www.twilio.com/docs/voice)
- [Socket.io Documentation](https://socket.io/docs/)
- [React Hooks Guide](https://reactjs.org/docs/hooks-intro.html)

---

**Implementation Status**: Ready to implement
**Estimated Time**: 6-8 hours for full implementation
**Difficulty**: Intermediate
