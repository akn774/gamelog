import { useMemo, useState } from "react";
import { Card, CardContent } from "./components/ui/card";
import { Input } from "./components/ui/input";
import { Badge } from "./components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "./components/ui/tabs";
import { motion } from "framer-motion";
// import { Button } from "./components/ui/button";
// import { Textarea } from "./components/ui/textarea";
// import { Checkbox } from "./components/ui/checkbox";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./components/ui/dialog";
// import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./components/ui/sheet";
// import { ScrollArea } from "./componentnpm run builds/ui/scroll-area";
import { Search, Gamepad2, ArrowDownWideNarrow, ExternalLink, Check, Minus} from "lucide-react";
// import { Filter as FilterIcon, Search, Gamepad2, ArrowDownWideNarrow, ExternalLink } from "lucide-react";
import gamesData from "./data/games.json";


// --- 型定義 ---
export type GameItem = {
  hardware: string;       // ハード名
  title: string;          // ゲーム名
  keyword: string;        // 検索用キーワード
  completed: boolean;     // クリアしたかどうか
  achievement?: string;   // （任意）誇れる要素
  playtime: number;       // プレイ時間
  archive_url?: string;   // （任意）配信アーカイブのURL
  notes?: string;         // （任意）一言メモ
  release_date: number;   // リリース日
};

// --- サンプルデータ（初期表示用） ---
const seedData: GameItem[] = (gamesData as any[]).map(game => ({
  ...game,
  release_date: new Date(game.release_date).getTime()
}));

// --- ユーティリティ ---
const uniq = (arr: string[]) => Array.from(new Set(arr.filter(Boolean)));

// カタカナをひらがなに変換する関数
function toHiragana(input: string): string {
  return input
    .normalize("NFKC") // 全角/半角を統一
    .replace(/[\u30a1-\u30f6]/g, (match) =>
      String.fromCharCode(match.charCodeAt(0) - 0x60)
    );
}



// --- メインコンポーネント ---
export default function GameLog() {
  const [rows] = useState<GameItem[]>(seedData);
  const [query, setQuery] = useState("");
  const [hardwareFilter, setHardwareFilter] = useState<string>("all");
  const [completedFilter, setCompletedFilter] = useState<string>("all");
  const [sortKey, setSortKey] = useState<string>("releaseDate_asc");
  const hardwareOrder = [
    "SFC", "GB", "GBA", "GC", "DS", "3DS", "Switch",
    "PS", "PS2", "PS3", "PS4", "PS5", "PSP",
    "PC", "Steam", "Mobile"
  ];
  const hardwareList = useMemo(() => {
    const uniqList = uniq(rows.map(r => r.hardware));
    return uniqList.sort((a, b) => {
      const indexA = hardwareOrder.indexOf(a);
      const indexB = hardwareOrder.indexOf(b);
      if (indexA === -1 && indexB === -1) return a.localeCompare(b); // 両方不明な場合はアルファベット順
      if (indexA === -1) return 1; // a が不明なら後ろ
      if (indexB === -1) return -1; // b が不明なら後ろ
      return indexA - indexB; // 並び順に従う
    });
  }, [rows]);

  const filtered = useMemo(() => {
    const q = toHiragana(query.trim().toLowerCase());
    let out = [...rows].filter((r) => {
      const okHardware = hardwareFilter === "all" || r.hardware === hardwareFilter;
      const okCompleted =
        completedFilter === "all" || (completedFilter === "done" ? r.completed : !r.completed);
      const keywordHira = toHiragana(r.keyword.toLowerCase());
      const okQuery = !q ||
        keywordHira.includes(q);
        // (r.achievement ?? "").toLowerCase().includes(q) ||
        // (r.notes ?? "").toLowerCase().includes(q) ||
      // r.hardware.toLowerCase().includes(q);
      return okHardware && okCompleted && okQuery;
    });

    switch (sortKey) {
      case "releaseDate_desc":
        out.sort((a, b) => b.release_date - a.release_date); break;
      case "releaseDate_asc":
        out.sort((a, b) => a.release_date - b.release_date); break;
      case "title_asc":
        out.sort((a, b) => a.title.localeCompare(b.title)); break;
      case "title_desc":
        out.sort((a, b) => b.title.localeCompare(a.title)); break;
      case "playtime_desc":
        out.sort((a, b) => b.playtime - a.playtime); break;
      case "playtime_asc":
        out.sort((a, b) => a.playtime - b.playtime); break;
    }
    return out;
  }, [rows, query, hardwareFilter, completedFilter, sortKey]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white p-4 md:p-8">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2 }} className="max-w-6xl mx-auto space-y-4">
        <header className="flex flex-col md:flex-row md:items-end gap-3 md:gap-4">
          <div className="flex-1 space-y-1">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2">
              <Gamepad2 className="w-7 h-7" />
            </h1>
            <p className="text-sm text-muted-foreground">今まで遊んできたゲーム</p>
          </div>
        </header>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 md:p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-2 top-1/2 -translate-y-1/2" />
                  <Input className="pl-8" placeholder="検索（ゲームソフト名）" value={query} onChange={(e) => setQuery(e.target.value)} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              {/* ハードでのフィルター */}
              <div className="flex items-center gap-2">
                <Select value={hardwareFilter} onValueChange={setHardwareFilter}>
                  <SelectTrigger className="w-full"><SelectValue placeholder="ハード" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全てのハード</SelectItem>
                    {hardwareList.map((h) => (
                      <SelectItem key={h} value={h}>{h}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* クリア有無でのフィルター */}
              <div className="flex items-center gap-2">
                <Tabs value={completedFilter} onValueChange={setCompletedFilter} className="w-full">
                  <TabsList className="grid grid-cols-3 w-full">
                    <TabsTrigger value="all">全て</TabsTrigger>
                    <TabsTrigger value="done">クリア済</TabsTrigger>
                    <TabsTrigger value="todo">未クリア</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              {/* 並び替え */}
              <div className="flex items-center gap-3 md:col-start-4 justify-end">
                {/* <span className="text-sm text-muted-foreground">並び替え:</span> */}
                <ArrowDownWideNarrow  className="w-4 h-4 hidden md:block" />
                <Select value={sortKey} onValueChange={setSortKey}>
                  <SelectTrigger className="w-full md:w-[220px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="releaseDate_desc">発売日(新)</SelectItem>
                    <SelectItem value="releaseDate_asc">発売日(旧)</SelectItem>
                    <SelectItem value="playtime_desc">プレイ時間(多)</SelectItem>
                    <SelectItem value="playtime_asc">プレイ時間(少)</SelectItem>
                    <SelectItem value="title_asc">タイトル A→Z</SelectItem>
                    <SelectItem value="title_desc">タイトル Z→A</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* 合計プレイ時間と検索件数を表示する */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="flex gap-3 md:col-start-4 justify-end">
                {/* 合計プレイ時間 */}
                <span className="text-sm text-muted-foreground">
                  {filtered.reduce((sum, r) => sum + r.playtime, 0).toLocaleString('ja-JP')} 時間
                </span>
                {/* 検索件数 */}
                <span className="text-sm text-muted-foreground">
                  {filtered.length} 件
                </span>
              </div>
            </div>

            <div className="rounded-2xl border overflow-hidden overflow-x-auto">
              <Table className="min-w-[600px]">
                <TableHeader className="bg-slate-200 font-semibold text-sm text-yellow-50">
                  <TableRow>
                    <TableHead className="text-center w-[80px]">ハード名</TableHead>
                    <TableHead className="text-center w-[50px]">クリア</TableHead>
                    <TableHead className="text-center">ゲーム名</TableHead>
                    <TableHead className="text-center w-[110px]">プレイ時間</TableHead>
                    <TableHead className="text-center">アチーブメント</TableHead>
                    <TableHead className="text-center">備考</TableHead>
                    <TableHead className="text-center w-[50px]">配信</TableHead>
                    {/* <TableHead className="w-[110px]"></TableHead> */}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((r, i) => (
                    <TableRow key={i} className="odd:bg-white even:bg-slate-50">
                      <TableCell>
                        <Badge variant="secondary" className="text-xs py-1 px-2 rounded-xl">{r.hardware}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-center">{r.completed ? <Check className="w-4 h-4 mx-auto" color="#cc3150" /> : <Minus className="w-2 h-2 mx-auto"/>}</TableCell>
                      <TableCell className="text-sm font-medium">{r.title}</TableCell>
                      <TableCell className="text-sm text-center">{r.playtime.toLocaleString('ja-JP')}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{r.achievement || ""}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{r.notes || ""}</TableCell>
                      <TableCell className="text-sm text-center">
                        {r.archive_url?.length !== 0 ? (
                          <a target="_blank" href={"" + r.archive_url}><ExternalLink className="w-4 h-4 mx-auto"/></a>
                        ):<Minus className="w-2 h-2 mx-auto"/>}
                      </TableCell>
                    </TableRow>
                  ))}
                  {filtered.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center text-sm text-muted-foreground py-8">該当するデータがありません</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <footer className="text-xs text-muted-foreground text-right"></footer>
      </motion.div>
    </div>
  );
}
