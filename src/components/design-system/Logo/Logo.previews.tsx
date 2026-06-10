import React, { Component } from 'react';
import { Logo } from './index';
import type { ComponentPreviewModule } from '../previewTypes';
const previews: ComponentPreviewModule = {
  componentName: 'Logo',
  importPath: 'components/Logo',
  previews: [
  {
    name: 'Default',
    description: 'Brandmark with leaf icon',
    render: () => <Logo />
  },
  {
    name: 'Wordmark only',
    description: 'Text only, no icon',
    render: () => <Logo showIcon={false} />
  }]

};
export default previews;