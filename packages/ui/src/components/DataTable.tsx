import { Table, LoadingOverlay, Box, type TableProps } from '@repo/mantine';
import { motion, AnimatePresence } from '@repo/shared';
import type { ReactNode } from 'react';
import { TablePagination } from './TablePagination';

const MotionTr = motion.create(Table.Tr);


export interface Column<T> {
  key: string;
  header: ReactNode;
  render?: (item: T) => ReactNode;
  width?: string | number;
  textAlign?: 'left' | 'center' | 'right';
}

export interface PaginationProps {
  total: number;
  totalPages: number;
  page: number;
  onChange: (page: number) => void;
  limit: number;
  onLimitChange: (limit: number) => void;
}

export interface DataTableProps<T> extends Omit<TableProps, 'data'> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: ReactNode;
  minHeight?: string | number;
  rowKey?: (item: T) => string | number;
  pagination?: PaginationProps;
}

export function DataTable<T>({
  columns,
  data,
  loading = false,
  emptyMessage = 'No data found',
  minHeight = 200,
  rowKey = (item: any) => item.id,
  pagination,
  ...tableProps
}: DataTableProps<T>) {
  return (
    <Box>
      <Box style={{ overflowX: 'auto', position: 'relative', minHeight: data.length === 0 ? minHeight : 'auto' }}>
        <LoadingOverlay visible={loading} overlayProps={{ blur: 2 }} />
        <Table striped highlightOnHover verticalSpacing="sm" horizontalSpacing="md" {...tableProps}>
          <Table.Thead>
            <Table.Tr>
              {columns.map((column) => (
                <Table.Th key={column.key} style={{ width: column.width, textAlign: column.textAlign }}>
                  {column.header}
                </Table.Th>
              ))}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            <AnimatePresence mode="popLayout">
              {data.length > 0 ? (
                data.map((item, index) => (
                  <MotionTr
                    key={rowKey(item)}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                  >
                    {columns.map((column) => (
                      <Table.Td key={`${rowKey(item)}-${column.key}`} style={{ textAlign: column.textAlign }}>
                        {column.render ? column.render(item) : (item as any)[column.key]}
                      </Table.Td>
                    ))}
                  </MotionTr>
                ))
              ) : (
                <Table.Tr>
                  <Table.Td colSpan={columns.length} style={{ textAlign: 'center', color: 'gray', padding: 40 }}>
                    {!loading && emptyMessage}
                  </Table.Td>
                </Table.Tr>
              )}
            </AnimatePresence>
          </Table.Tbody>
        </Table>
      </Box>
      {pagination && (
        <Box px="md" pb="md">
          <TablePagination {...pagination} />
        </Box>
      )}
    </Box>
  );
}
