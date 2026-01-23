"use client"

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="w-full max-w-[1400px]">
      <div className="rounded-lg border border-zinc-800 bg-zinc-950/50 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="border-b border-zinc-800 hover:bg-transparent">
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} className="h-12 px-4 text-xs font-medium text-zinc-400 bg-zinc-900/50">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="border-b border-zinc-800/50 hover:bg-zinc-900/20 transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="px-4 py-4">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={columns.length} className="h-32 text-center text-zinc-500">
                    No prompts found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      
      {/* Pagination */}
      {table.getRowModel().rows?.length > 0 && (
        <div className="flex items-center justify-between px-2 py-4">
          <div className="text-sm text-zinc-500">
            Showing <span className="font-medium text-zinc-400">1-{table.getRowModel().rows.length}</span> of{" "}
            <span className="font-medium text-zinc-400">{data.length}</span> prompts
          </div>
          <div className="flex items-center gap-2">
            <button
              className="inline-flex items-center justify-center h-8 w-8 rounded-md border border-zinc-800 bg-transparent hover:bg-zinc-900 text-zinc-400 disabled:opacity-50 disabled:pointer-events-none transition-colors"
              disabled={true}
            >
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.85355 3.14645C7.04882 3.34171 7.04882 3.65829 6.85355 3.85355L3.70711 7H12.5C12.7761 7 13 7.22386 13 7.5C13 7.77614 12.7761 8 12.5 8H3.70711L6.85355 11.1464C7.04882 11.3417 7.04882 11.6583 6.85355 11.8536C6.65829 12.0488 6.34171 12.0488 6.14645 11.8536L2.14645 7.85355C1.95118 7.65829 1.95118 7.34171 2.14645 7.14645L6.14645 3.14645C6.34171 2.95118 6.65829 2.95118 6.85355 3.14645Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"/>
                <path d="M13.8536 7.85355C14.0488 7.65829 14.0488 7.34171 13.8536 7.14645L9.85355 3.14645C9.65829 2.95118 9.34171 2.95118 9.14645 3.14645C8.95118 3.34171 8.95118 3.65829 9.14645 3.85355L12.2929 7L9.14645 10.1464C8.95118 10.3417 8.95118 10.6583 9.14645 10.8536C9.34171 11.0488 9.65829 11.0488 9.85355 10.8536L13.8536 7.85355Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd" opacity="0.5"/>
              </svg>
            </button>
            <button
              className="inline-flex items-center justify-center h-8 w-8 rounded-md border border-zinc-800 bg-transparent hover:bg-zinc-900 text-zinc-400 disabled:opacity-50 disabled:pointer-events-none transition-colors"
              disabled={true}
            >
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.1464 11.8536C6.34166 12.0488 6.65824 12.0488 6.8535 11.8536L10.8535 7.85355C11.0488 7.65829 11.0488 7.34171 10.8535 7.14645L6.8535 3.14645C6.65824 2.95118 6.34166 2.95118 6.1464 3.14645C5.95114 3.34171 5.95114 3.65829 6.1464 3.85355L9.29285 7L6.1464 10.1464C5.95114 10.3417 5.95114 10.6583 6.1464 10.8536Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd" opacity="0.5"/>
                <path d="M2.14645 11.8536C2.34171 12.0488 2.65829 12.0488 2.85355 11.8536L6.85355 7.85355C7.04882 7.65829 7.04882 7.34171 6.85355 7.14645L2.85355 3.14645C2.65829 2.95118 2.34171 2.95118 2.14645 3.14645C1.95118 3.34171 1.95118 3.65829 2.14645 3.85355L5.29289 7L2.14645 10.1464C1.95118 10.3417 1.95118 10.6583 2.14645 10.8536Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"/>
              </svg>
            </button>
            <button
              className="inline-flex items-center justify-center h-8 w-8 rounded-md border border-zinc-800 bg-transparent hover:bg-zinc-900 text-zinc-400 disabled:opacity-50 disabled:pointer-events-none transition-colors"
              disabled={true}
            >
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"/>
                <path d="M1.14645 7.14645C0.951184 7.34171 0.951184 7.65829 1.14645 7.85355L5.14645 11.8536C5.34171 12.0488 5.65829 12.0488 5.85355 11.8536C6.04882 11.6583 6.04882 11.3417 5.85355 11.1464L2.70711 8L5.85355 4.85355C6.04882 4.65829 6.04882 4.34171 5.85355 4.14645C5.65829 3.95118 5.34171 3.95118 5.14645 4.14645L1.14645 7.14645Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd" opacity="0.5"/>
              </svg>
            </button>
            <button
              className="inline-flex items-center justify-center h-8 w-8 rounded-md border border-zinc-800 bg-transparent hover:bg-zinc-900 text-zinc-400 disabled:opacity-50 disabled:pointer-events-none transition-colors"
              disabled={true}
            >
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.84198 3.14645C9.03725 2.95118 9.35383 2.95118 9.54909 3.14645L13.5491 7.14645C13.7443 7.34171 13.7443 7.65829 13.5491 7.85355L9.54909 11.8536C9.35383 12.0488 9.03725 12.0488 8.84198 11.8536C8.64672 11.6583 8.64672 11.3417 8.84198 11.1464L12.0355 8L8.84198 4.85355C8.64672 4.65829 8.64672 4.34171 8.84198 3.14645Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"/>
                <path d="M1.14645 7.14645C0.951184 7.34171 0.951184 7.65829 1.14645 7.85355L5.14645 11.8536C5.34171 12.0488 5.65829 12.0488 5.85355 11.8536C6.04882 11.6583 6.04882 11.3417 5.85355 11.1464L2.70711 8H11.5C11.7761 8 12 7.77614 12 7.5C12 7.22386 11.7761 7 11.5 7H2.70711L5.85355 3.85355C6.04882 3.65829 6.04882 3.34171 5.85355 3.14645C5.65829 2.95118 5.34171 2.95118 5.14645 3.14645L1.14645 7.14645Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd" opacity="0.5"/>
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}