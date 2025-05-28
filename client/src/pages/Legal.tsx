import { useState } from 'react';
import { Link } from 'wouter';
import { ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';

export default function Legal() {
  const [expandedSection, setExpandedSection] = useState<string | null>('privacy'); // Default to privacy policy open
  
  const toggleSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };
  
  // Get today's date in a formatted string
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header/Navigation */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-neutral-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-[#FF5C5C] to-[#FF8C8C] text-transparent bg-clip-text">
                HostPrompt
              </span>
              <p className="text-xs text-neutral-500 ml-3 hidden sm:block">Built by hosts, for hosts.</p>
            </div>
            <nav className="flex items-center">
              <Link href="/">
                <a className="flex items-center text-sm font-medium text-neutral-700 hover:text-[#FF5C5C]">
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back to Home
                </a>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <section className="py-8 sm:py-12">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl md:text-5xl">
                Legal & Policies
              </h1>
              <p className="mt-4 text-lg text-neutral-600 max-w-2xl mx-auto">
                Important information about how we handle your data and the terms of using HostPrompt.
              </p>
            </div>
            
            {/* Accordion sections */}
            <div className="space-y-6">
              {/* Privacy Policy */}
              <div className="border border-neutral-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSection('privacy')}
                  className="w-full flex justify-between items-center p-4 sm:p-6 bg-white hover:bg-neutral-50 text-left focus:outline-none transition duration-150"
                >
                  <h2 className="text-xl font-semibold text-[#FF5C5C]">Privacy Policy</h2>
                  {expandedSection === 'privacy' ? (
                    <ChevronUp className="h-5 w-5 text-neutral-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-neutral-500" />
                  )}
                </button>
                
                {expandedSection === 'privacy' && (
                  <div className="p-4 sm:p-6 border-t border-neutral-200 bg-white">
                    <p className="text-sm text-neutral-500 mb-4">Last updated: {today}</p>
                    
                    <div className="prose prose-neutral prose-sm max-w-none">
                      <p>
                        HostPrompt respects your privacy. We collect minimal data to deliver core features, personalize your experience, and improve functionality.
                      </p>
                      
                      <h3 className="text-lg font-medium text-neutral-900 mt-6 mb-3">What We Collect:</h3>
                      <ul className="list-disc pl-5 space-y-1 text-neutral-700">
                        <li>Name, email, and property details you submit</li>
                        <li>Analytics on how the platform is used</li>
                        <li>Images uploaded for content creation</li>
                      </ul>
                      
                      <h3 className="text-lg font-medium text-neutral-900 mt-6 mb-3">How We Use It:</h3>
                      <ul className="list-disc pl-5 space-y-1 text-neutral-700">
                        <li>To generate content based on your inputs</li>
                        <li>To send important product updates (only if you opt in)</li>
                      </ul>
                      
                      <h3 className="text-lg font-medium text-neutral-900 mt-6 mb-3">Your Trust Matters:</h3>
                      <p className="text-neutral-700">
                        We will never sell or rent your personal information.
                      </p>
                      
                      <p className="text-neutral-700 mt-6">
                        Contact us at: <a href="mailto:hello@hostprompt.com" className="text-[#FF5C5C] hover:underline">hello@hostprompt.com</a>
                      </p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Terms of Service */}
              <div className="border border-neutral-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSection('terms')}
                  className="w-full flex justify-between items-center p-4 sm:p-6 bg-white hover:bg-neutral-50 text-left focus:outline-none transition duration-150"
                >
                  <h2 className="text-xl font-semibold text-[#FF5C5C]">Terms of Service</h2>
                  {expandedSection === 'terms' ? (
                    <ChevronUp className="h-5 w-5 text-neutral-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-neutral-500" />
                  )}
                </button>
                
                {expandedSection === 'terms' && (
                  <div className="p-4 sm:p-6 border-t border-neutral-200 bg-white">
                    <p className="text-sm text-neutral-500 mb-4">Last updated: {today}</p>
                    
                    <div className="prose prose-neutral prose-sm max-w-none">
                      <p>
                        By using HostPrompt, you agree to the following terms:
                      </p>
                      
                      <h3 className="text-lg font-medium text-neutral-900 mt-6 mb-3">Your Content:</h3>
                      <ul className="list-disc pl-5 space-y-1 text-neutral-700">
                        <li>You own the content and images you upload.</li>
                        <li>You grant HostPrompt permission to analyze your content to generate marketing materials and improve platform functionality.</li>
                      </ul>
                      
                      <h3 className="text-lg font-medium text-neutral-900 mt-6 mb-3">Generated Content:</h3>
                      <ul className="list-disc pl-5 space-y-1 text-neutral-700">
                        <li>Content created by HostPrompt is yours to use for personal or business purposes.</li>
                        <li>You may not resell or distribute generated content as a service.</li>
                      </ul>
                      
                      <h3 className="text-lg font-medium text-neutral-900 mt-6 mb-3">Fair Use:</h3>
                      <p className="text-neutral-700">
                        We reserve the right to suspend accounts that misuse the platform or breach these terms.
                      </p>
                      
                      <p className="text-neutral-700 mt-6">
                        This platform is provided "as is." While we work to ensure reliability, we cannot guarantee uninterrupted access or error-free functionality.
                      </p>
                      
                      <p className="text-neutral-700 mt-6">
                        Questions? Email: <a href="mailto:hello@hostprompt.com" className="text-[#FF5C5C] hover:underline">hello@hostprompt.com</a>
                      </p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Cookie Policy */}
              <div className="border border-neutral-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSection('cookies')}
                  className="w-full flex justify-between items-center p-4 sm:p-6 bg-white hover:bg-neutral-50 text-left focus:outline-none transition duration-150"
                >
                  <h2 className="text-xl font-semibold text-[#FF5C5C]">Cookie Policy</h2>
                  {expandedSection === 'cookies' ? (
                    <ChevronUp className="h-5 w-5 text-neutral-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-neutral-500" />
                  )}
                </button>
                
                {expandedSection === 'cookies' && (
                  <div className="p-4 sm:p-6 border-t border-neutral-200 bg-white">
                    <p className="text-sm text-neutral-500 mb-4">Last updated: {today}</p>
                    
                    <div className="prose prose-neutral prose-sm max-w-none">
                      <p>
                        HostPrompt uses cookies to improve your experience.
                      </p>
                      
                      <h3 className="text-lg font-medium text-neutral-900 mt-6 mb-3">Types of Cookies We Use:</h3>
                      <ul className="list-disc pl-5 space-y-1 text-neutral-700">
                        <li>Essential cookies for app functionality</li>
                        <li>Analytics cookies to understand how you use the platform</li>
                      </ul>
                      
                      <p className="text-neutral-700 mt-6">
                        We do not use advertising or third-party marketing cookies.
                      </p>
                      
                      <p className="text-neutral-700 mt-6">
                        You can disable cookies via your browser settings. Disabling some cookies may impact functionality.
                      </p>
                      
                      <p className="text-neutral-700 mt-6">
                        Learn more or contact us at: <a href="mailto:hello@hostprompt.com" className="text-[#FF5C5C] hover:underline">hello@hostprompt.com</a>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-neutral-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider">About</h3>
              <ul className="mt-4 space-y-2">
                <li><a href="/our-story" className="text-neutral-400 hover:text-white text-sm">Our Story</a></li>
                <li><a href="#" className="text-neutral-400 hover:text-white text-sm">Blog</a></li>
                <li><a href="#" className="text-neutral-400 hover:text-white text-sm">Careers</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider">Support</h3>
              <ul className="mt-4 space-y-2">
                <li><a href="#" className="text-neutral-400 hover:text-white text-sm">Help Center</a></li>
                <li><a href="#" className="text-neutral-400 hover:text-white text-sm">Contact Us</a></li>
                <li><a href="#" className="text-neutral-400 hover:text-white text-sm">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider">Legal</h3>
              <ul className="mt-4 space-y-2">
                <li><a href="/legal" className="text-neutral-400 hover:text-white text-sm">Privacy Policy</a></li>
                <li><a href="/legal" className="text-neutral-400 hover:text-white text-sm">Terms of Service</a></li>
                <li><a href="/legal" className="text-neutral-400 hover:text-white text-sm">Cookie Policy</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider">Connect</h3>
              <ul className="mt-4 space-y-2">
                <li><a href="#" className="text-neutral-400 hover:text-white text-sm">Instagram</a></li>
                <li><a href="mailto:hello@hostprompt.com" className="text-neutral-400 hover:text-white text-sm">hello@hostprompt.com</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-neutral-700 flex flex-col md:flex-row justify-between items-center">
            <div>
              <span className="text-lg font-bold bg-gradient-to-r from-[#FF5C5C] to-[#FF8C8C] text-transparent bg-clip-text">
                HostPrompt
              </span>
              <p className="mt-2 text-neutral-400 text-sm">
                &copy; {new Date().getFullYear()} HostPrompt. All rights reserved.
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <a href="#" className="text-neutral-400 hover:text-white">
                <span className="sr-only">Instagram</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}