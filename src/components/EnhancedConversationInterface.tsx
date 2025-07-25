import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Send, Bot, User, Clock, DollarSign, Hash, Copy, ThumbsUp, ThumbsDown, CheckCircle, Sparkles, Zap, Brain } from 'lucide-react';
import { EnhancedGeminiFramework } from '@/lib/gemini-framework';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  tokens?: number;
  responseTime?: number;
  cost?: number;
  model?: string;
  timestamp: Date;
  rating?: 'thumbs_up' | 'thumbs_down' | null;
}

interface ConversationInterfaceProps {
  framework: EnhancedGeminiFramework;
}

export const EnhancedConversationInterface: React.FC<ConversationInterfaceProps> = ({ framework }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    loadConversationHistory();
  }, [framework]);

  const loadConversationHistory = async () => {
    try {
      const history = await framework.getConversationHistory();
      if (history.length > 0) {
        const latestConversation = history[0];
        const historyMessages: Message[] = latestConversation.messages.map((msg: any) => ({
          id: msg.id,
          role: msg.role,
          content: msg.content,
          tokens: msg.tokens_used,
          responseTime: msg.response_time_ms,
          cost: msg.cost,
          model: msg.model_used,
          timestamp: new Date(msg.created_at),
          rating: msg.message_ratings?.[0]?.rating || null
        }));
        setMessages(historyMessages);
        
        if (historyMessages.length > 0) {
          toast({
            description: "✨ Loaded your conversation history!",
            duration: 3000,
          });
        }
      }
    } catch (error) {
      console.log('No conversation history available');
    }
  };

  const copyToClipboard = async (content: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMessageId(messageId);
      toast({
        description: "📋 Message copied to clipboard!",
        duration: 2000,
      });
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (error) {
      toast({
        description: "Failed to copy message",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  const rateMessage = async (messageId: string, rating: 'thumbs_up' | 'thumbs_down') => {
    try {
      await framework.rateMessage(messageId, rating);
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, rating } : msg
      ));
      toast({
        description: `${rating === 'thumbs_up' ? '👍 Thanks for the positive feedback!' : '👎 Feedback noted - we\'ll improve!'}`,
        duration: 2000,
      });
    } catch (error) {
      toast({
        description: "Failed to record feedback",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString() + '-user',
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await framework.processRequest(input);
      
      const assistantMessage: Message = {
        id: Date.now().toString() + '-assistant',
        role: 'assistant',
        content: response.main_response,
        tokens: response.actual_tokens_used,
        responseTime: response.response_time,
        cost: response.stats.costEstimate,
        model: response.model_used,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Save to Supabase if available
      try {
        await framework.saveMessage({
          role: 'user',
          content: input,
          tokens_used: response.stats.inputTokens || 0,
          response_time_ms: 0
        });
        
        await framework.saveMessage({
          role: 'assistant',
          content: response.main_response,
          tokens_used: response.stats.outputTokens || 0,
          response_time_ms: response.response_time,
          model_used: response.model_used,
          cost: response.stats.costEstimate
        });
      } catch (error) {
        console.log('Running in demo mode - messages not persisted');
      }
    } catch (error) {
      console.error('Error processing message:', error);
      const errorMessage: Message = {
        id: Date.now().toString() + '-error',
        role: 'assistant',
        content: '❌ Sorry, I encountered an error processing your request. Please check your API key and try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const getProfundityColor = (score?: number) => {
    if (!score) return 'text-muted-foreground';
    if (score >= 70) return 'text-purple-500';
    if (score >= 50) return 'text-blue-500';
    if (score >= 30) return 'text-green-500';
    return 'text-gray-500';
  };

  const getProfundityIcon = (score?: number) => {
    if (!score) return Sparkles;
    if (score >= 70) return Brain;
    if (score >= 50) return Zap;
    return Sparkles;
  };

  return (
    <Card className="flex flex-col h-[700px] bg-gradient-to-br from-background to-secondary/10 border-border/50">
      <CardContent className="flex flex-col h-full p-6">
        <div className="flex items-center justify-between pb-4 border-b border-border/50 mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background animate-pulse" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Enhanced Gemini Assistant</h3>
              <p className="text-sm text-muted-foreground">
                {framework.isApiReady() ? 'Connected with intelligent routing' : 'Not connected'}
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-gradient-to-r from-primary/10 to-secondary">
            <Sparkles className="w-3 h-3 mr-1" />
            AI Powered
          </Badge>
        </div>
        
        <ScrollArea className="flex-1 mb-4">
          <div className="space-y-4">
            {messages.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center">
                  <Bot className="w-8 h-8 opacity-50" />
                </div>
                <h4 className="text-lg font-medium mb-2">Ready to chat!</h4>
                <p className="text-sm max-w-md mx-auto">
                  Try asking complex questions to see the Pro model in action, or simple ones for lightning-fast responses!
                </p>
                <div className="flex justify-center gap-2 mt-4">
                  <Badge variant="outline" className="text-xs">Auto-routing</Badge>
                  <Badge variant="outline" className="text-xs">Real-time metrics</Badge>
                  <Badge variant="outline" className="text-xs">Persistent history</Badge>
                </div>
              </div>
            )}
            
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-4 group animate-fade-in ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`flex gap-3 max-w-[85%] ${
                    message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white shadow-lg ${
                    message.role === 'user' 
                      ? 'bg-gradient-to-br from-blue-500 to-blue-600' 
                      : 'bg-gradient-to-br from-purple-500 to-purple-600'
                  }`}>
                    {message.role === 'user' ? (
                      <User className="w-4 h-4" />
                    ) : (
                      <Bot className="w-4 h-4" />
                    )}
                  </div>
                  
                  <div
                    className={`px-4 py-3 rounded-2xl shadow-sm border backdrop-blur-sm ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground ml-4 rounded-br-md'
                        : 'bg-card/80 border-border/50 mr-4 rounded-bl-md'
                    }`}
                  >
                    <div className="whitespace-pre-wrap leading-relaxed text-sm">
                      {message.content}
                    </div>
                    
                    {message.role === 'assistant' && (
                      <div className="mt-3 pt-3 border-t border-border/20">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            {message.tokens && (
                              <div className="flex items-center gap-1">
                                <Hash className="w-3 h-3" />
                                <span>{message.tokens.toLocaleString()}</span>
                              </div>
                            )}
                            {message.responseTime && (
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span>{message.responseTime}ms</span>
                              </div>
                            )}
                            {message.cost && (
                              <div className="flex items-center gap-1">
                                <DollarSign className="w-3 h-3" />
                                <span>${message.cost.toFixed(6)}</span>
                              </div>
                            )}
                            {message.model && (
                              <Badge variant="outline" className="text-xs">
                                {message.model.replace('gemini-', '')}
                              </Badge>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 px-2 hover:bg-background/50"
                              onClick={() => copyToClipboard(message.content, message.id)}
                            >
                              {copiedMessageId === message.id ? (
                                <CheckCircle className="w-3 h-3 text-green-500" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </Button>
                            <Button
                              variant={message.rating === 'thumbs_up' ? 'default' : 'ghost'}
                              size="sm"
                              className="h-7 px-2 hover:bg-green-500/10"
                              onClick={() => rateMessage(message.id, 'thumbs_up')}
                            >
                              <ThumbsUp className="w-3 h-3" />
                            </Button>
                            <Button
                              variant={message.rating === 'thumbs_down' ? 'destructive' : 'ghost'}
                              size="sm"
                              className="h-7 px-2 hover:bg-red-500/10"
                              onClick={() => rateMessage(message.id, 'thumbs_down')}
                            >
                              <ThumbsDown className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <div className="space-y-3 pt-3 border-t border-border/50">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything - I'll automatically choose the best model..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                disabled={isLoading}
                className="min-h-[44px] max-h-32 resize-none pr-12 rounded-2xl border-border/50 focus:border-primary/50"
                rows={1}
              />
              {isLoading && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
            <Button 
              onClick={handleSendMessage} 
              disabled={isLoading || !input.trim()}
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 rounded-2xl px-6 shadow-lg"
              size="lg"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
          
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Press Enter to send, Shift+Enter for new line</span>
            <div className="flex items-center gap-2">
              <span>Powered by</span>
              <Badge variant="outline" className="text-xs">Gemini AI</Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};