import { redirect } from "next/navigation";
import { FolderView } from "@/features/folders/components/FolderView";

interface FoldersPageProps {
  searchParams?: Promise<{ id?: string }>;
}

export default async function FoldersPage({ searchParams }: FoldersPageProps) {
  const resolvedSearchParams = await searchParams;
  if (resolvedSearchParams?.id) {
    redirect(`/folders/${resolvedSearchParams.id}`);
  }
  return <FolderView />;
}
