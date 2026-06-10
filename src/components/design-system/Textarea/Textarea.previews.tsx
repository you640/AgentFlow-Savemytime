import React, { Component } from 'react';
import { Textarea } from './index';
import type { ComponentPreviewModule } from '../previewTypes';
const previews: ComponentPreviewModule = {
  componentName: 'Textarea',
  importPath: 'components/Textarea',
  previews: [
  {
    name: 'Default',
    description: 'Labelled multiline field',
    render: () =>
    <div
      style={{
        width: 360
      }}>
      
          <Textarea
        label="Vaša správa"
        placeholder="Napíšte nám…"
        hint="Odpovieme do 24 hodín." />
      
        </div>

  },
  {
    name: 'Error',
    description: 'Invalid state',
    render: () =>
    <div
      style={{
        width: 360
      }}>
      
          <Textarea
        label="Poznámka k objednávke"
        error="Toto pole je povinné." />
      
        </div>

  }]

};
export default previews;