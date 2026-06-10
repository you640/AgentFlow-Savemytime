import React, { Component } from 'react';
import { Skeleton, ProductCardSkeleton } from './index';
import type { ComponentPreviewModule } from '../previewTypes';
const previews: ComponentPreviewModule = {
  componentName: 'Skeleton',
  importPath: 'components/Skeleton',
  previews: [
  {
    name: 'Primitives',
    description: 'Text, rect, and circle shapes',
    render: () =>
    <div
      style={{
        width: 300,
        display: 'flex',
        flexDirection: 'column',
        gap: 12
      }}>
      
          <div
        style={{
          display: 'flex',
          gap: 12,
          alignItems: 'center'
        }}>
        
            <Skeleton variant="circle" className="w-12 h-12" />
            <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 8
          }}>
          
              <Skeleton variant="text" className="w-2/3" />
              <Skeleton variant="text" className="w-1/2" />
            </div>
          </div>
          <Skeleton className="h-24 w-full" />
        </div>

  },
  {
    name: 'Product card',
    description: 'Loading placeholder for a product tile',
    render: () =>
    <div
      style={{
        width: 220
      }}>
      
          <ProductCardSkeleton />
        </div>

  }]

};
export default previews;