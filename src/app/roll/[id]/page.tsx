import RollPageClient from "@/components/RollPage";

export const dynamic = "force-dynamic";

export default async function RollRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <RollPageClient rollId={id} />;
}
