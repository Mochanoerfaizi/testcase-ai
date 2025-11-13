"use client"

import * as React from "react"
import { Box, Table, Text, Flex } from "@chakra-ui/react"
import {useColorModeValue} from "@/Components/themes/ui/color-mode.jsx";

export default function DataGridStickySimple() {

    const borderColor = useColorModeValue("gray.200", "gray.700")
    const bgSticky = useColorModeValue("white", "gray.900")

    // ========= 🔹 Dummy Data
    // const data = [
    //     { kode: "D-01", "2023": 12, "2024": 14, "2025": 15, "2026": 15, "2027": 15, "2028": 15, "2029": 15, "2030": 15, "2031": 15, "2032": 15, "2033": 15, "2034": 15, "2035": 15 },
    //     { kode: "D-02", "2023": 22, "2024": 23, "2025": 24, "2026": 24, "2027": 24, "2028": 24, "2029": 24, "2030": 24, "2031": 24, "2032": 24, "2033": 24, "2034": 24, "2035": 24 },
    //     { kode: "D-03", "2023": 30, "2024": 33, "2025": 36, "2026": 36, "2027": 36, "2028": 36, "2029": 36, "2030": 36, "2031": 36, "2032": 36, "2033": 36, "2034": 36, "2035": 36 },
    //     { kode: "D-04", "2023": 18, "2024": 19, "2025": 20, "2026": 20, "2027": 20, "2028": 20, "2029": 20, "2030": 20, "2031": 20, "2032": 20, "2033": 20, "2034": 20, "2035": 20 },
    //     { kode: "D-05", "2023": 42, "2024": 46, "2025": 49, "2026": 49, "2027": 49, "2028": 49, "2029": 49, "2030": 49, "2031": 49, "2032": 49, "2033": 49, "2034": 49, "2035": 49 },
    //     { kode: "D-01", "2023": 12, "2024": 14, "2025": 15, "2026": 15, "2027": 15, "2028": 15, "2029": 15, "2030": 15, "2031": 15, "2032": 15, "2033": 15, "2034": 15, "2035": 15 },
    //     { kode: "D-02", "2023": 22, "2024": 23, "2025": 24, "2026": 24, "2027": 24, "2028": 24, "2029": 24, "2030": 24, "2031": 24, "2032": 24, "2033": 24, "2034": 24, "2035": 24 },
    //     { kode: "D-03", "2023": 30, "2024": 33, "2025": 36, "2026": 36, "2027": 36, "2028": 36, "2029": 36, "2030": 36, "2031": 36, "2032": 36, "2033": 36, "2034": 36, "2035": 36 },
    //     { kode: "D-04", "2023": 18, "2024": 19, "2025": 20, "2026": 20, "2027": 20, "2028": 20, "2029": 20, "2030": 20, "2031": 20, "2032": 20, "2033": 20, "2034": 20, "2035": 20 },
    //     { kode: "D-05", "2023": 42, "2024": 46, "2025": 49, "2026": 49, "2027": 49, "2028": 49, "2029": 49, "2030": 49, "2031": 49, "2032": 49, "2033": 49, "2034": 49, "2035": 49 },
    //     { kode: "D-01", "2023": 12, "2024": 14, "2025": 15, "2026": 15, "2027": 15, "2028": 15, "2029": 15, "2030": 15, "2031": 15, "2032": 15, "2033": 15, "2034": 15, "2035": 15 },
    //     { kode: "D-02", "2023": 22, "2024": 23, "2025": 24, "2026": 24, "2027": 24, "2028": 24, "2029": 24, "2030": 24, "2031": 24, "2032": 24, "2033": 24, "2034": 24, "2035": 24 },
    //     { kode: "D-03", "2023": 30, "2024": 33, "2025": 36, "2026": 36, "2027": 36, "2028": 36, "2029": 36, "2030": 36, "2031": 36, "2032": 36, "2033": 36, "2034": 36, "2035": 36 },
    //     { kode: "D-04", "2023": 18, "2024": 19, "2025": 20, "2026": 20, "2027": 20, "2028": 20, "2029": 20, "2030": 20, "2031": 20, "2032": 20, "2033": 20, "2034": 20, "2035": 20 },
    //     { kode: "D-05", "2023": 42, "2024": 46, "2025": 49, "2026": 49, "2027": 49, "2028": 49, "2029": 49, "2030": 49, "2031": 49, "2032": 49, "2033": 49, "2034": 49, "2035": 49 },
    //     { kode: "D-01", "2023": 12, "2024": 14, "2025": 15, "2026": 15, "2027": 15, "2028": 15, "2029": 15, "2030": 15, "2031": 15, "2032": 15, "2033": 15, "2034": 15, "2035": 15 },
    //     { kode: "D-02", "2023": 22, "2024": 23, "2025": 24, "2026": 24, "2027": 24, "2028": 24, "2029": 24, "2030": 24, "2031": 24, "2032": 24, "2033": 24, "2034": 24, "2035": 24 },
    //     { kode: "D-03", "2023": 30, "2024": 33, "2025": 36, "2026": 36, "2027": 36, "2028": 36, "2029": 36, "2030": 36, "2031": 36, "2032": 36, "2033": 36, "2034": 36, "2035": 36 },
    //     { kode: "D-04", "2023": 18, "2024": 19, "2025": 20, "2026": 20, "2027": 20, "2028": 20, "2029": 20, "2030": 20, "2031": 20, "2032": 20, "2033": 20, "2034": 20, "2035": 20 },
    //     { kode: "D-05", "2023": 42, "2024": 46, "2025": 49, "2026": 49, "2027": 49, "2028": 49, "2029": 49, "2030": 49, "2031": 49, "2032": 49, "2033": 49, "2034": 49, "2035": 49 },
    //     { kode: "D-01", "2023": 12, "2024": 14, "2025": 15, "2026": 15, "2027": 15, "2028": 15, "2029": 15, "2030": 15, "2031": 15, "2032": 15, "2033": 15, "2034": 15, "2035": 15 },
    //     { kode: "D-02", "2023": 22, "2024": 23, "2025": 24, "2026": 24, "2027": 24, "2028": 24, "2029": 24, "2030": 24, "2031": 24, "2032": 24, "2033": 24, "2034": 24, "2035": 24 },
    //     { kode: "D-03", "2023": 30, "2024": 33, "2025": 36, "2026": 36, "2027": 36, "2028": 36, "2029": 36, "2030": 36, "2031": 36, "2032": 36, "2033": 36, "2034": 36, "2035": 36 },
    //     { kode: "D-04", "2023": 18, "2024": 19, "2025": 20, "2026": 20, "2027": 20, "2028": 20, "2029": 20, "2030": 20, "2031": 20, "2032": 20, "2033": 20, "2034": 20, "2035": 20 },
    //     { kode: "D-05", "2023": 42, "2024": 46, "2025": 49, "2026": 49, "2027": 49, "2028": 49, "2029": 49, "2030": 49, "2031": 49, "2032": 49, "2033": 49, "2034": 49, "2035": 49 },
    //     { kode: "D-01", "2023": 12, "2024": 14, "2025": 15, "2026": 15, "2027": 15, "2028": 15, "2029": 15, "2030": 15, "2031": 15, "2032": 15, "2033": 15, "2034": 15, "2035": 15 },
    //     { kode: "D-02", "2023": 22, "2024": 23, "2025": 24, "2026": 24, "2027": 24, "2028": 24, "2029": 24, "2030": 24, "2031": 24, "2032": 24, "2033": 24, "2034": 24, "2035": 24 },
    //     { kode: "D-03", "2023": 30, "2024": 33, "2025": 36, "2026": 36, "2027": 36, "2028": 36, "2029": 36, "2030": 36, "2031": 36, "2032": 36, "2033": 36, "2034": 36, "2035": 36 },
    //     { kode: "D-04", "2023": 18, "2024": 19, "2025": 20, "2026": 20, "2027": 20, "2028": 20, "2029": 20, "2030": 20, "2031": 20, "2032": 20, "2033": 20, "2034": 20, "2035": 20 },
    //     { kode: "D-05", "2023": 42, "2024": 46, "2025": 49, "2026": 49, "2027": 49, "2028": 49, "2029": 49, "2030": 49, "2031": 49, "2032": 49, "2033": 49, "2034": 49, "2035": 49 },
    // ]

    const data = [
        { kode: "D-01", "2023": 12},
        { kode: "D-02", "2023": 22},
        { kode: "D-03", "2023": 30},
        { kode: "D-04", "2023": 18},
        { kode: "D-05", "2023": 42},
    ]

    // ========= 🔹 Tahun header (dari key)
    const years = Object.keys(data[0]).filter((k) => k !== "kode")

    return (
        <Box
            overflow="auto"
            maxH="600px"
            maxW="100%"
            borderWidth="1px"
            rounded="sm"
            position="relative"
            sx={{
                "& table": {
                    borderCollapse: "separate",
                    borderSpacing: 0,
                },
            }}
        >
            <Box as={Table.Root} variant="outline" size="sm" minW="1000px" striped>
                {/* HEADER */}
                <Table.Header>
                    <Table.Row
                        position="sticky"
                        top="0"
                        zIndex="20"
                        bg={bgSticky}
                        borderBottomWidth="1px"
                        borderColor={borderColor}
                    >
                        {/* Sticky kiri: Kode */}
                        <Table.ColumnHeader
                            position="sticky"
                            left="0"
                            zIndex="25"
                            bg={bgSticky}
                            borderRight={`1px solid ${borderColor}`}
                            borderBottom={`1px solid ${borderColor}`}
                            minW="100px"
                        >
                            <Flex justify="center" align="center" fontWeight="bold">
                                Kode
                            </Flex>
                        </Table.ColumnHeader>

                        {/* Sticky kiri kedua: Elemen */}
                        <Table.ColumnHeader
                            position="sticky"
                            left="100px"
                            zIndex="24"
                            bg={bgSticky}
                            borderRight={`1px solid ${borderColor}`}
                            borderBottom={`1px solid ${borderColor}`}
                            minW="160px"
                        >
                            <Flex justify="center" align="center" fontWeight="bold">
                                Elemen
                            </Flex>
                        </Table.ColumnHeader>

                        {/* Tahun */}
                        {years.map((year) => (
                            <Table.ColumnHeader
                                key={year}
                                textAlign="center"
                                borderBottom={`1px solid ${borderColor}`}
                                borderRight={`1px solid ${borderColor}`}
                                minW="100px"
                                bg={bgSticky}
                            >
                                <Text fontWeight="bold">{year}</Text>
                            </Table.ColumnHeader>
                        ))}

                        {/* Sticky kanan: Total */}
                        <Table.ColumnHeader
                            position="sticky"
                            right="0"
                            zIndex="23"
                            bg={bgSticky}
                            borderLeft={`1px solid ${borderColor}`}
                            borderBottom={`1px solid ${borderColor}`}
                            minW="120px"
                        >
                            <Flex justify="center" align="center" fontWeight="bold">
                                Total
                            </Flex>
                        </Table.ColumnHeader>
                    </Table.Row>
                </Table.Header>

                {/* BODY */}
                <Table.Body>
                    {data.map((row, i) => (
                        <Table.Row
                            key={`${row.kode}-${i}`}
                            borderBottom={`1px solid ${borderColor}`}
                            _hover={{ bg: useColorModeValue("gray.50", "gray.800") }}
                        >
                            {/* Sticky kiri: Kode */}
                            <Table.Cell
                                position="sticky"
                                left="0"
                                zIndex="15"
                                bg={bgSticky}
                                borderRight={`1px solid ${borderColor}`}
                                minW="100px"
                                fontWeight="medium"
                            >
                                {row.kode}
                            </Table.Cell>

                            {/* Sticky kiri kedua: Elemen */}
                            <Table.Cell
                                position="sticky"
                                left="100px"
                                zIndex="14"
                                bg={bgSticky}
                                borderRight={`1px solid ${borderColor}`}
                                minW="160px"
                            >
                                {row.elemen}
                            </Table.Cell>

                            {/* Isi tahun */}
                            {years.map((year) => (
                                <Table.Cell
                                    key={year}
                                    textAlign="center"
                                    borderRight={`1px solid ${borderColor}`}
                                    borderBottom={`1px solid ${borderColor}`}
                                    minW="100px"
                                >
                                    {row[year]}
                                </Table.Cell>
                            ))}

                            {/* Sticky kanan: Total */}
                            <Table.Cell
                                position="sticky"
                                right="0"
                                zIndex="15"
                                bg={bgSticky}
                                borderLeft={`1px solid ${borderColor}`}
                                minW="120px"
                                fontWeight="semibold"
                            >
                                {row.total}
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Box>
        </Box>
    )
}
