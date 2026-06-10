import React, { Component } from 'react';
import { ShoppingBagIcon, SearchIcon } from 'lucide-react';
import { EmptyState } from './index';
import { Button } from '../Button';
import type { ComponentPreviewModule } from '../previewTypes';
const previews: ComponentPreviewModule = {
  componentName: 'EmptyState',
  importPath: 'components/EmptyState',
  previews: [
  {
    name: 'Empty cart',
    description: 'With icon and action',
    render: () =>
    <div
      style={{
        maxWidth: 420
      }}>
      
          <EmptyState
        icon={<ShoppingBagIcon className="w-6 h-6" />}
        title="Váš košík je prázdny"
        description="Objavte naše bylinné kolekcie a pridajte si niečo pre svoju pohodu."
        action={<Button>Prejsť do obchodu</Button>} />
      
        </div>

  },
  {
    name: 'No results',
    description: 'Search empty state',
    render: () =>
    <div
      style={{
        maxWidth: 420
      }}>
      
          <EmptyState
        icon={<SearchIcon className="w-6 h-6" />}
        title="Nenašli sa žiadne produkty"
        description="Skúste upraviť hľadaný výraz alebo filtre." />
      
        </div>

  }]

};
export default previews;