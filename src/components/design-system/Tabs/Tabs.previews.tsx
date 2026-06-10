import React, { Component } from 'react';
import { Tabs } from './index';
import type { ComponentPreviewModule } from '../previewTypes';
const items = [
{
  id: 'desc',
  label: 'Popis',
  content:
  'Upokojujúci levanduľový olej lisovaný za studena. Ideálny na večernú masáž a starostlivosť o pleť.'
},
{
  id: 'ingredients',
  label: 'Zloženie',
  content:
  '100 % levanduľový esenciálny olej. Bez prísad, parabénov a syntetických vôní.'
},
{
  id: 'shipping',
  label: 'Doprava',
  content: 'Expedícia do 24 hodín. Doprava zdarma od 50 €.'
}];

const previews: ComponentPreviewModule = {
  componentName: 'Tabs',
  importPath: 'components/Tabs',
  previews: [
  {
    name: 'Product detail',
    description: 'Underlined tabs for a PDP',
    render: () =>
    <div
      style={{
        maxWidth: 480
      }}>
      
          <Tabs items={items} />
        </div>

  },
  {
    name: 'With disabled',
    description: 'A disabled tab',
    render: () =>
    <div
      style={{
        maxWidth: 480
      }}>
      
          <Tabs
        items={[
        ...items,
        {
          id: 'reviews',
          label: 'Recenzie',
          content: '',
          disabled: true
        }]
        }
        defaultValue="ingredients" />
      
        </div>

  }]

};
export default previews;