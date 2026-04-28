import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Shell } from './components/layout/Shell';
import { Overview } from './components/dashboard/Overview';
import { UnifiedInbox } from './components/inbox/UnifiedInbox';
import { FlowBuilder } from './components/workflows/FlowBuilder';
import { IntegrationsGrid } from './components/integrations/IntegrationsGrid';

export default function App() {
  return (
    <Router>
      <Shell>
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/inbox" element={<UnifiedInbox />} />
          <Route path="/workflows" element={<FlowBuilder />} />
          <Route path="/integrations" element={<IntegrationsGrid />} />
          <Route path="/analytics" element={<Overview />} /> {/* Reuse overview for demo */}
        </Routes>
      </Shell>
    </Router>
  );
}

