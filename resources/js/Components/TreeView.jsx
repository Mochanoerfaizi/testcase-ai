"use client"

import React from "react"
import { TreeView, createTreeCollection } from "@chakra-ui/react"
import { LuChevronRight, LuFile, LuFolder } from "react-icons/lu"

/**
 * Reusable TreeView component
 * @param {Object[]} data - hierarchical tree data
 * @param {string} data[].id - unique identifier for node
 * @param {string} data[].name - label of the node
 * @param {Object[]} [data[].children] - nested child nodes
 * @param {string} [label="Tree View"] - optional title
 * @param {boolean} [expandOnClick=false] - enable expand/collapse on label click
 * @param {string} [maxW="sm"] - Chakra width token or custom CSS width
 */
const TreeViewComponent = (props) => {

    const {
        data = [],
        label = "Tree View",
        expandOnClick = false,
        maxW = "sm",
    } = props

    // Membuat koleksi tree secara dinamis
    const collection = React.useMemo(
        () =>
            createTreeCollection({
                nodeToValue: (node) => node.id,
                nodeToString: (node) => node.name,
                rootNode: {
                    id: "ROOT",
                    name: "",
                    children: data,
                },
            }),
        [data]
    )

    return (
        <TreeView.Root collection={collection} maxW={maxW} expandOnClick={expandOnClick}>
            <TreeView.Tree>
                <TreeView.Node
                    indentGuide={<TreeView.BranchIndentGuide />}
                    render={({ node, nodeState }) =>
                        nodeState.isBranch ? (
                            <TreeView.BranchControl>
                                <TreeView.BranchTrigger>
                                    <TreeView.BranchIndicator asChild>
                                        <LuChevronRight />
                                    </TreeView.BranchIndicator>
                                </TreeView.BranchTrigger>
                                <LuFolder />
                                <TreeView.BranchText>{node.name}</TreeView.BranchText>
                            </TreeView.BranchControl>
                        ) : (
                            <TreeView.Item>
                                <LuFile />
                                <TreeView.ItemText>{node.name}</TreeView.ItemText>
                            </TreeView.Item>
                        )
                    }
                />
            </TreeView.Tree>
        </TreeView.Root>
    )
}

export default TreeViewComponent
