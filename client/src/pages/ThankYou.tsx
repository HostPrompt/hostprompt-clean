import { Link } from "wouter";

export default function ThankYou() {
  return (
    <div className="min-h-screen bg-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <a href="https://www.hostprompt.com" target="_blank" rel="noopener noreferrer">
            <img
              className="h-16 w-auto cursor-pointer"
              src="/hostprompt-logo.png"
              alt="HostPrompt"
            />
          </a>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Thanks for creating your HostPrompt account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="rounded-md bg-blue-50 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm text-blue-700">
                  We just sent you a confirmation email — please click the link in that email to verify your address. Once verified, you'll be guided through setting up your password.
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <p className="text-sm text-gray-600">
              After logging in, you'll get access to HostPrompt's content tools, manage your subscription, and personalize your property profile. You'll also be able to track your saved content and access premium features.
            </p>
            
            <div className="rounded-md bg-yellow-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    If you don't see the email right away, please check your spam or promotions folder.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <a href="https://www.hostprompt.com" target="_blank" rel="noopener noreferrer" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#FF5C5C] hover:bg-[#FF3C3C] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF7C7C]">
                Go back to the home page
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}