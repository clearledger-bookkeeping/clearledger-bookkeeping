const AGENT_ID =
  "agent_5567a8d63b4d47f6b7ac43769a27bdfe44c3a1176ce44f629c";

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });
}

export default async function handler(req) {
  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  if (!process.env.OPENAI_API_KEY) {
    return json(
      { error: "OPENAI_API_KEY is missing in Vercel." },
      500
    );
  }

  let body;

  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid request." }, 400);
  }

  const message =
    typeof body.message === "string"
      ? body.message.trim()
      : "";

  if (!message) {
    return json({ error: "Message is required." }, 400);
  }

  try {
    // Create a new agent session
    const sessionResponse = await fetch(
      "https://api.openai.com/v1/agents/sessions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
          "OpenAI-Beta": "agents=v1",
        },
        body: JSON.stringify({
          agent: {
            id: AGENT_ID,
          },
          environment: {
            type: "none",
          },
          input: message,
        }),
      }
    );

    const sessionData = await sessionResponse.json();

    if (!sessionResponse.ok) {
      console.error("OpenAI session error:", sessionData);

      return json(
        {
          error:
            sessionData?.error?.message ||
            "Unable to start the AI agent.",
        },
        sessionResponse.status
      );
    }

    const sessionId = sessionData.id;

    // If the session already contains the answer,
    // return it. Otherwise retrieve the session.
    let session = sessionData;

    if (!session?.output_text) {
      const getResponse = await fetch(
        `https://api.openai.com/v1/agents/sessions/${sessionId}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            "OpenAI-Beta": "agents=v1",
          },
        }
      );

      const getData = await getResponse.json();

      if (getResponse.ok) {
        session = getData;
      }
    }

    return json({
      session_id: sessionId,
      response: session.output_text || session.output || "",
      status: session.status || "completed",
    });
  } catch (error) {
    console.error("Agent error:", error);

    return json(
      {
        error:
          "The AI assistant is temporarily unavailable.",
      },
      500
    );
  }
}
