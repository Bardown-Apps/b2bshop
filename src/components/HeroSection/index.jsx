import { HERO_STATS } from "@/constants/navigation";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import heroBg from "@/assets/hero-bg.png";
import heroBg1 from "@/assets/adrenalin.jpg";

const HeroSection = ({ onSignIn }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <section className="relative bg-slate-950 text-white overflow-hidden min-h-[400px] sm:min-h-[480px] md:min-h-[580px] flex items-center">
      <img
        src={isAuthenticated ? heroBg1 : heroBg}
        alt=""
        className="absolute inset-0 w-full h-full object-cover object-[center_40%]"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/70 to-slate-950/50" />

      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-900/20 rounded-full blur-3xl animate-float" />
      <div
        className="absolute bottom-0 left-1/4 w-80 h-80 bg-blue-900/10 rounded-full blur-3xl animate-float"
        style={{ animationDelay: "3s" }}
      />

      <div className="relative max-w-[1400px] mx-auto px-4 md:px-8 py-16 md:py-24 flex flex-col md:flex-row items-center gap-10 md:gap-16 w-full">
        <div className="flex-1 text-center md:text-left">
          <div className="inline-block bg-red-600 text-white text-[10px] sm:text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5 md:mb-7 animate-fade-up">
            5-Day Freestyle Sublimation
          </div>
          <h1
            className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight mb-4 md:mb-5 leading-[0.95] animate-fade-up"
            style={{ animationDelay: "0.15s" }}
          >
            More Flex.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">
              Less Wait.
            </span>
          </h1>
          <p
            className="text-base sm:text-lg md:text-xl text-slate-300 mb-2 md:mb-3 animate-fade-up"
            style={{ animationDelay: "0.3s" }}
          >
            <strong className="text-white">MORE</strong> styles.{" "}
            <strong className="text-white">MORE</strong> designs.{" "}
            <strong className="text-white">MORE</strong> choice.
          </p>
          <p
            className="text-sm sm:text-base text-slate-500 mb-8 md:mb-10 max-w-lg mx-auto md:mx-0 animate-fade-up"
            style={{ animationDelay: "0.4s" }}
          >
            Your custom sublimation unleashed in just 5 days.
          </p>
          <div
            className="flex flex-wrap gap-4 justify-center md:justify-start animate-fade-up"
            style={{ animationDelay: "0.55s" }}
          >
            <button
              onClick={onSignIn}
              className="group px-7 sm:px-10 py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow-lg shadow-red-900/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-red-900/50 text-xs sm:text-sm uppercase tracking-wide cursor-pointer"
            >
              Sign In to Order
            </button>
            <Link
              to="/"
              className="px-7 sm:px-10 py-3.5 border border-white/30 text-white hover:bg-white/10 hover:border-white/50 font-semibold rounded-lg transition-all duration-300 text-xs sm:text-sm uppercase tracking-wide"
            >
              Browse Catalogue
            </Link>
          </div>
        </div>

        <div className="flex flex-row md:flex-col gap-4 md:gap-5 shrink-0">
          {HERO_STATS.map((s, i) => (
            <div
              key={s.label}
              className="bg-white/5 border border-white/10 rounded-2xl px-5 sm:px-7 py-4 sm:py-5 text-center backdrop-blur-md flex-1 md:flex-none hover:bg-white/10 hover:border-white/20 transition-all duration-300 animate-slide-right"
              style={{ animationDelay: `${0.3 + i * 0.15}s` }}
            >
              <p className="text-2xl sm:text-4xl font-black text-red-400">
                {s.num}
              </p>
              <p className="text-[10px] sm:text-xs text-slate-500 font-medium uppercase tracking-wide mt-1">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
