import { useState, useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import PropertyProfile from "@/pages/PropertyProfile";
import ContentGenerator from "@/pages/ContentGenerator";
import SocialPreview from "@/pages/SocialPreview";
import ContentLibrary from "@/pages/ContentLibrary";
// Landing, OurStory, and Legal pages now hosted on Squarespace
import SimplePhotoPage from "@/pages/SimplePhotoPage";
import ThankYou from "@/pages/ThankYou";
import Login from "@/pages/Login";
import AuthCallback from "@/pages/AuthCallback";
import ProtectedRoute from "@/components/ProtectedRoute";
import Alpine from 'alpinejs';
import SupabaseTestRunner from "@/components/SupabaseTestRunner";
import UATIndicator from "@/components/UATIndicator";
import { getUserIdString } from "@/lib/userId";

// Initialize Alpine.js only if not already initialized
if (!window.Alpine) {
  window.Alpine = Alpine;
  Alpine.start();
}

function Router() {
  // Mobile menu state - shared across all pages
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  
  // Close mobile menu when changing routes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);
  
  return (
    <Switch>
      <Route path="/">
        {() => {
          // Redirect to app since landing page is now hosted on Squarespace
          window.location.href = '/app';
          return null;
        }}
      </Route>
      <Route path="/our-story">
        {() => {
          // Redirect to Squarespace hosted page
          window.location.href = 'https://www.hostprompt.com/our-story';
          return null;
        }}
      </Route>
      <Route path="/legal">
        {() => {
          // Redirect to Squarespace hosted page
          window.location.href = 'https://www.hostprompt.com/legal';
          return null;
        }}
      </Route>
      {/* Public routes */}
      <Route path="/login">
        {() => <Login />}
      </Route>
      <Route path="/auth/callback">
        {() => <AuthCallback />}
      </Route>
      <Route path="/thank-you">
        {() => <ThankYou />}
      </Route>
      
      {/* Protected routes */}
      <Route path="/app">
        {() => (
          <ProtectedRoute>
            <Home mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/property">
        {() => (
          <ProtectedRoute>
            <PropertyProfile mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/generator">
        {() => (
          <ProtectedRoute>
            <ContentGenerator mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/preview">
        {() => (
          <ProtectedRoute>
            <SocialPreview mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/share">
        {() => (
          <ProtectedRoute>
            <SocialPreview mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/library">
        {() => (
          <ProtectedRoute>
            <ContentLibrary mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/photos">
        {() => (
          <ProtectedRoute>
            <SimplePhotoPage mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
          </ProtectedRoute>
        )}
      </Route>
      <Route>
        {() => <NotFound mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />}
      </Route>
    </Switch>
  );
}

function App() {
  // Initialize user ID on app startup
  useEffect(() => {
    // This will check if a user ID exists in localStorage and generate one if it doesn't
    const userId = getUserIdString();
    console.log("Session initialized with user ID:", userId);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
        {/* Test component that doesn't affect UI but tests Supabase connection */}
        <SupabaseTestRunner />
        {/* UAT Indicator badge */}
        <UATIndicator />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
