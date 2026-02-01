/**
 * App.jsx - Routing principal con recuperación automática
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import { 
  ProductsPage, 
  CheckoutPage, 
  SummaryPage, 
  ResultPage 
} from './pages';
import useRecovery from './hooks/useRecovery';
import { Loader } from './components/common';

function AppContent() {
  const { isRecovering } = useRecovery();

  if (isRecovering) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader size="lg" text="Recovering your session..." />
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<ProductsPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="summary" element={<SummaryPage />} />
        <Route path="result" element={<ResultPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

// Componente principal (exportado)
function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;