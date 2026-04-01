export const initialNodes = [
  {
    id: "root",
    type: "custom",
    data: { label: "Chia động từ", type: "root" },
    position: { x: 400, y: 50 },
  },

  // V1
  {
    id: "v1",
    type: "ABC",
    data: {
      label: "V1",
      rows: [
        ["う", "います", "って", "った", "わない"],
        ["つ", "ちます", "", "", "たない"],
        ["る", "ります", "", "", "らない"],
        ["む", "みます", "んで", "んだ", "まない"],
        ["ぶ", "びます", "", "", "ばない"],
        ["ぬ", "にます", "", "", "なない"],
        ["く", "きます", "いて", "いた", "かない"],
        ["ぐ", "ぎます", "いで", "いだ", "がない"],
        ["す", "します", "して", "した", "さない"],
      ],
    },
    position: { x: 100, y: 200 },
  },

  // V2
  {
    id: "v2",
    type: "table",
    data: {
      label: "V2",
      rows: [["（え）る", "（え）ます", "（え）て", "（え）た", "（え）ない"]],
    },
    position: { x: 400, y: 200 },
  },

  // V3
  {
    id: "v3",
    type: "table",
    data: {
      label: "V3",
      rows: [
        ["する", "します", "して", "した", "しない"],
        ["くる", "きます", "きて", "きた", "こない"],
      ],
    },
    position: { x: 700, y: 200 },
  },
];

export const initialEdges = [
  { id: "e1", source: "root", target: "v1" },
  { id: "e2", source: "root", target: "v2" },
  { id: "e3", source: "root", target: "v3" },
];