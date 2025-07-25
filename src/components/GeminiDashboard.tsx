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
  Activity
} from 'lucide-react';
import { EnhancedGeminiFramework, type GeminiConfig, type SupabaseConfig } from '@/lib/gemini-framework';
import { ModelConfiguration } from './ModelConfiguration';
import { MemoryVisualization } from './MemoryVisualization';
import { MultimediaGenerator } from './MultimediaGenerator';
import { TokenAnalytics } from './TokenAnalytics';
import { ConversationInterface } from './ConversationInterface';

interface DashboardProps {
  geminiConfig?: GeminiConfig;
  supabaseConfig?: SupabaseConfig;
}

export const GeminiDashboard: React.FC<DashboardProps> = ({
  geminiConfig,
  supabaseConfig
}) => {
  const [framework, setFramework] = useState<EnhancedGeminiFramework | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [activeTab, setActiveTab] = useState('conversation');
  const [stats, setStats] = useState({
    totalTokensUsed: 0,
    cachedTokens: 0,
    totalRequests: 0,
    cacheEfficiency: 0
  });

  // Initialize framework
  useEffect(() => {
    if (geminiConfig && supabaseConfig) {
      const fw = new EnhancedGeminiFramework(geminiConfig, supabaseConfig);
      setFramework(fw);
      
      // Initialize with default tiers
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
      
      fw.initializeTiers(defaultTiers.tier1, defaultTiers.tier2, defaultTiers.tier3)
        .then(() => {
          setIsInitialized(true);
          updateStats(fw);
        });
    }
  }, [geminiConfig, supabaseConfig]);

  const updateStats = (fw: EnhancedGeminiFramework) => {
    const currentStats = fw.getStats();
    setStats({
      totalTokensUsed: currentStats.totalTokensUsed,
      cachedTokens: currentStats.cachedTokens,
      totalRequests: Math.floor(currentStats.totalTokensUsed / 100), // Mock calculation
      cacheEfficiency: currentStats.cachedTokens > 0 
        ? Math.round((currentStats.cachedTokens / Math.max(currentStats.totalTokensUsed, 1)) * 100)
        : 0
    });
  };

  if (!framework) {
    return (
      <div className="min-h-screen hero-gradient flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-neural rounded-full flex items-center justify-center">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="gradient-text text-2xl">Gemini LLM Framework</CardTitle>
            <CardDescription>Configure your API credentials to begin</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Gemini API Key</Label>
              <Input placeholder="Enter your Gemini API key" type="password" />
            </div>
            <div className="space-y-2">
              <Label>Supabase URL</Label>
              <Input placeholder="https://your-project.supabase.co" />
            </div>
            <div className="space-y-2">
              <Label>Supabase Anon Key</Label>
              <Input placeholder="Enter your Supabase anon key" type="password" />
            </div>
            <Button variant="hero" className="w-full" size="lg">
              <Zap className="w-4 h-4 mr-2" />
              Initialize Framework
            </Button>
          </CardContent>
        </Card>
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
            
            {/* Status Indicators */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                <span className="text-sm text-success">Framework Active</span>
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
                  <Gauge className="w-4 h-4 text-accent" />
                  <span>{stats.cacheEfficiency}% efficiency</span>
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
            <ConversationInterface 
              framework={framework} 
              onStatsUpdate={() => updateStats(framework)}
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
                  Advanced settings for your Gemini LLM framework
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold">Cache Settings</h3>
                    <div className="space-y-2">
                      <Label>Cache Retention (hours)</Label>
                      <Input defaultValue="24" type="number" />
                    </div>
                    <div className="space-y-2">
                      <Label>Max Cache Size (MB)</Label>
                      <Input defaultValue="100" type="number" />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold">Performance</h3>
                    <div className="space-y-2">
                      <Label>Concurrent Requests</Label>
                      <Input defaultValue="5" type="number" />
                    </div>
                    <div className="space-y-2">
                      <Label>Timeout (seconds)</Label>
                      <Input defaultValue="30" type="number" />
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex space-x-4">
                  <Button variant="neural">
                    <Database className="w-4 h-4 mr-2" />
                    Clear Cache
                  </Button>
                  <Button variant="memory">
                    <HardDrive className="w-4 h-4 mr-2" />
                    Export Memory
                  </Button>
                  <Button variant="glass">
                    <Settings className="w-4 h-4 mr-2" />
                    Reset Framework
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