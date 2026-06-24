import React, { useMemo } from 'react';
import { verbForm, typeForm } from "../../utils/convertNodeGrammar";

export default function GrammarStructure({ structure }) {
    if (!structure?.length) return null;
    // if(structure[0].label === "Từ nghi vấn") return null; 
    const { processedNodes, maxCol, totalRows } = useMemo(() => {
        const nodeMap = Object.fromEntries(structure.map(n => [n.id, n]));
        const maxCol = Math.max(...structure.map(n => n.position?.col ?? 0));

        // 1. Tạo bản đồ liên kết 2 chiều để tính toán vị trí không sót node nào
        const adj = {};
        structure.forEach(node => {
            if (!adj[node.id]) adj[node.id] = [];
            (node.links || []).forEach(toId => {
                if (!adj[toId]) adj[toId] = [];
                if (!adj[node.id].includes(toId)) adj[node.id].push(toId);
                if (!adj[toId].includes(node.id)) adj[toId].push(node.id);
            });
        });

        // Phân nhóm các node theo từng cột
        const colsData = Array.from({ length: maxCol + 1 }, () => []);
        structure.forEach(node => {
            const c = node.position?.col ?? 0;
            colsData[c].push(node);
        });
        // Sắp xếp các node trong cùng một cột theo row của JSON để giữ thứ tự từ trên xuống
        colsData.forEach(arr => arr.sort((a, b) => (a.position?.row ?? 0) - (b.position?.row ?? 0)));

        // 2. Lấy cột chứa các loại từ (Cột 1) làm cột cơ sở để dựng khung hàng chuẩn
        //colsData nào nhiều node nhất
        const baseCol = colsData.reduce(
            (maxIndex, arr, index) =>
                arr.length > colsData[maxIndex].length ? index : maxIndex,
            0
        );
        const subRowsPerNode = 1; // Mỗi từ chiếm 2 hàng trong Grid để dễ tính toán dãn cách

        // Sửa lỗi ở đây: Sử dụng optional chaining (?.) để tránh văng lỗi nếu cột 1 rỗng
        const baseNodes = colsData[baseCol] || [];
        const totalRows = Math.max(1, baseNodes.length * subRowsPerNode);


        const nodeIntervals = {};
        // Gán hàng cố định cho cột cơ sở (Cột 1)
        baseNodes.forEach((node, idx) => {
            const start = idx * subRowsPerNode + 1;
            const end = start + subRowsPerNode;
            nodeIntervals[node.id] = [start, end];
        });


        // Hàm helper lấy dải hàng bao phủ của các node liên kết
        const getCoverage = (nodeId, targetCol) => {
            const neighbors = adj[nodeId] || [];
            // Lọc các node lân cận thuộc cột đích cần quét
            const filtered = neighbors.filter(id => nodeMap[id]?.position?.col === targetCol);
            if (filtered.length === 0) return null;

            let minStart = Infinity;
            let maxEnd = -Infinity;
            filtered.forEach(id => {
                if (nodeIntervals[id]) {
                    const [s, e] = nodeIntervals[id];
                    if (s < minStart) minStart = s;
                    if (e > maxEnd) maxEnd = e;
                }
            });
            return minStart === Infinity ? null : [minStart, maxEnd];
        };

        // Loang sang trái từ cột 1 -> cột 0
        for (let c = baseCol - 1; c >= 0; c--) {
            colsData[c].forEach(node => {
                const cov = getCoverage(node.id, c + 1);
                if (cov) {
                    nodeIntervals[node.id] = cov;
                } else {
                    const idx = colsData[c].indexOf(node);
                    nodeIntervals[node.id] = [idx * subRowsPerNode + 1, (idx + 1) * subRowsPerNode + 1];
                }
            });
        }

        // Loang sang phải từ cột 1 -> cột 2 -> cột 3...
        for (let c = baseCol + 1; c <= maxCol; c++) {
            colsData[c].forEach(node => {
                const cov = getCoverage(node.id, c - 1);
                if (cov) {
                    nodeIntervals[node.id] = cov;
                } else {
                    const idx = colsData[c].indexOf(node);
                    nodeIntervals[node.id] = [idx * subRowsPerNode + 1, (idx + 1) * subRowsPerNode + 1];
                }
            });
        }

        // 3. Xác định điều kiện hiển thị dấu ngoặc dựa trên kích thước dải hàng bao phủ
        const processedNodes = structure.map(node => {
            const col = node.position?.col ?? 0;
            const [gridRowStart, gridRowEnd] = nodeIntervals[node.id] || [1, totalRows + 1];

            // Kiểm tra cột bên phải liền kề xem có cụm hội tụ (nhiều node) kết nối với node này không
            const rightNeighbors = (adj[node.id] || []).filter(id => nodeMap[id]?.position?.col === col + 1);
            const hasRightBrace = rightNeighbors.length >= 2;

            // Kiểm tra cột bên trái liền kề xem có cụm hội tụ kết nối với node này không
            const leftNeighbors = (adj[node.id] || []).filter(id => nodeMap[id]?.position?.col === col - 1);
            // Một node hiển thị ngoặc trái khi nó là node gom nhóm ở cột trước (ví dụ: node 1)
            // Hoặc bản thân nó thuộc nhóm con trỏ về 1 node duy nhất ở bên trái mà node đó bao phủ nhiều hàng
            let hasLeftBrace = leftNeighbors.length >= 2;


            if (!hasLeftBrace && leftNeighbors.length === 1) {
                const leftNodeId = leftNeighbors[0];
                const leftNodeRightNeighbors = (adj[leftNodeId] || []).filter(id => nodeMap[id]?.position?.col === col);
                // Nếu node cha bên trái kết nối với nhiều node ở cột hiện tại, và node hiện tại là phần tử đầu tiên trong nhóm đó
                if (leftNodeRightNeighbors.length >= 2) {
                    const sortedGroup = leftNodeRightNeighbors.sort((a, b) => nodeIntervals[a][0] - nodeIntervals[b][0]);
                    if (sortedGroup[0] === node.id) {
                        hasLeftBrace = false; // Node này không cần ngoặc trái vì nó là node gom nhóm ở cột trước
                        // Gán dải hàng cho khung chứa ngoặc trái bằng đúng dải hàng bao phủ của toàn bộ nhóm
                        node.leftBraceRows = [nodeIntervals[sortedGroup[0]][0], nodeIntervals[sortedGroup[sortedGroup.length - 1]][1]];
                    }
                }
            }

            return {
                ...node,
                gridRowStart,
                gridRowEnd,
                gridColStart: col * 2 + 1,
                hasRightBrace,
                hasLeftBrace,
                leftBraceRows: node.leftBraceRows || [gridRowStart, gridRowEnd]
            };
        });

        return { processedNodes, maxCol, totalRows };
    }, [structure]);

    // Hàm render text và modifier loại bỏ ký tự (Ví dụ: だ)
    const renderNodeContent = (node) => {
        const baseText = verbForm(node.verbForm) || node.hiragana || node.kanji || node.label || typeForm(node.type);
        const removeModifier = node.modifiers?.find(m => m.action === 'remove');

        if (removeModifier) {
            return (
                <div className="flex items-center gap-1 font-sans text-left whitespace-nowrap">
                    <span className="text-gray-950 font-medium">
                        {baseText}
                    </span>

                    <span className="text-xs text-gray-400 font-normal tracking-wide">
                        (
                        <span className="line-through decoration-red-500 decoration-2 text-gray-400 font-semibold">
                            ~{removeModifier.from}
                        </span>
                        )
                    </span>
                </div>
            );
        }

        return <span className="text-gray-950 font-medium font-sans text-left whitespace-nowrap">{baseText}</span>;
    };

    return (
        <div className="w-full p-4 bg-white select-none">
            <div className="font-semibold mb-3 text-base flex items-center gap-2 text-slate-700 pb-2">
                <span className="text-blue-500">◆</span> Cấu trúc ngữ pháp
            </div>

            <div className="w-full overflow-x-auto bg-white border rounded-lg mb-6 p-4">
                <div
                    className="grid items-stretch w-max max-w-full"
                    style={{
                        gridTemplateColumns: `repeat(${maxCol}, max-content 24px) max-content`,
                        gridTemplateRows: `repeat(${totalRows}, minmax(36px, auto))`,
                        columnGap: '4px'
                    }}
                >
                    {processedNodes.map(node => {
                        return (
                            <React.Fragment key={node.id}>
                                {/* 1. KHỐI HIỂN THỊ NỘI DUNG TEXT */}
                                <div
                                    style={{
                                        gridColumnStart: node.gridColStart,
                                        gridRowStart: node.gridRowStart,
                                        gridRowEnd: node.gridRowEnd,
                                    }}
                                    className="flex items-center justify-start px-2 py-2 text-left text-[16px]"
                                >
                                    {renderNodeContent(node)}
                                </div>

                                {/* 2. DẤU NGOẶC ĐÓNG */}
                                {node.hasLeftBrace && (
                                    <div
                                        style={{
                                            gridColumnStart: node.gridColStart - 1,
                                            gridRowStart: node.leftBraceRows[0],
                                            gridRowEnd: node.leftBraceRows[1],
                                        }}
                                        className="flex items-center justify-center relative my-1"
                                    >
                                        <svg className="w-3.5 h-[96%] text-gray-700" viewBox="0 0 20 100" preserveAspectRatio="none">
                                            <path d="M0,2 C8,2 8,46 18,50 C8,54 8,98 0,98" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                                        </svg>
                                    </div>
                                )}

                                {/* 3. DẤU NGOẶC MỞ */}
                                {node.hasRightBrace && (
                                    <div
                                        style={{
                                            gridColumnStart: node.gridColStart + 1,
                                            gridRowStart: node.gridRowStart,
                                            gridRowEnd: node.gridRowEnd,
                                        }}
                                        className="flex items-center justify-center relative my-1"
                                    >
                                        <svg className="w-3.5 h-[96%] text-gray-700" viewBox="0 0 20 100" preserveAspectRatio="none">
                                            <path d="M20,2 C12,2 12,46 2,50 C12,54 12,98 20,98" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                                        </svg>
                                    </div>
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}