import { useState, useEffect } from 'react';

export function useTopRatedProducts() {
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const abortController = new AbortController();

    const fetchTopProducts = async () => {
      setLoading(true);
      try {
        // Pointing directly to your local backend
        const res = await fetch('http://localhost:4000/topproducts', {
          signal: abortController.signal,
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch top products: ${res.status}`);
        }

        const jsonData = await res.json();
        setTopProducts(jsonData);
      } catch (err) {
        // Ignore abort errors if the component unmounts mid-fetch
        if (err.name !== 'AbortError') {
          setError(err.message || 'An error occurred while fetching products');
        }
      } finally {
        if (!abortController.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchTopProducts();

    // Cleanup function to abort fetch if user navigates away
    return () => abortController.abort();
  }, []);

  return { topProducts, loading, error };
}