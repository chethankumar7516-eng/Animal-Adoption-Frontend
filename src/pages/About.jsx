import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Dog, MessageCircle, Handshake } from "lucide-react";

const About = () => {
  const petImagesGroup = [
    "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&q=80&w=800",
  ];

  return (
    <div className="relative min-h-screen bg-[#FAF6F0] text-[#3D2314] font-sans flex flex-col justify-between overflow-hidden">
      <style>{`
        @keyframes scrollUp {
          0% { transform: translateY(0%); }
          100% { transform: translateY(-50%); }
        }

        .animate-scroll-up {
          animation: scrollUp 30s linear infinite;
        }

        @keyframes pulseGlow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.05); }
        }

        .animate-glow {
          animation: pulseGlow 6s ease-in-out infinite;
        }
      `}</style>

      {/* Background Animated Image Columns */}
      <div className="absolute inset-0 grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 opacity-25 pointer-events-none filter sepia-[0.3] brightness-95">
        {[1, 2, 3, 4].map((colIndex) => (
          <div
            key={`col-${colIndex}`}
            className="flex flex-col gap-4 animate-scroll-up"
          >
            {[...petImagesGroup, ...petImagesGroup].map((img, index) => (
              <div
                key={`img-${colIndex}-${index}`}
                className="h-64 w-full rounded-2xl overflow-hidden shadow-sm flex-shrink-0 border border-[#E6DCCF]"
              >
                <img
                  src={img}
                  alt="Pet"
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="absolute inset-0 bg-[#FAF6F0]/75 backdrop-blur-sm pointer-events-none z-0" />

      <Navbar />

      <main className="relative z-10 max-w-5xl mx-auto px-6 py-12 md:py-16 my-auto w-full">
        {/* Header Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-6 mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#E6DCCF] text-[#8B5A2B] text-xs font-bold tracking-wider uppercase shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#8B5A2B] animate-pulse" />
            100% Free Adoption Platform
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-[#3D2314] tracking-tight leading-tight">
            Connecting Pets With Loving Homes,
            <span className="text-[#8B5A2B]"> Completely Free</span>
          </h1>

          <p className="text-base sm:text-lg text-[#6E5D4F] leading-relaxed font-semibold bg-white/80 backdrop-blur-sm rounded-xl p-5 border border-[#E6DCCF] shadow-sm">
            PetMarket connects pet lovers directly with providers and shelter admins.
            Providers list pets seeking homes, while users can browse listings, submit
            adoption requests, and message providers directly to complete the adoption.
          </p>
        </div>

        {/* INTERNSHIP CREDITS CARD */}
        <div className="bg-gradient-to-r from-[#3D2314] to-[#5A3825] text-white rounded-2xl p-6 sm:p-8 shadow-xl mb-12 relative overflow-hidden group border border-[#8B5A2B]/30">
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-[#8B5A2B]/30 rounded-full blur-2xl pointer-events-none animate-glow" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-4 text-center md:text-left">
              <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="bg-white p-2 rounded-xl shadow-md inline-block">
                  <img
                    src="https://th.bing.com/th/id/OIP.loWQP3W_XKllHg6rBq7BGgHaHa?w=192&h=192&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3"
                    alt="CodeLab Systems Logo"
                    className="h-10 w-auto object-contain"
                  />
                </div>

                <div className="inline-block px-3 py-1 bg-[#8B5A2B]/40 border border-[#A06C3F]/40 rounded-lg text-xs font-bold text-[#E6DCCF] uppercase tracking-wide">
                  Internship Partner
                </div>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#FAF6F0]">
                CodeLab Systems, Mangaluru
              </h2>

              <p className="text-sm text-[#E6DCCF]/90 max-w-xl leading-relaxed">
                This project was designed, developed, and deployed during our
                Internship Program at <strong>CodeLab Systems, Mangaluru</strong>{" "}
                to solve real-world pet welfare challenges through software innovation.
              </p>

              <div className="pt-2">
                <a
                  href="https://www.codelabsystems.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-bold bg-[#8B5A2B]/30 hover:bg-[#8B5A2B]/50 border border-[#A06C3F]/40 px-4 py-2 rounded-lg transition-colors text-[#FAF6F0]"
                >
                  <span>Visit CodeLab Systems</span>

                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </div>
            </div>

            <div className="flex-shrink-0 bg-white/10 backdrop-blur-md border border-[#E6DCCF]/20 p-5 rounded-xl text-center min-w-[160px]">
              <span className="text-3xl font-black text-[#A06C3F] block">
                2026
              </span>

              <span className="text-xs uppercase font-bold text-[#FAF6F0] tracking-wider">
                Internship Batch
              </span>
            </div>
          </div>
        </div>

        {/* MISSION */}
        <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl border border-[#E6DCCF] shadow-md mb-12">
          <h2 className="text-2xl font-black text-[#3D2314] mb-4">
            Our Mission & Philosophy
          </h2>

          <div className="grid md:grid-cols-2 gap-6 text-sm text-[#6E5D4F] leading-relaxed">
            <p>
              Millions of pets end up in shelters or without homes every year.
              PetMarket provides a direct digital solution enabling pet admins and
              providers to upload pet details and facilitate direct adoptions.
            </p>

            <p>
              By offering direct messaging and structured requests, we empower adopters
              and providers to seamlessly coordinate and ensure every pet finds a caring family.
            </p>
          </div>
        </div>

        {/* FEATURES */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl border border-[#E6DCCF] shadow-md hover:border-[#8B5A2B] hover:-translate-y-1 transition-all">
            <div className="w-12 h-12 rounded-xl bg-[#FAF6F0] border border-[#E6DCCF] flex items-center justify-center text-[#8B5A2B] mb-4">
              <Dog className="w-6 h-6 stroke-[2.25]" />
            </div>

            <h3 className="text-lg font-black text-[#3D2314] mb-2">
              Provider Uploads
            </h3>

            <p className="text-sm text-[#6E5D4F]">
              Verified providers and admins easily upload profiles, pictures, and details for pets in need.
            </p>
          </div>

          <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl border border-[#E6DCCF] shadow-md hover:border-[#8B5A2B] hover:-translate-y-1 transition-all">
            <div className="w-12 h-12 rounded-xl bg-[#FAF6F0] border border-[#E6DCCF] flex items-center justify-center text-[#8B5A2B] mb-4">
              <MessageCircle className="w-6 h-6 stroke-[2.25]" />
            </div>

            <h3 className="text-lg font-black text-[#3D2314] mb-2">
              Direct Messaging
            </h3>

            <p className="text-sm text-[#6E5D4F]">
              Users connect with providers via direct messaging to ask questions and coordinate adoptions.
            </p>
          </div>

          <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl border border-[#E6DCCF] shadow-md hover:border-[#8B5A2B] hover:-translate-y-1 transition-all">
            <div className="w-12 h-12 rounded-xl bg-[#FAF6F0] border border-[#E6DCCF] flex items-center justify-center text-[#8B5A2B] mb-4">
              <Handshake className="w-6 h-6 stroke-[2.25]" />
            </div>

            <h3 className="text-lg font-black text-[#3D2314] mb-2">
              Request & Adopt
            </h3>

            <p className="text-sm text-[#6E5D4F]">
              Submit formal adoption requests directly to providers to start the adoption process smoothly.
            </p>
          </div>
        </div>

        {/* HOW IT WORKS */}
        <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl border border-[#E6DCCF] shadow-md mb-12">
          <h2 className="text-2xl font-black text-[#3D2314] mb-6 text-center">
            How PetMarket Works
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-14 h-14 mx-auto rounded-full bg-[#8B5A2B] text-white flex items-center justify-center font-bold text-xl mb-4 shadow-md">
                1
              </div>

              <h3 className="font-extrabold text-[#3D2314] mb-2">
                Browse Listings
              </h3>

              <p className="text-sm text-[#6E5D4F]">
                Users explore pets uploaded by providers and shelter admins.
              </p>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 mx-auto rounded-full bg-[#8B5A2B] text-white flex items-center justify-center font-bold text-xl mb-4 shadow-md">
                2
              </div>

              <h3 className="font-extrabold text-[#3D2314] mb-2">
                Request & Chat
              </h3>

              <p className="text-sm text-[#6E5D4F]">
                Send an adoption request and message the provider directly.
              </p>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 mx-auto rounded-full bg-[#8B5A2B] text-white flex items-center justify-center font-bold text-xl mb-4 shadow-md">
                3
              </div>

              <h3 className="font-extrabold text-[#3D2314] mb-2">
                Welcome Pet Home
              </h3>

              <p className="text-sm text-[#6E5D4F]">
                Finalize adoption details with the provider and bring your pet home.
              </p>
            </div>
          </div>
        </div>

        {/* CTA SECTION */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#3D2314] via-[#5A3825] to-[#8B5A2B] p-10 text-center shadow-xl border border-[#8B5A2B]/40">
          <div className="absolute inset-0 opacity-15">
            <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-56 h-56 bg-white rounded-full blur-3xl" />
          </div>

          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl font-black text-[#FAF6F0] mb-4">
              Ready to Find Your New Best Friend?
            </h2>

            <p className="text-[#E6DCCF] max-w-2xl mx-auto mb-8 font-medium">
              Join thousands of pet lovers using PetMarket to connect directly with pet providers.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/user/register"
                className="px-7 py-3.5 bg-[#8B5A2B] hover:bg-[#724820] text-white font-bold rounded-xl shadow-lg transition"
              >
                Browse Pets
              </Link>

              <Link
                to="/provider/register"
                className="px-7 py-3.5 border border-[#E6DCCF]/50 text-[#FAF6F0] font-bold rounded-xl hover:bg-white/10 transition"
              >
                Become a Provider
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;