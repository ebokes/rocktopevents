import { useState } from "react";
import { MessageCircle, Phone } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import ChatbotModal from "@/components/ui/chatbot-modal";

export default function FloatingChat() {
  const [chatbotOpen, setChatbotOpen] = useState(false);

  const handleWhatsAppClick = () => {
    window.open("https://wa.me/message/XQJXF6ITDWTTP1", "_blank");
  };

  const handleChatbotClick = () => {
    setChatbotOpen(true);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      {/* WhatsApp Chat Button */}
      <button
        onClick={handleWhatsAppClick}
        className="group flex items-center justify-center w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
        data-testid="button-whatsapp-chat"
        aria-label="Chat on WhatsApp"
      >
        <FaWhatsapp className="h-7 w-7" />

        {/* Tooltip */}
        <div className="absolute hidden md:inline-block right-16 bg-gray-800 text-white px-3 py-2 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
          Chat on WhatsApp
          <div className="absolute top-1/2 -right-1 transform -translate-y-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
        </div>
      </button>

      {/* Chatbot Button */}
      <button
        onClick={handleChatbotClick}
        className="group flex items-center justify-center w-14 h-14 bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
        data-testid="button-chatbot"
        aria-label="Open Chatbot"
      >
        <MessageCircle className="h-7 w-7" />

        {/* Tooltip */}
        <div className="absolute hidden md:inline-block right-16 bg-gray-800 text-white px-3 py-2 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
          Live Chat Support
          <div className="absolute top-1/2 -right-1 transform -translate-y-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
        </div>
      </button>

      {/* Phone Button (Optional) */}
      <button
        onClick={() => window.open("tel:+2348136842241", "_self")}
        className="group flex items-center justify-center w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
        data-testid="button-phone-call"
        aria-label="Call Us"
      >
        <Phone className="h-6 w-6" />

        {/* Tooltip */}
        <div className="absolute hidden md:inline-block right-16 bg-gray-800 text-white px-3 py-2 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
          Call Us Now
          <div className="absolute top-1/2 -right-1 transform -translate-y-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
        </div>
      </button>

      {/* Chatbot Modal */}
      <ChatbotModal open={chatbotOpen} onOpenChange={setChatbotOpen} />
    </div>
  );
}
