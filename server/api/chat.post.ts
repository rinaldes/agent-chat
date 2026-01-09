interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatRequest {
  from?: string;
  message: string;
  history?: ChatMessage[];
}

export default defineEventHandler(async (event) => {
  const body = await readBody<ChatRequest>(event);
  const webhookUrl = process.env.WEBHOOK_URL;

  if (!webhookUrl) {
    throw createError({
      statusCode: 500,
      statusMessage: 'WEBHOOK_URL is not configured',
    });
  }

  try {
    const response = await $fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        from: body.from || `user-${Math.floor(Math.random() * 10000)}`,
        message: body.message,
        history: body.history || [],
      },
    });

    console.log(response);

    return response;
  } catch (error) {
    console.error('Error forwarding to backend:', error);
    throw error;
  }
});
