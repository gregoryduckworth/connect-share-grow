
import { useState, useMemo } from 'react';

interface UseAdminFiltersProps<T> {
  data: T[];
  searchKey?: keyof T;
  sortKey?: keyof T;
  filterKey?: keyof T;
}

export function useAdminFilters<T>({
  data,
  searchKey,
  sortKey,
  filterKey,
}: UseAdminFiltersProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<keyof T | ''>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterValue, setFilterValue] = useState('all');

  const filteredAndSortedData = useMemo(() => {
    let result = [...data];

    // Apply search filter
    if (searchQuery && searchKey) {
      result = result.filter((item) =>
        String(item[searchKey]).toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    if (filterValue !== 'all' && filterKey) {
      result = result.filter((item) => {
        const value = item[filterKey];
        if (filterValue === 'high-activity') {
          return typeof value === 'number' && value > 100;
        }
        if (filterValue === 'low-activity') {
          return typeof value === 'number' && value <= 100;
        }
        return String(value) === filterValue;
      });
    }

    // Apply sorting
    if (sortBy) {
      result.sort((a, b) => {
        const aVal = a[sortBy];
        const bVal = b[sortBy];
        
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return sortOrder === 'desc' ? bVal - aVal : aVal - bVal;
        }
        
        const aStr = String(aVal).toLowerCase();
        const bStr = String(bVal).toLowerCase();
        
        if (sortOrder === 'desc') {
          return bStr.localeCompare(aStr);
        }
        return aStr.localeCompare(bStr);
      });
    }

    return result;
  }, [data, searchQuery, sortBy, sortOrder, filterValue, searchKey, sortKey, filterKey]);

  return {
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    filterValue,
    setFilterValue,
    filteredAndSortedData,
    toggleSortOrder: () => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc'),
  };
}
