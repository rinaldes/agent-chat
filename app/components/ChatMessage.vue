<script setup lang="ts">
import { parseWhatsAppFormatting } from '~/utils/whatsapp-formatting'

const props = defineProps<{
  message: {
    role: "user" | "assistant";
    content: string;
    timestamp?: string;
    status?: "sent" | "delivered" | "read";
  };
}>();

const formattedContent = computed(() => parseWhatsAppFormatting(props.message.content))
</script>

<template>
  <div
    class="flex w-full"
    :class="[message.role === 'user' ? 'justify-end' : 'justify-start']"
  >
    <div
      class="max-w-[78%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm"
      :class="[
        message.role === 'user'
          ? 'bg-[#dcf8c6] text-gray-900 rounded-br-none'
          : 'bg-white text-gray-900 rounded-bl-none border border-gray-100',
      ]"
    >
      <div class="whitespace-pre-wrap" v-html="formattedContent"></div>
      <div class="mt-1.5 flex items-center justify-end space-x-1 text-[11px] text-gray-500">
        <span>{{ message.timestamp }}</span>
        <UIcon
          v-if="message.role === 'user'"
          :name="message.status === 'read' ? 'i-lucide-check-check' : 'i-lucide-check'"
          :class="[
            'w-3.5 h-3.5',
            message.status === 'read' ? 'text-[#34b7f1]' : 'text-gray-500',
          ]"
        />
      </div>
    </div>
  </div>
</template>
