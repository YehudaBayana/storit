import { listVideos } from "@/features/videos/api/videos";
import { cookies } from "next/headers";

export const getInitialVideos = async () => {
  // Grab cookies from the incoming Next.js request
  const cookieStore = await cookies();
  const cookieString = cookieStore.toString();

  // You would need to update listVideos to accept headers and pass this cookie string
  const initialVideos = await listVideos(50, 0, { headers: { Cookie: cookieString } });
  return initialVideos;
};
