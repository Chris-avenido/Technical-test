/**
 * @file LanguageSelector.test.tsx
 * @description Component tests for the LanguageSelector dropdown.
 *
 * Tests verify:
 * - Renders a combobox with all 4 language options (EN, NL, DE, FR).
 * - Defaults to English on initial mount.
 * - Fires a change event that updates the selected language.
 * - Persists language selection to localStorage.
 * - Updates document.documentElement.lang when language changes.
 */

import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { LanguageSelector } from '../src/components/LanguageSelector';
import { I18nProvider } from '../src/i18n/I18nContext';

// Helper to render inside the I18n context provider
const renderWithI18n = (ui: React.ReactElement) =>
  render(<I18nProvider>{ui}</I18nProvider>);

describe('LanguageSelector', () => {
  beforeEach(() => {
    // Clear localStorage between tests
    localStorage.clear();
    // Reset html lang to default
    document.documentElement.lang = 'en';
  });

  test('renders a language selector dropdown', () => {
    renderWithI18n(<LanguageSelector />);
    const select = screen.getByRole('combobox', { name: /select language/i });
    expect(select).toBeInTheDocument();
  });

  test('renders exactly 4 language options', () => {
    renderWithI18n(<LanguageSelector />);
    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(4);
  });

  test('renders all 4 required language options with correct values', () => {
    renderWithI18n(<LanguageSelector />);

    const enOption = screen.getByRole('option', { name: /english/i }) as HTMLOptionElement;
    const nlOption = screen.getByRole('option', { name: /nederlands/i }) as HTMLOptionElement;
    const deOption = screen.getByRole('option', { name: /deutsch/i }) as HTMLOptionElement;
    const frOption = screen.getByRole('option', { name: /français/i }) as HTMLOptionElement;

    expect(enOption.value).toBe('en');
    expect(nlOption.value).toBe('nl');
    expect(deOption.value).toBe('de');
    expect(frOption.value).toBe('fr');
  });

  test('defaults to English (en) on initial render', () => {
    renderWithI18n(<LanguageSelector />);
    const select = screen.getByRole('combobox') as HTMLSelectElement;
    expect(select.value).toBe('en');
  });

  test('updates selected value when language is changed to Dutch', () => {
    renderWithI18n(<LanguageSelector />);
    const select = screen.getByRole('combobox');

    fireEvent.change(select, { target: { value: 'nl' } });

    expect((select as HTMLSelectElement).value).toBe('nl');
  });

  test('updates selected value when language is changed to French', () => {
    renderWithI18n(<LanguageSelector />);
    const select = screen.getByRole('combobox');

    fireEvent.change(select, { target: { value: 'fr' } });

    expect((select as HTMLSelectElement).value).toBe('fr');
  });

  test('persists selected language to localStorage', () => {
    renderWithI18n(<LanguageSelector />);
    const select = screen.getByRole('combobox');

    fireEvent.change(select, { target: { value: 'de' } });

    expect(localStorage.getItem('food_finder_lang')).toBe('de');
  });

  test('updates document.documentElement.lang when language changes', () => {
    renderWithI18n(<LanguageSelector />);
    const select = screen.getByRole('combobox');

    fireEvent.change(select, { target: { value: 'nl' } });

    expect(document.documentElement.lang).toBe('nl');
  });

  test('restores saved language from localStorage on mount', async () => {
    localStorage.setItem('food_finder_lang', 'de');

    await act(async () => {
      renderWithI18n(<LanguageSelector />);
    });

    const select = screen.getByRole('combobox') as HTMLSelectElement;
    expect(select.value).toBe('de');
  });
});
