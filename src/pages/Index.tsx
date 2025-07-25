import { GeminiDashboard } from '@/components/GeminiDashboard';

const Index = () => {
  // In a real implementation, these would come from environment variables or user input
  const geminiConfig = {
    apiKey: 'your-gemini-api-key', // Replace with actual API key
  };

  const supabaseConfig = {
    url: 'your-supabase-url', // Replace with actual Supabase URL
    anonKey: 'your-supabase-anon-key', // Replace with actual Supabase anon key
  };

  return (
    <GeminiDashboard 
      geminiConfig={geminiConfig}
      supabaseConfig={supabaseConfig}
    />
  );
};

export default Index;
