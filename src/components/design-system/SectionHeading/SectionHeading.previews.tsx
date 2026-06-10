import React, { Component } from 'react';
import { SectionHeading } from './index';
import type { ComponentPreviewModule } from '../previewTypes';
const previews: ComponentPreviewModule = {
  componentName: 'SectionHeading',
  importPath: 'components/SectionHeading',
  previews: [
  {
    name: 'Centered',
    description: 'Default centered heading with subtitle',
    render: () =>
    <SectionHeading
      title="Naše bylinné kolekcie"
      subtitle="Starostlivo vyberané prírodné prípravky pre vašu každodennú pohodu." />


  },
  {
    name: 'Left aligned',
    description: 'Left alignment without subtitle',
    render: () =>
    <SectionHeading alignment="left" title="Najpredávanejšie produkty" />

  }]

};
export default previews;