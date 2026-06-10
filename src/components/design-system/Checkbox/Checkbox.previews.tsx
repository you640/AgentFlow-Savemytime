import React, { useState, Component } from 'react';
import { Checkbox } from './index';
import type { ComponentPreviewModule } from '../previewTypes';
function Demo() {
  const [checked, setChecked] = useState(true);
  return (
    <Checkbox
      label="Súhlasím s obchodnými podmienkami"
      checked={checked}
      onChange={(e) => setChecked(e.target.checked)} />);


}
const previews: ComponentPreviewModule = {
  componentName: 'Checkbox',
  importPath: 'components/Checkbox',
  previews: [
  {
    name: 'With label',
    description: 'Interactive checkbox',
    render: () => <Demo />
  },
  {
    name: 'With description',
    description: 'Label plus helper text',
    render: () =>
    <Checkbox
      label="Newsletter"
      description="Novinky a akcie raz mesačne. Odhlásiť sa môžete kedykoľvek."
      defaultChecked />


  },
  {
    name: 'Disabled',
    description: 'Non-interactive',
    render: () => <Checkbox label="Nedostupné" disabled />
  }]

};
export default previews;