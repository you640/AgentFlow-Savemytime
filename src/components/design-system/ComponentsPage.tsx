import React from 'react';
import { ComponentSection } from './ComponentSection';
import { componentRegistry } from './registry';

export function ComponentsPage() {
  return (
    <div
      className="mx-auto"
      style={{
        maxWidth: 'var(--canvas-max-width)',
      }}>

      <div className="flex flex-col gap-8 md:gap-10 px-4 py-6 md:px-10 md:py-12">
        {componentRegistry.map((module) =>
        <ComponentSection key={module.componentName} module={module} />
        )}
      </div>
    </div>);

}