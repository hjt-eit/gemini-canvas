import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity, 
  TrendingUp, 
  Database, 
  Zap,
  Clock,
  DollarSign,
  BarChart3,
  PieChart,
  Target
} from 'lucide-react';
import { EnhancedGeminiFramework } from '@/lib/gemini-framework';

interface TokenAnalyticsProps {
  framework: EnhancedGeminiFramework;
}

interface AnalyticsData {
  totalTokens: number;
  cachedTokens: number;
  inputTokens: number;
  outputTokens: number;
  costEstimate: number;
  efficiency: number;
  dailyUsage: Array<{ date: string; tokens: number; cost: number }>;
  modelUsage: Array<{ model: string; tokens: number; requests: number }>;
}

export const TokenAnalytics: React.FC<TokenAnalyticsProps> = ({
  framework
}) => {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalTokens: 0,
    cachedTokens: 0,
    inputTokens: 0,
    outputTokens: 0,
    costEstimate: 0,
    efficiency: 0,
    dailyUsage: [],
    modelUsage: []
  });

  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('24h');

  useEffect(() => {
    // Mock analytics data - in real implementation, this would come from the framework
    const stats = framework.getStats();
    
    const mockAnalytics: AnalyticsData = {
      totalTokens: stats.totalTokensUsed || 15420,
      cachedTokens: stats.cachedTokens || 5830,
      inputTokens: 8420,
      outputTokens: 7000,
      costEstimate: 0.23,
      efficiency: stats.cachedTokens > 0 ? Math.round((stats.cachedTokens / Math.max(stats.totalTokensUsed, 1)) * 100) : 37,
      dailyUsage: [
        { date: '2024-01-20', tokens: 2340, cost: 0.04 },
        { date: '2024-01-21', tokens: 3120, cost: 0.05 },
        { date: '2024-01-22', tokens: 2890, cost: 0.05 },
        { date: '2024-01-23', tokens: 4200, cost: 0.06 },
        { date: '2024-01-24', tokens: 2870, cost: 0.05 }
      ],
      modelUsage: [
        { model: 'gemini-2.5-flash', tokens: 8420, requests: 15 },
        { model: 'gemini-2.0-flash', tokens: 5200, requests: 28 },
        { model: 'gemini-pro', tokens: 1800, requests: 3 }
      ]
    };

    setAnalytics(mockAnalytics);
  }, [framework, timeRange]);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-primary">{formatNumber(analytics.totalTokens)}</p>
                <p className="text-xs text-muted-foreground">Total Tokens</p>
              </div>
              <Activity className="w-8 h-8 text-primary opacity-60" />
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Input: {formatNumber(analytics.inputTokens)}</span>
                <span>Output: {formatNumber(analytics.outputTokens)}</span>
              </div>
              <Progress 
                value={(analytics.inputTokens / analytics.totalTokens) * 100} 
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-neural">{formatNumber(analytics.cachedTokens)}</p>
                <p className="text-xs text-muted-foreground">Cached Tokens</p>
              </div>
              <Database className="w-8 h-8 text-neural opacity-60" />
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Cache Efficiency</span>
                <span>{analytics.efficiency}%</span>
              </div>
              <Progress 
                value={analytics.efficiency} 
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-accent">{formatCurrency(analytics.costEstimate)}</p>
                <p className="text-xs text-muted-foreground">Estimated Cost</p>
              </div>
              <DollarSign className="w-8 h-8 text-accent opacity-60" />
            </div>
            <div className="mt-4">
              <div className="flex items-center space-x-1">
                <TrendingUp className="w-3 h-3 text-accent" />
                <span className="text-xs text-muted-foreground">+12% from last period</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-memory">{analytics.modelUsage.reduce((acc, m) => acc + m.requests, 0)}</p>
                <p className="text-xs text-muted-foreground">API Requests</p>
              </div>
              <Zap className="w-8 h-8 text-memory opacity-60" />
            </div>
            <div className="mt-4">
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3 text-memory" />
                <span className="text-xs text-muted-foreground">Avg: 1.2s response</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Usage Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              <span>Usage Trends</span>
            </CardTitle>
            <CardDescription>
              Token usage and cost trends over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={timeRange} onValueChange={(value) => setTimeRange(value as any)} className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="24h">24 Hours</TabsTrigger>
                <TabsTrigger value="7d">7 Days</TabsTrigger>
                <TabsTrigger value="30d">30 Days</TabsTrigger>
              </TabsList>
              
              <TabsContent value={timeRange} className="space-y-4">
                <div className="space-y-3">
                  {analytics.dailyUsage.map((day, index) => (
                    <div key={day.date} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-primary rounded-full" />
                        <span className="text-sm font-medium">
                          {new Date(day.date).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="text-muted-foreground">
                          {formatNumber(day.tokens)} tokens
                        </span>
                        <Badge variant="secondary">
                          {formatCurrency(day.cost)}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="pt-4 border-t">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-lg font-semibold text-primary">
                        {formatNumber(analytics.dailyUsage.reduce((acc, d) => acc + d.tokens, 0))}
                      </p>
                      <p className="text-xs text-muted-foreground">Total Tokens</p>
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-accent">
                        {formatCurrency(analytics.dailyUsage.reduce((acc, d) => acc + d.cost, 0))}
                      </p>
                      <p className="text-xs text-muted-foreground">Total Cost</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Model Usage Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <PieChart className="w-5 h-5 text-primary" />
              <span>Model Usage</span>
            </CardTitle>
            <CardDescription>
              Token distribution across different models
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {analytics.modelUsage.map((model, index) => {
              const percentage = (model.tokens / analytics.totalTokens) * 100;
              const avgTokensPerRequest = Math.round(model.tokens / model.requests);
              
              return (
                <div key={model.model} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${
                        index === 0 ? 'bg-primary' : 
                        index === 1 ? 'bg-neural' : 'bg-accent'
                      }`} />
                      <span className="font-medium text-sm">{model.model}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {model.requests} requests
                    </Badge>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{formatNumber(model.tokens)} tokens</span>
                      <span>{percentage.toFixed(1)}%</span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      Avg: {avgTokensPerRequest} tokens/request
                    </p>
                  </div>
                </div>
              );
            })}
            
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Cache Hit Rate</span>
                <div className="flex items-center space-x-2">
                  <Badge variant="neural" className="text-xs">
                    {analytics.efficiency}%
                  </Badge>
                  <Target className="w-4 h-4 text-neural" />
                </div>
              </div>
              <Progress value={analytics.efficiency} className="h-2 mt-2" />
              <p className="text-xs text-muted-foreground mt-1">
                Higher cache efficiency reduces API costs and improves response times
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cost Optimization Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-primary" />
            <span>Optimization Insights</span>
          </CardTitle>
          <CardDescription>
            Recommendations to improve efficiency and reduce costs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2 p-4 bg-primary/5 rounded-lg border border-primary/20">
              <div className="flex items-center space-x-2">
                <Database className="w-4 h-4 text-primary" />
                <span className="font-medium text-sm">Cache Optimization</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Your cache efficiency is {analytics.efficiency}%. Consider increasing cache retention for frequently used prompts.
              </p>
              <Badge variant="neural" className="text-xs">
                Potential 15% cost reduction
              </Badge>
            </div>
            
            <div className="space-y-2 p-4 bg-neural/5 rounded-lg border border-neural/20">
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-neural" />
                <span className="font-medium text-sm">Model Selection</span>
              </div>
              <p className="text-xs text-muted-foreground">
                {((analytics.modelUsage[0]?.tokens || 0) / analytics.totalTokens * 100).toFixed(0)}% of tokens use the most expensive model. Route simple queries to faster models.
              </p>
              <Badge variant="memory" className="text-xs">
                Potential 25% speed improvement
              </Badge>
            </div>
            
            <div className="space-y-2 p-4 bg-accent/5 rounded-lg border border-accent/20">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-accent" />
                <span className="font-medium text-sm">Usage Patterns</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Peak usage detected during business hours. Consider implementing request queuing for cost optimization.
              </p>
              <Badge variant="accent" className="text-xs">
                Potential 10% cost reduction
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};