import React, { useState, Component } from 'react';
import { Modal } from './index';
import { Button } from '../Button';
import type { ComponentPreviewModule } from '../previewTypes';
function Demo() {
  const [open, setOpen] = useState(false);
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        width: '100%'
      }}>
      
      <Button onClick={() => setOpen(true)}>Odstrániť produkt</Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Odstrániť z košíka?"
        description="Túto akciu nie je možné vrátiť späť."
        size="sm"
        footer={
        <>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Zrušiť
            </Button>
            <Button onClick={() => setOpen(false)}>Odstrániť</Button>
          </>
        }>
        
        <p>Levanduľový olej bude odstránený z vášho košíka.</p>
      </Modal>
    </div>);

}
const previews: ComponentPreviewModule = {
  componentName: 'Modal',
  importPath: 'components/Modal',
  previews: [
  {
    name: 'Confirmation',
    description: 'Title, body, and footer actions',
    render: () => <Demo />
  }]

};
export default previews;