import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Cpu, 
  Gauge, 
  Settings, 
  Zap, 
  Brain,
  Image,
  Video,
  FileText,
  Code,
  Sparkles
} from 'lucide-react';

interface ModelConfig {
  name: string;
  temperature: number;
  maxTokens: number;
  topP: number;
  frequencyPenalty: number;
  presencePenalty: number;
  enabled: boolean;
}

export const ModelConfiguration: React.FC = () => {
  const [models, setModels] = useState<Record<string, ModelConfig>>({
    'gemini-2.5-flash': {
      name: 'Gemini 2.5 Flash',
      temperature: 0.7,
      maxTokens: 2048,
      topP: 0.9,
      frequencyPenalty: 0.1,
      presencePenalty: 0.1,
      enabled: true
    },
    'gemini-2.0-flash': {
      name: 'Gemini 2.0 Flash',
      temperature: 0.5,
      maxTokens: 1024,
      topP: 0.8,
      frequencyPenalty: 0.0,
      presencePenalty: 0.0,
      enabled: true
    },
    'gemini-pro': {
      name: 'Gemini Pro',
      temperature: 0.9,
      maxTokens: 4096,
      topP: 0.95,
      frequencyPenalty: 0.2,
      presencePenalty: 0.2,
      enabled: false
    }
  });

  const [selectedModel, setSelectedModel] = useState('gemini-2.5-flash');

  const updateModelConfig = (modelKey: string, field: keyof ModelConfig, value: any) => {
    setModels(prev => ({
      ...prev,
      [modelKey]: {
        ...prev[modelKey],
        [field]: value
      }
    }));
  };

  const currentModel = models[selectedModel];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Model Selection */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Cpu className="w-5 h-5 text-primary" />
              <span>Available Models</span>
            </CardTitle>
            <CardDescription>
              Select and configure your Gemini models
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(models).map(([key, model]) => (
              <div 
                key={key}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedModel === key 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => setSelectedModel(key)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{model.name}</h3>
                  <Switch 
                    checked={model.enabled}
                    onCheckedChange={(checked) => updateModelConfig(key, 'enabled', checked)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Gauge className="w-3 h-3" />
                  <span>Temp: {model.temperature}</span>
                  <Separator orientation="vertical" className="h-3" />
                  <span>Max: {model.maxTokens}</span>
                </div>
                {key.includes('2.5') && (
                  <Badge variant="neural" className="mt-2 text-xs">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Thinking Mode
                  </Badge>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Model Capabilities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-primary" />
                  <span className="text-sm">Text Generation</span>
                </div>
                <Badge variant="secondary">All Models</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Image className="w-4 h-4 text-neural" />
                  <span className="text-sm">Image Analysis</span>
                </div>
                <Badge variant="neural">Gemini Pro</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Video className="w-4 h-4 text-memory" />
                  <span className="text-sm">Video Processing</span>
                </div>
                <Badge variant="memory">Gemini Pro</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Code className="w-4 h-4 text-accent" />
                  <span className="text-sm">Code Generation</span>
                </div>
                <Badge variant="secondary">All Models</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Model Configuration Panel */}
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="w-5 h-5 text-primary" />
              <span>Configure {currentModel.name}</span>
            </CardTitle>
            <CardDescription>
              Fine-tune parameters for optimal performance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Temperature */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="temperature">Temperature</Label>
                <Badge variant="outline">{currentModel.temperature}</Badge>
              </div>
              <Slider
                id="temperature"
                min={0}
                max={2}
                step={0.1}
                value={[currentModel.temperature]}
                onValueChange={(value) => updateModelConfig(selectedModel, 'temperature', value[0])}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Controls randomness. Lower values make output more focused and deterministic.
              </p>
            </div>

            {/* Max Tokens */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="maxTokens">Max Output Tokens</Label>
                <Badge variant="outline">{currentModel.maxTokens}</Badge>
              </div>
              <Slider
                id="maxTokens"
                min={256}
                max={8192}
                step={256}
                value={[currentModel.maxTokens]}
                onValueChange={(value) => updateModelConfig(selectedModel, 'maxTokens', value[0])}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Maximum number of tokens in the response.
              </p>
            </div>

            {/* Top P */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="topP">Top P (Nucleus Sampling)</Label>
                <Badge variant="outline">{currentModel.topP}</Badge>
              </div>
              <Slider
                id="topP"
                min={0}
                max={1}
                step={0.05}
                value={[currentModel.topP]}
                onValueChange={(value) => updateModelConfig(selectedModel, 'topP', value[0])}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Controls diversity via nucleus sampling. 0.9 means only tokens comprising the top 90% probability mass are considered.
              </p>
            </div>

            {/* Frequency Penalty */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="frequencyPenalty">Frequency Penalty</Label>
                <Badge variant="outline">{currentModel.frequencyPenalty}</Badge>
              </div>
              <Slider
                id="frequencyPenalty"
                min={-2}
                max={2}
                step={0.1}
                value={[currentModel.frequencyPenalty]}
                onValueChange={(value) => updateModelConfig(selectedModel, 'frequencyPenalty', value[0])}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Reduces likelihood of repeating tokens based on their frequency in the text so far.
              </p>
            </div>

            {/* Presence Penalty */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="presencePenalty">Presence Penalty</Label>
                <Badge variant="outline">{currentModel.presencePenalty}</Badge>
              </div>
              <Slider
                id="presencePenalty"
                min={-2}
                max={2}
                step={0.1}
                value={[currentModel.presencePenalty]}
                onValueChange={(value) => updateModelConfig(selectedModel, 'presencePenalty', value[0])}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Reduces likelihood of repeating any token that has appeared in the text so far.
              </p>
            </div>

            <Separator />

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <Button variant="hero" className="flex-1">
                <Zap className="w-4 h-4 mr-2" />
                Apply Configuration
              </Button>
              <Button variant="glass">
                <Settings className="w-4 h-4 mr-2" />
                Reset to Defaults
              </Button>
              <Button variant="outline">
                Export Config
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Model Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Avg Response Time</p>
                <p className="text-2xl font-bold text-primary">1.2s</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Tokens/Second</p>
                <p className="text-2xl font-bold text-neural">150</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Success Rate</p>
                <p className="text-2xl font-bold text-accent">99.8%</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Total Requests</p>
                <p className="text-2xl font-bold text-memory">1,247</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};