"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import NewShotModal from "@/components/NewShotModal";

interface Roll {
  id: string;
  name: string;
  film_stock: string;
  asa: number;
  total_frames: number;
  camera: string | null;
  notes: string | null;
  status: "active" | "developed" | "archived";
}

interface Shot {
  id: string;
  frame_number: number;
  aperture: string | null;
  shutter_speed: string | null;
  lens: string | null;
  light_condition: string | null;
  filter: string | null;
  description: string | null;
  created_at: string;
}

const LIGHT_EMOJIS: Record<string, string> = {
  "bright-sun": "☀️",
  "light-clouds": "🌤️",
  overcast: "☁️",
  shade: "🌳",
  "golden-hour": "🌅",
  indoor: "🏠",
  night: "🌙",
};

export default function RollPage({ rollId }: { rollId: string }) {
  const router = useRouter();
  const [roll, setRoll] = useState<Roll | null>(null);
  const [shots, setShots] = useState<Shot[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewShot, setShowNewShot] = useState(false);
  const [editShot, setEditShot] = useState<{
    id: string;
    frame_number: number;
    aperture: string;
    shutter_speed: string;
    lens: string;
    light_condition: string;
    filter: string;
    description: string;
  } | null>(null);
  const [expandedShot, setExpandedShot] = useState<string | null>(null);

  const supabase = createClient();

  const fetchRoll = useCallback(async () => {
    const { data } = await supabase
      .from("filmlog_rolls")
      .select("*")
      .eq("id", rollId)
      .single();
    if (data) setRoll(data as Roll);
  }, [supabase, rollId]);

  const fetchShots = useCallback(async () => {
    const { data } = await supabase
      .from("filmlog_shots")
      .select("*")
      .eq("roll_id", rollId)
      .order("frame_number", { ascending: true });
    if (data) setShots(data as Shot[]);
  }, [supabase, rollId]);

  useEffect(() => {
    const init = async () => {
      await Promise.all([fetchRoll(), fetchShots()]);
      setLoading(false);
    };
    init();
  }, []);

  const updateStatus = async (status: string) => {
    await supabase.from("filmlog_rolls").update({ status }).eq("id", rollId);
    fetchRoll();
  };

  const deleteShot = async (shotId: string) => {
    await supabase.from("filmlog_shots").delete().eq("id", shotId);
    fetchShots();
  };

  const nextFrame =
    shots.length > 0
      ? Math.max(...shots.map((s) => s.frame_number)) + 1
      : 1;

  const statusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "developed":
        return "bg-[#E5A100]/20 text-[#F5C542] border-[#E5A100]/30";
      case "archived":
        return "bg-[#8B8B8B]/20 text-[#8B8B8B] border-[#8B8B8B]/30";
      default:
        return "bg-[#2a2a2a] text-[#8B8B8B]";
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#E5A100] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!roll) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <p className="text-[#8B8B8B] mb-4">Roll not found</p>
        <button
          onClick={() => router.push("/")}
          className="text-[#E5A100] hover:underline"
        >
          Go back
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-[#111]/90 backdrop-blur-md border-b border-[#2a2a2a] px-4 pt-[env(safe-area-inset-top)] pb-0">
        <div className="flex items-center h-14 max-w-2xl mx-auto w-full gap-3">
          <button
            onClick={() => router.push("/")}
            className="text-[#8B8B8B] hover:text-[#ededed] transition-colors text-sm flex items-center gap-1"
          >
            <span className="text-lg leading-none">&larr;</span> Back
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-bold text-[#ededed] truncate">
              {roll.name}
            </h1>
          </div>
        </div>
      </header>

      <main className="flex-1 px-4 py-5 max-w-2xl mx-auto w-full">
        {/* Roll Info Card */}
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4 mb-5">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-sm text-[#8B8B8B]">
                {roll.film_stock} &middot; ASA {roll.asa_iso}
              </p>
              {roll.camera && (
                <p className="text-sm text-[#8B8B8B] mt-0.5">{roll.camera}</p>
              )}
            </div>
            <span
              className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize border ${statusColor(roll.status)}`}
            >
              {roll.status}
            </span>
          </div>

          {/* Progress */}
          <div className="flex items-center justify-between text-xs text-[#8B8B8B] mb-2">
            <span>
              {shots.length} / {roll.total_frames} frames
            </span>
            <span>
              {Math.round((shots.length / roll.total_frames) * 100)}%
            </span>
          </div>
          <div className="h-1.5 bg-[#2a2a2a] rounded-full overflow-hidden mb-3">
            <div
              className="h-full bg-[#E5A100] rounded-full transition-all"
              style={{
                width: `${Math.min(100, (shots.length / roll.total_frames) * 100)}%`,
              }}
            />
          </div>

          {roll.notes && (
            <p className="text-sm text-[#8B8B8B] italic">{roll.notes}</p>
          )}

          {/* Status Actions */}
          <div className="flex gap-2 mt-3">
            {roll.status === "active" && (
              <button
                onClick={() => updateStatus("developed")}
                className="text-xs bg-[#2a2a2a] text-[#ededed] px-3 py-1.5 rounded-lg hover:bg-[#3a3a3a] transition-colors"
              >
                Mark Developed
              </button>
            )}
            {roll.status === "developed" && (
              <button
                onClick={() => updateStatus("archived")}
                className="text-xs bg-[#2a2a2a] text-[#ededed] px-3 py-1.5 rounded-lg hover:bg-[#3a3a3a] transition-colors"
              >
                Archive
              </button>
            )}
            {roll.status !== "active" && (
              <button
                onClick={() => updateStatus("active")}
                className="text-xs bg-[#2a2a2a] text-[#ededed] px-3 py-1.5 rounded-lg hover:bg-[#3a3a3a] transition-colors"
              >
                Reactivate
              </button>
            )}
          </div>
        </div>

        {/* Shots */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-[#ededed]">Shots</h2>
          <button
            onClick={() => {
              setEditShot(null);
              setShowNewShot(true);
            }}
            className="bg-[#E5A100] text-[#111] font-semibold rounded-xl py-2 px-4 text-sm hover:bg-[#F5C542] transition-colors"
          >
            + Add Shot
          </button>
        </div>

        {shots.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-3xl mb-2">🎯</div>
            <p className="text-[#8B8B8B]">
              No shots yet. Start logging your frames.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {shots.map((shot) => {
              const isExpanded = expandedShot === shot.id;
              return (
                <div
                  key={shot.id}
                  className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl overflow-hidden hover:border-[#E5A100]/30 transition-colors"
                >
                  <button
                    onClick={() =>
                      setExpandedShot(isExpanded ? null : shot.id)
                    }
                    className="w-full text-left p-3 flex items-center gap-3"
                  >
                    {/* Frame number badge */}
                    <div className="w-9 h-9 rounded-lg bg-[#E5A100]/15 text-[#E5A100] flex items-center justify-center text-sm font-bold shrink-0">
                      {shot.frame_number}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-sm">
                        {shot.aperture && (
                          <span className="text-[#ededed]">
                            {shot.aperture}
                          </span>
                        )}
                        {shot.shutter_speed && (
                          <span className="text-[#8B8B8B]">
                            {shot.shutter_speed}
                          </span>
                        )}
                        {shot.lens && (
                          <span className="text-[#8B8B8B] truncate">
                            {shot.lens}
                          </span>
                        )}
                      </div>
                      {shot.description && (
                        <p className="text-xs text-[#8B8B8B] mt-0.5 truncate">
                          {shot.description}
                        </p>
                      )}
                    </div>

                    {shot.light_condition && (
                      <span className="text-base shrink-0">
                        {LIGHT_EMOJIS[shot.light_condition] ?? ""}
                      </span>
                    )}

                    <span className="text-[#8B8B8B] text-xs shrink-0">
                      {isExpanded ? "▲" : "▼"}
                    </span>
                  </button>

                  {isExpanded && (
                    <div className="px-3 pb-3 border-t border-[#2a2a2a] pt-3">
                      <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                        <div>
                          <span className="text-[#8B8B8B]">Aperture: </span>
                          <span className="text-[#ededed]">
                            {shot.aperture ?? "-"}
                          </span>
                        </div>
                        <div>
                          <span className="text-[#8B8B8B]">Shutter: </span>
                          <span className="text-[#ededed]">
                            {shot.shutter_speed ?? "-"}
                          </span>
                        </div>
                        <div>
                          <span className="text-[#8B8B8B]">Lens: </span>
                          <span className="text-[#ededed]">
                            {shot.lens ?? "-"}
                          </span>
                        </div>
                        <div>
                          <span className="text-[#8B8B8B]">Light: </span>
                          <span className="text-[#ededed]">
                            {shot.light_condition
                              ? `${LIGHT_EMOJIS[shot.light_condition] ?? ""} ${shot.light_condition.replace("-", " ")}`
                              : "-"}
                          </span>
                        </div>
                        {shot.filter && (
                          <div className="col-span-2">
                            <span className="text-[#8B8B8B]">Filter: </span>
                            <span className="text-[#ededed]">
                              {shot.filter}
                            </span>
                          </div>
                        )}
                        {shot.description && (
                          <div className="col-span-2">
                            <span className="text-[#8B8B8B]">Note: </span>
                            <span className="text-[#ededed]">
                              {shot.description}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditShot({
                              id: shot.id,
                              frame_number: shot.frame_number,
                              aperture: shot.aperture ?? "",
                              shutter_speed: shot.shutter_speed ?? "",
                              lens: shot.lens ?? "",
                              light_condition: shot.light_condition ?? "",
                              filter: shot.filter ?? "",
                              description: shot.description ?? "",
                            });
                            setShowNewShot(true);
                          }}
                          className="text-xs bg-[#2a2a2a] text-[#ededed] px-3 py-1.5 rounded-lg hover:bg-[#3a3a3a] transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            if (confirm("Delete this shot?")) {
                              deleteShot(shot.id);
                            }
                          }}
                          className="text-xs bg-red-500/10 text-red-400 px-3 py-1.5 rounded-lg hover:bg-red-500/20 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>

      {showNewShot && (
        <NewShotModal
          rollId={rollId}
          asa={roll.asa_iso}
          nextFrame={nextFrame}
          editShot={editShot}
          onClose={() => {
            setShowNewShot(false);
            setEditShot(null);
          }}
          onSaved={() => {
            setShowNewShot(false);
            setEditShot(null);
            fetchShots();
          }}
        />
      )}
    </div>
  );
}
