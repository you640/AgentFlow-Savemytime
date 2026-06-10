import React, { Component } from 'react';
import { AddToCartButton } from './index';
import type { ComponentPreviewModule } from '../previewTypes';
const noop = async () => {
  await new Promise((r) => setTimeout(r, 800));
};
const previews: ComponentPreviewModule = {
  componentName: 'AddToCartButton',
  importPath: 'components/AddToCartButton',
  previews: [
  {
    name: 'Default',
    description: 'Primary buy CTA — click to see the loading state',
    render: () =>
    <div
      style={{
        width: 280
      }}>
      
          <AddToCartButton productId="p1" availableForSale onAddToCart={noop} />
        </div>

  },
  {
    name: 'Quick add',
    description: 'Frosted quick-add used in product card hover',
    render: () =>
    <div
      className="bg-gm-bg-soft p-8 rounded-gm-lg"
      style={{
        width: 280
      }}>
      
          <AddToCartButton
        productId="p1"
        variant="quick-add"
        availableForSale
        onAddToCart={noop} />
      
        </div>

  },
  {
    name: 'Sold out',
    description: 'Disabled when unavailable',
    render: () =>
    <div
      style={{
        width: 280
      }}>
      
          <AddToCartButton
        productId="p1"
        availableForSale={false}
        onAddToCart={noop} />
      
        </div>

  }]

};
export default previews;