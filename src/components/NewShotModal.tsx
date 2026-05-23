"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import ExposureIndicator from "./ExposureIndicator";

const APERTURES = [
  "f/1.4",
  "f/2",
  "f/2.8",
  "f/4",
  "f/5.6",
  "f/8",
  "f/11",
  "f/16",
  "f/22",
];

const SHUTTER_SPEEDS = [
  "1/1000",
  "1/500",
  "1/250",
  "1/125",
  "1/60",
  "1/30",
  "1/15",
  "1/8",
  "1/4",
  "1/2",
  "1s",
  "2s",
  "B",
];

const LIGHT_CONDITIONS = [
  { value: "bright-sun", label: "Bright Sun", emoji: "☀️" },
  { value: "light-clouds", label: "Light Clouds", emoji: "🌤️" },
  { value: "overcast", label: "Overcast", emoji: "☁️" },
  { value: "shade", label: "Shade", emoji: "🌳" },
  { value: "golden-hour", label: "Golden Hour", emoji: "🌅" },
  { value: "indoor", label: "Indoor", emoji: "🏠" },
  { value: "night", label: "Night", emoji: "🌙" },
];

interface Props {
  rollId: string;
  asa: number;
  nextFrame: number;
  onClose: () => void;
  onSaved: () => void;
  editShot?: {
    id: string;
    frame_number: number;
    aperture: string;
    shutter_speed: string;
    lens: string;
    light_condition: string;
    filter: string;
    description: string;
  } | null;
}

export default function NewShotModal({
  rollId,
  asa,
  nextFrame,
  onClose,
  onSaved,
  editShot,
}: Props) {
  const [frameNumber, setFrameNumber] = useState(
    editShot?.frame_number ?? nextFrame
  );
  const [aperture, setAperture] = useState(editShot?.aperture ?? "");
  const [shutterSpeed, setShutterSpeed] = useState(
    editShot?.shutter_speed ?? ""
  );
  const [lens, setLens] = useState(editShot?.lens ?? "");
  const [lightCondition, setLightCondition] = useState(
    editShot?.light_condition ?? ""
  );
  const [filter, setFilter] = useState(editShot?.filter ?? "");
  const [description, setDescription] = useState(editShot?.description ?? "");
  const [saving, setSaving] = useState(false);

  const supabase = createClient();

  const handleSave = async () => {
    setSaving(true);

    const shotData = {
      roll_id: rollId,
      frame_number: frameNumber,
      aperture: aperture || null,
      shutter_speed: shutterSpeed || null,
      lens: lens.trim() || null,
      light_condition: lightCondition || null,
      filter: filter.trim() || null,
      description: description.trim() || null,
    };

    if (editShot) {
      await supabase.from("filmlog_shots").update(shotData).eq("id", editShot.id);
    } else {
      await supabase.from("filmlog_shots").insert(shotData);
    }

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
            <h2 className="text-lg font-bold text-[#ededed]">
              {editShot ? "Edit Shot" : "Add Shot"}
            </h2>
            <button
              onClick={onClose}
              className="text-[#8B8B8B] hover:text-[#ededed] text-xl leading-none"
            >
              x
            </button>
          </div>

          <div className="space-y-4">
            {/* Frame Number */}
            <div>
              <label className="block text-sm text-[#8B8B8B] mb-1.5">
                Frame #
              </label>
              <input
                type="number"
                value={frameNumber}
                onChange={(e) => setFrameNumber(parseInt(e.target.value) || 1)}
                min={1}
                className="w-full"
              />
            </div>

            {/* Aperture and Shutter Speed */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-[#8B8B8B] mb-1.5">
                  Aperture
                </label>
                <select
                  value={aperture}
                  onChange={(e) => setAperture(e.target.value)}
                  className="w-full"
                >
                  <option value="">Select</option>
                  {APERTURES.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-[#8B8B8B] mb-1.5">
                  Shutter Speed
                </label>
                <select
                  value={shutterSpeed}
                  onChange={(e) => setShutterSpeed(e.target.value)}
                  className="w-full"
                >
                  <option value="">Select</option>
                  {SHUTTER_SPEEDS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Exposure Indicator */}
            {aperture && shutterSpeed && (
              <ExposureIndicator
                asa={asa}
                aperture={aperture}
                shutterSpeed={shutterSpeed}
                lightCondition={lightCondition}
              />
            )}

            {/* Lens */}
            <div>
              <label className="block text-sm text-[#8B8B8B] mb-1.5">
                Lens
              </label>
              <input
                type="text"
                value={lens}
                onChange={(e) => setLens(e.target.value)}
                placeholder="e.g. 50mm f/1.8"
                className="w-full"
              />
            </div>

            {/* Light Condition */}
            <div>
              <label className="block text-sm text-[#8B8B8B] mb-1.5">
                Light Condition
              </label>
              <select
                value={lightCondition}
                onChange={(e) => setLightCondition(e.target.value)}
                className="w-full"
              >
                <option value="">Select</option>
                {LIGHT_CONDITIONS.map((lc) => (
                  <option key={lc.value} value={lc.value}>
                    {lc.emoji} {lc.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter */}
            <div>
              <label className="block text-sm text-[#8B8B8B] mb-1.5">
                Filter (optional)
              </label>
              <input
                type="text"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="e.g. UV, Polarizer, ND4"
                className="w-full"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm text-[#8B8B8B] mb-1.5">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What are you shooting?"
                rows={2}
                className="w-full resize-none"
              />
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full bg-[#E5A100] text-[#111] font-semibold rounded-xl py-3 text-base hover:bg-[#F5C542] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "Saving..." : editShot ? "Update Shot" : "Save Shot"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
