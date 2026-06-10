import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Shell } from './components/layout/Shell';
import { Overview } from './components/dashboard/Overview';
import { EmailPerformanceDashboard } from './components/dashboard/EmailPerformanceDashboard';
import { UnifiedInbox } from './components/inbox/UnifiedInbox';
import { FlowBuilder } from './components/workflows/FlowBuilder';
import { IntegrationsGrid } from './components/integrations/IntegrationsGrid';
import { EmailComposer } from './components/comms/EmailComposer';
import { ShopifyConsole } from './components/integrations/ShopifyConsole';
import { ComponentsPage } from './components/design-system/ComponentsPage';
import { ComponentPage } from './components/design-system/ComponentPage';
import { ComponentPreviewPage } from './components/design-system/ComponentPreviewPage';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Full-screen pure interactive preview sandbox outside of admin shell */}
        <Route 
          path="/components/:name/preview/:previewIdx" 
          element={<ComponentPreviewPage />} 
        />
        
        {/* Admin dashboard and system management routes inside the Shell */}
        <Route path="*" element={
          <Shell>
            <Routes>
              <Route path="/" element={<Overview />} />
              <Route path="/comms" element={<EmailComposer />} />
              <Route path="/inbox" element={<UnifiedInbox />} />
              <Route path="/workflows" element={<FlowBuilder />} />
              <Route path="/integrations" element={<IntegrationsGrid />} />
              <Route path="/shopify" element={<ShopifyConsole />} />
              <Route path="/analytics" element={<EmailPerformanceDashboard />} />
              <Route path="/components" element={<ComponentsPage />} />
              <Route path="/components/:name" element={<ComponentPage />} />
            </Routes>
          </Shell>
        } />
      </Routes>
    </Router>
  );
}


