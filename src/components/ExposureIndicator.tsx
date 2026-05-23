"use client";

/**
 * Exposure indicator based on Sunny 16 rule approximation.
 *
 * Sunny 16: At ISO N, correct exposure in bright sun is f/16, 1/N sec.
 * We compute an EV (exposure value) delta from the "correct" Sunny 16 baseline
 * and display a simple meter from -2 to +2 stops.
 */

interface Props {
  asa: number;
  aperture: string;
  shutterSpeed: string;
  lightCondition: string;
}

const APERTURE_STOPS: Record<string, number> = {
  "f/1.4": 1,
  "f/2": 2,
  "f/2.8": 3,
  "f/4": 4,
  "f/5.6": 5,
  "f/8": 6,
  "f/11": 7,
  "f/16": 8,
  "f/22": 9,
};

const SHUTTER_STOPS: Record<string, number> = {
  "1/1000": 10,
  "1/500": 9,
  "1/250": 8,
  "1/125": 7,
  "1/60": 6,
  "1/30": 5,
  "1/15": 4,
  "1/8": 3,
  "1/4": 2,
  "1/2": 1,
  "1s": 0,
  "2s": -1,
  B: -2,
};

// EV adjustments for light conditions (relative to bright sun)
const LIGHT_EV: Record<string, number> = {
  "bright-sun": 0,
  "light-clouds": -1,
  "overcast": -2,
  "shade": -3,
  "golden-hour": -3,
  "indoor": -5,
  "night": -8,
};

export default function ExposureIndicator({
  asa,
  aperture,
  shutterSpeed,
  lightCondition,
}: Props) {
  if (!aperture || !shutterSpeed) return null;

  const apertureStops = APERTURE_STOPS[aperture];
  const shutterStops = SHUTTER_STOPS[shutterSpeed];

  if (apertureStops === undefined || shutterStops === undefined) return null;

  // EV of the shot = aperture_stops + shutter_stops
  const shotEV = apertureStops + shutterStops;

  // Sunny 16 correct EV at this ASA:
  // f/16 = 8 stops, shutter = 1/ASA
  // For ASA 100: 1/125 ~= stop 7, so EV = 8 + 7 = 15
  // For ASA 400: 1/500 ~= stop 9, so EV = 8 + 9 = 17
  const asaShutterStop = Math.log2(asa) + 3; // approximate mapping
  const sunny16EV = 8 + asaShutterStop;

  // Adjust for light condition
  const lightAdj = LIGHT_EV[lightCondition] ?? 0;
  const targetEV = sunny16EV + lightAdj;

  // Delta: positive = overexposed, negative = underexposed
  const delta = Math.round(targetEV - shotEV);
  const clampedDelta = Math.max(-2, Math.min(2, delta));

  const stops = [-2, -1, 0, 1, 2];

  const label =
    clampedDelta === 0
      ? "Correct"
      : clampedDelta > 0
        ? `+${clampedDelta} over`
        : `${clampedDelta} under`;

  const labelColor =
    clampedDelta === 0
      ? "text-green-400"
      : Math.abs(clampedDelta) === 1
        ? "text-[#F5C542]"
        : "text-red-400";

  return (
    <div className="bg-[#111] border border-[#2a2a2a] rounded-xl p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-[#8B8B8B]">Exposure</span>
        <span className={`text-xs font-medium ${labelColor}`}>{label}</span>
      </div>
      <div className="flex items-center justify-between gap-1">
        {stops.map((s) => (
          <div key={s} className="flex-1 flex flex-col items-center gap-1">
            <div
              className={`w-full h-2 rounded-full transition-colors ${
                s === clampedDelta
                  ? s === 0
                    ? "bg-green-400"
                    : Math.abs(s) === 1
                      ? "bg-[#F5C542]"
                      : "bg-red-400"
                  : "bg-[#2a2a2a]"
              }`}
            />
            <span className="text-[10px] text-[#8B8B8B]">
              {s > 0 ? `+${s}` : s}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
