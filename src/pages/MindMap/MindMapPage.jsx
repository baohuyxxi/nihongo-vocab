import React from "react"
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider,
  useReactFlow,
} from "reactflow"
import "reactflow/dist/style.css"

import useMindmap from "./useMindmap"

import ConceptNode from "./ConceptNode"
import GrammarNode from "./GrammarNode"
import ExampleNode from "./ExampleNode"

const nodeTypes = {
  concept: ConceptNode,
  grammar: GrammarNode,
  example: ExampleNode,
}

function FlowContent() {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addConcept,
    addGrammar,
    addExample,
  } = useMindmap()

  const { zoomIn, zoomOut } = useReactFlow()

  return (
    <div className="w-full h-screen bg-gray-50">

      {/* TOP TOOLBAR */}
      <div className="absolute top-3 left-3 z-10 flex gap-2">
        <button onClick={addConcept} className="px-3 py-1 bg-blue-500 text-white rounded-lg">
          + Concept
        </button>

        <button onClick={addGrammar} className="px-3 py-1 bg-green-500 text-white rounded-lg">
          + Grammar
        </button>

        <button onClick={addExample} className="px-3 py-1 bg-orange-500 text-white rounded-lg">
          + Example
        </button>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        panOnScroll
        zoomOnScroll={false}
      >
        <MiniMap
          nodeColor={(node) => {
            if (node.type === "concept") return "#3b82f6"
            if (node.type === "grammar") return "#10b981"
            if (node.type === "example") return "#f97316"
            return "#999"
          }}
        />
        <Controls />
        <Background gap={16} />
      </ReactFlow>
    </div>
  )
}

export default function MindMapPage() {
  return (
    <ReactFlowProvider>
      <FlowContent />
    </ReactFlowProvider>
  )
}