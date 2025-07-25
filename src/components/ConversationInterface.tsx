
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Send, 
  Brain, 
  Sparkles, 
  Clock, 
  Zap,
  MessageSquare,
  Bot,
  AlertCircle,
  DollarSign,
  Activity
} from 'lucide-react';
import { EnhancedGeminiFramework } from '@/lib/gemini-framework';

interface ConversationInterfaceProps {
  framework: EnhancedGeminiFramework;
  onStatsUpdate: () => void;
}

interface Message {
  id: string;
  type: 'user' | 'ai' | 'error';
  content: string;
  timestamp: Date;
  profundityScore?: number;
  modelUsed?: string;
  processingTime?: number;
  tokensUsed?: number;
  costEstimate?: number;
  error?: string;
}

export const ConversationInterface: React.FC<ConversationInterfaceProps> = ({
  framework,
  onStatsUpdate
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [sessionId] = useState(`session_${Date.now()}`);

  const handleSendMessage = async () => {
    if (!input.trim() || isProcessing) return;

    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      type: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsProcessing(true);

    try {
      // Use real API call
      const result = await framework.processRequest(
        userMessage.content,
        sessionId,
        'user_demo'
      );

      const aiMessage: Message = {
        id: `msg_${Date.now() + 1}`,
        type: 'ai',
        content: result.main_response,
        timestamp: new Date(),
        profundityScore: result.profundity_score,
        modelUsed: result.model_used,
        processingTime: result.response_time,
        tokensUsed: result.actual_tokens_used,
        costEstimate: result.stats.costEstimate
      };

      setMessages(prev => [...prev, aiMessage]);
      onStatsUpdate();

    } catch (error) {
      console.error('Error processing message:', error);
      
      const errorMessage: Message = {
        id: `msg_error_${Date.now()}`,
        type: 'error',
        content: 'Sorry, I encountered an error processing your request.',
        timestamp: new Date(),
        error: error instanceof Error ? error.message : 'Unknown error'
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatCost = (cost: number) => {
    return cost < 0.01 ? '<$0.01' : `$${cost.toFixed(4)}`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Chat Interface */}
      <div className="lg:col-span-2">
        <Card className="h-[70vh] flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="w-5 h-5 text-primary" />
              <span>Live Gemini API Chat</span>
            </CardTitle>
            <CardDescription>
              Real-time conversation with intelligent model routing and token tracking
            </CardDescription>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col space-y-4">
            {/* Messages */}
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Start a conversation to test the real Gemini API</p>
                    <p className="text-sm mt-2">Ask complex questions to see intelligent routing!</p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] p-4 rounded-lg ${
                        message.type === 'user' 
                          ? 'bg-primary text-primary-foreground' 
                          : message.type === 'error'
                          ? 'bg-destructive/10 border border-destructive/20'
                          : 'bg-card border'
                      }`}>
                        <div className="flex items-start space-x-2">
                          {message.type === 'ai' && (
                            <Bot className="w-5 h-5 mt-1 text-primary" />
                          )}
                          {message.type === 'error' && (
                            <AlertCircle className="w-5 h-5 mt-1 text-destructive" />
                          )}
                          <div className="flex-1">
                            <p className="whitespace-pre-wrap">{message.content}</p>
                            
                            {message.type === 'error' && message.error && (
                              <Alert className="mt-2">
                                <AlertDescription className="text-xs">
                                  {message.error}
                                </AlertDescription>
                              </Alert>
                            )}
                            
                            <div className="flex items-center space-x-2 mt-2 text-xs opacity-70">
                              <Clock className="w-3 h-3" />
                              <span>{message.timestamp.toLocaleTimeString()}</span>
                              
                              {message.profundityScore !== undefined && (
                                <>
                                  <Separator orientation="vertical" className="h-3" />
                                  <Sparkles className="w-3 h-3" />
                                  <span>Profundity: {message.profundityScore}/100</span>
                                </>
                              )}
                              
                              {message.modelUsed && (
                                <>
                                  <Separator orientation="vertical" className="h-3" />
                                  <Zap className="w-3 h-3" />
                                  <span>{message.modelUsed}</span>
                                </>
                              )}
                              
                              {message.processingTime && (
                                <>
                                  <Separator orientation="vertical" className="h-3" />
                                  <span>{message.processingTime}ms</span>
                                </>
                              )}

                              {message.tokensUsed && (
                                <>
                                  <Separator orientation="vertical" className="h-3" />
                                  <Activity className="w-3 h-3" />
                                  <span>{message.tokensUsed} tokens</span>
                                </>
                              )}

                              {message.costEstimate && (
                                <>
                                  <Separator orientation="vertical" className="h-3" />
                                  <DollarSign className="w-3 h-3" />
                                  <span>{formatCost(message.costEstimate)}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
            
            {/* Input Area */}
            <div className="space-y-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything - I'll route to the best model based on complexity..."
                className="min-h-[80px] resize-none"
                disabled={isProcessing}
              />
              
              <div className="flex justify-between items-center">
                <div className="text-xs text-muted-foreground">
                  Press Enter to send, Shift+Enter for new line
                </div>
                
                <Button 
                  onClick={handleSendMessage}
                  disabled={!input.trim() || isProcessing}
                  variant="hero"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Analytics Sidebar */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Live Session Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Messages Sent</span>
                <Badge variant="secondary">{messages.filter(m => m.type === 'user').length}</Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span>AI Responses</span>
                <Badge variant="secondary">{messages.filter(m => m.type === 'ai').length}</Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span>Total Tokens</span>
                <Badge variant="neural">
                  {messages.reduce((sum, m) => sum + (m.tokensUsed || 0), 0).toLocaleString()}
                </Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span>Session Cost</span>
                <Badge variant="accent">
                  {formatCost(messages.reduce((sum, m) => sum + (m.costEstimate || 0), 0))}
                </Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span>Session ID</span>
                <Badge variant="outline" className="text-xs">{sessionId.slice(-8)}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Model Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {['gemini-1.5-pro', 'gemini-1.5-flash'].map(model => {
                const usage = messages.filter(m => m.modelUsed === model).length;
                const totalAI = messages.filter(m => m.type === 'ai').length;
                const percentage = totalAI > 0 ? (usage / totalAI) * 100 : 0;
                
                return (
                  <div key={model} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{model}</span>
                      <span>{usage} requests</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {percentage.toFixed(1)}% of total requests
                    </p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Avg Response Time</span>
                <Badge variant="memory">
                  {messages.filter(m => m.processingTime).length > 0 
                    ? Math.round(messages.reduce((sum, m) => sum + (m.processingTime || 0), 0) / messages.filter(m => m.processingTime).length)
                    : 0}ms
                </Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tokens per Request</span>
                <Badge variant="neural">
                  {messages.filter(m => m.tokensUsed).length > 0 
                    ? Math.round(messages.reduce((sum, m) => sum + (m.tokensUsed || 0), 0) / messages.filter(m => m.tokensUsed).length)
                    : 0}
                </Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span>Avg Profundity</span>
                <Badge variant="accent">
                  {messages.filter(m => m.profundityScore).length > 0 
                    ? Math.round(messages.reduce((sum, m) => sum + (m.profundityScore || 0), 0) / messages.filter(m => m.profundityScore).length)
                    : 0}/100
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
