import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Send, 
  Brain, 
  Sparkles, 
  Clock, 
  Zap,
  MessageSquare,
  Bot
} from 'lucide-react';
import { EnhancedGeminiFramework } from '@/lib/gemini-framework';

interface ConversationInterfaceProps {
  framework: EnhancedGeminiFramework;
  onStatsUpdate: () => void;
}

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  profundityScore?: number;
  modelUsed?: string;
  processingTime?: number;
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
      const startTime = Date.now();
      
      // Mock AI processing - in real implementation this would call framework methods
      const profundityAssessment = await framework.assessProfundity(userMessage.content);
      
      // Simulate AI response
      const mockResponse = `Based on your ${profundityAssessment.profundity_score > 50 ? 'profound' : 'straightforward'} question: "${userMessage.content}"

This is a mock response from the Gemini LLM Framework. In a real implementation, this would:

1. Route to ${profundityAssessment.profundity_score > 50 ? 'Gemini 2.5 Flash' : 'Gemini 2.0 Flash'} based on profundity score (${profundityAssessment.profundity_score}/100)
2. Use cached tier prompts for context
3. Generate memory annotations
4. Store conversation in Supabase

${profundityAssessment.reasoning}`;

      const aiMessage: Message = {
        id: `msg_${Date.now() + 1}`,
        type: 'ai',
        content: mockResponse,
        timestamp: new Date(),
        profundityScore: profundityAssessment.profundity_score,
        modelUsed: profundityAssessment.profundity_score > 50 ? 'gemini-2.5-flash' : 'gemini-2.0-flash',
        processingTime: Date.now() - startTime
      };

      setMessages(prev => [...prev, aiMessage]);
      
      // Store conversation (mock)
      await framework.storeConversation(
        'user_demo',
        sessionId,
        userMessage.content,
        aiMessage.content,
        aiMessage.modelUsed!,
        { input_tokens: 100, output_tokens: 150 }
      );

      onStatsUpdate();
    } catch (error) {
      console.error('Error processing message:', error);
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Chat Interface */}
      <div className="lg:col-span-2">
        <Card className="h-[70vh] flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="w-5 h-5 text-primary" />
              <span>Gemini LLM Conversation</span>
            </CardTitle>
            <CardDescription>
              Intelligent routing with memory annotation and caching
            </CardDescription>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col space-y-4">
            {/* Messages */}
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Start a conversation to see the framework in action</p>
                    <p className="text-sm mt-2">Try asking a complex philosophical question!</p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] p-4 rounded-lg ${
                        message.type === 'user' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-card border'
                      }`}>
                        <div className="flex items-start space-x-2">
                          {message.type === 'ai' && (
                            <Bot className="w-5 h-5 mt-1 text-primary" />
                          )}
                          <div className="flex-1">
                            <p className="whitespace-pre-wrap">{message.content}</p>
                            
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
                placeholder="Ask me anything - complex questions will route to more powerful models..."
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

      {/* Conversation Analytics Sidebar */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Session Analytics</CardTitle>
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
              {['gemini-2.5-flash', 'gemini-2.0-flash'].map(model => {
                const usage = messages.filter(m => m.modelUsed === model).length;
                return (
                  <div key={model} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{model}</span>
                      <span>{usage}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ 
                          width: `${messages.length > 0 ? (usage / messages.filter(m => m.type === 'ai').length) * 100 : 0}%` 
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};