import Slider from "react-slick";

const SizeChart = ({ images }) => {
  const normalizedImages = Array.isArray(images)
    ? images.filter(Boolean)
    : images
      ? [images]
      : [];

  if (!normalizedImages.length) return null;
  const SlickSlider = Slider?.default || Slider;

  const sliderSettings = {
    dots: normalizedImages.length > 1,
    arrows: normalizedImages.length > 1,
    infinite: normalizedImages.length > 1,
    speed: 350,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
  };

  return (
    <div className="size-chart-slider overflow-hidden rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
      <SlickSlider {...sliderSettings}>
        {normalizedImages.map((image, index) => (
          <div key={`${image}-${index}`} className="px-1">
            <img
              src={image}
              alt={`Size chart ${index + 1}`}
              className="mx-auto max-h-[70vh] w-auto max-w-full rounded-lg object-contain"
            />
          </div>
        ))}
      </SlickSlider>
    </div>
  );
};

export default SizeChart;
