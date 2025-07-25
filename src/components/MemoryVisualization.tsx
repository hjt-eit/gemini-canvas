import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  HardDrive, 
  Clock, 
  Brain, 
  Lightbulb, 
  Network,
  TrendingUp,
  Database,
  RefreshCw,
  Filter,
  Search
} from 'lucide-react';
import { EnhancedGeminiFramework, type MemoryAnnotation } from '@/lib/gemini-framework';

interface MemoryVisualizationProps {
  framework: EnhancedGeminiFramework;
}

interface MemoryStats {
  total_memories: number;
  episodic_count: number;
  short_term_active: number;
  long_term_consolidated: number;
  avg_importance: number;
  patterns_identified: number;
}

export const MemoryVisualization: React.FC<MemoryVisualizationProps> = ({
  framework
}) => {
  const [memories, setMemories] = useState<MemoryAnnotation[]>([]);
  const [stats, setStats] = useState<MemoryStats>({
    total_memories: 0,
    episodic_count: 0,
    short_term_active: 0,
    long_term_consolidated: 0,
    avg_importance: 0,
    patterns_identified: 0
  });
  const [selectedMemoryType, setSelectedMemoryType] = useState<'all' | 'episodic' | 'short_term' | 'long_term'>('all');

  // Mock memory data for demonstration
  useEffect(() => {
    const mockMemories: MemoryAnnotation[] = [
      {
        episodic_memory: {
          event_description: "User asked about quantum consciousness and free will",
          timestamp: new Date().toISOString(),
          context: "Philosophical discussion about consciousness",
          emotional_valence: 0.2,
          importance_score: 8.5,
          associated_entities: ["consciousness", "quantum mechanics", "philosophy", "free will"]
        },
        short_term_memory: {
          active_concepts: ["quantum mechanics", "consciousness", "determinism"],
          working_context: "Deep philosophical inquiry",
          immediate_goals: ["provide comprehensive answer", "explore implications"],
          attention_focus: "quantum consciousness theory",
          decay_timestamp: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        },
        long_term_memory: {
          knowledge_updates: [
            {
              domain: "philosophy",
              concept: "quantum consciousness",
              relationship: "relates to free will debate",
              confidence: 0.8
            }
          ],
          pattern_recognition: [
            {
              pattern_type: "topic preference",
              pattern_description: "User shows interest in complex philosophical topics",
              frequency: 3,
              reliability: 0.9
            }
          ],
          consolidation_priority: 7
        },
        metadata: {
          session_id: "session_demo",
          user_id: "user_demo",
          interaction_id: "int_demo_1",
          model_used: "gemini-2.5-flash",
          profundity_score: 85,
          created_at: new Date().toISOString()
        }
      },
      {
        episodic_memory: {
          event_description: "User asked for help with JavaScript function",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          context: "Programming assistance request",
          emotional_valence: 0.1,
          importance_score: 4.2,
          associated_entities: ["JavaScript", "programming", "function", "debugging"]
        },
        short_term_memory: {
          active_concepts: ["JavaScript", "functions", "debugging"],
          working_context: "Technical programming help",
          immediate_goals: ["solve coding problem", "explain solution"],
          attention_focus: "JavaScript syntax",
          decay_timestamp: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString()
        },
        long_term_memory: {
          knowledge_updates: [
            {
              domain: "programming",
              concept: "JavaScript debugging",
              relationship: "user needs technical assistance",
              confidence: 0.7
            }
          ],
          pattern_recognition: [
            {
              pattern_type: "skill level",
              pattern_description: "User has intermediate JavaScript skills",
              frequency: 5,
              reliability: 0.8
            }
          ],
          consolidation_priority: 4
        },
        metadata: {
          session_id: "session_demo",
          user_id: "user_demo",
          interaction_id: "int_demo_2",
          model_used: "gemini-2.0-flash",
          profundity_score: 25,
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        }
      }
    ];

    setMemories(mockMemories);
    
    // Calculate stats
    setStats({
      total_memories: mockMemories.length,
      episodic_count: mockMemories.length,
      short_term_active: mockMemories.filter(m => 
        new Date(m.short_term_memory.decay_timestamp || '') > new Date()
      ).length,
      long_term_consolidated: mockMemories.filter(m => 
        m.long_term_memory.consolidation_priority > 5
      ).length,
      avg_importance: mockMemories.reduce((acc, m) => 
        acc + m.episodic_memory.importance_score, 0
      ) / mockMemories.length,
      patterns_identified: mockMemories.reduce((acc, m) => 
        acc + m.long_term_memory.pattern_recognition.length, 0
      )
    });
  }, []);

  const getMemoryTypeColor = (type: string) => {
    switch (type) {
      case 'episodic': return 'text-primary';
      case 'short_term': return 'text-warning';
      case 'long_term': return 'text-accent';
      default: return 'text-foreground';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const filteredMemories = selectedMemoryType === 'all' 
    ? memories 
    : memories; // In real implementation, filter by type

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Memory Statistics */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <HardDrive className="w-5 h-5 text-primary" />
              <span>Memory Overview</span>
            </CardTitle>
            <CardDescription>
              Current memory system status and metrics
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-2xl font-bold text-primary">{stats.total_memories}</p>
                <p className="text-xs text-muted-foreground">Total Memories</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-warning">{stats.short_term_active}</p>
                <p className="text-xs text-muted-foreground">Active STM</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-accent">{stats.long_term_consolidated}</p>
                <p className="text-xs text-muted-foreground">Consolidated LTM</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-neural">{stats.patterns_identified}</p>
                <p className="text-xs text-muted-foreground">Patterns Found</p>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Average Importance</span>
                <Badge variant="outline">{stats.avg_importance.toFixed(1)}/10</Badge>
              </div>
              <Progress value={stats.avg_importance * 10} className="w-full" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Memory Types</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { type: 'all', icon: HardDrive, label: 'All Memories', count: stats.total_memories },
              { type: 'episodic', icon: Clock, label: 'Episodic', count: stats.episodic_count },
              { type: 'short_term', icon: Brain, label: 'Short Term', count: stats.short_term_active },
              { type: 'long_term', icon: Database, label: 'Long Term', count: stats.long_term_consolidated }
            ].map(({ type, icon: Icon, label, count }) => (
              <Button
                key={type}
                variant={selectedMemoryType === type ? 'neural' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setSelectedMemoryType(type as any)}
              >
                <Icon className="w-4 h-4 mr-2" />
                <span className="flex-1 text-left">{label}</span>
                <Badge variant="secondary">{count}</Badge>
              </Button>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Pattern Recognition</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-accent" />
                  <span className="text-sm">Topic Preferences</span>
                </div>
                <Badge variant="secondary">3</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Lightbulb className="w-4 h-4 text-memory" />
                  <span className="text-sm">Learning Patterns</span>
                </div>
                <Badge variant="secondary">2</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Network className="w-4 h-4 text-neural" />
                  <span className="text-sm">Interaction Styles</span>
                </div>
                <Badge variant="secondary">1</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Memory Details */}
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-primary" />
                  <span>Memory Timeline</span>
                </CardTitle>
                <CardDescription>
                  Detailed view of memory annotations and patterns
                </CardDescription>
              </div>
              <div className="flex space-x-2">
                <Button variant="glass" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
                <Button variant="glass" size="sm">
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px] pr-4">
              <div className="space-y-6">
                {filteredMemories.map((memory, index) => (
                  <div key={memory.metadata.interaction_id} className="border rounded-lg p-4 space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm mb-1">
                          {memory.episodic_memory.event_description}
                        </h3>
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>{formatTimestamp(memory.metadata.created_at)}</span>
                          <Separator orientation="vertical" className="h-3" />
                          <Badge variant="outline" className="text-xs">
                            {memory.metadata.model_used}
                          </Badge>
                          <Badge 
                            variant={memory.metadata.profundity_score > 50 ? 'neural' : 'secondary'}
                            className="text-xs"
                          >
                            Profundity: {memory.metadata.profundity_score}/100
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-primary">
                          {memory.episodic_memory.importance_score.toFixed(1)}
                        </div>
                        <div className="text-xs text-muted-foreground">Importance</div>
                      </div>
                    </div>

                    {/* Memory Components */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Episodic Memory */}
                      <div className="space-y-2">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3 text-primary" />
                          <span className="text-xs font-medium">Episodic</span>
                        </div>
                        <div className="text-xs bg-muted/50 p-2 rounded">
                          <p className="mb-2">{memory.episodic_memory.context}</p>
                          <div className="flex flex-wrap gap-1">
                            {memory.episodic_memory.associated_entities.map(entity => (
                              <Badge key={entity} variant="outline" className="text-xs">
                                {entity}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Short-term Memory */}
                      <div className="space-y-2">
                        <div className="flex items-center space-x-1">
                          <Brain className="w-3 h-3 text-warning" />
                          <span className="text-xs font-medium">Short-term</span>
                        </div>
                        <div className="text-xs bg-muted/50 p-2 rounded">
                          <p className="mb-1 font-medium">Focus: {memory.short_term_memory.attention_focus}</p>
                          <div className="space-y-1">
                            <div>
                              <span className="text-muted-foreground">Concepts:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {memory.short_term_memory.active_concepts.map(concept => (
                                  <Badge key={concept} variant="secondary" className="text-xs">
                                    {concept}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Long-term Memory */}
                      <div className="space-y-2">
                        <div className="flex items-center space-x-1">
                          <Database className="w-3 h-3 text-accent" />
                          <span className="text-xs font-medium">Long-term</span>
                        </div>
                        <div className="text-xs bg-muted/50 p-2 rounded">
                          <div className="space-y-2">
                            <div>
                              <span className="text-muted-foreground">Knowledge Updates:</span>
                              {memory.long_term_memory.knowledge_updates.map((update, i) => (
                                <div key={i} className="mt-1">
                                  <Badge variant="accent" className="text-xs mr-1">
                                    {update.domain}
                                  </Badge>
                                  <span>{update.concept}</span>
                                </div>
                              ))}
                            </div>
                            <div>
                              <span className="text-muted-foreground">Patterns:</span>
                              {memory.long_term_memory.pattern_recognition.map((pattern, i) => (
                                <div key={i} className="mt-1">
                                  <Badge variant="neural" className="text-xs mr-1">
                                    {pattern.pattern_type}
                                  </Badge>
                                  <span>{pattern.pattern_description}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};