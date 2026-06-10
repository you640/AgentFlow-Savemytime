import React, { Component } from 'react';
import { InfoIcon } from 'lucide-react';
import { Tooltip } from './index';
import { Button } from '../Button';
import type { ComponentPreviewModule } from '../previewTypes';
const previews: ComponentPreviewModule = {
  componentName: 'Tooltip',
  importPath: 'components/Tooltip',
  previews: [
  {
    name: 'On button',
    description: 'Hover or focus to reveal',
    render: () =>
    <div
      style={{
        padding: 40,
        display: 'flex',
        justifyContent: 'center'
      }}>
      
          <Tooltip content="Pridať do obľúbených">
            <Button variant="outline">Obľúbené</Button>
          </Tooltip>
        </div>

  },
  {
    name: 'On icon',
    description: 'Info hint, bottom side',
    render: () =>
    <div
      style={{
        padding: 40,
        display: 'flex',
        justifyContent: 'center'
      }}>
      
          <Tooltip side="bottom" content="Doprava zdarma od 50 €">
            <span className="text-gm-text-muted">
              <InfoIcon className="w-5 h-5" />
            </span>
          </Tooltip>
        </div>

  }]

};
export default previews;