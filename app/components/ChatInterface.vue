<script setup lang="ts">
interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ApiChatResponse {
  from?: string;
  body?: string;
}

const messages = ref<Message[]>([
  { role: "assistant", content: "Hello! How can I help you today?" },
]);
const input = ref("");
const isLoading = ref(false);

const sendMessage = async () => {
  if (!input.value.trim() || isLoading.value) return;

  const userMessage = input.value.trim();
  input.value = "";

  messages.value.push({ role: "user", content: userMessage });
  isLoading.value = true;

  try {
    const response = await $fetch<ApiChatResponse>("/api/chat", {
      method: "POST",
      body: {
        message: userMessage,
        from: "user-123", // You might want to make this dynamic later
      },
    });

    const content = response?.body ?? JSON.stringify(response);
    messages.value.push({ role: "assistant", content });
  } catch (error) {
    console.error("Failed to send message:", error);
    messages.value.push({
      role: "assistant",
      content: "Sorry, I encountered an error connecting to the server.",
    });
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="flex h-screen flex-col bg-white dark:bg-gray-900">
    <!-- Header -->
    <header
      class="border-b border-gray-200 dark:border-gray-800 p-4 flex items-center space-x-3"
    >
      <img
        src="https://hyoshii.com/wp-content/uploads/2023/01/hyoshii-redlogo.png"
        alt="Hyoshii Logo"
        class="h-8 w-auto"
      />
      <h1 class="text-xl font-semibold text-gray-800 dark:text-white">
        hyoshii chat
      </h1>
    </header>

    <!-- Messages Area -->
    <div class="flex-1 overflow-y-auto p-4 space-y-4">
      <ChatMessage
        v-for="(msg, index) in messages"
        :key="index"
        :message="msg"
      />
      <div v-if="isLoading" class="flex justify-start">
        <div
          class="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-bl-none px-4 py-3"
        >
          <div class="flex space-x-2">
            <div
              class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
              style="animation-delay: 0ms"
            />
            <div
              class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
              style="animation-delay: 150ms"
            />
            <div
              class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
              style="animation-delay: 300ms"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Input Area -->
    <div class="border-t border-gray-200 dark:border-gray-800 p-4">
      <form class="relative max-w-4xl mx-auto" @submit.prevent="sendMessage">
        <input
          v-model="input"
          type="text"
          placeholder="Type a message..."
          class="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-3 pr-12 text-gray-900 dark:text-white focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          :disabled="isLoading"
        />
        <button
          type="submit"
          :disabled="!input.trim() || isLoading"
          class="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 disabled:opacity-50"
        >
          <UIcon name="i-lucide-send" class="w-5 h-5" />
        </button>
      </form>
    </div>
  </div>
</template>
