import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Home } from "lucide-react";
import { useLocation } from "wouter";

interface NotFoundProps {
  mobileMenuOpen?: boolean;
  setMobileMenuOpen?: (open: boolean) => void;
}

export default function NotFound({ mobileMenuOpen, setMobileMenuOpen }: NotFoundProps) {
  const [, setLocation] = useLocation();
  
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-neutral-50">
      <Card className="w-full max-w-md mx-4 border border-neutral-200 rounded-xl shadow-sm">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center mb-4">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="h-8 w-8 text-primary-500" />
            </div>
            <h1 className="text-2xl font-heading font-semibold text-neutral-800">404 Page Not Found</h1>
            <p className="mt-4 text-neutral-600">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>

          <div className="mt-6">
            <button
              onClick={() => setLocation('/')}
              className="w-full bg-primary-500 hover:bg-primary-600 text-white rounded-lg py-2.5 text-sm font-medium transition-colors flex items-center justify-center"
            >
              <Home className="h-4 w-4 mr-1.5" />
              Back to Dashboard
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
