
import { GeminiDashboard } from '@/components/GeminiDashboard';

const Index = () => {
  // Note: In production, you should use environment variables for Supabase config
  // For now, these are optional - the dashboard will work without them
  const supabaseConfig = {
    url: process.env.REACT_APP_SUPABASE_URL || '',
    anonKey: process.env.REACT_APP_SUPABASE_ANON_KEY || '',
  };

  return (
    <GeminiDashboard 
      supabaseConfig={supabaseConfig.url && supabaseConfig.anonKey ? supabaseConfig : undefined}
    />
  );
};

export default Index;
