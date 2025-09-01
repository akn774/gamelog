import { FC } from "react";
import { TableRow, TableCell } from "./ui/table";
import { Badge } from "./ui/badge";
import { Check, Minus, ExternalLink } from "lucide-react";
import type { GameItem } from "../App";

type GameRowProps = {
  game: GameItem;
};

const GameRow: FC<GameRowProps> = ({ game }) => {
  return (
    <TableRow className="odd:bg-white even:bg-slate-50">
      <TableCell>
        <Badge variant="secondary" className="text-xs py-1 px-2 rounded-xl">
          {game.hardware}
        </Badge>
      </TableCell>
      <TableCell className="text-sm text-center">
        {game.completed ? (
          <Check className="w-4 h-4 mx-auto" color="#cc3150" />
        ) : (
          <Minus className="w-2 h-2 mx-auto" />
        )}
      </TableCell>
      <TableCell className="text-sm font-medium">{game.title}</TableCell>
      <TableCell className="text-sm text-center">
        {game.playtime.toLocaleString("ja-JP")}
      </TableCell>
      <TableCell className="text-sm text-muted-foreground">
        {game.achievement || ""}
      </TableCell>
      <TableCell className="text-sm text-muted-foreground">{game.notes || ""}</TableCell>
      <TableCell className="text-sm text-center">
        {game.archive_url?.length ? (
          <a target="_blank" rel="noreferrer" href={game.archive_url}>
            <ExternalLink className="w-4 h-4 mx-auto" />
          </a>
        ) : (
          <Minus className="w-2 h-2 mx-auto" />
        )}
      </TableCell>
    </TableRow>
  );
};

export default GameRow;
