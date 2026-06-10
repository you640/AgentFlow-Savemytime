import React, { Component } from 'react';
import { SearchIcon, MailIcon } from 'lucide-react';
import { Input } from './index';
import type { ComponentPreviewModule } from '../previewTypes';
const previews: ComponentPreviewModule = {
  componentName: 'Input',
  importPath: 'components/Input',
  previews: [
  {
    name: 'With label',
    description: 'Labelled field with hint',
    render: () =>
    <div
      style={{
        width: 320
      }}>
      
          <Input
        label="E-mail"
        type="email"
        placeholder="vas@email.sk"
        hint="Nikdy ho nezdieľame." />
      
        </div>

  },
  {
    name: 'With icon',
    description: 'Leading icon',
    render: () =>
    <div
      style={{
        width: 320
      }}>
      
          <Input
        placeholder="Hľadať produkty"
        leadingIcon={<SearchIcon className="w-4 h-4" />} />
      
        </div>

  },
  {
    name: 'Error',
    description: 'Invalid state with message',
    render: () =>
    <div
      style={{
        width: 320
      }}>
      
          <Input
        label="E-mail"
        defaultValue="neplatny"
        error="Zadajte platnú e-mailovú adresu."
        leadingIcon={<MailIcon className="w-4 h-4" />} />
      
        </div>

  }]

};
export default previews;