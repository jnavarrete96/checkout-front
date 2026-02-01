/**
 * App.jsx - Routing principal
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import { 
  ProductsPage, 
  CheckoutPage, 
  SummaryPage, 
  ResultPage 
} from './pages';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<ProductsPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="summary" element={<SummaryPage />} />
          <Route path="result" element={<ResultPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;