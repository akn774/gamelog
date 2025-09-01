import React from "react";
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from "./ui/table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { GameRow } from "./GameRow";
import type { GameItem } from "../App";

type Props = {
    rows: GameItem[];
};

export function GameTable({ rows }: Props) {
    const parentRef = React.useRef<HTMLDivElement>(null);

    const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 48, // 行の高さの目安(px)
    overscan: 10, // 前後に余分にレンダリングする行数
    });

    return (
    <div
        ref={parentRef}
        className="h-[550px] overflow-auto border rounded"
    >
    <Table className="min-w-[600px]">
        <TableHeader className="bg-slate-200 font-semibold text-sm text-yellow-50 sticky top-0 z-10">
            <TableRow>
                <TableHead className="text-center w-[80px]">ハード名</TableHead>
                <TableHead className="text-center w-[50px]">クリア</TableHead>
                <TableHead className="text-center">ゲーム名</TableHead>
                <TableHead className="text-center w-[110px]">プレイ時間</TableHead>
                <TableHead className="text-center">アチーブメント</TableHead>
                <TableHead className="text-center">備考</TableHead>
                <TableHead className="text-center w-[50px]">配信</TableHead>
            </TableRow>
        </TableHeader>

        <TableBody style={{ position: "relative", height: `${rowVirtualizer.getTotalSize()}px` }}>
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const row = rows[virtualRow.index];
            return (
              <div
                key={row.id}
                ref={virtualRow.measureElement as React.Ref<HTMLDivElement>} // ←型キャスト
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                <GameRow game={row} />
              </div>
            );
          })}
        </TableBody>
      </Table>
    </div>
    );
}
