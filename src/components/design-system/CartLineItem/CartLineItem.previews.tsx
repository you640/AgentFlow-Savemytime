import React, { useState, Component } from 'react';
import { CartLineItem, CartLineItemData } from './index';
import type { ComponentPreviewModule } from '../previewTypes';
function Demo({ withVariant }: {withVariant?: boolean;}) {
  const [item, setItem] = useState<CartLineItemData>({
    id: '1',
    title: 'Levanduľový olej',
    variant: withVariant ? '50 ml' : undefined,
    image:
    'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=200&q=80',
    price: 24.9,
    quantity: 1
  });
  return (
    <div
      style={{
        maxWidth: 420
      }}>
      
      <CartLineItem
        item={item}
        onQuantityChange={(_, q) =>
        setItem({
          ...item,
          quantity: q
        })
        }
        onRemove={() => {}} />
      
    </div>);

}
const previews: ComponentPreviewModule = {
  componentName: 'CartLineItem',
  importPath: 'components/CartLineItem',
  previews: [
  {
    name: 'With variant',
    description: 'Line item with variant and quantity stepper',
    render: () => <Demo withVariant />
  },
  {
    name: 'No variant',
    description: 'Simple line item',
    render: () => <Demo />
  }]

};
export default previews;