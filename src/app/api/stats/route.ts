import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
      return Response.json({ users: 0, error: "Missing env vars", hasUrl: !!url, hasKey: !!key });
    }

    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("filmlog_rolls")
      .select("user_id")
      .limit(10000);

    if (error) {
      return Response.json({ users: 0, dbError: error.message });
    }

    const uniqueUsers = new Set(data?.map((r: { user_id: string }) => r.user_id));
    return Response.json({ users: uniqueUsers.size });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return Response.json({ users: 0, error: msg });
  }
}
