import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Send, Bot, User, X } from "lucide-react";

interface Message {
  id: string;
  type: "bot" | "user";
  content: string;
  timestamp: Date;
}

interface ChatbotModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ChatbotModal({ open, onOpenChange }: ChatbotModalProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "bot",
      content: "Hello! Welcome to ROCKTOP PREMIUM EVENTS. I'm here to help you with any questions about our event planning services. How can I assist you today?",
      timestamp: new Date(),
    },
  ]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Predefined responses for common questions
  const botResponses = {
    greeting: [
      "Hello! How can I help you with your event planning needs?",
      "Hi there! I'm here to assist with any questions about our services.",
      "Welcome! Let me know how I can help make your event perfect.",
    ],
    services: [
      "We offer comprehensive event planning services including:\n• Complete Event Planning & Coordination\n• Decoration & Design\n• Equipment Rentals\n• Venue Selection\n• Academic Events\n\nWhich service interests you most?",
    ],
    pricing: [
      "Our pricing varies based on your specific needs and event size. For a personalized quote, please:\n• Fill out our quote request form\n• Contact us via WhatsApp\n• Call us directly\n\nWould you like me to help you get started with a quote?",
    ],
    contact: [
      "You can reach us through:\n• WhatsApp: Click the green icon\n• Phone: Click the blue phone icon\n• Email: Contact form on our website\n• Visit our Contact page for more details\n\nWhat's the best way for our team to reach you?",
    ],
    venues: [
      "We work with amazing venues across different locations. You can:\n• Browse our Venues page to see available options\n• Let us help you find the perfect venue for your event\n• We handle all venue coordination\n\nWhat type of event are you planning?",
    ],
    default: [
      "That's a great question! For detailed information, I'd recommend speaking with our event planning specialists. You can reach them via WhatsApp or phone.",
      "I'd love to help you with that! Our team can provide specific details. Would you like to connect via WhatsApp for immediate assistance?",
      "Let me connect you with our expert team who can give you detailed information about that. Use the WhatsApp button for quick responses!",
    ],
  };

  const generateBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes("hello") || message.includes("hi") || message.includes("hey")) {
      return botResponses.greeting[Math.floor(Math.random() * botResponses.greeting.length)];
    }
    
    if (message.includes("service") || message.includes("what do you") || message.includes("offer")) {
      return botResponses.services[0];
    }
    
    if (message.includes("price") || message.includes("cost") || message.includes("quote") || message.includes("budget")) {
      return botResponses.pricing[0];
    }
    
    if (message.includes("contact") || message.includes("reach") || message.includes("phone") || message.includes("email")) {
      return botResponses.contact[0];
    }
    
    if (message.includes("venue") || message.includes("location") || message.includes("place")) {
      return botResponses.venues[0];
    }
    
    return botResponses.default[Math.floor(Math.random() * botResponses.default.length)];
  };

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: currentMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage("");
    setIsTyping(true);

    // Simulate bot thinking time
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: generateBotResponse(currentMessage),
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000); // 1-3 seconds delay
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickActions = [
    "What services do you offer?",
    "How much does event planning cost?",
    "Can you help with venue selection?",
    "I need a quote for my event",
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md h-[600px] flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-white">Chat Support</DialogTitle>
                <p className="text-sm text-purple-100">ROCKTOP Events Assistant</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="text-white hover:bg-white/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 px-4 py-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.type === "bot" && (
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                )}
                
                <div
                  className={`max-w-[70%] px-4 py-2 rounded-lg ${
                    message.type === "user"
                      ? "bg-purple-600 text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">{message.content}</p>
                  <p className="text-xs mt-1 opacity-70">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>

                {message.type === "user" && (
                  <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
            ))}
            
            {isTyping && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="bg-gray-100 px-4 py-2 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Quick Actions */}
        {messages.length === 1 && (
          <div className="px-4 py-2 border-t bg-gray-50">
            <p className="text-xs text-gray-600 mb-2">Quick questions:</p>
            <div className="flex flex-wrap gap-2">
              {quickActions.map((action, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="cursor-pointer hover:bg-purple-100 text-xs px-2 py-1"
                  onClick={() => setCurrentMessage(action)}
                >
                  {action}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Message Input */}
        <div className="px-4 py-4 border-t bg-white">
          <div className="flex gap-2">
            <Input
              placeholder="Type your message..."
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
              disabled={isTyping}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!currentMessage.trim() || isTyping}
              size="sm"
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            For immediate assistance, use WhatsApp or call us directly
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}