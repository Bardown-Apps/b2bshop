import { FOOTER_LINKS } from "@/constants/navigation";
import { Link } from "react-router-dom";
import useInView from "@/hooks/useInView";

const Footer = () => {
  const [ref, inView] = useInView({ threshold: 0.1 });

  return (
    <footer className="bg-slate-950 text-white">
      <div
        ref={ref}
        className={`max-w-[1400px] mx-auto px-4 md:px-8 py-14 md:py-20 ${
          inView ? "animate-fade-in" : "opacity-0"
        }`}
        style={{ animationDelay: "0.1s" }}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          <div className="col-span-2 md:col-span-1">
            <h4 className="text-xl font-bold tracking-tight mb-4">
              Bardown B2B
            </h4>
            <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
              Your trusted B2B wholesale partner for premium sportswear and
              athletic apparel.
            </p>
          </div>
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h5 className="text-sm font-bold uppercase tracking-wider mb-4 md:mb-5 text-white/80">
                {title}
              </h5>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <Link
                      to="/"
                      className="text-sm text-slate-500 hover:text-white transition-colors duration-200 hover:translate-x-0.5 inline-block"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-slate-800 mt-10 md:mt-14 pt-8 md:pt-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} Bardown B2B. All rights reserved.
          </p>
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="text-xs text-slate-500 hover:text-white transition-colors duration-200"
            >
              Privacy Policy
            </Link>
            <Link
              to="/"
              className="text-xs text-slate-500 hover:text-white transition-colors duration-200"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
