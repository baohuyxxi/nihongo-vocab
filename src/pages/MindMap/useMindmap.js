import { useCallback } from "react";
import {
  useNodesState,
  useEdgesState,
  addEdge,
} from "reactflow";

import {
  initialNodes,
  initialEdges,
} from "../../mock/mindmapData";

export default function useMindmap() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback((params) => {
    setEdges((eds) =>
      addEdge({ ...params, animated: true }, eds)
    );
  }, []);

  const addNode = useCallback(() => {
    const id = `node-${Date.now()}`;

    setNodes((nds) => [
      ...nds,
      {
        id,
        type: "custom",
        data: { label: "Node mới", type: "note" },
        position: {
          x: Math.random() * 600,
          y: Math.random() * 400,
        },
      },
    ]);
  }, []);

  const addTableNode = useCallback(() => {
    const id = `table-${Date.now()}`;

    const tableData = {
      type: "v1",
      rows: [
        { dict: "う", mas: "います", te: "って", ta: "った", nai: "わない", span: 3, color: "#fff3cd" },
        { dict: "つ", mas: "ちます", nai: "たない" },
        { dict: "る", mas: "ります", nai: "らない" },

        { dict: "む", mas: "みます", te: "んで", ta: "んだ", nai: "まない", span: 3, color: "#d1ecf1" },
        { dict: "ぶ", mas: "びます", nai: "ばない" },
        { dict: "ぬ", mas: "にます", nai: "なない" },

        { dict: "く", mas: "きます", te: "いて", ta: "いた", nai: "かない", span: 1, color: "#d4edda" },
        { dict: "ぐ", mas: "ぎます", te: "いで", ta: "いだ", nai: "がない", span: 1, color: "#d4edda" },
        { dict: "す", mas: "します", te: "して", ta: "した", nai: "さない", span: 1, color: "#f8d7da" },
      ],
      note: "いきます → いって",
    };

    setNodes((nds) => [
      ...nds,
      {
        id,
        type: "table",
        data: tableData,
        position: {
          x: Math.random() * 600,
          y: Math.random() * 400,
        },
      },
    ]);
  }, []);

  const deleteNode = useCallback((nodeId) => {
    setNodes((nds) => nds.filter((n) => n.id !== nodeId));
    setEdges((eds) =>
      eds.filter(
        (e) => e.source !== nodeId && e.target !== nodeId
      )
    );
  }, []);

  return {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    addTableNode,
    deleteNode,
  };
}