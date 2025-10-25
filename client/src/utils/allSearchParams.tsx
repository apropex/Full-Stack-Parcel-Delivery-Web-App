import { useSearchParams } from "react-router";

export default function AllSearchParams() {
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search") || undefined;
  const trackingId = searchParams.get("trackingId") || undefined;
  const status = searchParams.get("status") || undefined;
  const type = searchParams.get("type") || undefined;
  const page = searchParams.get("page") || undefined;
  const limit = searchParams.get("limit") || undefined;
  const sort = searchParams.get("sort") || undefined;

  return { search, trackingId, status, type, page, limit, sort };
}
