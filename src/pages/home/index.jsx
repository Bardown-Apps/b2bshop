import HeroSection from "@/components/HeroSection";
// import BrandBar from "@/components/BrandBar";
import CategoryGrid from "@/components/CategoryGrid";
import QuickLinks from "@/components/QuickLinks";
import TrendingSection from "@/components/TrendingSection";
import { useOutletContext } from "react-router-dom";

const Home = () => {
  const { openLogin } = useOutletContext();

  return (
    <>
      <HeroSection onSignIn={openLogin} />
      {/* <BrandBar /> */}
      <CategoryGrid onAction={openLogin} />
      <QuickLinks onAction={openLogin} />
      <TrendingSection onAction={openLogin} />
    </>
  );
};

export default Home;
