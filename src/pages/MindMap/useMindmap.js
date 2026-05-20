import { useCallback, useState } from "react"
import { useNodesState, useEdgesState, addEdge } from "reactflow"

export default function useMindmap() {
  const [nodes, setNodes, onNodesChange] = useNodesState([
    {
      id: "1",
      type: "concept",
      data: { label: "Từ vựng N5", sub: "Root" },
      position: { x: 300, y: 200 },
    },
  ])

  const [edges, setEdges, onEdgesChange] = useEdgesState([])

  const onConnect = useCallback((params) => {
    setEdges((eds) => addEdge({ ...params, animated: true }, eds))
  }, [])

  const addConcept = useCallback(() => {
    const id = `concept-${Date.now()}`

    setNodes((nds) => [
      ...nds,
      {
        id,
        type: "concept",
        data: {
          label: "Concept mới",
          sub: "N5/N4",
        },
        position: {
          x: 200 + Math.random() * 400,
          y: 150 + Math.random() * 300,
        },
      },
    ])
  }, [])

  const addGrammar = useCallback(() => {
    const id = `grammar-${Date.now()}`

    setNodes((nds) => [
      ...nds,
      {
        id,
        type: "grammar",
        data: {
          label: "～ている",
          meaning: "diễn tả đang xảy ra",
        },
        position: {
          x: 200 + Math.random() * 400,
          y: 150 + Math.random() * 300,
        },
      },
    ])
  }, [])

  const addExample = useCallback(() => {
    const id = `example-${Date.now()}`

    setNodes((nds) => [
      ...nds,
      {
        id,
        type: "example",
        data: {
          text: "食べています",
        },
        position: {
          x: 200 + Math.random() * 400,
          y: 150 + Math.random() * 300,
        },
      },
    ])
  }, [])

  return {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addConcept,
    addGrammar,
    addExample,
  }
}