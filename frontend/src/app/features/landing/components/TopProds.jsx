"use client"
import React from 'react'
// Make sure this path is correct based on your folder structure
import { useTopRatedProducts } from '../hooks/TopProds' 

export default function TopProds() {
  // 1. Call the hook at the TOP LEVEL of the component
  const { topProducts, loading, error } = useTopRatedProducts();

  // 2. Handle loading and error states
  if (loading) return <p className="text-teal-500">Loading top products...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  // 3. Render the data
  return (
    <div>
      <h2 className="text-xl text-teal-300 mb-4">Top Rated Products</h2>
      
      {/* If the array is empty */}
      {topProducts.length === 0 && <p>No products found.</p>}

      {/* Map through the data */}
           <div className="grid grid-cols-4 gap-6 font-mono">
        {topProducts.map((product) => (
          <div key={product.id} className="group order priority-67 curtain-horizontal appear flex flex-col w-full">
            
            {/* The Nested Beveled Wrapper */}
            <div className="beveled-left w-full bg-teal-300/50 group-hover:bg-teal-300 p-px transition-colors duration-300 flex-grow">
              
              {/* The Inner Dark Card */}
              <div className="beveled-left w-full h-full bg-gray-800 p-4 flex flex-col">
                
                {/* Image Container */}
                <div className="relative overflow-hidden beveled-right h-48 w-full flex items-center justify-center bg-gray-900/50 mb-4 p-2">
  
  {/* Overlay */}
  <div className="absolute inset-0 bg-gray-800 mix-blend-color z-10 opacity-50 pointer-events-none"></div>
  
  {/* Image */}
  <img 
    src={product.image} 
    alt={product.title}
    className="w-full h-full object-contain grayscale hover:grayscale-0 appear click-expand amount-11"
  />
</div>

                {/* Product Title */}
                <h3 className="text-teal-300 text-sm leading-tight mb-4 flex-grow">
                  {product.title}
                </h3>

                {/* Price & Rating Row */}
                <div className="flex justify-between items-end border-t border-teal-300/20 pt-3 mt-auto">
                  <span className="text-teal-200 text-lg">
                    ${product.price}
                  </span>
                  <span className="text-teal-500 text-xs flex items-center gap-1">
                    ★ {product.rating.rate} <span className="text-teal-700">({product.rating.count})</span>
                  </span>
                </div>

              </div>
            </div>
            
          </div>
        ))}
      </div>

      {/* If you REALLY want a button to manually re-fetch, you shouldn't use this hook as-is. 
          But for now, the data is already fetched automatically on page load. */}
    </div>
  )
}