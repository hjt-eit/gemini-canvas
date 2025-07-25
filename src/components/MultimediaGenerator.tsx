import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Image, 
  Video, 
  BarChart3, 
  Box, 
  Music,
  FileText,
  Download,
  Play,
  Sparkles,
  Wand2
} from 'lucide-react';
import { EnhancedGeminiFramework, type MultimediaRequest } from '@/lib/gemini-framework';
import { PlotlyVisualization } from './PlotlyVisualization';
import { ThreeJSVisualization } from './ThreeJSVisualization';

interface MultimediaGeneratorProps {
  framework: EnhancedGeminiFramework;
  onGenerate: (requests: MultimediaRequest[]) => Promise<any[]>;
}

export const MultimediaGenerator: React.FC<MultimediaGeneratorProps> = ({
  framework,
  onGenerate
}) => {
  const [activeTab, setActiveTab] = useState('image');
  const [requests, setRequests] = useState<MultimediaRequest[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<any[]>([]);
  
  const [imageConfig, setImageConfig] = useState({
    prompt: '',
    width: 512,
    height: 512,
    style: 'realistic'
  });

  const [videoConfig, setVideoConfig] = useState({
    prompt: '',
    duration: 10,
    format: 'mp4'
  });

  const [plotlyConfig, setPlotlyConfig] = useState({
    prompt: 'Create a scatter plot showing sales data',
    chartType: 'scatter'
  });

  const [threejsConfig, setThreejsConfig] = useState({
    prompt: 'Create a network graph with interconnected nodes',
    sceneType: 'network'
  });

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    try {
      const newRequests: MultimediaRequest[] = [];
      
      switch (activeTab) {
        case 'image':
          if (imageConfig.prompt) {
            newRequests.push({
              type: 'image',
              prompt: imageConfig.prompt,
              config: {
                width: imageConfig.width,
                height: imageConfig.height,
                style: imageConfig.style
              }
            });
          }
          break;
          
        case 'video':
          if (videoConfig.prompt) {
            newRequests.push({
              type: 'video',
              prompt: videoConfig.prompt,
              config: {
                duration: videoConfig.duration,
                format: videoConfig.format
              }
            });
          }
          break;
          
        case 'plotly':
          if (plotlyConfig.prompt) {
            newRequests.push({
              type: 'plotly',
              prompt: plotlyConfig.prompt
            });
          }
          break;
          
        case 'threejs':
          if (threejsConfig.prompt) {
            newRequests.push({
              type: 'threejs',
              prompt: threejsConfig.prompt
            });
          }
          break;
      }
      
      if (newRequests.length > 0) {
        const results = await onGenerate(newRequests);
        setGeneratedContent(prev => [...prev, ...results]);
        setRequests(prev => [...prev, ...newRequests]);
      }
    } catch (error) {
      console.error('Error generating multimedia:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Generation Controls */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Wand2 className="w-5 h-5 text-primary" />
              <span>Multimedia Generator</span>
            </CardTitle>
            <CardDescription>
              Generate images, videos, and interactive visualizations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="image" className="flex items-center space-x-2">
                  <Image className="w-4 h-4" />
                  <span>Image</span>
                </TabsTrigger>
                <TabsTrigger value="video" className="flex items-center space-x-2">
                  <Video className="w-4 h-4" />
                  <span>Video</span>
                </TabsTrigger>
                <TabsTrigger value="plotly" className="flex items-center space-x-2">
                  <BarChart3 className="w-4 h-4" />
                  <span>Charts</span>
                </TabsTrigger>
                <TabsTrigger value="threejs" className="flex items-center space-x-2">
                  <Box className="w-4 h-4" />
                  <span>3D</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="image" className="space-y-4">
                <div className="space-y-2">
                  <Label>Image Description</Label>
                  <Textarea
                    placeholder="Describe the image you want to generate..."
                    value={imageConfig.prompt}
                    onChange={(e) => setImageConfig(prev => ({ ...prev, prompt: e.target.value }))}
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Width</Label>
                    <Input
                      type="number"
                      value={imageConfig.width}
                      onChange={(e) => setImageConfig(prev => ({ ...prev, width: parseInt(e.target.value) }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Height</Label>
                    <Input
                      type="number"
                      value={imageConfig.height}
                      onChange={(e) => setImageConfig(prev => ({ ...prev, height: parseInt(e.target.value) }))}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Style</Label>
                  <Select value={imageConfig.style} onValueChange={(value) => setImageConfig(prev => ({ ...prev, style: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="realistic">Realistic</SelectItem>
                      <SelectItem value="artistic">Artistic</SelectItem>
                      <SelectItem value="cartoon">Cartoon</SelectItem>
                      <SelectItem value="abstract">Abstract</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>

              <TabsContent value="video" className="space-y-4">
                <div className="space-y-2">
                  <Label>Video Description</Label>
                  <Textarea
                    placeholder="Describe the video you want to generate..."
                    value={videoConfig.prompt}
                    onChange={(e) => setVideoConfig(prev => ({ ...prev, prompt: e.target.value }))}
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Duration (seconds)</Label>
                    <Input
                      type="number"
                      value={videoConfig.duration}
                      onChange={(e) => setVideoConfig(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Format</Label>
                    <Select value={videoConfig.format} onValueChange={(value) => setVideoConfig(prev => ({ ...prev, format: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mp4">MP4</SelectItem>
                        <SelectItem value="webm">WebM</SelectItem>
                        <SelectItem value="gif">GIF</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="plotly" className="space-y-4">
                <div className="space-y-2">
                  <Label>Chart Description</Label>
                  <Textarea
                    placeholder="Describe the chart or visualization you want..."
                    value={plotlyConfig.prompt}
                    onChange={(e) => setPlotlyConfig(prev => ({ ...prev, prompt: e.target.value }))}
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Chart Type</Label>
                  <Select value={plotlyConfig.chartType} onValueChange={(value) => setPlotlyConfig(prev => ({ ...prev, chartType: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="scatter">Scatter Plot</SelectItem>
                      <SelectItem value="bar">Bar Chart</SelectItem>
                      <SelectItem value="line">Line Chart</SelectItem>
                      <SelectItem value="pie">Pie Chart</SelectItem>
                      <SelectItem value="heatmap">Heatmap</SelectItem>
                      <SelectItem value="3d">3D Surface</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>

              <TabsContent value="threejs" className="space-y-4">
                <div className="space-y-2">
                  <Label>3D Scene Description</Label>
                  <Textarea
                    placeholder="Describe the 3D scene or visualization..."
                    value={threejsConfig.prompt}
                    onChange={(e) => setThreejsConfig(prev => ({ ...prev, prompt: e.target.value }))}
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Scene Type</Label>
                  <Select value={threejsConfig.sceneType} onValueChange={(value) => setThreejsConfig(prev => ({ ...prev, sceneType: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="network">Network Graph</SelectItem>
                      <SelectItem value="particles">Particle System</SelectItem>
                      <SelectItem value="geometry">Geometric Objects</SelectItem>
                      <SelectItem value="terrain">Terrain/Landscape</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>
            </Tabs>

            <Button 
              onClick={handleGenerate} 
              disabled={isGenerating}
              variant="hero" 
              className="w-full mt-6"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Generation History */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Generation History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {requests.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No generations yet. Create your first multimedia content!
                </p>
              ) : (
                requests.map((request, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                    <div className="flex items-center space-x-2">
                      {request.type === 'image' && <Image className="w-4 h-4" />}
                      {request.type === 'video' && <Video className="w-4 h-4" />}
                      {request.type === 'plotly' && <BarChart3 className="w-4 h-4" />}
                      {request.type === 'threejs' && <Box className="w-4 h-4" />}
                      <span className="text-sm">{request.type}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {new Date().toLocaleTimeString()}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Generated Content Display */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <span>Generated Content</span>
            </CardTitle>
            <CardDescription>
              Preview and download your generated multimedia
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {generatedContent.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Wand2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Generated content will appear here</p>
                  <p className="text-sm mt-2">Use the controls on the left to create multimedia content</p>
                </div>
              ) : (
                generatedContent.map((content, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    {content.type === 'image' && content.url && (
                      <div className="space-y-2">
                        <img 
                          src={content.url} 
                          alt="Generated" 
                          className="w-full rounded-lg"
                        />
                        <div className="flex justify-between items-center">
                          <Badge variant="secondary">{content.type}</Badge>
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    {content.type === 'plotly' && content.data && (
                      <div className="space-y-2">
                        <PlotlyVisualization data={content.data} />
                        <div className="flex justify-between items-center">
                          <Badge variant="secondary">{content.type}</Badge>
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-2" />
                            Export Data
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    {content.type === 'threejs' && content.data && (
                      <div className="space-y-2">
                        <ThreeJSVisualization data={content.data} />
                        <div className="flex justify-between items-center">
                          <Badge variant="secondary">{content.type}</Badge>
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-2" />
                            Export Scene
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    {content.type === 'video' && content.url && (
                      <div className="space-y-2">
                        <video 
                          src={content.url} 
                          controls 
                          className="w-full rounded-lg"
                        />
                        <div className="flex justify-between items-center">
                          <Badge variant="secondary">{content.type}</Badge>
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};