# ClearLedger Bookkeeping — GitHub + Vercel + GPT

This is the ready-to-deploy version of the ClearLedger website.

## Important architecture

GitHub stores the website source code.

Vercel hosts the website AND the `/api/chat` serverless backend.

The browser never receives the OpenAI API key. The browser sends the customer's message
to `/api/chat`; Vercel sends the request to OpenAI; the response comes back to the browser.

This is required because OpenAI says API keys must not be deployed in browsers or committed
to repositories.

## Publish it

### Option A — easiest

1. Create a GitHub repository, for example:
   `clearledger-bookkeeping`
2. Upload every file in this folder to the repository.
3. Import that GitHub repository into Vercel.
4. In Vercel → Project Settings → Environment Variables, add:
   `OPENAI_API_KEY`
5. Paste your OpenAI API key as the value.
6. Add:
   `OPENAI_MODEL = gpt-5-mini`
7. Redeploy.
8. Open the Vercel URL and test the AI assistant.

Do NOT use GitHub Pages for the AI version. GitHub Pages is only a static host; the GPT
API key must stay on a server-side function. Vercel is being used here so the GitHub
repository can remain the source of truth while the serverless `/api/chat` function runs
securely.

## Custom domain

After the Vercel deployment works:

1. Vercel → Project → Settings → Domains
2. Add your domain.
3. Vercel will show the DNS record(s) to add at your domain registrar.
4. Add those records.
5. Wait for DNS verification.
6. HTTPS is handled by Vercel after the domain is connected.

## Test the assistant

Try:

"Hi, I run a small retail business."

Then:

"I use QuickBooks and have about 120 transactions each month."

Then:

"I need reconciliation and monthly reports."

Then:

"Can you do it for $100?"

Then:

"Okay, I'll take the $149 package."

The assistant should keep the context across the conversation and eventually direct the
customer to Deepak when they are ready.

## Contact

Email: dipakkumarkhadka33@gmail.com
WhatsApp: +9779826452613

## Security

Never commit `.env` or a real API key.
Do not ask customers for passwords, bank credentials, card numbers, or authentication codes.
Do not put confidential accounting records into the public chat.

For production, also configure spend limits and monitor API usage.
