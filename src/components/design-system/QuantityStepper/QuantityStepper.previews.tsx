import React, { useState, Component } from 'react';
import { QuantityStepper } from './index';
import type { ComponentPreviewModule } from '../previewTypes';
function Demo({ disabled }: {disabled?: boolean;}) {
  const [qty, setQty] = useState(1);
  return <QuantityStepper value={qty} onChange={setQty} disabled={disabled} />;
}
const previews: ComponentPreviewModule = {
  componentName: 'QuantityStepper',
  importPath: 'components/QuantityStepper',
  previews: [
  {
    name: 'Default',
    description: 'Interactive quantity control',
    render: () => <Demo />
  },
  {
    name: 'Disabled',
    description: 'Non-interactive state',
    render: () => <Demo disabled />
  }]

};
export default previews;