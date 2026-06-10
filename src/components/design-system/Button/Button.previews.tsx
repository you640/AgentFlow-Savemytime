import React, { Component } from 'react';
import { Button } from './index';
import type { ComponentPreviewModule } from '../previewTypes';
const previews: ComponentPreviewModule = {
  componentName: 'Button',
  importPath: 'components/Button',
  previews: [
  {
    name: 'Primary',
    description: 'Peach liquid CTA — lifts on hover with soft shadow',
    render: () => <Button variant="primary">Do košíka</Button>
  },
  {
    name: 'Secondary',
    description: 'Surface-toned secondary action',
    render: () => <Button variant="secondary">Zobraziť detail</Button>
  },
  {
    name: 'Outline & Ghost',
    description: 'Lower-emphasis variants',
    render: () =>
    <div
      style={{
        display: 'flex',
        gap: 12,
        alignItems: 'center'
      }}>
      
          <Button variant="outline">Pokračovať</Button>
          <Button variant="ghost">Zrušiť</Button>
        </div>

  },
  {
    name: 'Disabled',
    description: 'Disabled state',
    render: () =>
    <Button variant="primary" disabled>
          Vypredané
        </Button>

  }]

};
export default previews;