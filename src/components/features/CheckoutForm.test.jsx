import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import CheckoutForm from './CheckoutForm';
import checkoutReducer from '../../store/slices/checkoutSlice';

/* -------------------- MOCKS -------------------- */

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../../store/slices/checkoutSlice', async () => {
  const actual = await vi.importActual('../../store/slices/checkoutSlice');
  return {
    ...actual,
    createCheckoutTransaction: () => async () => ({
      type: 'checkout/createCheckoutTransaction/fulfilled',
    }),
  };
});

/* -------------------- HELPERS -------------------- */

const renderWithStore = () => {
  const store = configureStore({
    reducer: {
      checkout: checkoutReducer,
    },
    preloadedState: {
      checkout: {
        selectedProduct: { id: 'product-1' },
        loading: false,
        customerData: {},
        deliveryData: {},
      },
    },
  });

  return render(
    <Provider store={store}>
      <CheckoutForm />
    </Provider>
  );
};

/* -------------------- TESTS -------------------- */

describe('CheckoutForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('renders all form sections', () => {
    renderWithStore();

    expect(screen.getByText('1. Customer Information')).toBeInTheDocument();
    expect(screen.getByText('2. Payment Information')).toBeInTheDocument();
    expect(screen.getByText('3. Delivery Information')).toBeInTheDocument();
  });

  it('shows validation errors when submitting empty form', async () => {
    renderWithStore();

    fireEvent.click(
      screen.getByRole('button', { name: /continue to summary/i })
    );

    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
    expect(screen.getByText(/invalid card number/i)).toBeInTheDocument();
  });

  it('formats card number with spaces every 4 digits', () => {
    renderWithStore();

    const cardInput = screen.getByPlaceholderText('4242 4242 4242 4242');

    fireEvent.change(cardInput, {
      target: { value: '4242424242424242' },
    });

    expect(cardInput.value).toBe('4242 4242 4242 4242');
  });

  it('autofills delivery data from customer data', () => {
    renderWithStore();

    const fullNameInputs = screen.getAllByLabelText(/full name/i);
    const phoneInputs = screen.getAllByLabelText(/phone/i);

    fireEvent.change(fullNameInputs[0], {
      target: { value: 'Juan Perez' },
    });

    fireEvent.change(phoneInputs[0], {
      target: { value: '3001234567' },
    });

    fireEvent.click(
      screen.getByRole('button', { name: /same as customer/i })
    );

    expect(fullNameInputs[1].value).toBe('Juan Perez');
    expect(phoneInputs[1].value).toBe('3001234567');
  });

  it('submits form and navigates to summary on success', async () => {
    renderWithStore();

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'juan@test.com' },
    });

    fireEvent.change(screen.getAllByLabelText(/full name/i)[0], {
      target: { value: 'Juan Perez' },
    });

    fireEvent.change(screen.getAllByLabelText(/phone/i)[0], {
      target: { value: '3001234567' },
    });

    fireEvent.change(screen.getByPlaceholderText('4242 4242 4242 4242'), {
      target: { value: '4242424242424242' },
    });

    fireEvent.change(screen.getByPlaceholderText('MM'), {
      target: { value: '12' },
    });

    fireEvent.change(screen.getByPlaceholderText('YY'), {
      target: { value: '25' },
    });

    fireEvent.change(screen.getByPlaceholderText('123'), {
      target: { value: '123' },
    });

    fireEvent.change(screen.getByPlaceholderText('JUAN PEREZ'), {
      target: { value: 'JUAN PEREZ' },
    });

    fireEvent.change(screen.getByPlaceholderText(/calle/i), {
      target: { value: 'Calle 123 #45-67 Apto 501' },
    });

    fireEvent.change(screen.getByPlaceholderText('Medellín'), {
      target: { value: 'Medellín' },
    });

    fireEvent.change(screen.getByPlaceholderText('Antioquia'), {
      target: { value: 'Antioquia' },
    });

    // 👇 clave para que pase validación
    fireEvent.click(
      screen.getByRole('button', { name: /same as customer/i })
    );

    fireEvent.click(
      screen.getByRole('button', { name: /continue to summary/i })
    );

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/summary');
    });
  });
});
