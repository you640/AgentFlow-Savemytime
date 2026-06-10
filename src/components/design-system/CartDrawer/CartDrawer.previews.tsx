import React, { useState, Component } from 'react';
import { CartDrawer } from './index';
import { CartLineItemData } from '../CartLineItem';
import { Button } from '../Button';
import type { ComponentPreviewModule } from '../previewTypes';
const seed: CartLineItemData[] = [
{
  id: '1',
  title: 'Levanduľový olej',
  variant: '50 ml',
  image:
  'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=200&q=80',
  price: 24.9,
  quantity: 1
},
{
  id: '2',
  title: 'Harmančekový čaj',
  variant: '100 g',
  image:
  'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=200&q=80',
  price: 12.5,
  quantity: 2
}];

function Demo({ empty }: {empty?: boolean;}) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<CartLineItemData[]>(empty ? [] : seed);
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        width: '100%'
      }}>
      
      <Button onClick={() => setOpen(true)}>Otvoriť košík</Button>
      <CartDrawer
        open={open}
        onClose={() => setOpen(false)}
        items={items}
        shipping={3.9}
        onQuantityChange={(id, q) =>
        setItems((prev) =>
        prev.map((i) =>
        i.id === id ?
        {
          ...i,
          quantity: q
        } :
        i
        )
        )
        }
        onRemove={(id) => setItems((prev) => prev.filter((i) => i.id !== id))} />
      
    </div>);

}
const previews: ComponentPreviewModule = {
  componentName: 'CartDrawer',
  importPath: 'components/CartDrawer',
  previews: [
  {
    name: 'With items',
    description: 'Line items, summary, and checkout CTA',
    render: () => <Demo />
  },
  {
    name: 'Empty',
    description: 'Empty cart state',
    render: () => <Demo empty />
  }]

};
export default previews;