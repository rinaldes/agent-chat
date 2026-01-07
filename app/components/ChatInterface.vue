<script setup lang="ts">
interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  status?: "sent" | "delivered" | "read";
  images?: string[];
}

interface ApiChatResponse {
  from?: string;
  body?: string;
  images?: string[];
}

const formatTime = () =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const messages = ref<Message[]>([
  {
    role: "assistant",
    content: "🍓✨ *Selamat datang!* 🎊\n\nRayakan Chinese New Year dengan *Hampers Spesial* dari kami! 🧧\n\n📦 *Pilihan Hampers Chinese New Year:*\n\n• *Hampers Totome* - Rp 180.000\n  1x Totome A15 dengan kemasan lucu\n\n• *Hampers Momoka* - Rp 200.000\n  1x Momoka M6 dengan kemasan lucu\n\n• *Hampers Momoka & Hatsu* - Rp 400.000\n  1x Hatsu 6 & 1x Momoka M6\n\n🌸 Semua stroberi kami *segar, manis, dan berkualitas premium*! Sempurna untuk hadiah atau nikmati sendiri.\n\n❓ Mau pesan yang mana? Atau butuh info lebih lanjut? 😊",
    timestamp: formatTime(),
    images: [
      "/catalogue.jpg"
    ],
  },
]);
const input = ref("");
const isLoading = ref(false);
const messagesContainer = ref<HTMLElement>();

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  });
};

// Watch for changes in messages and loading state
watch([messages, isLoading], () => {
  scrollToBottom();
}, { flush: 'post' });

const sendMessage = async () => {
  if (!input.value.trim() || isLoading.value) return;

  const userMessage = input.value.trim();
  input.value = "";

  messages.value.push({
    role: "user",
    content: userMessage,
    timestamp: formatTime(),
    status: "sent",
  });
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
    messages.value.push({
      role: "assistant",
      content,
      timestamp: formatTime(),
      images: response?.images || [],
    });
  } catch (error) {
    console.error("Failed to send message:", error);
    messages.value.push({
      role: "assistant",
      content: "Sorry, I encountered an error connecting to the server.",
      timestamp: formatTime(),
    });
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="flex h-screen flex-col bg-[#ece5dd]">
    <!-- Header -->
    <header
      class="p-4 flex items-center space-x-3 shadow-sm"
      style="background: linear-gradient(135deg, #075e54, #0b7a65)"
    >
      <img
        src="https://hyoshii.com/wp-content/uploads/2023/01/hyoshii-redlogo.png"
        alt="Hyoshii Logo"
        class="h-8 w-auto"
      />
      <div class="flex flex-col">
        <h1 class="text-lg font-semibold text-white">hyoshii chat</h1>
        <p class="text-xs text-white/80">online • encrypted</p>
      </div>
    </header>

    <!-- Messages Area -->
    <div
      ref="messagesContainer"
      class="flex-1 overflow-y-auto p-4 space-y-3 chat-wallpaper"
      aria-label="conversation"
    >
      <ChatMessage
        v-for="(msg, index) in messages"
        :key="index"
        :message="msg"
      />
      <div v-if="isLoading" class="flex justify-start">
        <div
          class="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-bl-none px-4 py-3"
        >
          <div class="flex space-x-1">
            <div class="typing-dot" style="animation-delay: 0ms" />
            <div class="typing-dot" style="animation-delay: 150ms" />
            <div class="typing-dot" style="animation-delay: 300ms" />
          </div>
        </div>
      </div>
    </div>

    <!-- Input Area -->
    <div class="p-4 bg-[#f0f2f5] shadow-[0_-1px_2px_rgba(0,0,0,0.08)]">
      <form
        class="relative max-w-4xl mx-auto flex items-center bg-white rounded-3xl px-4 py-2 shadow-sm ring-1 ring-gray-200"
        @submit.prevent="sendMessage"
      >
        <UIcon
          name="i-lucide-smile"
          class="w-5 h-5 text-gray-400 mr-3 shrink-0"
        />
        <input
          v-model="input"
          type="text"
          placeholder="Type a message..."
          class="w-full bg-transparent text-gray-900 placeholder:text-gray-400 focus:outline-none"
          :disabled="isLoading"
        />
        <UIcon
          name="i-lucide-paperclip"
          class="w-5 h-5 text-gray-400 ml-3 mr-4 shrink-0"
        />
        <button
          type="submit"
          :disabled="!input.trim() || isLoading"
          class="rounded-full bg-[#25d366] text-white p-2 hover:bg-[#21c05b] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          <UIcon name="i-lucide-send" class="w-5 h-5" />
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.chat-wallpaper {
  background-color: #ece5dd;
  background-image: radial-gradient(
      circle at 1px 1px,
      rgba(0, 0, 0, 0.03) 1px,
      transparent 0
    ),
    radial-gradient(
      circle at 20px 20px,
      rgba(0, 0, 0, 0.02) 1px,
      transparent 0
    );
  background-size: 28px 28px;
}

.typing-dot {
  width: 8px;
  height: 8px;
  background: #b0b0b0;
  border-radius: 9999px;
  animation: typing 1s infinite ease-in-out;
}

@keyframes typing {
  0%,
  80%,
  100% {
    transform: translateY(0);
    opacity: 0.4;
  }
  40% {
    transform: translateY(-4px);
    opacity: 1;
  }
}
</style>
