import Slider from "react-slick";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { useSelector } from "react-redux";
import { PRODUCTS } from "@/constants/services";
import { useFetch } from "@/hooks/useFetch";
import { useNavigate } from "react-router-dom";
import { Product } from "@/constants/routes";
import { useEffect, useState } from "react";

const settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 2,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
        infinite: true,
        dots: true,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        initialSlide: 1,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
};

const Images = ({ product, setProduct }) => {
  let navigate = useNavigate();
  // const { setProduct } = useProduct();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const products = useSelector((state) => state.products.list);

  // Create a Set to track unique image URLs
  const uniqueImageUrls = new Set();
  let images = [];

  // Add default image if it exists and is unique
  if (
    product?.defaultImageUrl &&
    !uniqueImageUrls.has(product.defaultImageUrl)
  ) {
    uniqueImageUrls.add(product.defaultImageUrl);
    images.push({ imageUrl: product.defaultImageUrl });
  }

  // Add media files if they are unique
  if (product?.mediaFiles) {
    product.mediaFiles.forEach((file) => {
      if (file?.imageUrl && !uniqueImageUrls.has(file.imageUrl)) {
        uniqueImageUrls.add(file.imageUrl);
        images.push(file);
      }
    });
  }

  // Add variant combination image if it exists and is unique
  if (
    product?.variantCombinationImage &&
    !uniqueImageUrls.has(product.variantCombinationImage)
  ) {
    uniqueImageUrls.add(product.variantCombinationImage);
    images.push({ imageUrl: product.variantCombinationImage });
  }

  const relatedProducts = products?.data?.filter(
    (p) => p?.prodId !== product?.prodId,
  );

  useEffect(() => {
    if (!product?.variantCombinationImage) setSelectedIndex(0);

    if (product?.variantCombinationImage) {
      const index = images?.findIndex(
        (image) => image.imageUrl === product.variantCombinationImage,
      );

      if (index !== -1) setSelectedIndex(index);
    }
  }, [product?.variantCombinationImage]);

  return (
    <div className="animate-fade-up" style={{ animationDuration: "0.4s" }}>
      <TabGroup
        className="flex flex-col-reverse gap-4"
        selectedIndex={selectedIndex}
        onChange={(i) => {
          setSelectedIndex(i);

          // if (images[i].imageUrl) {
          //   setProduct({
          //     ...product,
          //     variantCombinationImage: images[i].imageUrl,
          //  });
          // }
        }}
      >
        <div className="mx-auto mt-3 w-full max-w-2xl sm:block lg:max-w-none">
          <TabList className="grid grid-cols-4 gap-3">
            {images.map((image, index) => (
              <Tab
                key={`mediaFiles${index}`}
                className="group relative flex h-20 cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-white text-sm font-medium uppercase text-slate-900 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow focus:outline-none focus:ring-2 focus:ring-slate-200 focus:ring-offset-1"
              >
                <span className="sr-only">{image.name}</span>
                <span className="absolute inset-0 overflow-hidden rounded-md">
                  <img
                    alt=""
                    src={image.imageUrl}
                    className="h-full w-full object-contain object-center"
                  />

                  {/* {product?.remVariantImgUrl && (
                    <img
                      src={product?.remVariantImgUrl}
                      className="h-full w-full object-contain object-center"
                    />
                  )} */}
                </span>
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 rounded-lg ring-2 ring-transparent ring-offset-2 "
                />
              </Tab>
            ))}
          </TabList>
        </div>

        <TabPanels
          // className="aspect-h-1 md:aspect-h-[0.5] lg:aspect-h-1 aspect-w-1 w-full"
          defaultValue={0}
        >
          {images.length > 0 ? (
            images.map((image, index) => (
              <TabPanel
                key={`mediaFiless${index}`}
                className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
              >
                <img
                  src={image.imageUrl}
                  className="h-full w-full object-contain object-center"
                />

                {product?.colorVariantImgUrl && (
                  <img
                    src={product?.colorVariantImgUrl}
                    className="h-full w-full object-contain object-center absolute top-0 left-0"
                  />
                )}

                {product?.variantImgUrl && (
                  <img
                    src={product?.variantImgUrl}
                    className="w-48 object-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                  />
                )}
              </TabPanel>
            ))
          ) : (
            <TabPanel className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
              <img
                src={product.defaultImageUrl}
                className="h-full w-full object-contain object-center sm:rounded-lg"
              />
            </TabPanel>
          )}
        </TabPanels>
      </TabGroup>

      {relatedProducts?.length > 0 && (
        <div className="mt-10 border-t border-slate-200 pt-6">
          <h2 className="text-xl font-bold text-slate-900">Related Products</h2>

          <div className="pt-5">
            <Slider {...settings}>
              {relatedProducts?.map((rp, index) => {
                return (
                  <div
                    key={rp.prodId + index}
                    className="inline-flex w-64 cursor-pointer px-2"
                    onClick={() => {
                      setProduct(rp);
                      navigate(Product.path.replace(":productId", rp.prodId));
                    }}
                  >
                    <div className="group relative w-full rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
                      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-slate-50">
                        <img
                          alt={rp.name}
                          src={rp.defaultImageUrl}
                          className="h-full w-full object-contain object-center group-hover:opacity-75"
                        />
                      </div>
                      <div className="mt-3 text-left">
                        <h3 className="truncate text-sm font-semibold text-slate-900">
                          <a href={rp.href}>
                            <span className="absolute inset-0" />
                            {rp.name}
                          </a>
                        </h3>

                        {Number(rp.price) > 0 && (
                          <p className="mt-1 text-sm font-medium text-slate-700">
                            ${rp.price.toFixed(2)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </Slider>
          </div>
        </div>
      )}
    </div>
  );
};

export default Images;
