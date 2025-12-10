<script setup lang="ts">
defineProps<{
  message: {
    role: "user" | "assistant";
    content: string;
  };
}>();
</script>

<template>
  <div
    class="flex w-full"
    :class="[message.role === 'user' ? 'justify-end' : 'justify-start']"
  >
    <div
      class="max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed"
      :class="[
        message.role === 'user'
          ? 'bg-primary-600 text-white rounded-br-none'
          : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-none',
      ]"
    >
      <div class="whitespace-pre-wrap">{{ message.content }}</div>
    </div>
  </div>
</template>
