import React, { Component } from 'react';
import { Badge } from './index';
import type { ComponentPreviewModule } from '../previewTypes';
const previews: ComponentPreviewModule = {
  componentName: 'Badge',
  importPath: 'components/Badge',
  previews: [
  {
    name: 'Statuses',
    description: 'Product status pills',
    render: () =>
    <div className="bg-gm-bg-soft p-8 rounded-gm-lg flex gap-3 items-center">
          <Badge label="Novinka" status="new" />
          <Badge label="Zľava" status="sale" />
          <Badge label="Vypredané" status="soldOut" />
        </div>

  },
  {
    name: 'Default',
    description: 'Neutral pill',
    render: () =>
    <div className="bg-gm-bg-soft p-8 rounded-gm-lg">
          <Badge label="Bio" />
        </div>

  }]

};
export default previews;