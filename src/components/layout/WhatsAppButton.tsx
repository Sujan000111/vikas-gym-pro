import { MessageCircle } from 'lucide-react';

export function WhatsAppButton() {
  const open = (): void => {
    window.open('https://wa.me/919876543210?text=Hi%20VikasGym!%20I%20want%20to%20know%20more.', '_blank');
  };
  return (
    <button
      onClick={open}
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[hsl(var(--red))] hover:bg-[hsl(var(--red-hover))] text-white flex items-center justify-center shadow-lg shadow-black/40 transition-all duration-200 hover:scale-105 no-print"
    >
      <MessageCircle className="w-6 h-6" />
    </button>
  );
}
