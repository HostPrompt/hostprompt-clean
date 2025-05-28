import React, { useRef, useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CameraCaptureProps {
  onCapture: (imageData: string) => void;
  onClose: () => void;
}

export default function CameraCapture({ onCapture, onClose }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const { toast } = useToast();

  // Initialize the camera when component mounts
  useEffect(() => {
    const startCamera = async () => {
      try {
        // First check if the browser supports getUserMedia
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          setError("Your browser doesn't support camera access. Please use the 'Choose File' option instead.");
          return;
        }
        
        // For iOS Safari, we need special handling
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
        
        if (isIOS) {
          toast({
            title: 'Camera Permission',
            description: 'When prompted, please tap "Allow" to access your camera',
          });
        }
        
        const constraints = {
          video: { 
            facingMode: 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        };
        
        // Request access to the camera
        const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
        
        // When we get the stream, save it and set it as the video source
        setStream(mediaStream);
        
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error('Camera access error:', err);
        
        // Provide iOS-specific instructions
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        if (isIOS) {
          setError(
            'Camera access denied. To enable your camera on iOS Safari:\n\n' +
            '1. Go to your iPhone Settings\n' +
            '2. Scroll down and tap Safari\n' +
            '3. Scroll down to Settings for Websites\n' + 
            '4. Tap Camera\n' +
            '5. Select "Allow" for all websites\n' +
            '6. Return to Safari and reload this page'
          );
        } else {
          setError('Could not access camera. Please check your browser permissions and reload this page.');
        }
        
        toast({
          title: 'Camera Error',
          description: 'Could not access your camera. Please check your permissions in your browser settings.',
          variant: 'destructive'
        });
      }
    };

    startCamera();

    // Cleanup function to stop the camera when component unmounts
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [toast]);

  // Function to take a photo
  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Set canvas dimensions to match the video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw the current video frame on the canvas
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert the canvas to a data URL
        try {
          const imageData = canvas.toDataURL('image/jpeg', 0.9);
          onCapture(imageData);
        } catch (err) {
          setError('Failed to capture image. Please try again.');
          toast({
            title: 'Error',
            description: 'Failed to capture image. Please try again.',
            variant: 'destructive'
          });
        }
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Top bar with close button */}
      <div className="p-4 flex justify-between items-center">
        <button 
          onClick={onClose}
          className="text-white bg-black/50 p-2 rounded-full"
        >
          <X size={24} />
        </button>
        <span className="text-white text-lg font-medium">Take Photo</span>
        <div className="w-10"></div> {/* Spacer to balance the close button */}
      </div>
      
      {/* Video display */}
      <div className="flex-1 relative">
        {error ? (
          <div className="absolute inset-0 flex items-center justify-center text-white text-center p-6">
            <div className="max-w-md">
              <p className="mb-6 whitespace-pre-line text-left">{error}</p>
              
              {/* iOS Safari specific help links */}
              {error.includes('iOS') && (
                <div className="mb-6 p-4 bg-white/10 rounded-lg text-left">
                  <p className="font-semibold mb-2">Quick Help:</p>
                  <ol className="list-decimal pl-5 space-y-1 text-sm">
                    <li>Go to iPhone Settings &gt; Safari</li>
                    <li>Scroll to "Settings for Websites"</li>
                    <li>Tap "Camera" and select "Allow"</li>
                    <li>Return to this app and try again</li>
                  </ol>
                </div>
              )}
              
              <div className="flex gap-3 justify-center">
                <button 
                  onClick={onClose}
                  className="bg-white text-black px-4 py-2 rounded-lg font-medium"
                >
                  Use File Upload
                </button>
                {/* Alternative action to retry */}
                <button 
                  onClick={() => window.location.reload()}
                  className="bg-[#FF5C5C] text-white px-4 py-2 rounded-lg font-medium"
                >
                  Reload Page
                </button>
              </div>
            </div>
          </div>
        ) : (
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            className="h-full w-full object-cover"
          />
        )}
        
        {/* Hidden canvas for image capture */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
      
      {/* Capture button */}
      <div className="p-8 flex justify-center">
        <button 
          onClick={takePhoto}
          disabled={!!error}
          className="w-20 h-20 rounded-full bg-white flex items-center justify-center border-4 border-gray-300"
        >
          <div className="w-16 h-16 rounded-full bg-white border-2 border-gray-300"></div>
        </button>
      </div>
    </div>
  );
}