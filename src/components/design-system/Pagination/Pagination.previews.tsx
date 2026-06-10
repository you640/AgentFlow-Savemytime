import React, { useState, Component } from 'react';
import { Pagination } from './index';
import type { ComponentPreviewModule } from '../previewTypes';
function Demo({ total }: {total: number;}) {
  const [page, setPage] = useState(1);
  return <Pagination page={page} totalPages={total} onPageChange={setPage} />;
}
const previews: ComponentPreviewModule = {
  componentName: 'Pagination',
  importPath: 'components/Pagination',
  previews: [
  {
    name: 'Few pages',
    description: 'All page numbers shown',
    render: () => <Demo total={5} />
  },
  {
    name: 'Many pages',
    description: 'Ellipsis truncation',
    render: () => <Demo total={24} />
  }]

};
export default previews;