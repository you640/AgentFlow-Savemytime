import React, { useState, Component } from 'react';
import { VariantSelector } from './index';
import type { ComponentPreviewModule } from '../previewTypes';
function SizeDemo() {
  const [val, setVal] = useState('m');
  return (
    <VariantSelector
      label="Veľkosť"
      value={val}
      onChange={setVal}
      options={[
      {
        id: 's',
        label: 'S'
      },
      {
        id: 'm',
        label: 'M'
      },
      {
        id: 'l',
        label: 'L'
      },
      {
        id: 'xl',
        label: 'XL',
        available: false
      }]
      } />);


}
function ColorDemo() {
  const [val, setVal] = useState('peach');
  return (
    <VariantSelector
      label="Farba"
      value={val}
      onChange={setVal}
      options={[
      {
        id: 'peach',
        label: 'Broskyňová',
        color: '#E8A88B'
      },
      {
        id: 'cream',
        label: 'Krémová',
        color: '#E5DCC3'
      },
      {
        id: 'sand',
        label: 'Piesková',
        color: '#EAE5D9'
      },
      {
        id: 'ink',
        label: 'Tmavá',
        color: '#2C2A28',
        available: false
      }]
      } />);


}
const previews: ComponentPreviewModule = {
  componentName: 'VariantSelector',
  importPath: 'components/VariantSelector',
  previews: [
  {
    name: 'Size chips',
    description: 'Text variants with an unavailable option',
    render: () => <SizeDemo />
  },
  {
    name: 'Color swatches',
    description: 'Color variants with availability',
    render: () => <ColorDemo />
  }]

};
export default previews;