import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sword, Flame, Sun, Crown, Sparkles, RotateCcw } from "lucide-react";

const SEED = "BOOK-CLUB-DUEL-NINA-VID-2026-05-15-v1";

function xmur3(str) {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return function () {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return (h ^= h >>> 16) >>> 0;
  };
}

function mulberry32(a) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seededRandom(seed) {
  const seedFn = xmur3(seed);
  return mulberry32(seedFn());
}

const fighters = {
  nina: {
    name: "Nina",
    book: "We Burned So Bright",
    title: "The Ember Duchess",
    color: "from-rose-300 to-orange-300",
    accent: "bg-rose-400",
    side: "left",
    icon: Flame,
  },
  vid: {
    name: "Vid",
    book: "Sunburn",
    title: "The SPF Swordsman",
    color: "from-yellow-200 to-amber-400",
    accent: "bg-amber-400",
    side: "right",
    icon: Sun,
  },
};

function useDuel(seed) {
  return useMemo(() => {
    const rng = seededRandom(seed);
    const winnerKey = rng() < 0.5 ? "nina" : "vid";
    const loserKey = winnerKey === "nina" ? "vid" : "nina";
    const beats = [
      "The crowd of suspiciously literate squirrels gasps.",
      "Two tiny swords go CLANG, CLONG, and once, for no reason, KLÜMPF.",
      `${fighters.nina.name} invokes the ancient rite of dramatic page-turning.`,
      `${fighters.vid.name} counters with a tactical application of sunscreen.`,
      "A bookmark flutters across the battlefield like a doomed little flag.",
      `${fighters[winnerKey].name} lands the decisive blow: a perfectly timed recommendation.`,
    ];

    return {
      winnerKey,
      loserKey,
      winner: fighters[winnerKey],
      loser: fighters[loserKey],
      beats,
      roll: Math.floor(rng() * 1000000).toString().padStart(6, "0"),
    };
  }, [seed]);
}

function Warrior({ fighter, isWinner, defeated, entranceDelay = 0 }) {
  const Icon = fighter.icon;
  const isLeft = fighter.side === "left";
  const direction = isLeft ? 1 : -1;

  return (
    <motion.div
      initial={{ x: isLeft ? -260 : 260, y: 0, opacity: 0, rotate: isLeft ? -4 : 4 }}
      animate={
        defeated
          ? { x: isLeft ? -38 : 38, y: 58, opacity: 0.72, rotate: isLeft ? -13 : 13, scale: 0.92 }
          : { x: isWinner ? direction * 34 : direction * 10, y: isWinner ? -10 : 4, opacity: 1, rotate: isWinner ? direction * -4 : direction * 2, scale: isWinner ? 1.05 : 1 }
      }
      transition={{ delay: entranceDelay, duration: defeated ? 0.7 : 0.9, type: "spring", bounce: 0.36 }}
      className="relative flex w-44 flex-col items-center sm:w-56"
    >
      {isWinner && (
        <motion.div
          initial={{ y: -30, opacity: 0, rotate: -20 }}
          animate={{ y: -48, opacity: 1, rotate: 0 }}
          transition={{ delay: 5.6, type: "spring", bounce: 0.5 }}
          className="absolute -top-5 z-20"
        >
          <Crown className="h-12 w-12 fill-yellow-300 text-yellow-500 drop-shadow" />
        </motion.div>
      )}

      <div className="relative">
        <motion.div
          animate={defeated ? { rotate: [0, -3, 2, -2, 0] } : { y: [0, -7, 0], rotate: [0, direction * 2, 0] }}
          transition={{ repeat: Infinity, duration: defeated ? 1.4 : 1.15, ease: "easeInOut" }}
          className={`relative h-32 w-28 rounded-[2rem] bg-gradient-to-b ${fighter.color} shadow-2xl ring-4 ring-white/70 sm:h-40 sm:w-36`}
        >
          <div className="absolute left-1/2 top-4 h-16 w-16 -translate-x-1/2 rounded-full bg-orange-50 shadow-inner sm:h-20 sm:w-20" />
          <div className="absolute left-1/2 top-8 flex -translate-x-1/2 gap-5 sm:top-10">
            <div className="h-2.5 w-2.5 rounded-full bg-slate-800" />
            <div className="h-2.5 w-2.5 rounded-full bg-slate-800" />
          </div>
          <motion.div
            animate={defeated ? { width: 28, rotate: -8 } : { width: [28, 38, 28] }}
            transition={{ repeat: Infinity, duration: 1.1 }}
            className="absolute left-1/2 top-[4.55rem] h-2 -translate-x-1/2 rounded-full bg-slate-800 sm:top-[5.45rem]"
          />
          <div className={`absolute -left-3 top-20 h-14 w-7 rounded-full ${fighter.accent} shadow-lg sm:top-24`} />
          <div className={`absolute -right-3 top-20 h-14 w-7 rounded-full ${fighter.accent} shadow-lg sm:top-24`} />
          <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full bg-white/65 px-2 py-1 text-xs font-bold text-slate-700 shadow">
            <Icon className="h-3.5 w-3.5" />
            {fighter.name}
          </div>
        </motion.div>

        <motion.div
          className="absolute top-20 z-30 origin-bottom sm:top-24"
          style={{ [isLeft ? "right" : "left"]: -34 }}
          animate={
            defeated
              ? { rotate: isLeft ? 110 : -110, y: 38, x: isLeft ? -10 : 10 }
              : { rotate: isLeft ? [34, 88, 36, 82, 40] : [-34, -88, -36, -82, -40] }
          }
          transition={{ repeat: defeated ? 0 : Infinity, duration: 1.25, ease: "easeInOut" }}
        >
          <Sword className={`h-24 w-24 ${isLeft ? "text-slate-700" : "scale-x-[-1] text-slate-700"} drop-shadow-lg`} />
        </motion.div>
      </div>

      <motion.div
        initial={{ y: 18, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: entranceDelay + 0.35 }}
        className="mt-6 text-center"
      >
        <p className="text-lg font-black text-slate-900 sm:text-2xl">{fighter.name}</p>
        <p className="text-sm font-semibold text-slate-600">{fighter.title}</p>
        <p className="mt-2 rounded-full bg-white/80 px-3 py-1 text-xs font-bold italic text-slate-700 shadow-sm sm:text-sm">
          “{fighter.book}”
        </p>
      </motion.div>
    </motion.div>
  );
}

function ClashCloud() {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0, rotate: -12 }}
      animate={{ scale: [0, 1.25, 0.85, 1.05, 0], opacity: [0, 1, 1, 1, 0], rotate: [-12, 10, -6, 0] }}
      transition={{ delay: 2.15, duration: 3.1, ease: "easeInOut" }}
      className="pointer-events-none absolute left-1/2 top-1/2 z-40 flex h-40 w-40 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[42%] bg-white/90 text-center shadow-2xl ring-4 ring-amber-200 sm:h-52 sm:w-52"
    >
      <div className="absolute -left-8 top-7 h-12 w-12 rounded-full bg-white/90" />
      <div className="absolute -right-7 bottom-9 h-14 w-14 rounded-full bg-white/90" />
      <div className="absolute right-4 top-0 h-10 w-10 rounded-full bg-white/90" />
      <motion.div
        animate={{ rotate: [0, 8, -8, 0], scale: [1, 1.08, 0.98, 1] }}
        transition={{ repeat: Infinity, duration: 0.45 }}
        className="relative z-10 text-2xl font-black text-slate-800 sm:text-4xl"
      >
        CLANG!
        <div className="text-sm text-amber-600 sm:text-base">bookish violence</div>
      </motion.div>
    </motion.div>
  );
}

function SparkleField() {
  const sparkles = Array.from({ length: 30 }, (_, i) => i);
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {sparkles.map((i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20, scale: 0 }}
          animate={{ opacity: [0, 1, 0], y: [-10, -90 - (i % 5) * 22], scale: [0, 1, 0.4], rotate: [0, 90, 180] }}
          transition={{ delay: 0.3 + (i % 10) * 0.42, duration: 2.2 + (i % 4) * 0.35, repeat: Infinity, repeatDelay: 1.1 }}
          className="absolute"
          style={{ left: `${6 + ((i * 29) % 88)}%`, top: `${72 + ((i * 17) % 20)}%` }}
        >
          <Sparkles className="h-4 w-4 text-yellow-400 drop-shadow" />
        </motion.div>
      ))}
    </div>
  );
}

export default function BookClubBattle() {
  const [round, setRound] = useState(0);
  const [phase, setPhase] = useState("intro");
  const duel = useDuel(SEED);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase("duel"), 900),
      setTimeout(() => setPhase("clash"), 2200),
      setTimeout(() => setPhase("finish"), 5200),
      setTimeout(() => setPhase("winner"), 6400),
    ];
    return () => timers.forEach(clearTimeout);
  }, [round]);

  const replay = () => {
    setPhase("intro");
    setRound((r) => r + 1);
  };

  const ninaDefeated = phase === "winner" && duel.loserKey === "nina";
  const vidDefeated = phase === "winner" && duel.loserKey === "vid";

  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,#fff7ad_0%,#ffe0f0_38%,#c7f5ff_100%)] px-4 py-6 text-slate-900 sm:px-8">
      <SparkleField />

      <section className="mx-auto flex max-w-6xl flex-col items-center">
        <motion.div
          initial={{ y: -18, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-5 rounded-[2rem] border-4 border-white/70 bg-white/60 px-5 py-4 text-center shadow-xl backdrop-blur sm:px-8"
        >
          <div className="mb-2 flex items-center justify-center gap-2 text-sm font-black uppercase tracking-[0.25em] text-amber-700">
            <Sword className="h-4 w-4" />
            Deterministic Book Club Combat
            <Sword className="h-4 w-4 scale-x-[-1]" />
          </div>
          <h1 className="text-4xl font-black leading-tight sm:text-6xl">
            Fight to the <span className="text-rose-500">Read</span>
          </h1>
          <p className="mt-3 max-w-2xl text-sm font-medium text-slate-700 sm:text-base">
            Two cartoon champions enter. One seeded random number generator decides the next book club read.
          </p>
        </motion.div>

        <div className="relative mt-4 min-h-[520px] w-full rounded-[2.5rem] border-4 border-white/80 bg-gradient-to-b from-sky-100/70 to-lime-100/70 p-4 shadow-2xl backdrop-blur sm:min-h-[590px] sm:p-8">
          <div className="absolute bottom-0 left-0 right-0 h-32 rounded-b-[2.2rem] bg-gradient-to-t from-green-300/70 to-transparent" />
          <div className="absolute bottom-14 left-1/2 h-10 w-[74%] -translate-x-1/2 rounded-full bg-slate-800/10 blur-xl" />

          <div className="absolute left-1/2 top-7 z-20 -translate-x-1/2 rounded-full bg-white/80 px-4 py-2 text-center text-xs font-bold text-slate-600 shadow sm:text-sm">
            Baked-in seed: <span className="font-black text-slate-900">{SEED}</span>
            <span className="mx-2 text-slate-300">•</span>
            Roll: <span className="font-black text-slate-900">{duel.roll}</span>
          </div>

          {phase === "clash" && <ClashCloud />}

          <div className="relative z-10 flex min-h-[480px] items-end justify-between gap-2 pt-20 sm:min-h-[530px] sm:items-center sm:px-8 sm:pt-10">
            <Warrior fighter={fighters.nina} isWinner={phase === "winner" && duel.winnerKey === "nina"} defeated={ninaDefeated} entranceDelay={0.1} />

            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: phase === "intro" ? 0.45 : 1, scale: phase === "clash" ? [1, 1.2, 1] : 1 }}
              transition={{ duration: 0.4, repeat: phase === "clash" ? Infinity : 0 }}
              className="absolute left-1/2 top-[48%] z-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/45 p-5 shadow-inner"
            >
              <div className="text-5xl font-black text-white drop-shadow-[0_3px_0_rgba(15,23,42,0.28)] sm:text-7xl">VS</div>
            </motion.div>

            <Warrior fighter={fighters.vid} isWinner={phase === "winner" && duel.winnerKey === "vid"} defeated={vidDefeated} entranceDelay={0.25} />
          </div>
        </div>

        <div className="mt-5 w-full max-w-4xl rounded-[2rem] border-4 border-white/75 bg-white/70 p-5 shadow-xl backdrop-blur">
          <AnimatePresence mode="wait">
            {phase !== "winner" ? (
              <motion.div
                key={phase}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-center"
              >
                <p className="text-sm font-black uppercase tracking-[0.22em] text-rose-500">Battle log</p>
                <p className="mt-2 text-xl font-black text-slate-800 sm:text-2xl">
                  {phase === "intro" && "The warriors are entering the extremely official literary arena..."}
                  {phase === "duel" && duel.beats[2]}
                  {phase === "clash" && duel.beats[4]}
                  {phase === "finish" && duel.beats[5]}
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="winner"
                initial={{ opacity: 0, y: 22, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-center"
              >
                <p className="text-sm font-black uppercase tracking-[0.25em] text-amber-600">The seed has spoken</p>
                <h2 className="mt-2 text-4xl font-black text-slate-900 sm:text-5xl">
                  {duel.winner.name} wins!
                </h2>
                <p className="mt-3 text-xl font-bold text-slate-700 sm:text-2xl">
                  Next book club read: <span className="italic text-rose-600">“{duel.winner.book}”</span>
                </p>
                <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-600 sm:text-base">
                  {duel.loser.name} fought bravely, but was defeated by the fearsome power of deterministic randomness.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          onClick={replay}
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-black text-white shadow-xl transition hover:-translate-y-0.5 hover:bg-slate-800 active:translate-y-0"
        >
          <RotateCcw className="h-4 w-4" />
          Replay the exact same destiny
        </button>

        <p className="mt-3 text-center text-xs font-semibold text-slate-600">
          Changing the <code className="rounded bg-white/70 px-1.5 py-0.5">SEED</code> constant changes the winner; keeping it fixed keeps the result fixed.
        </p>
      </section>
    </main>
  );
}
