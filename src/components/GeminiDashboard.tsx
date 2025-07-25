
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Brain, 
  Cpu, 
  Database, 
  Image, 
  Video, 
  BarChart3, 
  Box, 
  Settings, 
  Zap,
  HardDrive,
  Timer,
  Gauge,
  Activity,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { EnhancedGeminiFramework, type GeminiConfig, type SupabaseConfig } from '@/lib/gemini-framework';
import { ModelConfiguration } from './ModelConfiguration';
import { MemoryVisualization } from './MemoryVisualization';
import { MultimediaGenerator } from './MultimediaGenerator';
import { TokenAnalytics } from './TokenAnalytics';
import { ConversationInterface } from './ConversationInterface';
import { EnhancedConversationInterface } from './EnhancedConversationInterface';

interface DashboardProps {
  geminiConfig?: GeminiConfig;
  supabaseConfig?: SupabaseConfig;
}

export const GeminiDashboard: React.FC<DashboardProps> = ({
  geminiConfig: initialGeminiConfig,
  supabaseConfig
}) => {
  const [framework, setFramework] = useState<EnhancedGeminiFramework | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [activeTab, setActiveTab] = useState('conversation');
  const [geminiApiKey, setGeminiApiKey] = useState(initialGeminiConfig?.apiKey || '');
  const [supabaseUrl, setSupabaseUrl] = useState(supabaseConfig?.url || '');
  const [supabaseKey, setSupabaseKey] = useState(supabaseConfig?.anonKey || '');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected');
  const [errorMessage, setErrorMessage] = useState('');
  const [stats, setStats] = useState({
    totalTokensUsed: 0,
    cachedTokens: 0,
    totalRequests: 0,
    cacheEfficiency: 0,
    averageResponseTime: 0,
    costEstimate: 0
  });

  const connectGemini = async () => {
    if (!geminiApiKey.trim()) {
      setErrorMessage('Please enter your Gemini API key');
      return;
    }

    setIsConnecting(true);
    setConnectionStatus('connecting');
    setErrorMessage('');

    try {
      // Create Supabase config if provided
      const supabaseConfig = (supabaseUrl && supabaseKey) ? {
        url: supabaseUrl,
        anonKey: supabaseKey
      } : undefined;

      // Create framework with API key and optional Supabase
      const fw = new EnhancedGeminiFramework(
        { apiKey: geminiApiKey.trim() },
        supabaseConfig
      );

      // Test the connection by initializing tiers
      const defaultTiers = {
        tier1: `TIER 1 - FOUNDATIONAL CONTEXT:
You are an advanced AI assistant with deep knowledge across multiple domains.
Always provide accurate, helpful, and thoughtful responses.
Consider the user's intent and provide comprehensive yet concise answers.`,
        
        tier2: `TIER 2 - ANALYTICAL FRAMEWORK:
When analyzing complex topics, consider multiple perspectives and methodologies.
Break down problems systematically and provide evidence-based reasoning.
Acknowledge uncertainties and limitations where appropriate.`,
        
        tier3: `TIER 3 - RESPONSE OPTIMIZATION:
Structure your response for maximum clarity and usefulness.
Use examples, analogies, or illustrations when they enhance understanding.
Tailor the complexity of your explanation to match the question's sophistication.`
      };

      const initialized = await fw.initializeTiers(
        defaultTiers.tier1, 
        defaultTiers.tier2, 
        defaultTiers.tier3
      );

      if (initialized) {
        setFramework(fw);
        setIsInitialized(true);
        setConnectionStatus('connected');
        updateStats(fw);
      } else {
        throw new Error('Failed to initialize tiers');
      }
    } catch (error) {
      console.error('Connection error:', error);
      setConnectionStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to connect to Gemini API');
    } finally {
      setIsConnecting(false);
    }
  };

  const updateStats = (fw: EnhancedGeminiFramework) => {
    const currentStats = fw.getStats();
    setStats({
      totalTokensUsed: currentStats.totalTokensUsed,
      cachedTokens: currentStats.cachedTokens,
      totalRequests: currentStats.totalRequests,
      averageResponseTime: currentStats.averageResponseTime,
      costEstimate: currentStats.costEstimate,
      cacheEfficiency: currentStats.cachedTokens > 0 
        ? Math.round((currentStats.cachedTokens / Math.max(currentStats.totalTokensUsed, 1)) * 100)
        : 0
    });
  };

  const connectSupabase = async () => {
    // This would trigger a reconnection with Supabase included
    await connectGemini();
  };

  // Auto-connect if API key is provided
  useEffect(() => {
    if (initialGeminiConfig?.apiKey && !framework) {
      connectGemini();
    }
  }, [initialGeminiConfig?.apiKey]);

  if (!framework || !isInitialized) {
    return (
      <div className="min-h-screen hero-gradient flex items-center justify-center p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full max-w-4xl">
          {/* Gemini API Configuration */}
          <Card className="backdrop-blur-md bg-card/80 border-border/50">
            <CardHeader className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl">Connect to Gemini</CardTitle>
              <CardDescription>
                Enter your API key to unlock AI capabilities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="api-key">Gemini API Key</Label>
                <div className="relative">
                  <Input
                    id="api-key"
                    type={showApiKey ? "text" : "password"}
                    placeholder="Enter your Gemini API key (AIza...)"
                    value={geminiApiKey}
                    onChange={(e) => setGeminiApiKey(e.target.value)}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowApiKey(!showApiKey)}
                  >
                    {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

            {errorMessage && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}

            {connectionStatus === 'connected' && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>Successfully connected to Gemini API!</AlertDescription>
              </Alert>
            )}

              <Button 
                onClick={connectGemini} 
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                disabled={!geminiApiKey}
              >
                <Brain className="w-4 h-4 mr-2" />
                Connect to Gemini
              </Button>
              <div className="text-xs text-muted-foreground text-center mt-2">
                Get your API key from{' '}
                <a 
                  href="https://makersuite.google.com/app/apikey" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Google AI Studio
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Supabase Configuration */}
          <Card className="backdrop-blur-md bg-card/80 border-border/50">
            <CardHeader className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                <Database className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl">Connect to Supabase</CardTitle>
              <CardDescription>
                Enable conversation history and analytics (optional)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Supabase Project URL
                </label>
                <Input
                  type="url"
                  placeholder="https://your-project.supabase.co"
                  value={supabaseUrl}
                  onChange={(e) => setSupabaseUrl(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Supabase Anon Key
                </label>
                <Input
                  type="password"
                  placeholder="Your Supabase anon key"
                  value={supabaseKey}
                  onChange={(e) => setSupabaseKey(e.target.value)}
                />
              </div>
              <Button 
                onClick={connectSupabase} 
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                disabled={!supabaseUrl || !supabaseKey || !geminiApiKey}
              >
                <Database className="w-4 h-4 mr-2" />
                Connect & Setup Database
              </Button>
              <div className="text-xs text-muted-foreground text-center mt-2">
                This will create tables and add sample data automatically
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Error/Success Messages */}
        {errorMessage && (
          <div className="fixed bottom-6 right-6 max-w-md">
            <Alert variant="destructive" className="backdrop-blur-md bg-card/90">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          </div>
        )}

        {connectionStatus === 'connected' && (
          <div className="fixed bottom-6 right-6 max-w-md">
            <Alert className="backdrop-blur-md bg-card/90">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>Successfully connected to Gemini API!</AlertDescription>
            </Alert>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen hero-gradient">
      {/* Header */}
      <div className="border-b border-border/50 backdrop-blur-md bg-card/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-neural rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold gradient-text">Gemini LLM Framework</h1>
                <p className="text-sm text-muted-foreground">
                  Advanced AI with Memory & Multimedia Generation
                </p>
              </div>
            </div>
            
            {/* Real-time Status Indicators */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                <span className="text-sm text-success">API Connected</span>
              </div>
              
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <Database className="w-4 h-4 text-primary" />
                  <span>{stats.cachedTokens.toLocaleString()} cached</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Activity className="w-4 h-4 text-memory" />
                  <span>{stats.totalRequests} requests</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Timer className="w-4 h-4 text-accent" />
                  <span>{stats.averageResponseTime}ms avg</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Gauge className="w-4 h-4 text-neural" />
                  <span>${stats.costEstimate.toFixed(4)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-card/20 backdrop-blur-md">
            <TabsTrigger value="conversation" className="flex items-center space-x-2">
              <Brain className="w-4 h-4" />
              <span>Chat</span>
            </TabsTrigger>
            <TabsTrigger value="memory" className="flex items-center space-x-2">
              <HardDrive className="w-4 h-4" />
              <span>Memory</span>
            </TabsTrigger>
            <TabsTrigger value="multimedia" className="flex items-center space-x-2">
              <Image className="w-4 h-4" />
              <span>Media</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="models" className="flex items-center space-x-2">
              <Cpu className="w-4 h-4" />
              <span>Models</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="conversation" className="space-y-6">
            <EnhancedConversationInterface 
              framework={framework}
            />
          </TabsContent>

          <TabsContent value="memory" className="space-y-6">
            <MemoryVisualization framework={framework} />
          </TabsContent>

          <TabsContent value="multimedia" className="space-y-6">
            <MultimediaGenerator 
              framework={framework}
              onGenerate={(requests) => framework.generateMultimedia(requests)}
            />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <TokenAnalytics framework={framework} />
          </TabsContent>

          <TabsContent value="models" className="space-y-6">
            <ModelConfiguration />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Framework Configuration</CardTitle>
                <CardDescription>
                  Manage your Gemini LLM framework settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold">API Configuration</h3>
                    <div className="space-y-2">
                      <Label>Current API Key</Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          type="password"
                          value={geminiApiKey}
                          readOnly
                          className="flex-1"
                        />
                        <Badge variant="neural">Connected</Badge>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Cache Efficiency</Label>
                      <Progress value={stats.cacheEfficiency} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        {stats.cacheEfficiency}% of requests use cached content
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold">Usage Statistics</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">Total Tokens</span>
                        <Badge variant="secondary">{stats.totalTokensUsed.toLocaleString()}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Total Requests</span>
                        <Badge variant="secondary">{stats.totalRequests}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Average Response Time</span>
                        <Badge variant="secondary">{stats.averageResponseTime}ms</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Estimated Cost</span>
                        <Badge variant="accent">${stats.costEstimate.toFixed(4)}</Badge>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex space-x-4">
                  <Button 
                    variant="neural"
                    onClick={() => {
                      framework.clearCache();
                      updateStats(framework);
                    }}
                  >
                    <Database className="w-4 h-4 mr-2" />
                    Clear Cache
                  </Button>
                  <Button variant="memory">
                    <HardDrive className="w-4 h-4 mr-2" />
                    Export Data
                  </Button>
                  <Button 
                    variant="glass"
                    onClick={() => {
                      setFramework(null);
                      setIsInitialized(false);
                      setConnectionStatus('disconnected');
                    }}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Disconnect
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
