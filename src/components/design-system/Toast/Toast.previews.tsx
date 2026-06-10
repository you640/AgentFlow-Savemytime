import React, { Component } from 'react';
import { ToastProvider, useToast } from './index';
import { Button } from '../Button';
import type { ComponentPreviewModule } from '../previewTypes';
function Trigger() {
  const { toast } = useToast();
  return (
    <div
      style={{
        display: 'flex',
        gap: 12,
        flexWrap: 'wrap',
        justifyContent: 'center',
        width: '100%'
      }}>
      
      <Button
        onClick={() =>
        toast({
          title: 'Pridané do košíka',
          description: 'Levanduľový olej · 1 ks',
          variant: 'success'
        })
        }>
        
        Úspech
      </Button>
      <Button
        variant="outline"
        onClick={() =>
        toast({
          title: 'Niečo sa pokazilo',
          description: 'Skúste to znova.',
          variant: 'error'
        })
        }>
        
        Chyba
      </Button>
      <Button
        variant="ghost"
        onClick={() =>
        toast({
          title: 'Doprava zdarma od 50 €',
          variant: 'info'
        })
        }>
        
        Info
      </Button>
    </div>);

}
const previews: ComponentPreviewModule = {
  componentName: 'Toast',
  importPath: 'components/Toast',
  previews: [
  {
    name: 'Variants',
    description: 'Trigger success, error, and info toasts (bottom-right)',
    render: () =>
    <ToastProvider>
          <Trigger />
        </ToastProvider>

  }]

};
export default previews;