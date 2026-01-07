/**
 * Parse WhatsApp-style formatting in text
 * Supports: *bold*, _italic_, ~strikethrough~, ```monospace```, automatic URLs
 */
export function parseWhatsAppFormatting(text: string): string {
  if (!text) return ''

  // Escape HTML to prevent XSS
  const escapeHtml = (text: string) => {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
  }

  let formatted = escapeHtml(text)

  // Monospace (```code```) - Process first to avoid conflicts
  formatted = formatted.replace(/```(.*?)```/gs, '<span class="font-mono bg-gray-200 dark:bg-gray-700 px-1 rounded text-xs">$1</span>')

  // Bold (*text*)
  formatted = formatted.replace(/\*(.*?)\*/g, '<strong>$1</strong>')

  // Italic (_text_)
  formatted = formatted.replace(/_(.*?)_/g, '<em>$1</em>')

  // Strikethrough (~text~)
  formatted = formatted.replace(/~(.*?)~/g, '<s>$1</s>')

  // URLs - Convert to clickable links
  const urlRegex = /(https?:\/\/[^\s<]+)/g
  formatted = formatted.replace(urlRegex, (url) => {
    // Remove trailing punctuation if present
    const cleanUrl = url.replace(/[.,;:!?]+$/, '')
    return `<a href="${cleanUrl}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline">${cleanUrl}</a>`
  })

  return formatted
}
