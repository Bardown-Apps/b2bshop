import { TRENDING } from '@/constants/navigation'
import SectionHeader from '@/components/SectionHeader'
import ProductCard from '@/components/ProductCard'
import CTABanner from '@/components/CTABanner'

const TrendingSection = ({ onAction }) => (
  <section id="new" className="py-10 md:py-16 bg-white">
    <div className="max-w-[1400px] mx-auto px-4 md:px-8">
      <SectionHeader
        title="New & Trending"
        subtitle="Elevate your game with our latest styles"
        actionLabel="Explore All"
        onAction={onAction}
      />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {TRENDING.map((product) => (
          <ProductCard key={product.sku} product={product} onClick={onAction} />
        ))}
      </div>
      <CTABanner onAction={onAction} />
    </div>
  </section>
)

export default TrendingSection
