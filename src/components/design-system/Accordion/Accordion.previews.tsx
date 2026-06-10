import React, { Component } from 'react';
import { Accordion } from './index';
import type { ComponentPreviewModule } from '../previewTypes';
const items = [
{
  id: 'shipping',
  title: 'Doprava a doručenie',
  content:
  'Objednávky expedujeme do 24 hodín. Doručenie kuriérom trvá 1–2 pracovné dni. Doprava je zdarma pri objednávke nad 50 €.'
},
{
  id: 'returns',
  title: 'Vrátenie tovaru',
  content:
  'Tovar môžete vrátiť do 14 dní od doručenia bez udania dôvodu. Stačí nás kontaktovať a priložiť doklad o kúpe.'
},
{
  id: 'ingredients',
  title: 'Zloženie',
  content:
  '100 % prírodné zložky bez parabénov a syntetických farbív. Presné zloženie nájdete na obale produktu.'
}];

const previews: ComponentPreviewModule = {
  componentName: 'Accordion',
  importPath: 'components/Accordion',
  previews: [
  {
    name: 'Single',
    description: 'One panel open at a time',
    render: () =>
    <div
      style={{
        maxWidth: 480
      }}>
      
          <Accordion items={items} defaultOpen={['shipping']} />
        </div>

  },
  {
    name: 'Multiple',
    description: 'Several panels can be open together',
    render: () =>
    <div
      style={{
        maxWidth: 480
      }}>
      
          <Accordion
        items={items}
        multiple
        defaultOpen={['shipping', 'returns']} />
      
        </div>

  }]

};
export default previews;