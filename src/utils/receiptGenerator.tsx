import html2canvas from 'html2canvas';
import type { Order } from '@/types/order';

// Telegram bot configuration (you can set these as environment variables later)
const TELEGRAM_BOT_URL = 'https://t.me/OrganicGreenUzBot'; // Replace with actual bot URL

export { TELEGRAM_BOT_URL };

// Format datetime for Uzbekistan timezone using proper Intl API
export function formatUzbekistanDateTime(dateString: string): string {
  const date = new Date(dateString);
  
  // Use Intl.DateTimeFormat for Uzbekistan timezone formatting
  return new Intl.DateTimeFormat('uz-UZ', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Tashkent' // Uzbekistan timezone
  }).format(date);
}

// Receipt component for rendering
export function ReceiptContent({ order, t }: { order: Order; t: (key: string) => string }) {
  const discount = Number(order.discount_total || 0);
  
  return (
    <div 
      id="receipt-content"
      className="bg-white p-8 max-w-md mx-auto text-black"
      style={{ fontFamily: 'monospace', fontSize: '14px', lineHeight: '1.4' }}
    >
      {/* Header */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center mb-2">
          <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center mr-2">
            <span className="text-white text-lg">🌿</span>
          </div>
          <h1 className="text-xl font-bold">Organic Green</h1>
        </div>
        <h2 className="text-lg font-semibold border-b-2 border-dashed border-gray-400 pb-2">
          {t('order.receipt.title')}
        </h2>
      </div>

      {/* Order Info */}
      <div className="mb-4">
        <h3 className="font-semibold mb-2">{t('order.receipt.order_info')}</h3>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span>{t('order.order_number')}:</span>
            <span className="font-mono">{order.order_number}</span>
          </div>
          <div className="flex justify-between">
            <span>{t('order.created_at')}:</span>
            <span>{formatUzbekistanDateTime(order.created_at)}</span>
          </div>
          <div className="flex justify-between">
            <span>{t('order.order_status')}:</span>
            <span>{t(`order.status.${order.status}`)}</span>
          </div>
          <div className="flex justify-between">
            <span>{t('order.payment_method')}:</span>
            <span>{order.payment_method.toUpperCase()}</span>
          </div>
        </div>
      </div>

      <div className="border-t border-dashed border-gray-400 my-4"></div>

      {/* Customer Info */}
      <div className="mb-4">
        <h3 className="font-semibold mb-2">{t('order.receipt.customer_info')}</h3>
        <div className="space-y-1 text-sm">
          <div>{order.full_name}</div>
          <div>{order.contact_phone}</div>
          <div className="break-words">{order.delivery_address}</div>
        </div>
      </div>

      <div className="border-t border-dashed border-gray-400 my-4"></div>

      {/* Items */}
      <div className="mb-4">
        <h3 className="font-semibold mb-2">{t('order.receipt.items')}</h3>
        <div className="space-y-2">
          {order.items.map((item, index) => (
            <div key={index} className="text-sm">
              <div className="font-medium break-words">
                {item.product_name || item.product_name_uz || item.product_name_ru || item.product_name_en}
              </div>
              <div className="flex justify-between">
                <span>{item.quantity} x {Number(item.unit_price || 0).toLocaleString()}</span>
                <span className="font-semibold">{Number(item.total_price || 0).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-dashed border-gray-400 my-4"></div>

      {/* Totals */}
      <div className="mb-4">
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span>{t('order.receipt.subtotal')}:</span>
            <span>{Number(order.subtotal).toLocaleString()}</span>
          </div>
          
          {discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>{t('order.receipt.discount')}:</span>
              <span>-{Number(discount).toLocaleString()}</span>
            </div>
          )}
          
          <div className="flex justify-between text-sm">
            <span>Доставка / Delivery:</span>
            <span className="text-green-600">БЕПУЛ / FREE</span>
          </div>
          
          <div className="border-t border-gray-400 pt-2 mt-2">
            <div className="flex justify-between font-bold text-lg">
              <span>{t('order.receipt.total')}:</span>
              <span>{Number(order.total_price).toLocaleString()} UZS</span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-dashed border-gray-400 my-4"></div>

      {/* Footer */}
      <div className="text-center">
        <div className="text-sm mb-2">{t('order.receipt.thank_you')}</div>
        <div className="text-xs text-gray-600">{t('order.receipt.contact')}</div>
        <div className="text-xs text-gray-600 mt-1">organicgreen.uz</div>
        
        {/* QR code placeholder */}
        <div className="mt-4 flex justify-center">
          <div className="w-16 h-16 bg-gray-200 border-2 border-dashed border-gray-400 flex items-center justify-center text-xs text-gray-500">
            QR CODE
          </div>
        </div>
      </div>
    </div>
  );
}

// Generate and download receipt
export async function downloadReceipt(order: Order, t: (key: string) => string): Promise<void> {
  // Validate order data
  if (!order || !order.items) {
    throw new Error('Order data is invalid or items are missing');
  }

  // Create a temporary container
  const tempContainer = document.createElement('div');
  tempContainer.style.position = 'absolute';
  tempContainer.style.left = '-9999px';
  tempContainer.style.top = '-9999px';
  tempContainer.style.width = '400px';
  document.body.appendChild(tempContainer);

  // Create the receipt content
  const receiptElement = document.createElement('div');
  receiptElement.innerHTML = `
    <div style="background: white; padding: 32px; max-width: 320px; color: black; font-family: monospace; font-size: 14px; line-height: 1.4;">
      <!-- Header -->
      <div style="text-align: center; margin-bottom: 24px;">
        <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 8px;">
          <div style="width: 32px; height: 32px; background: #16a34a; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 8px; font-size: 18px;">
            🌿
          </div>
          <h1 style="font-size: 20px; font-weight: bold; margin: 0;">Organic Green</h1>
        </div>
        <h2 style="font-size: 16px; font-weight: 600; border-bottom: 2px dashed #9ca3af; padding-bottom: 8px; margin: 0;">
          ${t('order.receipt.title')}
        </h2>
      </div>

      <!-- Order Info -->
      <div style="margin-bottom: 16px;">
        <h3 style="font-weight: 600; margin-bottom: 8px;">${t('order.receipt.order_info')}</h3>
        <div style="font-size: 14px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
            <span>${t('order.order_number')}:</span>
            <span style="font-family: monospace;">${order.order_number}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
            <span>${t('order.created_at')}:</span>
            <span>${formatUzbekistanDateTime(order.created_at)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
            <span>${t('order.order_status')}:</span>
            <span>${t(`order.status.${order.status}`)}</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span>${t('order.payment_method')}:</span>
            <span>${order.payment_method.toUpperCase()}</span>
          </div>
        </div>
      </div>

      <div style="border-top: 1px dashed #9ca3af; margin: 16px 0;"></div>

      <!-- Customer Info -->
      <div style="margin-bottom: 16px;">
        <h3 style="font-weight: 600; margin-bottom: 8px;">${t('order.receipt.customer_info')}</h3>
        <div style="font-size: 14px;">
          <div style="margin-bottom: 4px;">${order.full_name}</div>
          <div style="margin-bottom: 4px;">${order.contact_phone}</div>
          <div style="word-break: break-words;">${order.delivery_address}</div>
        </div>
      </div>

      <div style="border-top: 1px dashed #9ca3af; margin: 16px 0;"></div>

      <!-- Items -->
      <div style="margin-bottom: 16px;">
        <h3 style="font-weight: 600; margin-bottom: 8px;">${t('order.receipt.items')}</h3>
        <div>
          ${order.items && order.items.length > 0 ? order.items.map(item => `
            <div style="font-size: 14px; margin-bottom: 8px;">
              <div style="font-weight: 500; word-break: break-words;">
                ${item.product_name || item.product_name_en || item.product_name_uz || item.product_name_ru || 'Product'}
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span>${item.quantity || 0} x ${Number(item.unit_price || 0).toLocaleString()}</span>
                <span style="font-weight: 600;">${Number(item.total_price || 0).toLocaleString()}</span>
              </div>
            </div>
          `).join('') : '<div style="font-size: 14px; color: #6b7280;">No items found</div>'}
        </div>
      </div>

      <div style="border-top: 1px dashed #9ca3af; margin: 16px 0;"></div>

      <!-- Totals -->
      <div style="margin-bottom: 16px;">
        <div style="font-size: 14px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
            <span>${t('order.receipt.subtotal')}:</span>
            <span>${Number(order.subtotal || 0).toLocaleString()}</span>
          </div>
          
          ${Number(order.discount_total || 0) > 0 ? `
          <div style="display: flex; justify-content: space-between; color: #16a34a; margin-bottom: 4px;">
            <span>${t('order.receipt.discount')}:</span>
            <span>-${Number(order.discount_total).toLocaleString()}</span>
          </div>
          ` : ''}
          
          <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
            <span>Доставка / Delivery:</span>
            <span style="color: #16a34a;">БЕПУЛ / FREE</span>
          </div>
          
          <div style="border-top: 1px solid #9ca3af; padding-top: 8px; margin-top: 8px;">
            <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 16px;">
              <span>${t('order.receipt.total')}:</span>
              <span>${Number(order.total_price || 0).toLocaleString()} UZS</span>
            </div>
          </div>
        </div>
      </div>

      <div style="border-top: 1px dashed #9ca3af; margin: 16px 0;"></div>

      <!-- Footer -->
      <div style="text-align: center;">
        <div style="font-size: 14px; margin-bottom: 8px;">${t('order.receipt.thank_you')}</div>
        <div style="font-size: 12px; color: #6b7280;">${t('order.receipt.contact')}</div>
        <div style="font-size: 12px; color: #6b7280; margin-top: 4px;">organicgreen.uz</div>
        
        <!-- QR code placeholder -->
        <div style="margin-top: 16px; display: flex; justify-content: center;">
          <div style="width: 64px; height: 64px; background: #e5e7eb; border: 2px dashed #9ca3af; display: flex; align-items: center; justify-content: center; font-size: 12px; color: #6b7280;">
            QR CODE
          </div>
        </div>
      </div>
    </div>
  `;
  
  tempContainer.appendChild(receiptElement);

  try {
    // Generate the image
    const canvas = await html2canvas(receiptElement, {
      backgroundColor: '#ffffff',
      scale: 2, // Higher resolution
      useCORS: true,
      logging: false,
      width: 320,
      height: receiptElement.scrollHeight
    });

    // Create download link
    const link = document.createElement('a');
    link.download = `organic-green-receipt-${order.order_number}.png`;
    link.href = canvas.toDataURL('image/png');
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

  } catch (error) {
    console.error('Error generating receipt:', error);
    throw new Error('Failed to generate receipt');
  } finally {
    // Clean up
    document.body.removeChild(tempContainer);
  }
}
