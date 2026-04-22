import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import * as XLSX from "xlsx";
import {
    Box, Button, Flex, Text, Heading, VStack, HStack, Badge,
    Grid, GridItem, Card, Table, Separator
} from "@chakra-ui/react";
import { MdArrowBack, MdDownload, MdAutoAwesome, MdPerson, MdCalendarToday, MdImportExport } from "react-icons/md";

// ── BDD keyword color config ─────────────────────────────────────────────────
const BDD_COLORS = {
    Given: { bg: "#EFF6FF", border: "#3B82F6", label: "#1D4ED8" },
    When:  { bg: "#F0FDF4", border: "#22C55E", label: "#15803D" },
    Then:  { bg: "#FFF7ED", border: "#F97316", label: "#C2410C" },
    And:   { bg: "#F5F3FF", border: "#8B5CF6", label: "#6D28D9" },
    But:   { bg: "#FFF1F2", border: "#F43F5E", label: "#BE123C" },
};

// URL regex — matches http/https URLs
const URL_REGEX = /(https?:\/\/[^\s]+)/g;

/**
 * Split a text segment into plain-text chunks and URL chunks.
 * Returns: Array<{ type: "text"|"url", value: string }>
 */
function splitTextAndUrls(text) {
    const parts = [];
    let last = 0;
    let match;
    const re = new RegExp(URL_REGEX.source, "g");
    while ((match = re.exec(text)) !== null) {
        if (match.index > last) parts.push({ type: "text", value: text.slice(last, match.index) });
        parts.push({ type: "url", value: match[0] });
        last = match.index + match[0].length;
    }
    if (last < text.length) parts.push({ type: "text", value: text.slice(last) });
    return parts;
}

/** Render a line of text with embedded URLs turned into clickable links */
function RichText({ text, ...props }) {
    const parts = splitTextAndUrls(text);
    return (
        <Text {...props}>
            {parts.map((p, i) =>
                p.type === "url" ? (
                    <Box
                        as="a"
                        key={i}
                        href={p.value}
                        target="_blank"
                        rel="noopener noreferrer"
                        display="inline-flex"
                        alignItems="center"
                        gap={1}
                        color="blue.500"
                        fontWeight="medium"
                        fontSize="xs"
                        px={2}
                        py={0.5}
                        bg="blue.50"
                        borderRadius="md"
                        border="1px solid"
                        borderColor="blue.200"
                        maxW="100%"
                        overflow="hidden"
                        textOverflow="ellipsis"
                        whiteSpace="nowrap"
                        verticalAlign="middle"
                        mx={1}
                        _hover={{ bg: "blue.100", borderColor: "blue.400", textDecoration: "none" }}
                        title={p.value}
                    >
                        🔗 {p.value.replace(/^https?:\/\//, "").slice(0, 55)}{p.value.length > 62 ? "…" : ""}
                    </Box>
                ) : (
                    <span key={i}>{p.value}</span>
                )
            )}
        </Text>
    );
}

/**
 * Parse description text into structured blocks.
 * Handles: plain text, BDD (Given/When/Then/And), and Skenario groupings.
 */
function parseDescription(raw) {
    if (!raw) return null;

    // Strip HTML tags, decode entities, normalise whitespace
    let plain = raw
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<\/p>/gi, "\n")
        .replace(/<[^>]+>/g, "")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/\r\n/g, "\n")
        .replace(/\r/g, "\n")
        .trim();

    // Try to split by numbered scenarios or "Skenario:" prefix
    const scenarioRegex = /(\d+\.\s*Skenario\s*:|Skenario\s*:)/gi;
    const parts = plain.split(scenarioRegex);

    const scenarios = [];
    let preamble = "";

    if (parts.length <= 1) {
        preamble = "";
        scenarios.push({ title: null, rawText: plain });
    } else {
        preamble = parts[0].trim();
        for (let i = 1; i < parts.length; i += 2) {
            const content = parts[i + 1] || "";
            const firstKeywordIdx = content.search(/\b(Given|When|Then|And|But)\s*:/i);
            const title = firstKeywordIdx > 0 ? content.slice(0, firstKeywordIdx).trim() : "";
            const body  = firstKeywordIdx >= 0 ? content.slice(firstKeywordIdx) : content;
            scenarios.push({ title, rawText: body });
        }
    }

    // Parse BDD steps or plain paragraphs from each scenario block
    const parsed = scenarios.map((sc) => {
        const keywordPattern = /\b(Given|When|Then|And|But)\s*:/gi;
        const hasBDD = keywordPattern.test(sc.rawText);
        keywordPattern.lastIndex = 0;

        if (hasBDD) {
            // Extract BDD steps
            const steps = [];
            let matchB;
            let lastIdx = 0;
            let lastKeyword = null;
            const text = sc.rawText;
            while ((matchB = keywordPattern.exec(text)) !== null) {
                if (lastKeyword !== null) {
                    steps.push({ type: "bdd", keyword: lastKeyword, text: text.slice(lastIdx, matchB.index).trim() });
                }
                lastKeyword = matchB[1];
                lastIdx = matchB.index + matchB[0].length;
            }
            if (lastKeyword !== null) {
                steps.push({ type: "bdd", keyword: lastKeyword, text: text.slice(lastIdx).trim() });
            }
            return { ...sc, isBDD: true, blocks: steps };
        } else {
            // Split plain text into paragraphs (double-newline or single newline)
            const lines = sc.rawText
                .split(/\n{2,}/)          // prefer double-newline paragraphs
                .flatMap(chunk => {
                    // if a chunk has single newlines, split further
                    const sub = chunk.split(/\n/).map(l => l.trim()).filter(Boolean);
                    return sub.length > 0 ? [sub.join(" ")] : [];
                })
                .filter(Boolean);

            const blocks = lines.map(line => ({ type: "plain", text: line }));
            return { ...sc, isBDD: false, blocks };
        }
    });

    return { preamble, scenarios: parsed };
}

/** BDD step block with colored left border */
function BDDStep({ keyword, text }) {
    const colors = BDD_COLORS[keyword] || { bg: "#F9FAFB", border: "#D1D5DB", label: "#374151" };
    return (
        <Box
            pl={4} pr={3} py={2} mb={2}
            bg={colors.bg}
            borderLeftWidth="3px"
            borderLeftColor={colors.border}
            borderRadius="md"
        >
            <Text as="span" fontWeight="bold" fontSize="xs" color={colors.label}
                textTransform="uppercase" letterSpacing="wider" mr={2}>
                {keyword}:
            </Text>
            <RichText as="span" fontSize="sm" color="gray.700" lineHeight={1.7} text={text} />
        </Box>
    );
}

/** Plain paragraph block — nicely styled */
function PlainBlock({ text }) {
    return (
        <Box
            py={2} px={3} mb={2}
            bg="gray.50"
            borderRadius="md"
            borderLeftWidth="3px"
            borderLeftColor="gray.300"
        >
            <RichText fontSize="sm" color="gray.700" lineHeight={1.8} text={text} />
        </Box>
    );
}

/** Universal description renderer — works for all description types */
function FormattedDescription({ raw }) {
    const data = parseDescription(raw);
    if (!data) {
        return (
            <Text fontStyle="italic" color="gray.400" fontSize="sm">
                No description provided.
            </Text>
        );
    }

    const { preamble, scenarios } = data;

    return (
        <VStack align="stretch" gap={5}>
            {/* Preamble heading (e.g. "Acceptance Criteria (Kriteria Penerimaan)") */}
            {preamble && (
                <Box
                    px={3} py={2}
                    bg="gray.100"
                    borderRadius="md"
                    borderLeftWidth="3px"
                    borderLeftColor="gray.400"
                >
                    <Text fontSize="sm" fontWeight="semibold" color="gray.600">
                        {preamble}
                    </Text>
                </Box>
            )}

            {scenarios.map((sc, idx) => (
                <Box key={idx}>
                    {/* Scenario title (for BDD stories) */}
                    {sc.title && (
                        <Text fontSize="sm" fontWeight="bold" color="gray.800" mb={3}>
                            {scenarios.length > 1 ? `${idx + 1}. ` : ""}Skenario: {sc.title}
                        </Text>
                    )}

                    {/* Render each block */}
                    <VStack align="stretch" gap={0}>
                        {sc.blocks.map((block, bIdx) =>
                            block.type === "bdd"
                                ? <BDDStep key={bIdx} keyword={block.keyword} text={block.text} />
                                : <PlainBlock key={bIdx} text={block.text} />
                        )}
                    </VStack>
                </Box>
            ))}
        </VStack>
    );
}

const severityColor = (s) => {
    if (!s) return "gray";
    if (s === "Critical" || s === "High") return "red";
    if (s === "Medium") return "orange";
    return "green";
};

const caseTypeColor = (t) => {
    if (!t) return "gray";
    return t.toLowerCase().includes("positive") ? "teal" : "red";
};

export default function StoryShow({ story }) {
    const [isGenerating, setIsGenerating] = useState(false);

    const generateTestcases = () => {
        setIsGenerating(true);
        router.post(route("testcases.generate", story.id), {}, {
            preserveScroll: true,
            onFinish: () => setIsGenerating(false),
        });
    };

    const exportToXlsx = () => {
        if (!story.testcases || story.testcases.length === 0) return;
        const dataRows = story.testcases.map((tc) => ({
            "TestCase ID": tc.tc_id,
            "Title": tc.title,
            "Test Case Summary": tc.summary,
            "Severity": tc.severity,
            "Positive/Negative": tc.case_type,
            "Prerequisites": tc.prerequisites,
            "Test Procedure": tc.test_procedure,
            "Expected Result": tc.expected_result,
        }));
        const worksheet = XLSX.utils.json_to_sheet(dataRows);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Testcases");
        XLSX.writeFile(workbook, `Testcases_Story_${story.taiga_id}.xlsx`);
    };

    const hasTestcases = story.testcases && story.testcases.length > 0;

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Story Details
                </h2>
            }
        >
            <Head title={`Story - ${story.taiga_id}`} />

            <Box maxW="7xl" mx="auto" py={6} px={{ base: 4, sm: 6, lg: 8 }} overflow="hidden">

                {/* Back Button */}
                <Box mb={5}>
                    <Button as={Link} href={route("stories.index")} variant="ghost" size="sm" pl={0} color="gray.600" _hover={{ color: "gray.900" }}>
                        <MdArrowBack style={{ marginRight: 6 }} /> Back to Stories
                    </Button>
                </Box>

                {/* ── Hero Header Card ── */}
                <Card.Root
                    mb={6}
                    borderRadius="2xl"
                    overflow="hidden"
                    shadow="sm"
                    bg="gray.100"
                    border="1px solid"
                    borderColor="gray.200"
                >
                    <Card.Body p={{ base: 5, md: 8 }}>
                        <Flex
                            direction={{ base: "column", md: "row" }}
                            justify="space-between"
                            align={{ base: "flex-start", md: "center" }}
                            gap={4}
                        >
                            <Box>
                                <HStack mb={3} flexWrap="wrap" gap={2}>
                                    <Badge
                                        bg="gray.200"
                                        color="gray.600"
                                        px={3}
                                        py={1}
                                        borderRadius="full"
                                        fontSize="xs"
                                        fontWeight="semibold"
                                    >
                                        Taiga ID: {story.taiga_id}
                                    </Badge>
                                    {story.product && (
                                        <Badge
                                            bg="gray.200"
                                            color="gray.600"
                                            px={3}
                                            py={1}
                                            borderRadius="full"
                                            fontSize="xs"
                                            fontWeight="semibold"
                                        >
                                            {story.product.name}
                                        </Badge>
                                    )}
                                </HStack>
                                <Heading as="h1" size={{ base: "lg", md: "xl" }} color="gray.700" lineHeight="shorter">
                                    {story.subject}
                                </Heading>
                            </Box>

                            {!hasTestcases && (
                                <Button
                                    onClick={generateTestcases}
                                    disabled={isGenerating}
                                    bg="white"
                                    color="gray.700"
                                    border="1px solid"
                                    borderColor="gray.300"
                                    _hover={{ bg: "gray.100", borderColor: "gray.400" }}
                                    shadow="sm"
                                    size="md"
                                    flexShrink={0}
                                    fontWeight="semibold"
                                    minW="170px"
                                >
                                    <MdAutoAwesome style={{ marginRight: 6 }} />
                                    {isGenerating ? "Generating..." : "Generate Testcases"}
                                </Button>
                            )}
                        </Flex>
                    </Card.Body>
                </Card.Root>

                {/* ── Description Card (full width) ── */}
                <Card.Root bg="white" shadow="sm" borderRadius="xl" mb={6}>
                    <Card.Body p={{ base: 5, md: 7 }}>
                        <Heading as="h3" size="sm" color="gray.400" textTransform="uppercase" letterSpacing="widest" mb={4}>
                            Description
                        </Heading>
                        <Separator mb={4} />
                        {story.description
                            ? <FormattedDescription raw={story.description} />
                            : (
                                <Text fontStyle="italic" color="gray.400" fontSize="sm">
                                    No description provided.
                                </Text>
                            )
                        }
                    </Card.Body>
                </Card.Root>

                {/* ── Metadata + Additional Info (side by side) ── */}
                <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6} mb={6}>

                    {/* Metadata Card */}
                    <Card.Root bg="white" shadow="sm" borderRadius="xl">
                        <Card.Body p={{ base: 5, md: 6 }}>
                            <Heading as="h3" size="sm" color="gray.400" textTransform="uppercase" letterSpacing="widest" mb={4}>
                                Metadata
                            </Heading>
                            <Separator mb={4} />
                            <Grid templateColumns={{ base: "1fr", sm: "1fr 1fr" }} gap={4}>
                                <Flex align="center" gap={3}>
                                    <Box color="blue.400" flexShrink={0}>
                                        <MdPerson size={18} />
                                    </Box>
                                    <Box>
                                        <Text fontSize="xs" color="gray.400" fontWeight="medium" textTransform="uppercase" letterSpacing="wide">Creator</Text>
                                        <Text fontSize="sm" fontWeight="semibold" color="gray.700">{story.creator_name || "—"}</Text>
                                    </Box>
                                </Flex>

                                {story.assigned_to && (
                                    <Flex align="center" gap={3}>
                                        <Box color="teal.400" flexShrink={0}>
                                            <MdPerson size={18} />
                                        </Box>
                                        <Box>
                                            <Text fontSize="xs" color="gray.400" fontWeight="medium" textTransform="uppercase" letterSpacing="wide">Assigned To</Text>
                                            <Text fontSize="sm" fontWeight="semibold" color="gray.700">
                                                {story.assigned_to.full_name_display || "Unknown"}
                                            </Text>
                                        </Box>
                                    </Flex>
                                )}

                                <Flex align="center" gap={3}>
                                    <Box color="purple.400" flexShrink={0}>
                                        <MdCalendarToday size={16} />
                                    </Box>
                                    <Box>
                                        <Text fontSize="xs" color="gray.400" fontWeight="medium" textTransform="uppercase" letterSpacing="wide">Created (Taiga)</Text>
                                        <Text fontSize="sm" fontWeight="semibold" color="gray.700">
                                            {new Date(story.taiga_created_at).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" })}
                                        </Text>
                                    </Box>
                                </Flex>

                                <Flex align="center" gap={3}>
                                    <Box color="orange.400" flexShrink={0}>
                                        <MdImportExport size={18} />
                                    </Box>
                                    <Box>
                                        <Text fontSize="xs" color="gray.400" fontWeight="medium" textTransform="uppercase" letterSpacing="wide">Imported At</Text>
                                        <Text fontSize="sm" fontWeight="semibold" color="gray.700">
                                            {new Date(story.created_at).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" })}
                                        </Text>
                                    </Box>
                                </Flex>
                            </Grid>
                        </Card.Body>
                    </Card.Root>

                    {/* Additional Info Card */}
                    <Card.Root bg="white" shadow="sm" borderRadius="xl">
                        <Card.Body p={{ base: 5, md: 6 }}>
                            <Flex justify="space-between" align="center" mb={4}>
                                <Heading as="h3" size="sm" color="gray.400" textTransform="uppercase" letterSpacing="widest">
                                    Additional Info
                                </Heading>
                                <Badge colorPalette="purple" borderRadius="full" px={2}>
                                    {story.additionals?.length || 0}
                                </Badge>
                            </Flex>
                            <Separator mb={4} />

                            {story.additionals && story.additionals.length > 0 ? (
                                <VStack align="stretch" gap={3}>
                                    {story.additionals.map((item, index) => (
                                        <Box
                                            key={index}
                                            p={3}
                                            bg="gray.50"
                                            borderRadius="lg"
                                            borderLeftWidth="3px"
                                            borderLeftColor="purple.400"
                                        >
                                            <HStack justify="space-between" mb={1}>
                                                <Text fontWeight="semibold" fontSize="sm" color="gray.700">{item.label}</Text>
                                                <Badge variant="subtle" colorPalette="gray" size="sm">{item.key}</Badge>
                                            </HStack>
                                            <Text fontSize="sm" color="gray.600" mb={item.description ? 1 : 0}>{item.value}</Text>
                                            {item.description && (
                                                <Text fontSize="xs" color="gray.400">{item.description}</Text>
                                            )}
                                        </Box>
                                    ))}
                                </VStack>
                            ) : (
                                <Text fontSize="sm" color="gray.400" fontStyle="italic">
                                    No additional information found.
                                </Text>
                            )}
                        </Card.Body>
                    </Card.Root>

                </Grid>

                {/* ── Testcases Table Card ── */}
                {hasTestcases && (
                    <Card.Root bg="white" shadow="sm" borderRadius="xl" mt={6}>
                        <Card.Body p={{ base: 4, md: 7 }}>
                            <Flex
                                direction={{ base: "column", sm: "row" }}
                                justify="space-between"
                                align={{ base: "flex-start", sm: "center" }}
                                mb={5}
                                pb={4}
                                borderBottomWidth="1px"
                                borderColor="gray.100"
                                gap={{ base: 3, sm: 0 }}
                            >
                                <Box>
                                    <Heading as="h3" size="md" color="gray.700">
                                        Generated Testcases
                                    </Heading>
                                    <Text fontSize="sm" color="gray.400" mt={1}>
                                        {story.testcases.length} testcase{story.testcases.length !== 1 ? "s" : ""} generated by AI
                                    </Text>
                                </Box>
                                <Button
                                    onClick={exportToXlsx}
                                    colorPalette="green"
                                    size="sm"
                                    flexShrink={0}
                                >
                                    <MdDownload style={{ marginRight: 4 }} />
                                    Export (.xlsx)
                                </Button>
                            </Flex>

                            {/* Scrollable table container — scroll hanya di dalam card */}
                            <Box overflowX="auto">
                                <Table.Root variant="outline" size="sm">
                                    <Table.Header>
                                        <Table.Row bg="gray.50">
                                            <Table.ColumnHeader whiteSpace="nowrap" color="gray.600" fontWeight="semibold" fontSize="xs" textTransform="uppercase" letterSpacing="wide">TC ID</Table.ColumnHeader>
                                            <Table.ColumnHeader whiteSpace="nowrap" color="gray.600" fontWeight="semibold" fontSize="xs" textTransform="uppercase" letterSpacing="wide" minW="160px">Title</Table.ColumnHeader>
                                            <Table.ColumnHeader whiteSpace="nowrap" color="gray.600" fontWeight="semibold" fontSize="xs" textTransform="uppercase" letterSpacing="wide" minW="180px">Test Case Summary</Table.ColumnHeader>
                                            <Table.ColumnHeader whiteSpace="nowrap" color="gray.600" fontWeight="semibold" fontSize="xs" textTransform="uppercase" letterSpacing="wide">Severity</Table.ColumnHeader>
                                            <Table.ColumnHeader whiteSpace="nowrap" color="gray.600" fontWeight="semibold" fontSize="xs" textTransform="uppercase" letterSpacing="wide">Positive/Negative</Table.ColumnHeader>
                                            <Table.ColumnHeader whiteSpace="nowrap" color="gray.600" fontWeight="semibold" fontSize="xs" textTransform="uppercase" letterSpacing="wide" minW="200px">Prerequisites</Table.ColumnHeader>
                                            <Table.ColumnHeader whiteSpace="nowrap" color="gray.600" fontWeight="semibold" fontSize="xs" textTransform="uppercase" letterSpacing="wide" minW="220px">Test Procedure</Table.ColumnHeader>
                                            <Table.ColumnHeader whiteSpace="nowrap" color="gray.600" fontWeight="semibold" fontSize="xs" textTransform="uppercase" letterSpacing="wide" minW="200px">Expected Result</Table.ColumnHeader>
                                        </Table.Row>
                                    </Table.Header>
                                    <Table.Body>
                                        {story.testcases.map((tc, idx) => (
                                            <Table.Row
                                                key={tc.id || idx}
                                                _hover={{ bg: "blue.50" }}
                                                transition="background 0.15s"
                                            >
                                                <Table.Cell whiteSpace="nowrap">
                                                    <Badge colorPalette="blue" variant="subtle" fontFamily="mono" fontWeight="bold">
                                                        {tc.tc_id}
                                                    </Badge>
                                                </Table.Cell>
                                                <Table.Cell fontWeight="semibold" color="gray.800" whiteSpace="normal">
                                                    {tc.title}
                                                </Table.Cell>
                                                <Table.Cell color="gray.600" whiteSpace="normal" fontSize="sm">
                                                    {tc.summary}
                                                </Table.Cell>
                                                <Table.Cell whiteSpace="nowrap">
                                                    <Badge variant="subtle" colorPalette={severityColor(tc.severity)}>
                                                        {tc.severity}
                                                    </Badge>
                                                </Table.Cell>
                                                <Table.Cell whiteSpace="nowrap">
                                                    <Badge variant="subtle" colorPalette={caseTypeColor(tc.case_type)}>
                                                        {tc.case_type}
                                                    </Badge>
                                                </Table.Cell>
                                                <Table.Cell color="gray.600" fontSize="sm" whiteSpace="pre-wrap" verticalAlign="top">
                                                    {tc.prerequisites}
                                                </Table.Cell>
                                                <Table.Cell color="gray.600" fontSize="sm" whiteSpace="pre-wrap" verticalAlign="top">
                                                    {tc.test_procedure}
                                                </Table.Cell>
                                                <Table.Cell color="gray.600" fontSize="sm" whiteSpace="pre-wrap" verticalAlign="top">
                                                    {tc.expected_result}
                                                </Table.Cell>
                                            </Table.Row>
                                        ))}
                                    </Table.Body>
                                </Table.Root>
                            </Box>
                        </Card.Body>
                    </Card.Root>
                )}

            </Box>
        </AuthenticatedLayout>
    );
}
