import React, { Component } from 'react';
import { ProductBadge } from './index';
import type { ComponentPreviewModule } from '../previewTypes';
function Tile({ children }: {children: React.ReactNode;}) {
  return (
    <div className="relative w-44 aspect-[3/4] bg-gm-bg-soft rounded-gm-md overflow-hidden">
      {children}
    </div>);

}
const previews: ComponentPreviewModule = {
  componentName: 'ProductBadge',
  importPath: 'components/ProductBadge',
  previews: [
  {
    name: 'New',
    description: 'New product overlay',
    render: () =>
    <Tile>
          <ProductBadge kind="new" />
        </Tile>

  },
  {
    name: 'Sale',
    description: 'Sale overlay, top-right',
    render: () =>
    <Tile>
          <ProductBadge kind="sale" position="top-right" />
        </Tile>

  },
  {
    name: 'Sold out',
    description: 'Out-of-stock overlay',
    render: () =>
    <Tile>
          <ProductBadge kind="soldOut" />
        </Tile>

  }]

};
export default previews;