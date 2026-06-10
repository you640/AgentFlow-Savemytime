import React, { useState, Component } from 'react';
import { Select } from './index';
import type { ComponentPreviewModule } from '../previewTypes';
const options = [
{
  value: 'sk',
  label: 'Slovensko'
},
{
  value: 'cz',
  label: 'Česko'
},
{
  value: 'at',
  label: 'Rakúsko'
}];

function Demo() {
  const [val, setVal] = useState('');
  return (
    <div
      style={{
        width: 320
      }}>
      
      <Select
        label="Krajina doručenia"
        placeholder="Vyberte krajinu"
        options={options}
        value={val}
        onChange={(e) => setVal(e.target.value)} />
      
    </div>);

}
const previews: ComponentPreviewModule = {
  componentName: 'Select',
  importPath: 'components/Select',
  previews: [
  {
    name: 'Default',
    description: 'Native select with placeholder',
    render: () => <Demo />
  },
  {
    name: 'Error',
    description: 'Invalid state',
    render: () =>
    <div
      style={{
        width: 320
      }}>
      
          <Select label="Krajina" options={options} error="Vyberte krajinu." />
        </div>

  }]

};
export default previews;