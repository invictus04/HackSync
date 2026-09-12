export default function AuthSideContent() {
  return (
    <div className="hidden lg:flex relative overflow-hidden flex-col justify-center p-16 lg:p-24 bg-pale-mint w-full h-full">
      <div className="absolute inset-0 bg-pale-mint/85 backdrop-blur-[2px]" />
      <div className="relative z-10 max-w-xl flex flex-col gap-16">
        <div>
          <p className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-deep-espresso shadow-sm text-sm font-bold tracking-wide mb-8">
            <span className="w-2 h-2 rounded-full bg-soft-celadon"></span>
            Next Generation Hackathon Platform
          </p>
          <h2 className="text-5xl lg:text-6xl font-bold leading-tight text-deep-espresso" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Build The Future <br /> Through
            <span className="text-soft-celadon block mt-2"> Innovation. </span>
          </h2>
          <p className="mt-8 text-xl text-warm-stone leading-relaxed max-w-md">
            Organize, participate, mentor, and judge world-class hackathons using
            one unified platform.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="bg-white/60 border border-white shadow-sm rounded-3xl p-6 backdrop-blur-xl hover:-translate-y-1 transition-transform">
            <h3 className="text-3xl font-bold text-deep-espresso" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>500+</h3>
            <p className="text-warm-stone mt-2 font-bold uppercase text-[10px] tracking-widest">Hackathons</p>
          </div>
          <div className="bg-white/60 border border-white shadow-sm rounded-3xl p-6 backdrop-blur-xl hover:-translate-y-1 transition-transform">
            <h3 className="text-3xl font-bold text-deep-espresso" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>10K+</h3>
            <p className="text-warm-stone mt-2 font-bold uppercase text-[10px] tracking-widest">Developers</p>
          </div>
          <div className="bg-white/60 border border-white shadow-sm rounded-3xl p-6 backdrop-blur-xl hover:-translate-y-1 transition-transform">
            <h3 className="text-3xl font-bold text-deep-espresso" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>2K+</h3>
            <p className="text-warm-stone mt-2 font-bold uppercase text-[10px] tracking-widest">Projects</p>
          </div>
        </div>
      </div>
    </div>
  );
}
