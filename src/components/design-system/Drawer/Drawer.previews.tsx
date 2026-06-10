import React, { useState, Component } from 'react';
import { Drawer } from './index';
import { Button } from '../Button';
import type { ComponentPreviewModule } from '../previewTypes';
function Demo({ side }: {side?: 'left' | 'right';}) {
  const [open, setOpen] = useState(false);
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        width: '100%'
      }}>
      
      <Button onClick={() => setOpen(true)}>Otvoriť panel</Button>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        side={side}
        title="Košík"
        footer={<Button fullWidth>Pokladňa</Button>}>
        
        <p className="text-gm-text-muted font-light">
          Obsah vysúvacieho panela.
        </p>
      </Drawer>
    </div>);

}
const previews: ComponentPreviewModule = {
  componentName: 'Drawer',
  importPath: 'components/Drawer',
  previews: [
  {
    name: 'Right',
    description: 'Slide-in from the right (default)',
    render: () => <Demo side="right" />
  },
  {
    name: 'Left',
    description: 'Slide-in from the left',
    render: () => <Demo side="left" />
  }]

};
export default previews;