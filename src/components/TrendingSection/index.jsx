import { TRENDING } from "@/constants/navigation";
import SectionHeader from "@/components/SectionHeader";
import ProductCard from "@/components/ProductCard";
import CTABanner from "@/components/CTABanner";
import useInView from "@/hooks/useInView";

const TrendingSection = ({ onAction }) => {
  const [ref, inView] = useInView({ threshold: 0.05 });

  return (
    <section id="new" className="py-14 md:py-24 bg-white">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <SectionHeader
          title="New & Trending"
          subtitle="Elevate your game with our latest styles"
          actionLabel="Explore All"
          onAction={onAction}
        />
        <div
          ref={ref}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-5"
        >
          {TRENDING.map((product, i) => (
            <ProductCard
              key={product.sku}
              product={product}
              onClick={onAction}
              className={inView ? "animate-fade-up" : "opacity-0"}
              style={{ animationDelay: `${i * 0.08}s` }}
            />
          ))}
        </div>
        <CTABanner onAction={onAction} />
      </div>
    </section>
  );
};

export default TrendingSection;
