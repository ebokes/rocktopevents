import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";

interface Message {
  id: string;
  type: 'bot' | 'user';
  content: string;
  timestamp: Date;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: "Hi! I'm here to help you plan your perfect event. What type of event are you planning?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');

  const quickActions = [
    { label: 'Get Quote', action: 'quote' },
    { label: 'Find Venues', action: 'venues' },
    { label: 'Our Services', action: 'services' },
  ];

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Simulate bot response
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: "Thank you for your message! Our event specialists will help you create something amazing. Would you like me to connect you with one of our planners?",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  const handleQuickAction = (action: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: quickActions.find(a => a.action === action)?.label || '',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);

    // Simulate bot response based on action
    setTimeout(() => {
      let botContent = '';
      switch (action) {
        case 'quote':
          botContent = "I'd be happy to help you get a quote! Please tell me about your event type, guest count, and preferred date.";
          break;
        case 'venues':
          botContent = "Great! What city are you looking for venues in? Also, how many guests will you be hosting?";
          break;
        case 'services':
          botContent = "We offer event planning, decoration & design, equipment rentals, lighting & audio, staging, and academic event services. Which interests you most?";
          break;
        default:
          botContent = "How can I assist you today?";
      }
      
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: botContent,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chatbot Toggle Button */}
      <Button
        className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-full shadow-lg transition-all transform hover:scale-110"
        onClick={() => setIsOpen(true)}
        data-testid="chatbot-toggle"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>

      {/* Chatbot Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md max-h-[600px] flex flex-col" data-testid="chatbot-modal">
            <CardHeader className="bg-purple-600 text-white rounded-t-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-3">
                    <Bot className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Event Assistant</CardTitle>
                    <p className="text-sm text-purple-200">Online now</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:text-purple-200 hover:bg-white hover:bg-opacity-10"
                  onClick={() => setIsOpen(false)}
                  data-testid="chatbot-close"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[400px]">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start ${message.type === 'user' ? 'justify-end' : ''}`}
                  data-testid={`message-${message.id}`}
                >
                  {message.type === 'bot' && (
                    <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm mr-3">
                      <Bot className="h-4 w-4" />
                    </div>
                  )}
                  <div
                    className={`max-w-xs rounded-lg p-3 ${
                      message.type === 'bot'
                        ? 'bg-gray-100 text-slate-800'
                        : 'bg-purple-600 text-white ml-auto'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                  {message.type === 'user' && (
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm ml-3">
                      <User className="h-4 w-4" />
                    </div>
                  )}
                </div>
              ))}
            </CardContent>

            <div className="p-4 border-t">
              <div className="flex space-x-2 mb-3">
                <Input
                  placeholder="Type your message..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  data-testid="chatbot-input"
                />
                <Button
                  onClick={handleSendMessage}
                  className="bg-purple-600 hover:bg-purple-700"
                  data-testid="chatbot-send"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {quickActions.map((action) => (
                  <Button
                    key={action.action}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickAction(action.action)}
                    data-testid={`quick-action-${action.action}`}
                  >
                    {action.label}
                  </Button>
                ))}
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}
