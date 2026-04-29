import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Faq = () => {
  const { shopName, faqs } = useSelector((s) => s.shop);

  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    document.title = shopName ? `${shopName} FAQs` : "FAQs";
  }, [shopName]);

  const hasFaqs = Array.isArray(faqs) && faqs.length > 0;

  const toggleIndex = (index) => {
    setOpenIndex((current) => (current === index ? null : index));
  };

  return (
    <div className="mx-auto text-base leading-7 text-gray-700">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
        Frequently Asked Questions
      </h1>

      {!hasFaqs ? (
        <div className="mt-10 rounded-lg border border-dashed border-gray-300 bg-gray-50 px-6 py-10 text-center">
          <p className="text-sm font-medium text-gray-500">
            No FAQs are available right now.
          </p>
        </div>
      ) : (
        <dl className="mt-8 space-y-4">
          {faqs.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={item.id || index}
                className="rounded-lg border border-gray-200 bg-white"
              >
                <button
                  type="button"
                  onClick={() => toggleIndex(index)}
                  className="flex w-full items-center justify-between px-4 py-3 text-left"
                >
                  <div>
                    <dt className="text-base font-semibold text-gray-900">
                      {item.question}
                    </dt>
                  </div>

                  <span className="ml-4 flex h-6 w-6 items-center justify-center rounded-full border border-gray-300 text-gray-500 text-xs">
                    {isOpen ? "-" : "+"}
                  </span>
                </button>

                {isOpen ? (
                  <dd className="px-4 pb-4 text-sm text-gray-600">
                    <div
                      className="mt-2"
                      dangerouslySetInnerHTML={{ __html: item.answer }}
                    ></div>
                  </dd>
                ) : null}
              </div>
            );
          })}
        </dl>
      )}
    </div>
  );
};

export default Faq;
