"use client";

interface NavbarProps {
  onOpenLogin: () => void;
}

export function Navbar({ onOpenLogin }: NavbarProps) {
  return (
    <header className="sticky top-0 z-30 w-full bg-[#F6F7F2] border-b border-[#E8F3E6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand logo & title */}
        <a href="#" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#0F2F1E] flex items-center justify-center">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#9FD067"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 22v-9" />
              <path d="M12 13a5 5 0 0 1 5-5c3 0 4-3 4-3s-3 1-5 4" />
              <path d="M12 10a5 5 0 0 0-5-5C4 5 3 2 3 2s3 1 5 4" />
            </svg>
          </div>
          <span className="font-semibold tracking-tight text-[#0F2F1E] text-lg leading-none font-serif">
            PeoplePay360
          </span>
        </a>

        {/* Navigation links matching wireframe: Product, Features, How It Works, FAQ */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#1A1A1A]">
          <a
            href="#product"
            className="text-[#5C645C] hover:text-[#0F2F1E] transition-colors"
          >
            Product
          </a>
          <a
            href="#features"
            className="text-[#5C645C] hover:text-[#0F2F1E] transition-colors"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="text-[#5C645C] hover:text-[#0F2F1E] transition-colors"
          >
            How It Works
          </a>
          <a
            href="#faq"
            className="text-[#5C645C] hover:text-[#0F2F1E] transition-colors"
          >
            FAQ
          </a>
        </nav>

        {/* Right CTA: Login button */}
        <div className="flex items-center">
          <button
            type="button"
            suppressHydrationWarning
            onClick={onOpenLogin}
            className="px-5 py-2 rounded-lg bg-[#0F2F1E] text-white text-xs sm:text-sm font-medium hover:bg-[#1F4D32] transition-colors"
          >
            Login
          </button>
        </div>
      </div>
    </header>
  );
}
