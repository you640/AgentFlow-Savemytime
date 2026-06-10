import React, { Component } from 'react';
import { Breadcrumb } from './index';
import type { ComponentPreviewModule } from '../previewTypes';
const previews: ComponentPreviewModule = {
  componentName: 'Breadcrumb',
  importPath: 'components/Breadcrumb',
  previews: [
  {
    name: 'Full trail',
    description: 'Category → subcategory → product',
    render: () =>
    <Breadcrumb
      items={[
      {
        label: 'Domov',
        href: '/'
      },
      {
        label: 'Bylinky',
        href: '/bylinky'
      },
      {
        label: 'Oleje',
        href: '/bylinky/oleje'
      },
      {
        label: 'Levanduľový olej'
      }]
      } />


  },
  {
    name: 'Short',
    description: 'Two levels',
    render: () =>
    <Breadcrumb
      items={[
      {
        label: 'Domov',
        href: '/'
      },
      {
        label: 'Košík'
      }]
      } />


  }]

};
export default previews;