import { useState } from 'react';
import { Link } from 'wouter';
import { CheckCircle2, ChevronRight, Image, MessageSquare, Clock, Palette } from 'lucide-react';
import AuthButtons from '../components/AuthButtons';

export default function Landing() {
  const [email, setEmail] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle waitlist signup logic here
    alert(`Thank you for joining our waitlist with ${email}! We'll be in touch soon.`);
    setEmail('');
  };

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
            {/* Mobile only buttons */}
            <div className="block md:hidden">
              <AuthButtons variant="primary" />
            </div>
            
            {/* Desktop navigation */}
            <nav className="hidden md:flex md:space-x-6 items-center">
              <a href="#features" className="text-sm font-medium text-neutral-700 hover:text-[#FF5C5C]">
                Features
              </a>
              <a href="#how-it-works" className="text-sm font-medium text-neutral-700 hover:text-[#FF5C5C]">
                How It Works
              </a>
              <AuthButtons variant="secondary" />
            </nav>
            
            {/* Mobile tabs below header */}
            <div className="md:hidden w-full flex justify-center border-t border-neutral-100 fixed top-16 left-0 right-0 bg-white z-40 shadow-sm">
              <div className="flex space-x-12 py-2">
                <a href="#features" className="text-sm font-medium text-neutral-700 hover:text-[#FF5C5C]">
                  Features
                </a>
                <a href="#how-it-works" className="text-sm font-medium text-neutral-700 hover:text-[#FF5C5C]">
                  How It Works
                </a>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="pt-12 pb-16 sm:pt-16 sm:pb-20 lg:pt-20 lg:pb-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900 sm:text-5xl md:text-6xl">
                <span className="block">Your Creative Co-Host</span>
                <span className="block text-[#FF5C5C]">for Effortless Content</span>
              </h1>
              <p className="mt-3 mx-auto text-base text-neutral-600 sm:mt-5 sm:text-lg md:mt-5 md:text-xl max-w-2xl">
                HostPrompt helps short-term rental hosts create standout content in seconds — while staying true to your voice and saving you hours.
              </p>
              <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row justify-center gap-4">
                <a 
                  href="#demo-video" 
                  className="inline-flex items-center justify-center px-6 py-3 border border-neutral-300 rounded-full shadow-sm text-[#FF5C5C] bg-white hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF5C5C] transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-5 w-5 mr-2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"
                    />
                  </svg>
                  Watch Demo
                </a>
                <a
                  href="https://hostprompt-ai.outseta.com/auth?widgetMode=register&planUid=79Oba5QE&planPaymentTerm=month&skipPlanOptions=false&redirect_uri=https%3A//host-prompt-pro-tismith.replit.app/auth/callback#o-anonymous"
                  target="_blank"
                  rel="noopener"
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent font-medium rounded-full shadow-sm text-white bg-[#FF5C5C] hover:bg-[#FF3C3C] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF7C7C] transition-colors"
                >
                  Try HostPrompt for Free
                </a>
              </div>

              {/* Trust badges */}
              <div className="mt-8 flex flex-wrap gap-4 justify-center">
                <div className="flex items-center px-3 py-1 bg-neutral-100 rounded-full">
                  <CheckCircle2 className="h-4 w-4 text-[#FF5C5C] mr-1" />
                  <span className="text-xs font-medium text-neutral-700">Built with OpenAI</span>
                </div>
                <div className="flex items-center px-3 py-1 bg-neutral-100 rounded-full">
                  <CheckCircle2 className="h-4 w-4 text-[#FF5C5C] mr-1" />
                  <span className="text-xs font-medium text-neutral-700">Trusted by Airbnb Superhosts</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Video Demo Section */}
        <section id="demo-video" className="py-16 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-extrabold text-neutral-900 sm:text-4xl">
                See HostPrompt in Action
              </h2>
              <p className="mt-4 max-w-2xl mx-auto text-xl text-neutral-600">
                Watch how easy it is to create engaging content for your properties
              </p>
            </div>
            
            {/* iPhone-style Video Section - Larger Size */}
            <div className="flex justify-center mb-8">
              <div className="w-full max-w-[320px] md:max-w-[360px] rounded-[45px] overflow-hidden shadow-xl bg-black border-4 border-gray-800 relative">
                {/* iPhone notch */}
                <div className="absolute top-0 left-0 right-0 flex justify-center z-10">
                  <div className="h-7 w-36 bg-black rounded-b-2xl"></div>
                </div>
                
                {/* Side buttons (left) */}
                <div className="absolute left-[-8px] top-28 h-14 w-2 bg-gray-800 rounded-l-lg"></div>
                <div className="absolute left-[-8px] top-48 h-14 w-2 bg-gray-800 rounded-l-lg"></div>
                <div className="absolute left-[-8px] top-68 h-24 w-2 bg-gray-800 rounded-l-lg"></div>
                
                {/* Side buttons (right) */}
                <div className="absolute right-[-8px] top-36 h-20 w-2 bg-gray-800 rounded-r-lg"></div>
                
                {/* Video container with iPhone proportion */}
                <div className="relative bg-black aspect-[9/19.5] overflow-hidden">
                  <video
                    controls
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    className="absolute inset-0 w-full h-full object-cover"
                  >
                    <source src="/hostprompt-demo-mobiledevice (1).mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
                
                {/* Home indicator */}
                <div className="h-10 bg-black flex items-center justify-center">
                  <div className="h-1.5 w-1/3 bg-gray-600 rounded-full"></div>
                </div>
              </div>
            </div>

          </div>
        </section>
        
        {/* Feature highlights */}
        <section id="features" className="py-16 bg-neutral-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-neutral-900 sm:text-4xl">
                Why hosts love HostPrompt
              </h2>
              <p className="mt-4 max-w-2xl mx-auto text-xl text-neutral-600">
                Built for your unique needs, with tools that actually save you time.
              </p>
            </div>

            <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {/* Feature 1 */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-neutral-200">
                <div className="w-10 h-10 rounded-full bg-[#FFEEEE] flex items-center justify-center">
                  <Clock className="h-5 w-5 text-[#FF5C5C]" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-neutral-900">Save hours every week</h3>
                <p className="mt-2 text-sm text-neutral-600">
                  Create polished social media captions, listing descriptions & welcome notes effortlessly.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-neutral-200">
                <div className="w-10 h-10 rounded-full bg-[#FFEEEE] flex items-center justify-center">
                  <Palette className="h-5 w-5 text-[#FF5C5C]" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-neutral-900">Stay true to your brand</h3>
                <p className="mt-2 text-sm text-neutral-600">
                  HostPrompt adapts to your tone and personality, not the other way around.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-neutral-200">
                <div className="w-10 h-10 rounded-full bg-[#FFEEEE] flex items-center justify-center">
                  <Image className="h-5 w-5 text-[#FF5C5C]" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-neutral-900">Let your photos tell the story</h3>
                <p className="mt-2 text-sm text-neutral-600">
                  Upload an image — we create content grounded in the vibe of your space.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-neutral-200">
                <div className="w-10 h-10 rounded-full bg-[#FFEEEE] flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-[#FF5C5C]" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-neutral-900">Post with confidence</h3>
                <p className="mt-2 text-sm text-neutral-600">
                  Built-in CTA tips and hashtag suggestions make every post scroll-stopping.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-neutral-900 sm:text-4xl">
                How It Works
              </h2>
              <p className="mt-4 max-w-2xl mx-auto text-xl text-neutral-600">
                Three simple steps to better content
              </p>
            </div>

            <div className="mt-16">
              <div className="relative">
                {/* Steps connector line (desktop) */}
                <div className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-neutral-200 -translate-y-1/2 -translate-x-1/2" aria-hidden="true"></div>

                <div className="relative grid gap-8 grid-cols-1 md:grid-cols-3">
                  {/* Step 1 */}
                  <div className="md:text-center">
                    <div className="flex items-center md:flex-col md:justify-start">
                      <div className="flex-shrink-0 flex items-center justify-center md:mx-auto h-12 w-12 rounded-full bg-[#FF5C5C] text-white font-bold text-xl">
                        1
                      </div>
                      <div className="ml-4 md:ml-0 md:mt-4">
                        <h3 className="text-lg font-medium text-neutral-900">Set up your property profile</h3>
                        <p className="mt-2 text-sm text-neutral-600 md:mx-auto md:max-w-xs">
                          Add your property details and define your brand's unique voice
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="md:text-center">
                    <div className="flex items-center md:flex-col md:justify-start">
                      <div className="flex-shrink-0 flex items-center justify-center md:mx-auto h-12 w-12 rounded-full bg-[#FF5C5C] text-white font-bold text-xl">
                        2
                      </div>
                      <div className="ml-4 md:ml-0 md:mt-4">
                        <h3 className="text-lg font-medium text-neutral-900">Upload a photo or choose content type</h3>
                        <p className="mt-2 text-sm text-neutral-600 md:mx-auto md:max-w-xs">
                          Select what type of content you need and add a photo to inspire it
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="md:text-center">
                    <div className="flex items-center md:flex-col md:justify-start">
                      <div className="flex-shrink-0 flex items-center justify-center md:mx-auto h-12 w-12 rounded-full bg-[#FF5C5C] text-white font-bold text-xl">
                        3
                      </div>
                      <div className="ml-4 md:ml-0 md:mt-4">
                        <h3 className="text-lg font-medium text-neutral-900">Hit "Create" — then refine and share</h3>
                        <p className="mt-2 text-sm text-neutral-600 md:mx-auto md:max-w-xs">
                          Generate content instantly, make any tweaks you want, and share it
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Social proof section */}
        <section className="py-16 bg-neutral-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative bg-white rounded-2xl shadow-sm border border-neutral-200 p-8 lg:p-12 overflow-hidden">
              <div className="absolute right-0 bottom-0 opacity-5">
                <svg width="320" height="320" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 150C0 67.1573 67.1573 0 150 0C232.843 0 300 67.1573 300 150C300 232.843 232.843 300 150 300C67.1573 300 0 232.843 0 150Z" fill="#FF5C5C" />
                </svg>
              </div>
              
              <div className="relative max-w-3xl mx-auto">
                <svg className="h-12 w-12 text-[#FF5C5C] opacity-25 mb-4" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true">
                  <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                </svg>
                <blockquote className="mt-4">
                  <p className="text-xl md:text-2xl font-medium text-neutral-900">
                    "I used to spend hours writing posts — now I just click Create and tweak. Guests have even mentioned the captions!"
                  </p>
                </blockquote>
                <div className="mt-6 md:flex md:items-center">
                  <div className="h-10 w-10 rounded-full bg-[#FFEEEE] flex items-center justify-center">
                    <span className="text-[#FF5C5C] font-bold">J</span>
                  </div>
                  <div className="mt-3 md:mt-0 md:ml-4">
                    <p className="text-base font-medium text-neutral-900">Jamie</p>
                    <p className="text-base text-neutral-500">Host in Byron Bay</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA section */}
        <section className="py-16 bg-gradient-to-r from-[#FF5C5C] to-[#FF8C8C] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-extrabold sm:text-4xl">
              Ready to transform your content strategy?
            </h2>
            <p className="mt-4 text-xl">
              Join hundreds of hosts saving time and standing out
            </p>
            <div className="mt-8 max-w-md mx-auto sm:flex sm:justify-center">
              <Link href="/app">
                <div className="cursor-pointer w-full flex items-center justify-center px-8 py-3 border border-transparent font-medium rounded-full shadow-sm text-[#FF5C5C] bg-white hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white focus:ring-offset-[#FF5C5C] transition-colors sm:w-auto">
                  Try HostPrompt for free
                  <ChevronRight className="ml-2 h-4 w-4" />
                </div>
              </Link>
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
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider">Support</h3>
              <ul className="mt-4 space-y-2">
                <li><a href="mailto:support@hostprompt.com" className="text-neutral-400 hover:text-white text-sm">Help Center</a></li>
                <li><span className="text-neutral-500 text-sm">Pricing (Coming Soon)</span></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider">Legal</h3>
              <ul className="mt-4 space-y-2">
                <li><Link href="/legal"><span className="text-neutral-400 hover:text-white text-sm cursor-pointer">Privacy Policy</span></Link></li>
                <li><Link href="/legal"><span className="text-neutral-400 hover:text-white text-sm cursor-pointer">Terms of Service</span></Link></li>
                <li><Link href="/legal"><span className="text-neutral-400 hover:text-white text-sm cursor-pointer">Cookie Policy</span></Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider">Connect</h3>
              <ul className="mt-4 space-y-2">
                <li><a href="https://instagram.com/hostprompt" className="text-neutral-400 hover:text-white text-sm">Instagram</a></li>
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