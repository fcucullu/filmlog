"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import NewRollModal from "@/components/NewRollModal";
import { InstallPrompt } from "@/components/install-prompt";

interface Roll {
  id: string;
  name: string;
  film_stock: string;
  asa_iso: number;
  total_frames: number;
  camera: string | null;
  notes: string | null;
  status: "active" | "developed" | "archived";
  created_at: string;
  shot_count: number;
}

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [rolls, setRolls] = useState<Roll[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewRoll, setShowNewRoll] = useState(false);

  const supabase = createClient();

  const fetchRolls = useCallback(async () => {
    console.log("[FilmLog] fetchRolls start");
    try {
      const { data, error } = await supabase
        .from("filmlog_rolls")
        .select("*")
        .order("created_at", { ascending: false });

      console.log("[FilmLog] fetchRolls result:", data?.length, "rolls, error:", error?.message);

      if (data) {
        setRolls(data.map((r: Record<string, unknown>) => ({ ...r, shot_count: 0 })) as Roll[]);
      }
    } catch (e) {
      console.error("[FilmLog] fetchRolls error:", e);
    }
  }, [supabase]);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log("[FilmLog] auth state change:", _event, session?.user?.email);
      const u = session?.user ?? null;
      setUser(u);
      setLoading(false);
      if (u) {
        fetchRolls().catch(console.error);
      }
    });

    // Also check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("[FilmLog] getSession:", session?.user?.email || "no session");
      const u = session?.user ?? null;
      setUser(u);
      setLoading(false);
      if (u) {
        fetchRolls().catch(console.error);
      }
    }).catch(() => setLoading(false));

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setRolls([]);
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/20 text-green-400";
      case "developed":
        return "bg-[#E5A100]/20 text-[#F5C542]";
      case "archived":
        return "bg-[#8B8B8B]/20 text-[#8B8B8B]";
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

  if (!user) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="text-center max-w-sm">
          <div className="text-5xl mb-4">📷</div>
          <h1 className="text-3xl font-bold text-[#ededed] mb-2">FilmLog</h1>
          <p className="text-[#8B8B8B] mb-8">
            Track your analog photography
          </p>
          <button
            onClick={signIn}
            className="w-full bg-[#E5A100] text-[#111] font-semibold rounded-xl py-3 px-6 text-base hover:bg-[#F5C542] transition-colors"
          >
            Sign in with Google
          </button>
          <div className="mt-8">
            <InstallPrompt />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-[#111]/90 backdrop-blur-md border-b border-[#2a2a2a] px-4 pt-[env(safe-area-inset-top)] pb-0">
        <div className="flex items-center justify-between h-14 max-w-2xl mx-auto w-full">
          <h1 className="text-lg font-bold text-[#ededed]">
            <span className="text-[#E5A100]">Film</span>Log
          </h1>
          <button
            onClick={signOut}
            className="text-sm text-[#8B8B8B] hover:text-[#ededed] transition-colors"
          >
            Sign out
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 px-4 py-6 max-w-2xl mx-auto w-full">
        <InstallPrompt />
        {rolls.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
            <div className="text-4xl mb-3">🎞️</div>
            <p className="text-[#8B8B8B] mb-6">
              No rolls yet. Start logging your first roll of film.
            </p>
            <button
              onClick={() => setShowNewRoll(true)}
              className="bg-[#E5A100] text-[#111] font-semibold rounded-xl py-3 px-6 hover:bg-[#F5C542] transition-colors"
            >
              + New Roll
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-[#ededed]">
                Your Rolls
              </h2>
              <button
                onClick={() => setShowNewRoll(true)}
                className="bg-[#E5A100] text-[#111] font-semibold rounded-xl py-2 px-4 text-sm hover:bg-[#F5C542] transition-colors"
              >
                + New Roll
              </button>
            </div>

            <div className="space-y-3">
              {rolls.map((roll) => (
                <a
                  key={roll.id}
                  href={`/roll/${roll.id}`}
                  className="block bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4 hover:border-[#E5A100]/40 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-[#ededed]">
                        {roll.name}
                      </h3>
                      <p className="text-sm text-[#8B8B8B]">
                        {roll.film_stock} &middot; ASA {roll.asa_iso}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${statusColor(roll.status)}`}
                    >
                      {roll.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#8B8B8B]">
                      {roll.shot_count} / {roll.total_frames} frames
                    </span>
                    {roll.camera && (
                      <span className="text-[#8B8B8B]">{roll.camera}</span>
                    )}
                  </div>
                  {/* Progress bar */}
                  <div className="mt-3 h-1.5 bg-[#2a2a2a] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#E5A100] rounded-full transition-all"
                      style={{
                        width: `${Math.min(100, (roll.shot_count / roll.total_frames) * 100)}%`,
                      }}
                    />
                  </div>
                </a>
              ))}
            </div>
          </>
        )}
      </main>

      {showNewRoll && (
        <NewRollModal
          onClose={() => setShowNewRoll(false)}
          onSaved={() => {
            setShowNewRoll(false);
            fetchRolls();
          }}
        />
      )}
    </div>
  );
}
