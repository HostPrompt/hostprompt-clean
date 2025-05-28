import { useEffect, useState } from 'react';
import { testSupabaseInsert } from '@/lib/supabaseTest';

/**
 * A component that runs the Supabase test only in development mode
 * This component doesn't render anything visible to the user
 */
export default function SupabaseTestRunner() {
  const [testResult, setTestResult] = useState<{
    success?: boolean;
    message?: string;
    properties?: any[];
    error?: string;
  }>({});
  const [hasRun, setHasRun] = useState(false);

  useEffect(() => {
    // Only run the test once and only in development mode
    const isDevelopment = import.meta.env.DEV === true;
    
    if (!hasRun && isDevelopment) {
      const runTest = async () => {
        console.log('Testing Supabase connection (DEV MODE)...');
        const result = await testSupabaseInsert();
        setTestResult(result);
        setHasRun(true);
      };

      runTest();
    }
  }, [hasRun]);

  // This component doesn't render anything visible
  return null;
}