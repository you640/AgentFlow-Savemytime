import React, { Component } from 'react';
import { ProductGallery } from './index';
import type { ComponentPreviewModule } from '../previewTypes';
const images = [
{
  url: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&q=80',
  altText: 'Olej 1'
},
{
  url: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=600&q=80',
  altText: 'Olej 2'
},
{
  url: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=600&q=80',
  altText: 'Olej 3'
}];

const previews: ComponentPreviewModule = {
  componentName: 'ProductGallery',
  importPath: 'components/ProductGallery',
  previews: [
  {
    name: 'Multiple images',
    description: 'Primary image with selectable thumbnails',
    render: () =>
    <div
      style={{
        maxWidth: 440
      }}>
      
          <ProductGallery images={images} />
        </div>

  },
  {
    name: 'Single image',
    description: 'No thumbnail row',
    render: () =>
    <div
      style={{
        maxWidth: 440
      }}>
      
          <ProductGallery images={[images[0]]} />
        </div>

  }]

};
export default previews;