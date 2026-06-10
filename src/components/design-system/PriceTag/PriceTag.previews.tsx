import React, { Component } from 'react';
import { PriceTag } from './index';
import type { ComponentPreviewModule } from '../previewTypes';
const previews: ComponentPreviewModule = {
  componentName: 'PriceTag',
  importPath: 'components/PriceTag',
  previews: [
  {
    name: 'Regular',
    description: 'Single price',
    render: () => <PriceTag amount={24.9} size="lg" />
  },
  {
    name: 'On sale',
    description: 'Discounted with strikethrough and savings',
    render: () => <PriceTag amount={19.9} compareAt={24.9} size="lg" />
  },
  {
    name: 'Compact',
    description: 'Small size for list rows',
    render: () => <PriceTag amount={12.5} compareAt={15} size="sm" />
  }]

};
export default previews;