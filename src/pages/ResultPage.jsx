/**
 * Resultado del pago (Success/Error)
 */

import { Card } from '../components/common';

const ResultPage = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Page Title */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Payment Result
        </h2>
        <p className="mt-2 text-sm sm:text-base text-gray-600">
          Transaction completed
        </p>
      </div>

      {/* Placeholder */}
      <Card>
        <p className="text-center text-gray-600 py-8">
          Result page coming soon...
        </p>
      </Card>
    </div>
  );
};

export default ResultPage;