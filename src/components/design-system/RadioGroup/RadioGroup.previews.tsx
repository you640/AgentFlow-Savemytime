import React, { useState, Component } from 'react';
import { RadioGroup } from './index';
import type { ComponentPreviewModule } from '../previewTypes';
function Demo() {
  const [val, setVal] = useState('courier');
  return (
    <div
      style={{
        width: 380
      }}>
      
      <RadioGroup
        label="Spôsob doručenia"
        value={val}
        onChange={setVal}
        options={[
        {
          value: 'courier',
          label: 'Kuriér',
          description: 'Doručenie do 2 pracovných dní · 3,90 €'
        },
        {
          value: 'pickup',
          label: 'Osobný odber',
          description: 'Zdarma · zajtra k dispozícii'
        },
        {
          value: 'post',
          label: 'Slovenská pošta',
          description: 'Doručenie do 5 dní · 2,50 €',
          disabled: true
        }]
        } />
      
    </div>);

}
const previews: ComponentPreviewModule = {
  componentName: 'RadioGroup',
  importPath: 'components/RadioGroup',
  previews: [
  {
    name: 'Delivery options',
    description: 'Card-style radios with descriptions and a disabled option',
    render: () => <Demo />
  }]

};
export default previews;