export function Footer() {
  return (
    <footer className="w-full pt-32 pb-16 px-6 md:px-12 lg:px-24 flex flex-col items-center">
      
      {/* Top CTA */}
      <h2 className="font-serif text-5xl md:text-7xl lg:text-[6.5rem] tracking-tight text-center mb-16 text-[#0A0A0A]">
        LET'S CONNECT WITH US
      </h2>

      <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-2xl mx-auto mb-32">
        <input 
          type="email" 
          placeholder="Enter your e-mail" 
          className="w-full sm:flex-1 h-16 rounded-full border border-gray-300 px-8 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black transition-all bg-transparent placeholder:text-gray-400 font-medium"
        />
        <button className="h-16 px-12 rounded-full bg-[#0A0A0A] text-white text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-gray-800 hover:shadow-xl transition-all w-full sm:w-auto shrink-0">
          Subscribe Now
        </button>
      </div>

      {/* Grid Links Structure */}
      <div className="w-full max-w-[1600px] grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-12 lg:gap-8 mb-24 border-b border-gray-200 pb-20">
        
        {/* Brand Info */}
        <div className="col-span-2 md:col-span-3 lg:col-span-1 pr-8">
          <div className="font-serif text-4xl font-bold tracking-tight mb-6 text-[#0A0A0A]">
            MANCHAI
          </div>
          <p className="text-gray-500 text-sm font-medium leading-[1.8] max-w-[220px]">
            A restaurant is a business that prepares and serves food
          </p>
        </div>

        {/* Link Columns */}
        <div className="flex flex-col gap-5 text-sm font-semibold text-gray-800">
           <a href="#" className="hover:text-black transition-colors py-1">About Us</a>
           <a href="#" className="hover:text-black transition-colors py-1">Dishes</a>
           <a href="#" className="hover:text-black transition-colors py-1">Contact</a>
        </div>

        <div className="flex flex-col gap-5 text-sm font-semibold text-gray-800">
           <a href="#" className="hover:text-black transition-colors py-1">Compare Plans</a>
           <a href="#" className="hover:text-black transition-colors py-1">Resources</a>
           <a href="#" className="hover:text-black transition-colors py-1">Health & Safety</a>
        </div>

        <div className="flex flex-col gap-5 text-sm font-semibold text-gray-800">
           <a href="#" className="hover:text-black transition-colors py-1">Terms of service</a>
           <a href="#" className="hover:text-black transition-colors py-1">Privacy & Policy</a>
           <a href="#" className="hover:text-black transition-colors py-1">Request Beta</a>
        </div>

        <div className="flex flex-col gap-5 text-sm font-semibold text-gray-800">
           <a href="#" className="hover:text-black transition-colors py-1">Facebook</a>
           <a href="#" className="hover:text-black transition-colors py-1">Instagram</a>
           <a href="#" className="hover:text-black transition-colors py-1">Twitter</a>
        </div>

      </div>

      <div className="w-full text-center text-xs text-gray-400 font-semibold tracking-wide">
        © 2026 MANCHAI | All Rights Reserved
      </div>
    </footer>
  );
}
