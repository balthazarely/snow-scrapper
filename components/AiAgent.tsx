// components/agent/AIAgent.tsx
"use client";
import { useState } from "react";
import { useAskAgent } from "@/hooks/useAskAgent";
import { useUserPrefs } from "@/context/UserPrefsContext";
import AgentSettingsModal from "@/components/AgentSettingsModal";
import { MdTune, MdLocationOn, MdLocationOff, MdConfirmationNumber, MdLocationDisabled } from "react-icons/md";
import Image from "next/image";
import { useApp } from "@/context/AppContext";

const QUICK_QUESTIONS = [
  "Where should I ski this weekend?",
  "Best resort for fresh powder today?",
  "Closest resort with good conditions?",
  "Best resort for beginners?",
];

export default function AIAgent() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const { prefs } = useUserPrefs();
  const { locationError } = useApp();
  const locationDenied = locationError?.includes("denied");
  const { mutate: ask, isPending, error } = useAskAgent();

  function handleAsk(q?: string) {
    const finalQuestion = q ?? question;
    if (!finalQuestion.trim()) return;

    ask(finalQuestion, {
      onSuccess: (data) => {
        setAnswer(data.answer);
        setQuestion("");
      },
    });
  }

  return (
    <div className="mt-4 space-y-4">
      {settingsOpen && (
        <AgentSettingsModal onClose={() => setSettingsOpen(false)} />
      )}

      {/* Filter chips */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => setSettingsOpen(true)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition-colors ${
            prefs.pass
              ? "border-sky-400 bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-400"
              : "border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-600"
          }`}
        >
          {prefs.pass ? (
            <Image
              src={`/${prefs.pass}.png`}
              alt={prefs.pass}
              width={prefs.pass === "Ikon" ? 16 : 22}
              height={8}
              className="object-contain rounded-sm ring-1 ring-white/70"
            />
          ) : (
            <MdConfirmationNumber size={12} />
          )}
          {prefs.pass ? `${prefs.pass} Pass` : "No Pass"}
        </button>

        <button
          onClick={() => setSettingsOpen(true)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition-colors ${
            locationDenied
              ? "border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400"
              : prefs.useLocation
              ? "border-sky-400 bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-400"
              : "border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-600"
          }`}
        >
          {locationDenied
            ? <MdLocationDisabled size={12} />
            : prefs.useLocation
            ? <MdLocationOn size={12} />
            : <MdLocationOff size={12} />}
          {locationDenied ? "Location Denied" : prefs.useLocation ? "Location On" : "Location Off"}
        </button>

        <button
          onClick={() => setSettingsOpen(true)}
          className="ml-auto flex items-center gap-1 px-2.5 py-1.5 rounded-full border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-600 transition-colors"
        >
          <MdTune size={13} />
        </button>
      </div>

      {/* Main content */}
      <div className="space-y-4" suppressHydrationWarning>
        {/* Quick questions */}
        <div className="rounded-2xl bg-white dark:bg-zinc-800 shadow-sm p-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-3">
            Quick Questions
          </p>
          <div className="flex flex-wrap gap-2">
            {QUICK_QUESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => handleAsk(q)}
                disabled={isPending}
                className="px-3 py-1.5 rounded-full border border-zinc-200 dark:border-zinc-700 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:border-sky-400 hover:text-sky-600 hover:bg-sky-50 dark:hover:bg-sky-950 transition-colors disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Input + button */}
        <div className="rounded-2xl bg-white dark:bg-zinc-800 shadow-sm p-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-3">
            Ask Anything
          </p>
          <div className="flex gap-2" suppressHydrationWarning>
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAsk()}
              placeholder="Ask about snow conditions..."
              disabled={isPending}
              suppressHydrationWarning
              className="flex-1 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-800 dark:text-zinc-200 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:border-sky-400 transition-colors disabled:opacity-50"
            />
            <button
              onClick={() => handleAsk()}
              disabled={isPending || !question.trim()}
              suppressHydrationWarning
              className="px-4 py-2 rounded-xl bg-sky-500 text-white text-sm font-semibold hover:bg-sky-600 transition-colors disabled:opacity-40"
            >
              {isPending ? "..." : "Ask"}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-2xl bg-red-50 dark:bg-red-950 border border-red-100 dark:border-red-900 px-4 py-3 text-sm text-red-500">
            {error.message}
          </div>
        )}

        {/* Loading */}
        {isPending && (
          <div className="rounded-2xl bg-white dark:bg-zinc-800 shadow-sm px-4 py-6 text-center text-sm text-zinc-400 dark:text-zinc-500">
            Analyzing conditions...
          </div>
        )}

        {/* Answer */}
        {answer && !isPending && (
          <div className="rounded-2xl bg-white dark:bg-zinc-800 shadow-sm overflow-hidden">
            <div className="h-1 w-full bg-gradient-to-r from-sky-400 to-orange-400" />
            <div className="p-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-3">
                Answer
              </p>
              <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">
                {answer}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
