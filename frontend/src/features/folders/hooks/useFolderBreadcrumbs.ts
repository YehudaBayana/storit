import { useMemo } from "react";
import { Folder } from "../api/folders";
import { BreadcrumbItem } from "../components/FolderBreadcrumbsHeader";

export function useFolderBreadcrumbs(
  currentFolderID: string | null,
  folders: Folder[] | undefined,
): BreadcrumbItem[] {
  return useMemo(() => {
    const rootBreadcrumb: BreadcrumbItem = { id: null, name: "My Library" };
    if (!currentFolderID || !folders) {
      return [rootBreadcrumb];
    }

    const folderMap = new Map<string, Folder>();
    folders.forEach((f) => folderMap.set(f.id, f));

    const path: BreadcrumbItem[] = [];
    let curr: Folder | undefined = folderMap.get(currentFolderID);

    // Prevent infinite loops in case of corrupt cyclic data
    const visited = new Set<string>();
    while (curr && !visited.has(curr.id)) {
      visited.add(curr.id);
      path.unshift({ id: curr.id, name: curr.name });
      if (curr.parent_id) {
        curr = folderMap.get(curr.parent_id);
      } else {
        break;
      }
    }

    return [rootBreadcrumb, ...path];
  }, [currentFolderID, folders]);
}
