# AI Service Setup with OpenRouter

This document explains how to configure the Virtual Science Lab to use the OpenRouter API with the google/gemma-3n-e2b-it:free model.

## Prerequisites

1. An OpenRouter account (free to create)
2. An API key from OpenRouter

## Setup Instructions

### 1. Get Your OpenRouter API Key

1. Visit [OpenRouter](https://openrouter.ai/)
2. Sign up for a free account
3. Navigate to the API Keys section
4. Generate a new API key
5. Copy the API key for use in the next step

### 2. Configure Environment Variables

Create a `.env` file in the root directory of the project (`virtual-science-lab/.env`) with the following content:

```env
VITE_OPENROUTER_API_KEY=your_openrouter_api_key_here
```

Replace `your_openrouter_api_key_here` with your actual API key from OpenRouter.

### 3. Supported Model

The application is configured to use the `google/gemma-3n-e2b-it:free` model, which is a free and optimized option provided by OpenRouter. This model offers a good balance between performance and availability, making it well-suited for educational applications.

### 4. API Protection Features

The AI service implementation includes several protection mechanisms:

1. **Rate Limiting**: Requests are throttled to prevent API abuse with a minimum 1-second interval between requests
2. **Conversation History Management**: Only the last 6 messages are included in the conversation context to prevent token overflow
3. **Timeout Handling**: Requests timeout after 30 seconds to prevent indefinite hanging

### 5. Testing the Integration

After setting up the environment variable:

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open the AI Assistant in the application
3. Ask a science-related question to verify the integration works

## Fallback Behavior

If the API key is not configured or the API call fails, the application will display an appropriate error message indicating that the API key needs to be set.

## Troubleshooting

### API Key Issues
- Ensure the `.env` file is in the correct location (project root)
- Verify that the API key is correct and hasn't expired
- Check that the variable name is exactly `VITE_OPENROUTER_API_KEY`

### Network Issues
- Ensure you have internet connectivity
- Check if any firewall is blocking requests to openrouter.ai
- Try accessing https://openrouter.ai in your browser to verify connectivity

### Timeout Issues
- The API has a 30-second timeout by default
- If you're getting timeout errors, it might be due to:
  - Slow network connection
  - High demand on the API
  - Temporary issues with OpenRouter servers
- Try asking shorter or more specific questions
- Wait a few minutes and try again

### Rate Limiting
- Free accounts may have rate limits
- If you're making too many requests in a short time, you may be temporarily blocked
- The application includes built-in rate limiting to prevent this
- Check the OpenRouter documentation for rate limit details

## Cost Considerations

The `google/gemma-3n-e2b-it:free` model is free to use, but OpenRouter may have rate limits for free accounts. Check the OpenRouter documentation for the most current usage limits.

## Technical Implementation

The AI service makes direct API calls to OpenRouter from the browser. The API key is exposed in the browser, which is acceptable for this free service but would not be recommended for paid services. For production applications with paid APIs, you should implement a backend service to proxy these requests.