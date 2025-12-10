export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const config = useRuntimeConfig();

  try {
    const response = await $fetch("https://agent.rinal.dev/test/webhook", {
      method: "POST",
      body: {
        From: body.from || "user-" + Math.floor(Math.random() * 10000),
        Body: body.message,
        History: body.history || [], // Pass conversation history
      },
    });
    return response;
  } catch (error) {
    console.error("Error forwarding to backend:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to communicate with chatbot backend",
    });
  }
});
