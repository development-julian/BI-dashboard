'use client';

import * as React from 'react';
import {
  CaretSortIcon,
} from '@radix-ui/react-icons';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { Transaction } from '@/lib/data';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

type SortKey = keyof Transaction;

export function DataTable({ data }: { data: Transaction[] }) {
  const [sortConfig, setSortConfig] = React.useState<{ key: SortKey; direction: 'ascending' | 'descending' } | null>({ key: 'date', direction: 'descending' });

  const sortedData = React.useMemo(() => {
    let sortableItems = [...data];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [data, sortConfig]);

  const requestSort = (key: SortKey) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: SortKey) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <CaretSortIcon className="ml-2 h-4 w-4" />;
    }
    return sortConfig.direction === 'ascending' ? '▲' : '▼';
  };

  const headers: { key: SortKey; label: string }[] = [
    { key: 'id', label: 'Transaction ID' },
    { key: 'email', label: 'Email' },
    { key: 'amount', label: 'Amount' },
    { key: 'date', label: 'Date' },
    { key: 'status', label: 'Status' },
  ];

  return (
    <div className="w-full">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {headers.map((header) => (
                <TableHead key={header.key}>
                  <Button variant="ghost" onClick={() => requestSort(header.key)}>
                    {header.label}
                    <span className="ml-2">{getSortIcon(header.key)}</span>
                  </Button>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.length ? (
              sortedData.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-medium">{row.id}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell className="text-right">${row.amount.toFixed(2)}</TableCell>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        row.status === 'success'
                          ? 'default'
                          : row.status === 'pending'
                          ? 'secondary'
                          : 'destructive'
                      }
                      className={cn({
                        'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400': row.status === 'success',
                        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-400': row.status === 'pending',
                      })}
                    >
                      {row.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={headers.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
