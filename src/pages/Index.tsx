
import { GeminiDashboard } from '@/components/GeminiDashboard';

const Index = () => {
  // Note: In production, you should use environment variables for Supabase config
  // For now, these are optional - the dashboard will work without them
  const supabaseConfig = {
    url: import.meta.env.VITE_SUPABASE_URL || '',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  };

  return (
    <GeminiDashboard 
      supabaseConfig={supabaseConfig.url && supabaseConfig.anonKey ? supabaseConfig : undefined}
    />
  );
};

export default Index;
