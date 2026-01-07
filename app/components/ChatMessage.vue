<script setup lang="ts">
import { parseWhatsAppFormatting } from '~/utils/whatsapp-formatting'

const props = defineProps<{
  message: {
    role: "user" | "assistant";
    content: string;
    timestamp?: string;
    status?: "sent" | "delivered" | "read";
    images?: string[];
  };
}>();

const formattedContent = computed(() => parseWhatsAppFormatting(props.message.content))

const openImage = (imageUrl: string) => {
  window.open(imageUrl, '_blank', 'noopener,noreferrer')
}

const onImageLoad = (event: Event) => {
  console.log('Image loaded successfully')
}

const onImageError = (event: Event) => {
  console.error('Image failed to load')
  const img = event.target as HTMLImageElement
  img.style.display = 'none'
}
</script>

<template>
  <div
    class="flex w-full"
    :class="[message.role === 'user' ? 'justify-end' : 'justify-start']"
  >
    <div class="max-w-[78%] space-y-2">
      <!-- Images Section - Outside bubble -->
      <div v-if="message.images && message.images.length > 0" class="grid gap-1" :class="message.images.length === 1 ? 'grid-cols-1' : message.images.length === 2 ? 'grid-cols-2' : 'grid-cols-3'">
        <img
          v-for="(image, index) in message.images"
          :key="index"
          :src="image"
          :alt="`Image ${index + 1}`"
          class="rounded-lg cursor-pointer hover:opacity-90 transition-opacity max-w-full h-auto object-cover"
          :class="message.images.length === 1 ? 'max-h-64' : message.images.length === 2 ? 'max-h-48' : 'max-h-32'"
          @click="openImage(image)"
          @load="onImageLoad"
          @error="onImageError"
        />
      </div>
      
      <!-- Message Bubble -->
      <div
        class="rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm"
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
  </div>
</template>
