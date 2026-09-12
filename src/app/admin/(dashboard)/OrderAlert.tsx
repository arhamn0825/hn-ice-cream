"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const RING_DURATION_MS = 18000; // rings for 18 seconds
const CHIME_INTERVAL_S = 1.8; // one chime every 1.8s while ringing

export default function OrderAlert() {
  const router = useRouter();
  const lastCount = useRef<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Browsers block sound until you've clicked somewhere on the page at
  // least once — this "unlocks" audio the moment you click anywhere in
  // the admin panel, so it's ready before an order ever comes in.
  useEffect(() => {
    const unlock = () => {
      if (!audioCtxRef.current) {
        const Ctx = window.AudioContext || (window as any).webkitAudioContext;
        audioCtxRef.current = new Ctx();
      }
      if (audioCtxRef.current.state === "suspended") {
        audioCtxRef.current.resume();
      }
    };
    window.addEventListener("click", unlock);
    window.addEventListener("keydown", unlock);
    return () => {
      window.removeEventListener("click", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, []);

  // A soft, warm two-note chime (a gentle fifth interval) with a smooth
  // bell-like decay — closer to a hotel front-desk bell than a phone alarm.
  const scheduleChime = (ctx: AudioContext, atTime: number) => {
    const notes = [523.25, 783.99]; // C5, G5 — a clean, pleasant fifth
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;

      const start = atTime + i * 0.12;
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.14, start + 0.04); // soft attack
      gain.gain.exponentialRampToValueAtTime(0.0008, start + 1.1); // long, smooth decay

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 1.2);
    });
  };

  const startRinging = () => {
    const ctx = audioCtxRef.current;
    if (!ctx) return; // not unlocked yet — will work after the next click

    // Schedule every chime up front using the audio clock itself, rather
    // than repeated JS timers — this keeps it accurate for the full
    // duration even if the browser tab is in the background.
    const chimeCount = Math.floor(RING_DURATION_MS / 1000 / CHIME_INTERVAL_S);
    for (let i = 0; i < chimeCount; i++) {
      scheduleChime(ctx, ctx.currentTime + i * CHIME_INTERVAL_S);
    }
  };

  const showNotification = (orderNumber: string, total: string) => {
    toast.custom(
      (t) => (
        <div
          className={`${t.visible ? "animate-in fade-in slide-in-from-top-2" : "opacity-0"} 
            max-w-sm w-full bg-white rounded-2xl shadow-xl border border-grape-100 pointer-events-auto flex overflow-hidden`}
        >
          <div className="w-1.5 bg-gradient-to-b from-grape-500 to-blush-400" />
          <div className="flex-1 p-4">
            <p className="text-xs font-semibold tracking-wide text-grape-500 uppercase mb-1">New Order Received</p>
            <p className="text-sm text-ink/70">
              Order <span className="font-semibold text-ink">{orderNumber}</span> — Rs {total}
            </p>
          </div>
        </div>
      ),
      { duration: RING_DURATION_MS }
    );
  };

  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch("/api/admin/orders-count");
        if (!res.ok) return;
        const data = await res.json();

        if (lastCount.current === null) {
          lastCount.current = data.count; // first check just establishes the baseline
          return;
        }

        if (data.count > lastCount.current) {
          startRinging();
          showNotification(data.latest?.orderNumber ?? "", data.latest?.total ?? "");
          document.title = "New Order — HN Ice Cream Admin";
          router.refresh(); // silently updates whatever admin page you're on — no reload needed
        }
        lastCount.current = data.count;
      } catch {
        // Network hiccup — just try again next interval.
      }
    };

    check();
    const interval = setInterval(check, 20000); // check every 20 seconds
    const resetTitle = () => { document.title = "HN Ice Cream Admin"; };
    window.addEventListener("focus", resetTitle);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", resetTitle);
    };
  }, []);

  return null;
}
