import React, { Component } from 'react';
import { RatingStars } from './index';
import type { ComponentPreviewModule } from '../previewTypes';
const previews: ComponentPreviewModule = {
  componentName: 'RatingStars',
  importPath: 'components/RatingStars',
  previews: [
  {
    name: 'With count',
    description: 'Average rating and review count',
    render: () => <RatingStars rating={4.5} reviewCount={128} />
  },
  {
    name: 'Full',
    description: 'Perfect score, large',
    render: () => <RatingStars rating={5} size="lg" />
  },
  {
    name: 'Low',
    description: 'Partial rating',
    render: () => <RatingStars rating={2} reviewCount={4} size="sm" />
  }]

};
export default previews;