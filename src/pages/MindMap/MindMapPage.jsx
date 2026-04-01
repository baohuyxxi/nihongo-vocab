import React, { useCallback } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider,
  useReactFlow,
} from "reactflow";
import "reactflow/dist/style.css";

import useMindmap from "./useMindmap";
import CustomNode from "./CustomNode";
import TableNode from "./TableNode";

const nodeTypes = {
  custom: CustomNode,
  table: TableNode,
};

function FlowContent() {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    addTableNode,
  } = useMindmap();

  const { zoomIn, zoomOut } = useReactFlow();

  const handleWheel = useCallback((e) => {
    if (e.ctrlKey) {
      e.preventDefault();
      e.deltaY < 0 ? zoomIn() : zoomOut();
    }
  }, []);

  return (
    <div
      style={{ width: "100%", height: "100vh" }}
      onWheel={handleWheel}
    >
      <div style={{ position: "absolute", top: 10, left: 10, zIndex: 10 }}>
        <button onClick={addNode}>+ Node</button>
        <button onClick={addTableNode}>+ Table</button>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        zoomOnScroll={false}
        panOnScroll
        panOnScrollMode="vertical"
        fitView
      >
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
}

export default function MindMapPage() {
  return (
    <ReactFlowProvider>
      <FlowContent />
    </ReactFlowProvider>
  );
}