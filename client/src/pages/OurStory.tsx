import { Link } from 'wouter';
import { ArrowLeft } from 'lucide-react';

export default function OurStory() {
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
              <Link href="/" className="flex items-center text-sm font-medium text-neutral-700 hover:text-[#FF5C5C]">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Home
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="pt-8 pb-12 sm:pt-12 sm:pb-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900 sm:text-5xl">
                Our Story
              </h1>
              <p className="mt-4 text-xl font-semibold text-[#FF5C5C]">
                Built by Hosts, for Hosts
              </p>
            </div>
            
            <div className="prose prose-lg mx-auto">
              <p className="text-lg leading-relaxed text-neutral-700">
                HostPrompt was born out of a simple frustration: creating engaging, consistent content for our short-term rental was taking too much time — and joy — away from hosting.
              </p>
              
              <p className="text-lg leading-relaxed text-neutral-700 mt-6">
                We are hosts. The late-night photo edits. The blank screen staring back before a social media post. The scramble to write a warm welcome note or update a listing description before guests arrive.
              </p>
              
              <p className="text-lg leading-relaxed text-neutral-700 mt-6">
                So we built HostPrompt — not as just another AI tool, but as <span className="font-semibold text-[#FF5C5C]">your creative co-host</span>. A platform that works with you, reflects your voice, and gives you time back for what matters most: quality hosting.
              </p>
              
              <p className="text-lg leading-relaxed text-neutral-700 mt-6">
                Whether you're managing a coastal escape, a farmhouse, or a city studio — we're here to help your property standout.
              </p>
              
              {/* Decorative element */}
              <div className="mt-12 mb-12 flex justify-center">
                <svg width="64" height="8" viewBox="0 0 64 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="4" cy="4" r="4" fill="#FF5C5C" />
                  <circle cx="20" cy="4" r="4" fill="#FF7C7C" />
                  <circle cx="36" cy="4" r="4" fill="#FF9C9C" />
                  <circle cx="52" cy="4" r="4" fill="#FFBCBC" />
                </svg>
              </div>
              
              {/* Call to action */}
              <div className="mt-12 text-center">
                <h2 className="text-2xl font-semibold text-neutral-900">Ready to save time and create more engaging content?</h2>
                <div className="mt-6">
                  <Link href="/app">
                    <a className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-[#FF5C5C] hover:bg-[#FF3C3C] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF5C5C]">
                      Try HostPrompt Today
                    </a>
                  </Link>
                </div>
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
                <li><a href="mailto:support@hostprompt.com" className="text-neutral-400 hover:text-white text-sm">Help Center</a></li>
                <li><span className="text-neutral-500 text-sm">Pricing (Coming Soon)</span></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider">Legal</h3>
              <ul className="mt-4 space-y-2">
                <li><Link href="/legal"><span className="text-neutral-400 hover:text-white text-sm">Privacy Policy</span></Link></li>
                <li><Link href="/legal"><span className="text-neutral-400 hover:text-white text-sm">Terms of Service</span></Link></li>
                <li><Link href="/legal"><span className="text-neutral-400 hover:text-white text-sm">Cookie Policy</span></Link></li>
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