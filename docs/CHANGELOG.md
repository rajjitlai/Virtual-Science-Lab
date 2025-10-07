# Changelog

## v1.1.0 - AI Service Update

### Changed
- Updated AI service from NLP Cloud (Llama 2) with local fallback to OpenRouter API
- Integrated `openai/gpt-oss-20b:free` model as the primary AI model
- Modified [ai-service.ts](file:///d:/Other/Code/virtual-science-lab/src/config/ai-service.ts) to use direct API calls to OpenRouter
- Updated error handling in [AIAssistant.tsx](file:///d:/Other/Code/virtual-science-lab/src/components/ai/AIAssistant.tsx) to provide better feedback for API key issues
- Updated [README.md](file:///d:/Other/Code/virtual-science-lab/README.md) to reflect new AI service configuration
- Created [.env.example](file:///d:/Other/Code/virtual-science-lab/.env.example) with required environment variables
- Created [AI_SERVICE_SETUP.md](file:///d:/Other/Code/virtual-science-lab/docs/AI_SERVICE_SETUP.md) documentation
- Removed Vite proxy configuration as we're making direct API calls

### Added
- Documentation for OpenRouter API setup
- Environment variable example file
- Detailed changelog
- Timeout handling with 30-second limit
- Specific error messages for different failure scenarios
- Enhanced error handling for network issues and timeouts

### Removed
- Local fallback response generation
- Vite proxy configuration for AI service

## v1.1.1 - Timeout and Error Handling Improvements

### Changed
- Added 30-second timeout for API requests to prevent indefinite hanging
- Improved error messages for different failure scenarios (timeout, network issues, API key problems)
- Enhanced user feedback in the AI assistant interface
- Updated documentation with troubleshooting for timeout issues

## v1.1.2 - API Testing Tools

### Added
- Command-line API test script (`test-openrouter.js`)
- Browser-based API test page (`/api-test.html`)
- Utility function for API testing (`src/utils/openrouter-test.ts`)
- API testing documentation (`docs/API_TESTING.md`)
- `dotenv` dependency for environment variable loading
- `test:api` script in package.json

### Verified
- OpenRouter API connectivity confirmed working
- Both command-line and browser-based testing methods functional

### Removed
- Testing tools and scripts after successful verification
- `dotenv` dependency and `test:api` script from package.json

## v1.1.3 - Model Optimization

### Changed
- Switched from `openai/gpt-oss-20b:free` to `mistralai/mistral-small-3.1-24b-instruct:free` model
- Updated all documentation to reflect the new model choice
- The new model offers better performance and availability for educational use cases

### Reason
- The previous model (`openai/gpt-oss-20b:free`) was reported to be in high demand
- The new model (`mistralai/mistral-small-3.1-24b-instruct:free`) is optimized for instruction following and educational applications
- Better balance between performance and availability

## v1.1.4 - Model Name Correction

### Fixed
- Corrected the model name from `mistralai/mistral-small-3.1-24b-instruct:free` to `mistralai/mistral-small-3.2-24b-instruct-2506:free`
- Updated all references in the code and documentation to use the correct model name
- The corrected model name matches the actual available model on OpenRouter

### Reason
- The previous model name was incorrect and would cause API errors
- Using the correct model name should resolve the errors you were experiencing

## v1.1.5 - Rate Limiting and Conversation History Optimization

### Fixed
- Added rate limiting to prevent too many requests in a short period
- Limited conversation history to last 6 messages to prevent context overflow
- Added debugging logs to help identify issues
- Improved error handling for subsequent API calls

### Reason
- The AI service was working for the first call but failing on subsequent calls
- This was likely due to either rate limiting or context length issues
- These changes should resolve the issue and make the AI service more reliable

## v1.1.6 - Documentation Updates

### Updated
- Updated [README.md](file:///d:/Other/Code/virtual-science-lab/README.md) to include information about rate limiting and conversation history optimization
- Updated [AI_SERVICE_SETUP.md](file:///d:/Other/Code/virtual-science-lab/docs/AI_SERVICE_SETUP.md) to include details about API protection features
- Added information about the built-in protection mechanisms in the AI service

### Reason
- To provide better documentation for users about the implemented protection features
- To help users understand how the AI service handles rate limiting and conversation history

## v1.2.0 - Switch to Google Generative AI

### Changed
- Switched from OpenRouter API to Google Generative AI
- Integrated `gemma-3-1b-it` model as the primary AI model (completely free)
- Updated [ai-service.ts](file:///d:/Other/Code/virtual-science-lab/src/config/ai-service.ts) to use Google's Generative AI SDK
- Modified [AIAssistant.tsx](file:///d:/Other/Code/virtual-science-lab/src/components/ai/AIAssistant.tsx) to work with Google's API format
- Updated error handling to be specific to Google's API
- Updated all documentation to reflect the new API provider

### Reason
- Switching back to Google Generative AI with the Gemma model as requested
- The Google Generative AI SDK provides a more straightforward integration
- The gemma-3-1b-it model offers good performance for educational applications and is completely free

### Updated
- [README.md](file:///d:/Other/Code/virtual-science-lab/README.md) with Google Generative AI information
- [AI_SERVICE_SETUP.md](file:///d:/Other/Code/virtual-science-lab/docs/AI_SERVICE_SETUP.md) with Google API setup instructions
- [.env.example](file:///d:/Other/Code/virtual-science-lab/.env.example) with VITE_GEMINI_API_KEY variable

## v1.2.1 - Free Model Clarification

### Updated
- Clarified in documentation that we're using the `gemma-3-1b-it` model which is completely free
- Updated [README.md](file:///d:/Other/Code/virtual-science-lab/README.md) to emphasize the free nature of the model
- Updated [AI_SERVICE_SETUP.md](file:///d:/Other/Code/virtual-science-lab/docs/AI_SERVICE_SETUP.md) to highlight that the model is free with generous usage limits
- Added information about the lightweight nature of the model and its suitability for educational applications

### Reason
- To provide clear information that the selected model is completely free to use
- To help users understand the cost implications of using the AI service

## v1.3.0 - Switch Back to OpenRouter with Google Gemma Model

### Changed
- Switched back to OpenRouter API as requested
- Integrated `google/gemma-3n-e2b-it:free` model as the primary AI model
- Updated [ai-service.ts](file:///d:/Other/Code/virtual-science-lab/src/config/ai-service.ts) to use direct API calls to OpenRouter
- Modified [AIAssistant.tsx](file:///d:/Other/Code/virtual-science-lab/src/components/ai/AIAssistant.tsx) to work with OpenRouter's API format
- Updated error handling to be specific to OpenRouter's API
- Updated all documentation to reflect the new API provider and model

### Reason
- Switching back to OpenRouter with the Google Gemma model as requested
- The `google/gemma-3n-e2b-it:free` model offers good performance for educational applications and is free to use
- Maintains the benefits of OpenRouter's unified API access

### Updated
- [README.md](file:///d:/Other/Code/virtual-science-lab/README.md) with OpenRouter and Google Gemma model information
- [AI_SERVICE_SETUP.md](file:///d:/Other/Code/virtual-science-lab/docs/AI_SERVICE_SETUP.md) with OpenRouter API setup instructions
- [.env.example](file:///d:/Other/Code/virtual-science-lab/.env.example) with VITE_OPENROUTER_API_KEY variable
- Reverted conversation history management features from previous implementation

## v1.3.1 - AI Response Formatting Improvements

### Added
- Enhanced formatting for chemical equations and scientific notation in AI responses
- Added special styling for chemical reactions with reversible arrows (⇌)
- Improved bullet point formatting for lists
- Added monospace font styling for chemical equations
- Updated system prompt with specific formatting guidelines for chemical content

### Reason
- To improve readability of chemical equations and scientific content
- To make AI responses more visually appealing and easier to understand
- To provide consistent formatting for educational content

### Updated
- [ai-service.ts](file:///d:/Other/Code/virtual-science-lab/src/config/ai-service.ts) with enhanced formatting guidelines in system prompt
- [AIAssistant.tsx](file:///d:/Other/Code/virtual-science-lab/src/components/ai/AIAssistant.tsx) with improved content formatting function

## v1.3.2 - Markdown Formatting Support

### Added
- Implemented markdown parsing for AI responses
- Added support for headers (#, ##)
- Added support for bold text (**text** or __text__)
- Added support for italic text (*text* or _text_)
- Added support for bullet point lists (* or -)
- Enhanced chemical equation formatting with markdown awareness
- Improved overall readability of AI responses

### Reason
- To provide richer formatting options for AI responses
- To make complex scientific explanations more structured and readable
- To support common markdown syntax that the AI might generate

### Updated
- [AIAssistant.tsx](file:///d:/Other/Code/virtual-science-lab/src/components/ai/AIAssistant.tsx) with comprehensive markdown parsing function