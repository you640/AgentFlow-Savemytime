import React, { useMemo, useState, Component } from 'react';
import { SearchDrawer } from './index';
import { Button } from '../Button';
import type { ComponentPreviewModule } from '../previewTypes';
const CATALOG = [
{
  id: '1',
  label: 'Levanduľový upokojujúci olej'
},
{
  id: '2',
  label: 'Harmančekový čaj'
},
{
  id: '3',
  label: 'Levanduľové mydlo'
},
{
  id: '4',
  label: 'Medovková tinktúra'
}];

function Demo() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return CATALOG.filter((c) => c.label.toLowerCase().includes(q));
  }, [query]);
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        width: '100%'
      }}>
      
      <Button onClick={() => setOpen(true)}>Otvoriť hľadanie</Button>
      <SearchDrawer
        open={open}
        onClose={() => setOpen(false)}
        query={query}
        onQueryChange={setQuery}
        suggestions={suggestions} />
      
    </div>);

}
const previews: ComponentPreviewModule = {
  componentName: 'SearchDrawer',
  importPath: 'components/SearchDrawer',
  previews: [
  {
    name: 'Live search',
    description: 'Type "lev" to filter suggestions',
    render: () => <Demo />
  }]

};
export default previews;