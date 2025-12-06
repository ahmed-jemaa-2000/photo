import type { WhatsAppMessageParams } from '@busi/types';

/**
 * Generate WhatsApp URL with pre-filled message
 */
export function generateWhatsAppUrl(params: WhatsAppMessageParams): string {
  const { phone, productName, price, shopName, size, color } = params;

  // Remove all non-digit characters from phone number
  const cleanPhone = phone.replace(/\D/g, '');

  // Build message
  let message = `Hi, I'm interested in *${productName}*`;

  if (size) {
    message += ` (Size: ${size})`;
  }

  if (color) {
    message += ` (Color: ${color})`;
  }

  message += ` - ${price} TND from ${shopName}.`;

  // Encode message for URL
  const encodedMessage = encodeURIComponent(message);

  // Return WhatsApp web/app URL
  // Use wa.me for better mobile support
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
}

/**
 * Generate WhatsApp URL for multiple products (cart)
 */
export function generateWhatsAppCartUrl(
  phone: string,
  shopName: string,
  items: Array<{
    productName: string;
    price: number;
    quantity: number;
    size?: string;
    color?: string;
  }>
): string {
  const cleanPhone = phone.replace(/\D/g, '');

  let message = `Hi, I'd like to order the following from *${shopName}*:\n\n`;

  items.forEach((item, index) => {
    message += `${index + 1}. ${item.productName}`;

    if (item.size || item.color) {
      message += ' (';
      if (item.size) message += `Size: ${item.size}`;
      if (item.size && item.color) message += ', ';
      if (item.color) message += `Color: ${item.color}`;
      message += ')';
    }

    message += ` - ${item.price} TND x ${item.quantity}\n`;
  });

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  message += `\n*Total: ${total.toFixed(2)} TND*`;

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
}

/**
 * Validate phone number for WhatsApp
 */
export function isValidWhatsAppNumber(phone: string): boolean {
  // Remove all non-digit characters
  const cleanPhone = phone.replace(/\D/g, '');

  // Phone number should be between 8 and 15 digits
  return cleanPhone.length >= 8 && cleanPhone.length <= 15;
}

/**
 * Format phone number for display
 */
export function formatPhoneNumber(phone: string): string {
  const cleanPhone = phone.replace(/\D/g, '');

  // Tunisia phone numbers: +216 XX XXX XXX
  if (cleanPhone.startsWith('216')) {
    return `+216 ${cleanPhone.slice(3, 5)} ${cleanPhone.slice(5, 8)} ${cleanPhone.slice(8)}`;
  }

  // Generic international format
  if (cleanPhone.length > 10) {
    return `+${cleanPhone.slice(0, -10)} ${cleanPhone.slice(-10, -7)} ${cleanPhone.slice(-7, -4)} ${cleanPhone.slice(-4)}`;
  }

  // Generic format
  return cleanPhone.replace(/(\d{2})(?=\d)/g, '$1 ');
}
