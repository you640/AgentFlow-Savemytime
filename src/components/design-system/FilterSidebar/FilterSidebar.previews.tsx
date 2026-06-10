import React, { useState, Component } from 'react';
import { FilterSidebar, FilterGroup } from './index';
import type { ComponentPreviewModule } from '../previewTypes';
const groups: FilterGroup[] = [
{
  id: 'category',
  label: 'Kategória',
  options: [
  {
    id: 'oleje',
    label: 'Oleje',
    count: 12
  },
  {
    id: 'caje',
    label: 'Čaje',
    count: 8
  },
  {
    id: 'masti',
    label: 'Masti',
    count: 5
  }]

},
{
  id: 'color',
  label: 'Farba',
  options: [
  {
    id: 'peach',
    label: 'Broskyňová',
    color: '#E8A88B'
  },
  {
    id: 'cream',
    label: 'Krémová',
    color: '#E5DCC3'
  }]

}];

function Demo() {
  const [selected, setSelected] = useState<Record<string, string[]>>({
    category: ['oleje']
  });
  const onChange = (groupId: string, optionId: string, checked: boolean) =>
  setSelected((prev) => {
    const cur = prev[groupId] || [];
    return {
      ...prev,
      [groupId]: checked ?
      [...cur, optionId] :
      cur.filter((id) => id !== optionId)
    };
  });
  return (
    <div
      style={{
        maxWidth: 280
      }}>
      
      <FilterSidebar
        groups={groups}
        selected={selected}
        onChange={onChange}
        onClear={() => setSelected({})} />
      
    </div>);

}
const previews: ComponentPreviewModule = {
  componentName: 'FilterSidebar',
  importPath: 'components/FilterSidebar',
  previews: [
  {
    name: 'Default',
    description: 'Collapsible facet groups with counts and color swatches',
    render: () => <Demo />
  }]

};
export default previews;