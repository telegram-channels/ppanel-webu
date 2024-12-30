import { ArrowDownIcon, ArrowUpIcon, CaretSortIcon, EyeNoneIcon } from '@radix-ui/react-icons';
import { Button } from '@shadcn/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@shadcn/ui/dropdown-menu';
import { cn } from '@shadcn/ui/lib/utils';
import { flexRender, Header } from '@tanstack/react-table';

interface ColumnHeaderProps<TData, TValue> extends React.HTMLAttributes<HTMLDivElement> {
  header: Header<TData, TValue>;
  text?: Partial<{
    asc: string;
    desc: string;
    hide: string;
  }>;
}

export function ColumnHeader<TData, TValue>({
  header,
  className,
  text,
}: ColumnHeaderProps<TData, TValue>) {
  const column = header.column;
  const title = header.isPlaceholder
    ? null
    : flexRender(header.column.columnDef.header, header.getContext());
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>;
  }

  return (
    <div className={cn('flex w-full items-center', className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            className='flex h-8 w-full justify-start !bg-transparent p-0 text-sm'
          >
            <span>{title}</span>
            {column.getIsSorted() === 'desc' ? (
              <ArrowDownIcon className='ml-2 h-4 w-4' />
            ) : column.getIsSorted() === 'asc' ? (
              <ArrowUpIcon className='ml-2 h-4 w-4' />
            ) : (
              <CaretSortIcon className='ml-2 h-4 w-4' />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='start'>
          <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
            <ArrowUpIcon className='text-muted-foreground/70 mr-2 h-3.5 w-3.5' />
            {text?.asc || 'ASC'}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
            <ArrowDownIcon className='text-muted-foreground/70 mr-2 h-3.5 w-3.5' />
            {text?.desc || 'DESC'}
          </DropdownMenuItem>
          {column.getCanHide() && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
                <EyeNoneIcon className='text-muted-foreground/70 mr-2 h-3.5 w-3.5' />
                Hide
                {text?.hide || 'Hide'}
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
