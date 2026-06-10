import React, { Component } from 'react';
import { Spinner } from './index';
import type { ComponentPreviewModule } from '../previewTypes';
const previews: ComponentPreviewModule = {
  componentName: 'Spinner',
  importPath: 'components/Spinner',
  previews: [
  {
    name: 'Sizes',
    description: 'Small, medium, and large',
    render: () =>
    <div
      style={{
        display: 'flex',
        gap: 20,
        alignItems: 'center'
      }}>
      
          <Spinner size="sm" />
          <Spinner size="md" />
          <Spinner size="lg" />
        </div>

  }]

};
export default previews;