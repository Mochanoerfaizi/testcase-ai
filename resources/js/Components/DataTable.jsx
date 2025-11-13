"use client"

import * as React from "react"
import {
    Box,
    Button,
    HStack,
    IconButton,
    Input,
    NativeSelect,
    Table,
    Text,
    ButtonGroup,
    Pagination,
    VStack,
    Menu,
    Portal,
    Flex, Show,
} from "@chakra-ui/react"
import {Tooltip} from "@/Components/themes/ui/tooltip"
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    useReactTable,
} from "@tanstack/react-table"
import {HiChevronLeft, HiChevronRight} from "react-icons/hi"
import {LuArrowUp, LuArrowDown, LuArrowUpDown} from "react-icons/lu"
import {MdFilterAlt} from "react-icons/md"
import {useMemo} from "react";

export default function DataTable({
                                      columns,
                                      data,
                                      totalPages,
                                      isLoading,
                                      pageIndex,
                                      setPageIndex,
                                      pageSize,
                                      setPageSize,
                                      sorting,
                                      setSorting,
                                      globalFilter,
                                      setGlobalFilter,
                                      columnFilters,
                                      setColumnFilters,
                                      showNumbering = true
                                  }) {

    const numberingColumn = useMemo(
        () =>
            showNumbering
                ? [
                    {
                        id: "rowNumber",
                        header: "#",
                        size: 20,
                        enableSorting: false,
                        enableColumnFilter: false,
                        cell: ({row, table}) => {
                            const pageIndex = table.options.state.pagination.pageIndex
                            const pageSize = table.options.state.pagination.pageSize
                            const number = pageIndex * pageSize + row.index + 1
                            return (
                                <Text textAlign="center" w="full">
                                    {number}
                                </Text>
                            )
                        },
                    },
                ]
                : [],
        [showNumbering]
    )

    const table = useReactTable({
        data,
        columns: [...numberingColumn, ...columns],
        state: {sorting, pagination: {pageIndex, pageSize}, columnFilters, globalFilter},
        manualPagination: true,
        manualSorting: true,
        manualFiltering: true,
        onSortingChange: (updater) => {
            const newSorting = typeof updater === "function" ? updater(sorting) : updater
            setSorting(newSorting) // ini sekarang array, bukan function
        },
        onColumnFiltersChange: (updater) => {
            const newFilters = typeof updater === "function" ? updater(columnFilters) : updater
            setColumnFilters(newFilters)
        },
        onGlobalFilterChange: (updater) => {
            const newValue = typeof updater === "function" ? updater(globalFilter) : updater
            setGlobalFilter(newValue)
        },
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    })

    return (
        <Box p="6" bg="bg.panel" rounded="sm" shadow="sm">
            {/* Toolbar */}
            <HStack justify="space-between" mb="4">
                <HStack gap="2">
                    <Input
                        value={globalFilter ?? ""}
                        onChange={(e) => {
                            setPageIndex(0)
                            setGlobalFilter(e.target.value)
                        }}
                        placeholder="Search..."
                        size="sm"
                        maxW="250px"
                    />
                    {globalFilter && (
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                                setPageIndex(0)
                                setGlobalFilter("")
                            }}
                        >
                            Clear
                        </Button>
                    )}
                </HStack>

            {/*  Advance Filter  */}
            </HStack>

            <Box overflowX="auto">
                {/* Table */}
                <Table.Root size="sm" variant="outline" striped>
                    <Table.Header>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <Table.Row key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <Table.ColumnHeader
                                        key={header.id}
                                        w={header.column.columnDef.size ? `${header.column.columnDef.size}px` : "auto"}
                                    >
                                        <VStack align="start" spacing="1" w="full">
                                            <Flex
                                                w="100%"
                                                justify={header.column.id === "rowNumber" ? "center" : "space-between"}
                                                align="center"
                                            >


                                                <Tooltip
                                                    content={
                                                        header.column.getIsSorted() === "asc"
                                                            ? `Sorted by ${header.column.columnDef.header} ascending`
                                                            : header.column.getIsSorted() === "desc"
                                                                ? `Sorted by ${header.column.columnDef.header} descending`
                                                                : "Sort"
                                                    }
                                                >
                                                    <HStack
                                                        cursor={
                                                            header.column.getCanSort()
                                                                ? "pointer"
                                                                : "default"
                                                        }
                                                        onClick={
                                                            header.column.getCanSort()
                                                                ? header.column.getToggleSortingHandler()
                                                                : undefined
                                                        }
                                                    >
                                                        <Flex

                                                        >
                                                            {flexRender(
                                                                header.column.columnDef.header,
                                                                header.getContext()
                                                            )}
                                                        </Flex>
                                                        <Show
                                                            when={!(header?.column?.columnDef?.enableSorting === false)}>
                                                            {{
                                                                asc: <LuArrowUp/>,
                                                                desc: <LuArrowDown/>,
                                                            }[
                                                                header.column.getIsSorted()
                                                                ] ?? <LuArrowUpDown/>}
                                                        </Show>

                                                    </HStack>
                                                </Tooltip>

                                                {/* Filter menu */}
                                                <Show
                                                    when={!(header?.column?.columnDef?.enableColumnFilter === false)}>
                                                    <FilterMenuWrapper
                                                        header={header}
                                                        data={data}
                                                    />
                                                </Show>
                                            </Flex>
                                        </VStack>
                                    </Table.ColumnHeader>
                                ))}
                            </Table.Row>
                        ))}
                    </Table.Header>

                    <Table.Body>
                        {isLoading ? (
                            <Table.Row>
                                <Table.Cell colSpan={columns.length + 1}>
                                    <Text align="center">Loading...</Text>
                                </Table.Cell>
                            </Table.Row>
                        ) : table.getRowModel().rows.length > 0 ? (
                            table.getRowModel().rows.map((row) => (
                                <Table.Row
                                    key={row.id}
                                    _hover={{bg: "gray.50/_dark:gray.900"}}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <Table.Cell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </Table.Cell>
                                    ))}
                                </Table.Row>
                            ))
                        ) : (
                            <Table.Row>
                                <Table.Cell colSpan={columns.length+1}>
                                    <Text align="center">No data found</Text>
                                </Table.Cell>
                            </Table.Row>
                        )}
                    </Table.Body>
                </Table.Root>
            </Box>
            {/* Pagination */}
            <HStack justify="space-between" mt="4">
                <HStack>
                    <Text fontSize="sm" color="fg.muted">
                        Page {pageIndex + 1} of {totalPages}
                    </Text>
                    <NativeSelect.Root
                        size="sm"
                        value={pageSize}
                        onChange={(e) => {
                            setPageSize(Number(e.target.value))
                            setPageIndex(0)
                        }}
                        w="auto"
                    >
                        <NativeSelect.Field>
                            {[5, 10, 20, 50].map((size) => (
                                <option key={size} value={size}>
                                    {size}
                                </option>
                            ))}
                        </NativeSelect.Field>
                    </NativeSelect.Root>
                </HStack>

                <Pagination.Root
                    count={totalPages > 0 ? totalPages : 1}
                    page={pageIndex + 1}
                    onPageChange={(e) => setPageIndex(e.page - 1)}
                    pageSize={1}
                >
                    <ButtonGroup attached variant="outline" size="sm">
                        <Pagination.PrevTrigger asChild>
                            <IconButton aria-label="Previous page">
                                <HiChevronLeft/>
                            </IconButton>
                        </Pagination.PrevTrigger>

                        <Pagination.Items
                            render={(page) => (
                                <IconButton
                                    key={page.value}
                                    variant={{
                                        base: "outline",
                                        _selected: "solid",
                                    }}
                                    zIndex={{_selected: "1"}}
                                    onClick={() => setPageIndex(page.value - 1)}
                                >
                                    {page.value}
                                </IconButton>
                            )}
                        />

                        <Pagination.NextTrigger asChild>
                            <IconButton aria-label="Next page">
                                <HiChevronRight/>
                            </IconButton>
                        </Pagination.NextTrigger>
                    </ButtonGroup>
                </Pagination.Root>
            </HStack>
        </Box>
    )
}

/* ------------------------------
 * Sub Component: Filter Menu
 * ----------------------------- */
function FilterMenuWrapper({header, data}) {
    const [isOpen, setIsOpen] = React.useState(false)

    return (
        <Menu.Root
            closeOnSelect={false}
            open={isOpen}
            onOpenChange={(e) => setIsOpen(e.open)}
        >
            <Menu.Trigger asChild>
                <IconButton
                    size="xs"
                    variant="ghost"
                    aria-label={`Filter ${header.column.columnDef.header}`}
                >
                    <MdFilterAlt/>
                </IconButton>
            </Menu.Trigger>
            <Portal>
                <Menu.Positioner>
                    <Menu.Content minW="250px" p="2">
                        <FilterMenu
                            header={header}
                            data={data}
                            onClose={() => setIsOpen(false)}
                        />
                    </Menu.Content>
                </Menu.Positioner>
            </Portal>
        </Menu.Root>
    )
}

function FilterMenu({header, data, onClose}) {
    const uniqueValues = React.useMemo(() => {
        const vals = new Set(data.map((row) => row[header.column.id]))
        return Array.from(vals)
    }, [data, header.column.id])

    const [searchTerm, setSearchTerm] = React.useState("")
    const [tempValues, setTempValues] = React.useState(
        header.column.getFilterValue() ?? []
    )

    React.useEffect(() => {
        setTempValues(header.column.getFilterValue() ?? [])
    }, [header.column.getFilterValue()])

    return (
        <>
            {/* Search box */}
            <Input
                size="sm"
                placeholder="Search..."
                mb="2"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            {/* Actions */}
            <HStack justify="space-between" mb="2">
                <Button
                    size="xs"
                    variant="ghost"
                    onClick={() => setTempValues(uniqueValues)}
                >
                    Select all {uniqueValues.length}
                </Button>
                <Button size="xs" variant="ghost" onClick={() => setTempValues([])}>
                    Clear
                </Button>
            </HStack>

            {/* Values with checkbox */}
            <Box maxH="150px" overflowY="auto">
                {uniqueValues
                    .filter((val) =>
                        String(val).toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((val) => {
                        const isChecked = tempValues?.includes(val)
                        return (
                            <Menu.CheckboxItem
                                key={val}
                                value={val}
                                checked={isChecked}
                                onCheckedChange={() => {
                                    setTempValues((prev) =>
                                        prev.includes(val)
                                            ? prev.filter((v) => v !== val)
                                            : [...prev, val]
                                    )
                                }}
                            >
                                {String(val)}
                                <Menu.ItemIndicator/>
                            </Menu.CheckboxItem>
                        )
                    })}
            </Box>

            {/* Footer */}
            <HStack justify="end" gap="2" mt="2">
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                        setTempValues(header.column.getFilterValue() ?? [])
                        onClose?.()
                    }}
                >
                    Cancel
                </Button>
                <Button
                    size="sm"
                    colorPalette="green"
                    onClick={() => {
                        header.column.setFilterValue(tempValues)
                        onClose?.()
                    }}
                >
                    OK
                </Button>
            </HStack>
        </>
    )
}
