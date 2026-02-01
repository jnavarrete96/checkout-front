import { renderHook } from '@testing-library/react';
import useCardValidation from './useCardValidation';
import { describe, it, expect } from 'vitest';

describe('useCardValidation', () => {
  it('detecta VISA cuando inicia con 4', () => {
    const { result } = renderHook(() =>
      useCardValidation('4242 4242 4242 4242'),
    );

    expect(result.current.cardBrand).toBe('VISA');
    expect(result.current.isValid).toBe(true);
  });

  it('detecta MasterCard cuando inicia con 51–55', () => {
    const { result } = renderHook(() =>
      useCardValidation('5100 0000 0000 0000'),
    );

    expect(result.current.cardBrand).toBe('MASTERCARD');
    expect(result.current.isValid).toBe(true);
  });

  it('no detecta marca para tarjetas no soportadas', () => {
    const { result } = renderHook(() =>
      useCardValidation('3000 0000 0000 0000'),
    );

    expect(result.current.cardBrand).toBe(null);
  });

  it('marca la tarjeta como inválida si no tiene 16 dígitos', () => {
    const { result } = renderHook(() =>
      useCardValidation('4242 4242'),
    );

    expect(result.current.cardBrand).toBe('VISA');
    expect(result.current.isValid).toBe(false);
  });

  it('marca la tarjeta como inválida si contiene caracteres no numéricos', () => {
    const { result } = renderHook(() =>
      useCardValidation('4242 4242 4242 abcd'),
    );

    expect(result.current.cardBrand).toBe('VISA');
    expect(result.current.isValid).toBe(false);
  });

  it('formatea el número de tarjeta en grupos de 4', () => {
    const { result } = renderHook(() =>
      useCardValidation(''),
    );

    const formatted = result.current.formatCardNumber('4242424242424242');
    expect(formatted).toBe('4242 4242 4242 4242');
  });

  it('mantiene formato parcial mientras se escribe', () => {
    const { result } = renderHook(() =>
      useCardValidation(''),
    );

    const formatted = result.current.formatCardNumber('424242');
    expect(formatted).toBe('4242 42');
  });
});
