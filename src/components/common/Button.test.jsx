import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';

describe('Button component', () => {
  it('renderiza correctamente el texto', () => {
    render(<Button>Click me</Button>);

    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  it('ejecuta onClick cuando se hace click', () => {
    const onClick = vi.fn();

    render(<Button onClick={onClick}>Click</Button>);

    fireEvent.click(screen.getByRole('button'));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('no ejecuta onClick cuando está disabled', () => {
    const onClick = vi.fn();

    render(
      <Button onClick={onClick} disabled>
        Click
      </Button>,
    );

    fireEvent.click(screen.getByRole('button'));

    expect(onClick).not.toHaveBeenCalled();
  });

  it('muestra spinner cuando loading es true', () => {
    const { container } = render(<Button loading>Loading</Button>);

    const spinner = container.querySelector('svg.animate-spin');
    expect(spinner).toBeInTheDocument();
  });


  it('deshabilita el botón cuando loading es true', () => {
    render(<Button loading>Loading</Button>);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('aplica la variante primary por defecto', () => {
    render(<Button>Primary</Button>);

    const button = screen.getByRole('button');
    expect(button.className).toContain('bg-indigo-600');
  });

  it('aplica correctamente la variante danger', () => {
    render(<Button variant="danger">Danger</Button>);

    const button = screen.getByRole('button');
    expect(button.className).toContain('bg-red-600');
  });

  it('aplica correctamente el tamaño lg', () => {
    render(<Button size="lg">Large</Button>);

    const button = screen.getByRole('button');
    expect(button.className).toContain('px-6');
    expect(button.className).toContain('py-3');
  });

  it('aplica fullWidth cuando está activo', () => {
    render(<Button fullWidth>Full</Button>);

    const button = screen.getByRole('button');
    expect(button.className).toContain('w-full');
  });

  it('usa el type submit cuando se especifica', () => {
    render(<Button type="submit">Submit</Button>);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'submit');
  });
});
