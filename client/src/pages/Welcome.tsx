import { Link } from "wouter";

export default function Welcome() {
  return (
    <div className="min-h-screen bg-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Link href="/">
            <img
              className="h-16 w-auto cursor-pointer"
              src="/hostprompt-logo.svg"
              alt="HostPrompt"
            />
          </Link>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Welcome to HostPrompt!
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Your Creative Co-Host — built by hosts, for hosts
        </p>
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
              <div className="ml-3 flex-1 md:flex md:justify-between">
                <p className="text-sm text-blue-700">
                  Thank you for signing up! Please check your email to verify your account and set up your password.
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">What happens next?</h3>
              <ul className="mt-2 list-disc pl-5 text-sm text-gray-600 space-y-2">
                <li>You'll receive a welcome email with a link to set up your password</li>
                <li>Click the link in the email to verify your account</li>
                <li>After setting your password, you'll be able to log in to your account</li>
                <li>Once logged in, you'll have access to all of HostPrompt's features</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900">Need help?</h3>
              <p className="mt-2 text-sm text-gray-600">
                If you haven't received an email within a few minutes, please check your spam folder or contact support.
              </p>
            </div>
            
            <div className="flex flex-col space-y-4">
              <Link href="/login">
                <a className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#FF5C5C] hover:bg-[#FF3C3C] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF7C7C]">
                  Go to Login
                </a>
              </Link>
              <Link href="/">
                <a className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF7C7C]">
                  Return to Home
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}