/**
 * @file SearchBar.test.tsx
 * @description Component tests for the SearchBar component.
 *
 * Tests verify:
 * - Renders a text input and a submit button.
 * - Submit button is disabled when input is empty.
 * - Calls onSearch with trimmed query on form submission.
 * - Clear button appears when query is typed and clears the input.
 * - Renders recent search chips from props.
 * - Clicking a recent search chip triggers onSearch with that query.
 * - Translate placeholder text is displayed in the active language.
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SearchBar } from '../src/components/SearchBar';
import { I18nProvider } from '../src/i18n/I18nContext';
import type { SearchHistoryItem } from '../src/lib/types';

// Helper to render SearchBar inside the I18n context
const renderSearchBar = (props: Partial<React.ComponentProps<typeof SearchBar>> = {}) => {
  const defaults = {
    onSearch: jest.fn(),
    loading: false,
    recentSearches: [] as SearchHistoryItem[],
  };
  return render(
    <I18nProvider>
      <SearchBar {...defaults} {...props} />
    </I18nProvider>
  );
};

describe('SearchBar', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('Rendering', () => {
    test('renders a text input field', () => {
      renderSearchBar();
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    test('renders a submit button', () => {
      renderSearchBar();
      // The submit button has visible text "Search" (from English translations)
      const buttons = screen.getAllByRole('button');
      const submitButton = buttons.find((btn) => btn.getAttribute('type') === 'submit');
      expect(submitButton).toBeInTheDocument();
    });

    test('displays the search placeholder text from translations', () => {
      renderSearchBar();
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('placeholder');
      // English placeholder should contain 'Search'
      expect(input.getAttribute('placeholder')).toMatch(/search/i);
    });
  });

  describe('Input & Submit behaviour', () => {
    test('submit button is disabled when the input is empty', () => {
      renderSearchBar();
      const submitBtn = screen
        .getAllByRole('button')
        .find((btn) => btn.getAttribute('type') === 'submit')!;
      expect(submitBtn).toBeDisabled();
    });

    test('submit button becomes enabled when text is typed', () => {
      renderSearchBar();
      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'Nutella' } });

      const submitBtn = screen
        .getAllByRole('button')
        .find((btn) => btn.getAttribute('type') === 'submit')!;
      expect(submitBtn).not.toBeDisabled();
    });

    test('calls onSearch with trimmed query on form submit', () => {
      const onSearch = jest.fn();
      renderSearchBar({ onSearch });

      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: '  Nutella  ' } });
      fireEvent.submit(input.closest('form')!);

      expect(onSearch).toHaveBeenCalledTimes(1);
      expect(onSearch).toHaveBeenCalledWith('Nutella');
    });

    test('does NOT call onSearch when query is only whitespace', () => {
      const onSearch = jest.fn();
      renderSearchBar({ onSearch });

      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: '   ' } });
      fireEvent.submit(input.closest('form')!);

      expect(onSearch).not.toHaveBeenCalled();
    });
  });

  describe('Clear button', () => {
    test('clear button is NOT shown when input is empty', () => {
      renderSearchBar();
      expect(screen.queryByLabelText(/clear search/i)).not.toBeInTheDocument();
    });

    test('clear button appears when user types a query', () => {
      renderSearchBar();
      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'Chocolate' } });
      expect(screen.getByLabelText(/clear search/i)).toBeInTheDocument();
    });

    test('clear button resets the input value', () => {
      renderSearchBar();
      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'Chocolate' } });

      const clearBtn = screen.getByLabelText(/clear search/i);
      fireEvent.click(clearBtn);

      expect((input as HTMLInputElement).value).toBe('');
    });
  });

  describe('Recent searches chips', () => {
    const sampleSearches: SearchHistoryItem[] = [
      { id: '1', query: 'Nutella', language: 'en', createdAt: new Date().toISOString() },
      { id: '2', query: 'Oat Milk', language: 'nl', createdAt: new Date().toISOString() },
      { id: '3', query: 'Stroopwafel', language: 'de', createdAt: new Date().toISOString() },
    ];

    test('renders recent search chips when provided', () => {
      renderSearchBar({ recentSearches: sampleSearches });
      expect(screen.getByText('Nutella')).toBeInTheDocument();
      expect(screen.getByText('Oat Milk')).toBeInTheDocument();
      expect(screen.getByText('Stroopwafel')).toBeInTheDocument();
    });

    test('does not render chips section when recentSearches is empty', () => {
      renderSearchBar({ recentSearches: [] });
      // No "Recent Searches:" label should be visible
      expect(screen.queryByText(/recent searches/i)).not.toBeInTheDocument();
    });

    test('clicking a recent search chip calls onSearch with that query', () => {
      const onSearch = jest.fn();
      renderSearchBar({ onSearch, recentSearches: sampleSearches });

      fireEvent.click(screen.getByText('Nutella'));

      expect(onSearch).toHaveBeenCalledWith('Nutella');
    });

    test('clicking a chip also updates the input value', () => {
      renderSearchBar({ recentSearches: sampleSearches });

      fireEvent.click(screen.getByText('Stroopwafel'));

      const input = screen.getByRole('textbox') as HTMLInputElement;
      expect(input.value).toBe('Stroopwafel');
    });
  });

  describe('Loading state', () => {
    test('submit button is disabled when loading is true', () => {
      renderSearchBar({ loading: true });
      const submitBtn = screen
        .getAllByRole('button')
        .find((btn) => btn.getAttribute('type') === 'submit')!;
      expect(submitBtn).toBeDisabled();
    });
  });
});
