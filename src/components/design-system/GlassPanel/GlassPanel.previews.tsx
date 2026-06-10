import React, { Component } from 'react';
import { GlassPanel } from './index';
import type { ComponentPreviewModule } from '../previewTypes';
const previews: ComponentPreviewModule = {
  componentName: 'GlassPanel',
  importPath: 'components/GlassPanel',
  previews: [
  {
    name: 'Medium',
    description: 'Default frosted surface',
    render: () =>
    <div className="bg-gm-bg-soft p-10 rounded-gm-lg">
          <GlassPanel intensity="medium" className="rounded-gm-lg p-8">
            <p className="text-gm-text font-light">
              Jemný sklenený povrch s rozostrením pozadia.
            </p>
          </GlassPanel>
        </div>

  },
  {
    name: 'Intensities',
    description: 'Light, medium, and heavy blur',
    render: () =>
    <div className="bg-gm-bg-soft p-10 rounded-gm-lg grid grid-cols-3 gap-4">
          {(['light', 'medium', 'heavy'] as const).map((i) =>
      <GlassPanel
        key={i}
        intensity={i}
        className="rounded-gm-md p-6 text-center">
        
              <span className="text-gm-text text-sm capitalize">{i}</span>
            </GlassPanel>
      )}
        </div>

  }]

};
export default previews;