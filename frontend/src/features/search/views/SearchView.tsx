"use client";

import { KeyboardEvent, useState } from "react";
import { useSearchBy } from "../store/useSearch";
import Input from "@/components/ui/input/Input";
import TrackItem from "@/features/player/components/TrackItem";
import { Box, Stack } from "@/components/ui";

interface SearchViewProps {
  dataHook?: string;
}

export default function SearchView({ dataHook = "search-view" }: SearchViewProps) {
  const [draftTerm, setDraftTerm] = useState("");
  const [submittedTerm, setSubmittedTerm] = useState("");

  const { data } = useSearchBy(submittedTerm);

  const handleInputChange = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key == "Enter" && draftTerm) {
      setSubmittedTerm(draftTerm);
    }
  };

  return (
    <Box p={10} dataHook={dataHook}>
      <Stack gap={4}>
        <Input
          dataHook={dataHook}
          value={draftTerm}
          onChange={(e) => setDraftTerm(e.target.value)}
          onKeyDown={handleInputChange}
        />
        {data?.results.map((track) => {
          return <TrackItem track={track} key={track.id} showCover />;
        })}
      </Stack>
    </Box>
  );
}
