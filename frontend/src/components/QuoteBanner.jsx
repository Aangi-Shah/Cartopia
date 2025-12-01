import React, { useEffect, useState } from "react";

const QuoteBanner = () => {
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const res = await fetch("https://api.quotable.io/random");
        const data = await res.json();
        setQuote(data);
      } catch (error) {
        console.log("Quote fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuote();
  }, []);

  if (loading) return null;

  if (!quote) return null;

  return (
    <section className="w-full my-6 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-xs sm:text-sm text-gray-700">
      <p className="italic">
        “{quote.content}”
      </p>
      <p className="mt-1 text-right text-[11px] sm:text-xs text-gray-500">
        — {quote.author}
      </p>
    </section>
  );
};

export default QuoteBanner;