import React, { Component } from 'react';
import { ProductCard, StorefrontProductCard } from './index';
import type { ComponentPreviewModule } from '../previewTypes';
const noop = async () => {
  await new Promise((r) => setTimeout(r, 600));
};
const base: StorefrontProductCard = {
  id: 'p1',
  handle: 'levandulovy-olej',
  title: 'Levanduľový upokojujúci olej',
  availableForSale: true,
  featuredImage: {
    url: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&q=80',
    altText: 'Levanduľový olej'
  },
  priceRange: {
    minVariantPrice: {
      amount: '24,90',
      currencyCode: '€'
    }
  }
};
const previews: ComponentPreviewModule = {
  componentName: 'ProductCard',
  importPath: 'components/ProductCard',
  previews: [
  {
    name: 'Default',
    description: 'Hover the tile to reveal the quick-add button',
    render: () =>
    <div
      style={{
        width: 280
      }}>
      
          <ProductCard product={base} onAddToCart={noop} />
        </div>

  },
  {
    name: 'With badge',
    description: 'Sale badge overlay',
    render: () =>
    <div
      style={{
        width: 280
      }}>
      
          <ProductCard
        product={{
          ...base,
          badge: 'Zľava'
        }}
        onAddToCart={noop} />
      
        </div>

  },
  {
    name: 'Sold out',
    description: 'Unavailable product',
    render: () =>
    <div
      style={{
        width: 280
      }}>
      
          <ProductCard
        product={{
          ...base,
          availableForSale: false,
          badge: 'Vypredané'
        }}
        onAddToCart={noop} />
      
        </div>

  }]

};
export default previews;