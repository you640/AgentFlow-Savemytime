import React, { Component } from 'react';
import { OrderSummary } from './index';
import type { ComponentPreviewModule } from '../previewTypes';
const previews: ComponentPreviewModule = {
  componentName: 'OrderSummary',
  importPath: 'components/OrderSummary',
  previews: [
  {
    name: 'Free shipping',
    description: 'Subtotal with free shipping',
    render: () =>
    <div
      style={{
        maxWidth: 360
      }}>
      
          <OrderSummary subtotal={49.8} />
        </div>

  },
  {
    name: 'Full breakdown',
    description: 'Shipping, tax, and discount applied',
    render: () =>
    <div
      style={{
        maxWidth: 360
      }}>
      
          <OrderSummary
        subtotal={49.8}
        shipping={3.9}
        tax={9.96}
        discount={5} />
      
        </div>

  }]

};
export default previews;