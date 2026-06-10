import React, { Component } from 'react';
import { Steps } from './index';
import type { ComponentPreviewModule } from '../previewTypes';
const steps = [
{
  label: 'Košík',
  description: 'Skontrolujte položky'
},
{
  label: 'Doručenie',
  description: 'Adresa a doprava'
},
{
  label: 'Platba'
},
{
  label: 'Hotovo'
}];

const previews: ComponentPreviewModule = {
  componentName: 'Steps',
  importPath: 'components/Steps',
  previews: [
  {
    name: 'Checkout progress',
    description: 'Second step active, first complete',
    render: () =>
    <div
      style={{
        maxWidth: 560
      }}>
      
          <Steps steps={steps} current={1} />
        </div>

  },
  {
    name: 'Near completion',
    description: 'Final step active',
    render: () =>
    <div
      style={{
        maxWidth: 560
      }}>
      
          <Steps steps={steps} current={3} />
        </div>

  }]

};
export default previews;