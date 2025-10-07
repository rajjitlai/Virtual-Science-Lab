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