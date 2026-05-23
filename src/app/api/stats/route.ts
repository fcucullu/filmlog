import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("filmlog_rolls")
    .select("user_id")
    .limit(10000);

  if (error) {
    return Response.json({ users: 0 }, { status: 500 });
  }

  const uniqueUsers = new Set(data?.map((r: { user_id: string }) => r.user_id));

  return Response.json({ users: uniqueUsers.size });
}
