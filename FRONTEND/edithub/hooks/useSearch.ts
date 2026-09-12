'use client';

import { useState, useCallback, useTransition } from 'react';

export function useSearch(initialValue = '') {
  const [query, setQuery] = useState(initialValue);
  const [debouncedQuery, setDebouncedQuery] = useState(initialValue);
  const [isPending, startTransition] = useTransition();

  const handleSearch = useCallback(
    (value: string) => {
      setQuery(value);
      // Simple debounce via setTimeout
      const timer = setTimeout(() => {
        startTransition(() => {
          setDebouncedQuery(value);
        });
      }, 300);
      return () => clearTimeout(timer);
    },
    []
  );

  return {
    query,
    debouncedQuery,
    setQuery: handleSearch,
    isPending,
  };
}
