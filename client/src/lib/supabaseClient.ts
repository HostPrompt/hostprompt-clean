import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Initialize the Supabase client with your actual credentials
const supabaseUrl = 'https://vrmbaeohpjjfainjvnrs.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZybWJhZW9ocGpqZmFpbmp2bnJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2NTMyMTIsImV4cCI6MjA2MzIyOTIxMn0.ObMIfVJGORvzCcv_VI1k2c16c2apfIKkzhwaRrBzYdk'

// Environment-specific configuration
const isProduction = import.meta.env.PROD === true

// Create the client with enhanced options for production
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true
  },
  global: {
    // More aggressive fetch retries for production
    fetch: (...args) => {
      return fetch(...args).catch(error => {
        console.error('Supabase fetch error:', error)
        // Throw the error to let the calling code handle it
        throw error
      })
    }
  }
})

// Wrapper for Supabase operations with retry logic
export async function withRetry<T>(
  operation: (client: SupabaseClient) => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> {
  let lastError: any
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await operation(supabase)
    } catch (error) {
      console.error(`Supabase operation failed (attempt ${attempt + 1}/${maxRetries}):`, error)
      lastError = error
      
      // Wait before retrying (with exponential backoff)
      if (attempt < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, attempt)))
      }
    }
  }
  
  throw lastError
}

// Example usage:
// import { withRetry } from '@/lib/supabaseClient'
//
// async function fetchData() {
//   try {
//     const result = await withRetry(async (client) => {
//       const { data, error } = await client.from('your_table').select('*')
//       if (error) throw error
//       return data
//     })
//     return result
//   } catch (error) {
//     console.error('Failed after multiple retries:', error)
//     // Handle complete failure
//     return []
//   }
// }