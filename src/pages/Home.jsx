import { useRef } from "react";
import { Link } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { PawPrint, Search, MessageCircle, Home as HomeIcon } from "lucide-react";

function Home() {
  const box1 = useRef(null);
  const trackRef = useRef(null);

  useGSAP(() => {
    // Continuous smooth floating animation for hero image
    gsap.to(box1.current, {
      scale: 1.02,
      y: -10,
      duration: 2.5,
      ease: "power1.inOut",
      yoyo: true,
      repeat: 1,
    });

    // Seamless loop for moving gallery track
    gsap.to(trackRef.current, {
      xPercent: -50,
      duration: 20,
      ease: "none",
      repeat: -1,
    });
  });

  // Active image URLs for the continuous carousel
  const images = [
    "https://wallpaperaccess.com/full/2965621.jpg",
    "https://tse1.explicit.bing.net/th/id/OIP.mJgZ6RI1oDbRtv3JSr0t8QHaFj?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
    "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80",
    "https://wallpapercave.com/wp/wp11074079.jpg",
    "https://www.doghowto.com/wp-content/uploads/2024/02/puppy-follows-me-everywhere.jpg",
  ];

  // Duplicate array so images loop seamlessly without gaps
  const imageList = [...images, ...images];

  return (
    <main className="min-h-screen w-full bg-[#FAF6F0] overflow-x-hidden">
      {/* Header */}
      <header className="border-b border-[#E6DCCF] bg-white sticky top-0 z-50">
        <div className="flex w-full items-center justify-between px-6 py-4 lg:px-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#8B5A2B] text-white shadow-sm">
                <PawPrint className="h-6 w-6 stroke-[2.5]" />
              </div>
              <div>
                <h1 className="text-xl font-black leading-tight text-[#3D2314]">
                  PetConnect
                </h1>
                <p className="text-xs font-medium text-[#A06C3F]">
                  Find. Connect. Love.
                </p>
              </div>
            </Link>

            <Link
              to="/about"
              className="hidden font-semibold text-[#6E5D4F] transition hover:text-[#3D2314] md:inline-block"
            >
              About us
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/user/login"
              className="rounded-xl px-4 py-2 text-sm font-semibold text-[#3D2314] transition hover:bg-[#FAF6F0]"
            >
              User Login
            </Link>

            <Link
              to="/provider/login"
              className="rounded-xl bg-[#8B5A2B] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#724820]"
            >
              Provider Login
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="w-full px-6 py-16 lg:px-16 lg:py-24 xl:px-24">
        <div className="grid w-full items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left Content */}
          <div className="flex flex-col items-start">
            <span className="rounded-full bg-[#8B5A2B]/10 px-3.5 py-1 text-xs font-bold tracking-wider text-[#8B5A2B]">
              WELCOME TO PETCONNECT
            </span>

            <h2 className="mt-4 text-4xl font-black leading-tight text-[#3D2314] sm:text-5xl lg:text-6xl xl:text-7xl">
              Find a loving pet to call
              <span className="text-[#8B5A2B]"> family.</span>
            </h2>

            <p className="mt-6 max-w-2xl text-base leading-relaxed text-[#6E5D4F] sm:text-lg lg:text-xl">
              PetConnect helps people discover pets looking for a loving home
              and connects them directly with trusted pet providers.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/user/register"
                className="rounded-xl bg-[#8B5A2B] px-7 py-3.5 font-bold text-white shadow-lg shadow-[#8B5A2B]/20 transition hover:bg-[#724820] active:scale-[0.98]"
              >
                Find a Pet
              </Link>

              <Link
                to="/provider/register"
                className="rounded-xl border border-[#E6DCCF] bg-white px-7 py-3.5 font-bold text-[#3D2314] shadow-sm transition hover:bg-[#FAF6F0] active:scale-[0.98]"
              >
                Become a Provider
              </Link>
            </div>
          </div>

          {/* Right Visual - Hero Image */}
          <div className="flex w-full justify-center">
            <div className="relative flex h-[320px] w-[320px] items-center justify-center rounded-full bg-[#8B5A2B]/10 p-4 shadow-xl ring-8 ring-white/60 sm:h-[380px] sm:w-[380px] lg:h-[460px] lg:w-[460px]">
              <div
                ref={box1}
                className="h-full w-full overflow-hidden rounded-full border-4 border-[#8B5A2B] shadow-2xl"
              >
                <img
                  src="https://images.unsplash.com/photo-1591160690555-5debfba289f0?auto=format&fit=crop&w=1000&q=80"
                  alt="Cute Golden Retriever Puppy"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features & Continuous Moving Gallery */}
      <section className="w-full border-t border-[#E6DCCF] bg-white py-20">
        <div className="w-full">
          <div className="mb-12 text-center px-6 lg:px-16 xl:px-24">
            <h2 className="text-3xl font-black text-[#3D2314] lg:text-4xl">
              How PetConnect Works
            </h2>

            <p className="mt-3 text-[#6E5D4F]">
              A simple way to connect pets with their future families.
            </p>
          </div>

          {/* Continuous Moving Track */}
          <div className="w-full overflow-hidden py-4 mb-16">
            <div ref={trackRef} className="flex gap-6 w-max">
              {imageList.map((src, index) => (
                <div
                  key={index}
                  className="w-64 h-44 flex-shrink-0 rounded-2xl overflow-hidden shadow-sm border border-[#E6DCCF] bg-[#FAF6F0]"
                >
                  <img
                    src={src}
                    alt={`Pet ${(index % images.length) + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="grid w-full gap-8 md:grid-cols-3 px-6 lg:px-16 xl:px-24">
            {/* Feature 1 */}
            <div className="rounded-2xl border border-[#E6DCCF] bg-[#FAF6F0]/60 p-8 transition duration-200 hover:-translate-y-1 hover:shadow-lg">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-[#8B5A2B]/10 text-[#8B5A2B]">
                <Search className="h-7 w-7 stroke-[2.25]" />
              </div>

              <h3 className="text-xl font-black text-[#3D2314]">
                Discover Pets
              </h3>

              <p className="mt-3 leading-7 text-[#6E5D4F]">
                Browse pets available from registered providers.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-2xl border border-[#E6DCCF] bg-[#FAF6F0]/60 p-8 transition duration-200 hover:-translate-y-1 hover:shadow-lg">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-[#8B5A2B]/10 text-[#8B5A2B]">
                <MessageCircle className="h-7 w-7 stroke-[2.25]" />
              </div>

              <h3 className="text-xl font-black text-[#3D2314]">Connect</h3>

              <p className="mt-3 leading-7 text-[#6E5D4F]">
                Send messages and communicate directly with providers.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-2xl border border-[#E6DCCF] bg-[#FAF6F0]/60 p-8 transition duration-200 hover:-translate-y-1 hover:shadow-lg">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-[#8B5A2B]/10 text-[#8B5A2B]">
                <HomeIcon className="h-7 w-7 stroke-[2.25]" />
              </div>

              <h3 className="text-xl font-black text-[#3D2314]">
                Find a Friend
              </h3>

              <p className="mt-3 leading-7 text-[#6E5D4F]">
                Give a pet a loving home and start a beautiful journey together.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-[#E6DCCF] bg-white py-8">
        <div className="w-full px-6 text-center text-sm font-medium text-[#6E5D4F] lg:px-16">
          © 2026 PetConnect. All rights reserved.
        </div>
      </footer>
    </main>
  );
}

export default Home;