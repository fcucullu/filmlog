"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const FILM_SUGGESTIONS = [
  "Kodak Portra 400",
  "Ilford HP5",
  "Fuji Superia 400",
  "Kodak Gold 200",
  "Kodak Tri-X 400",
  "Kodak Portra 160",
  "Kodak Portra 800",
  "Ilford Delta 3200",
  "Fuji Pro 400H",
  "CineStill 800T",
  "Kodak Ektar 100",
  "Ilford FP4 Plus",
];

interface Props {
  onClose: () => void;
  onSaved: () => void;
}

export default function NewRollModal({ onClose, onSaved }: Props) {
  const [name, setName] = useState("");
  const [filmStock, setFilmStock] = useState("");
  const [asa, setAsa] = useState(400);
  const [totalFrames, setTotalFrames] = useState(36);
  const [camera, setCamera] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const supabase = createClient();

  const filtered = FILM_SUGGESTIONS.filter((f) =>
    f.toLowerCase().includes(filmStock.toLowerCase())
  );

  const handleSave = async () => {
    if (!name.trim()) return;
    setSaving(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("filmlog_rolls").insert({
      user_id: user.id,
      name: name.trim(),
      film_stock: filmStock.trim() || "Unknown",
      asa_iso: asa,
      total_frames: totalFrames,
      camera: camera.trim() || null,
      notes: notes.trim() || null,
      status: "active",
    });

    onSaved();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-t-2xl sm:rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-[#ededed]">New Roll</h2>
            <button
              onClick={onClose}
              className="text-[#8B8B8B] hover:text-[#ededed] text-xl leading-none"
            >
              x
            </button>
          </div>

          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm text-[#8B8B8B] mb-1.5">
                Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. NYC Street Walk"
                className="w-full"
              />
            </div>

            {/* Film Stock */}
            <div className="relative">
              <label className="block text-sm text-[#8B8B8B] mb-1.5">
                Film Stock
              </label>
              <input
                type="text"
                value={filmStock}
                onChange={(e) => {
                  setFilmStock(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                placeholder="e.g. Kodak Portra 400"
                className="w-full"
              />
              {showSuggestions && filmStock && filtered.length > 0 && (
                <div className="absolute z-10 top-full mt-1 w-full bg-[#111] border border-[#2a2a2a] rounded-xl overflow-hidden shadow-lg">
                  {filtered.map((f) => (
                    <button
                      key={f}
                      type="button"
                      onMouseDown={() => {
                        setFilmStock(f);
                        setShowSuggestions(false);
                        // Auto-set ASA from film name
                        const match = f.match(/(\d+)/);
                        if (match) setAsa(parseInt(match[1]));
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-[#ededed] hover:bg-[#2a2a2a] transition-colors"
                    >
                      {f}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ASA and Frames */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-[#8B8B8B] mb-1.5">
                  ASA / ISO
                </label>
                <input
                  type="number"
                  value={asa}
                  onChange={(e) => setAsa(parseInt(e.target.value) || 100)}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm text-[#8B8B8B] mb-1.5">
                  Frames
                </label>
                <select
                  value={totalFrames}
                  onChange={(e) => setTotalFrames(parseInt(e.target.value))}
                  className="w-full"
                >
                  <option value={12}>12</option>
                  <option value={24}>24</option>
                  <option value={36}>36</option>
                </select>
              </div>
            </div>

            {/* Camera */}
            <div>
              <label className="block text-sm text-[#8B8B8B] mb-1.5">
                Camera
              </label>
              <input
                type="text"
                value={camera}
                onChange={(e) => setCamera(e.target.value)}
                placeholder="e.g. Canon AE-1"
                className="w-full"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm text-[#8B8B8B] mb-1.5">
                Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any notes about this roll..."
                rows={2}
                className="w-full resize-none"
              />
            </div>

            <button
              onClick={handleSave}
              disabled={!name.trim() || saving}
              className="w-full bg-[#E5A100] text-[#111] font-semibold rounded-xl py-3 text-base hover:bg-[#F5C542] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "Saving..." : "Save Roll"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
