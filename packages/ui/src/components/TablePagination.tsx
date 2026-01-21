import { Pagination, Group, Text, Select } from '@mantine/core';

interface TablePaginationProps {
  total: number;
  totalPages: number;
  page: number;
  onChange: (page: number) => void;
  limit?: number;
  onLimitChange?: (limit: number) => void;
}

export function TablePagination({ total, totalPages, page, onChange, limit, onLimitChange }: TablePaginationProps) {
  if (total === 0) return null;

  return (
    <Group justify="space-between" mt="md">
      <Text size="sm" c="dimmed">
        Total {total} items
      </Text>
      <Group>
        {limit && onLimitChange && (
            <Select
                value={limit.toString()}
                onChange={(value) => onLimitChange(Number(value))}
                data={['5', '10', '20', '50']}
                w={70}
                size="sm"
                allowDeselect={false}
            />
        )}
        <Pagination 
            total={totalPages} 
            value={page} 
            onChange={onChange} 
            size="sm" 
            radius="md" 
            withEdges
        />
      </Group>
    </Group>
  );
}
