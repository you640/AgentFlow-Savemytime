import React, { Component } from 'react';
import { ReviewCard } from './index';
import type { ComponentPreviewModule } from '../previewTypes';
const previews: ComponentPreviewModule = {
  componentName: 'ReviewCard',
  importPath: 'components/ReviewCard',
  previews: [
  {
    name: 'Full review',
    description: 'Rating, title, body, verified author',
    render: () =>
    <div
      style={{
        maxWidth: 440
      }}>
      
          <ReviewCard
        rating={5}
        title="Jemný a upokojujúci"
        body="Olej má nádhernú vôňu a pleť po ňom pôsobí vyživene. Používam ho každý večer."
        author="Mária K."
        date="2026"
        verified />
      
        </div>

  },
  {
    name: 'Without title',
    description: 'Body-only review',
    render: () =>
    <div
      style={{
        maxWidth: 440
      }}>
      
          <ReviewCard
        rating={4}
        body="Pekné balenie a rýchle doručenie."
        author="Peter H." />
      
        </div>

  }]

};
export default previews;