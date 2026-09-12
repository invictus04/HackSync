
import Container from "../../components/common/Container";
import { Link } from "react-router";

export default function AboutPage() {
  const team = [
    { name: "Asha Rao", role: "Founder & CEO" },
    { name: "Diego Mar", role: "Head of Engineering" },
    { name: "Lina Patel", role: "Design Lead" },
  ];

  return (
    <div className="bg-pale-mint min-h-screen pt-24 pb-24">
      <Container>
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center mb-24">
          <span className="inline-block py-1.5 px-4 rounded-full bg-pale-mint/30 text-deep-espresso text-xs font-bold tracking-widest uppercase mb-6 border border-muted-slate/20">
            About Us
          </span>
          <h1 className="text-5xl md:text-6xl font-bold text-deep-espresso mb-6 tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            We build great hackathon experiences
          </h1>
          <p className="text-lg md:text-xl text-warm-stone max-w-2xl mx-auto leading-relaxed">
            HackSync is a lightweight platform that helps organizers run engaging, fair, and memorable hackathons — from registration to judging and post-event highlights.
          </p>
        </div>

        {/* Mission Section */}
        <div className="mb-32 bg-white border border-muted-slate/20 rounded-[2.5rem] shadow-[0_10px_30px_rgba(56,48,46,0.03)] overflow-hidden flex flex-col md:flex-row p-12 md:p-16 gap-12 md:gap-16 items-center">
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-deep-espresso mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Our mission
            </h2>
            <p className="text-warm-stone text-lg leading-relaxed mb-8">
              We believe in empowering creators by removing operational friction. Our goal is to make hackathons easier to organize and more delightful to participate in — giving people time to focus on building great things.
            </p>
            <ul className="space-y-4 text-deep-espresso font-medium">
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-soft-celadon" />
                Simple workflows for organizers
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-soft-celadon" />
                Fair, customizable judging
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-soft-celadon" />
                Clear onboarding for participants and mentors
              </li>
            </ul>
            <div className="mt-10">
              <Link to="/contact" className="inline-block py-3 px-8 rounded-xl bg-deep-espresso text-white font-semibold text-sm hover:bg-muted-slate transition-colors shadow-lg shadow-deep-espresso/10 cursor-pointer">
                Get in touch
              </Link>
            </div>
          </div>
          
          <div className="flex-1 relative w-full h-[350px] md:h-[450px]">
            <div className="absolute inset-0 bg-soft-celadon/20 rounded-[2rem] transform translate-x-4 translate-y-4" />
            <div className="relative bg-white border border-muted-slate/20 rounded-[2rem] shadow-sm w-full h-full overflow-hidden">
              <img src="/about_img.jpg" alt="About" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </div>
          </div>
        </div>



        {/* CTA Section */}
        <div className="bg-deep-espresso rounded-[2.5rem] p-12 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-soft-celadon/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-pale-mint/10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
          
          <div className="relative z-10 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Want to collaborate?
            </h2>
            <p className="text-pale-mint text-lg max-w-md">
              We'd love to hear about your event and explore how we can help make it exceptional.
            </p>
          </div>
          <div className="relative z-10 shrink-0">
            <Link to="/contact" className="inline-block py-4 px-10 rounded-2xl bg-white text-deep-espresso font-bold hover:-translate-y-1 transition-all shadow-[0_8px_24px_rgba(156,174,169,0.2)] cursor-pointer">
              Contact us
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
