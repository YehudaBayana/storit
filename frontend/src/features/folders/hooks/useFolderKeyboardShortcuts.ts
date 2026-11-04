import { useEffect } from "react";
import { LibraryItem } from "../api/folders";

interface UseFolderKeyboardShortcutsProps {
  items: LibraryItem[];
  selectedIDs: Set<string>;
  cutIDs: Set<string>;
  currentFolderID: string | null;
  setSelectedIDs: (value: Set<string>) => void;
  onCancelRename: () => void;
  setCutIDs: (value: Set<string>) => void;
  onMoveItem: (params: { item_id: string; item_type: "folder" | "video"; target_folder_id: string | null; version?: number }) => void;
}

export function useFolderKeyboardShortcuts({
  items,
  selectedIDs,
  cutIDs,
  currentFolderID,
  setSelectedIDs,
  onCancelRename,
  setCutIDs,
  onMoveItem,
}: UseFolderKeyboardShortcutsProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "a") {
        if (["INPUT", "TEXTAREA"].includes((e.target as HTMLElement).tagName)) return;
        e.preventDefault();
        setSelectedIDs(new Set(items.map((item) => item.id)));
      } else if (e.key === "Escape") {
        onCancelRename();
        setSelectedIDs(new Set());
        setCutIDs(new Set());
      } else if ((e.metaKey || e.ctrlKey) && e.key === "x") {
        if (selectedIDs.size > 0) {
          setCutIDs(new Set(selectedIDs));
        }
      } else if ((e.metaKey || e.ctrlKey) && e.key === "v") {
        if (cutIDs.size > 0) {
          cutIDs.forEach((id) => {
            const item = items.find((target) => target.id === id);
            if (item) {
              onMoveItem({
                item_id: item.id,
                item_type: item.type,
                target_folder_id: currentFolderID,
                version: item.version,
              });
            }
          });
          setCutIDs(new Set());
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [items, selectedIDs, cutIDs, currentFolderID, onMoveItem, setCutIDs, onCancelRename, setSelectedIDs]);
}
