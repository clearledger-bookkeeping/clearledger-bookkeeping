# ClearLedger — real GPT conversational assistant

This version uses the OpenAI Responses API through the Node.js backend. The browser never receives your OpenAI API key.

## Why this version feels like a real assistant
- The browser sends only the customer's new message.
- The server keeps a private in-memory session and the latest Responses API ID.
- Each turn continues the previous model response with `previous_response_id`.
- The model can ask follow-up questions, remember what the customer already said, explain pricing, handle objections, and decide when the conversation is ready to move to Deepak.
- A function tool can create a pending custom-price request when the customer asks for a discount or unusual scope.
- There is no local button-script pretending to be an AI conversation.

## Run it
1. Install Node.js LTS.
2. In this folder run `npm install`.
3. Set `OPENAI_API_KEY` as a server environment variable.
4. Optional: set `OPENAI_MODEL=gpt-5.5`.
5. Run `npm start`.
6. Open `http://localhost:3000`.

Do NOT put the API key into `index.html`.

## Important hosting requirement
Opening `index.html` directly from a phone as `content://download/...` does NOT start the Node.js server. In that situation `/api/chat` does not exist, so the assistant will say it cannot connect.

For the real assistant to work for customers, deploy the whole folder to a Node.js-capable host and configure `OPENAI_API_KEY` in that host's environment variables/secrets.

## Conversation and privacy
The app keeps the latest conversation pointer in server memory only. Restarting the server clears the local session map. The app does not create its own customer chat database.

The OpenAI Responses API is stateful when using `previous_response_id`; OpenAI documents that response objects are stored for 30 days by default unless storage is disabled, and the Conversations API has different persistence behavior. Review OpenAI's current data-retention documentation before promising customers any specific retention period.

The assistant is instructed not to request passwords, bank logins, card numbers, or unnecessary confidential accounting records.

## Custom-price approval
The AI can create a pending request in server memory, but this package does not yet give Deepak a secure web dashboard to approve/reject those requests. It therefore never tells a customer that a discount is approved unless a future approval system explicitly provides that status.
