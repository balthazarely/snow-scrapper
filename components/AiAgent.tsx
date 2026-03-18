// components/agent/AIAgent.tsx
"use client";
import { useState } from "react";
import { useAskAgent } from "@/hooks/useAskAgent";
import { useUserPrefs } from "@/context/UserPrefsContext";
import AgentSettingsModal from "@/components/AgentSettingsModal";
import { MdTune, MdLocationOn, MdLocationOff, MdConfirmationNumber } from "react-icons/md";
import Image from "next/image";

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
              ? "border-sky-400 bg-sky-50 text-sky-700"
              : "border-zinc-200 bg-white text-zinc-500 hover:border-zinc-300"
          }`}
        >
          {prefs.pass ? (
            <Image
              src={`/${prefs.pass}.png`}
              alt={prefs.pass}
              width={prefs.pass === "Ikon" ? 16 : 22}
              height={8}
              className="object-contain"
            />
          ) : (
            <MdConfirmationNumber size={12} />
          )}
          {prefs.pass ? `${prefs.pass} Pass` : "No Pass"}
        </button>

        <button
          onClick={() => setSettingsOpen(true)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition-colors ${
            prefs.useLocation
              ? "border-sky-400 bg-sky-50 text-sky-700"
              : "border-zinc-200 bg-white text-zinc-500 hover:border-zinc-300"
          }`}
        >
          {prefs.useLocation
            ? <MdLocationOn size={12} />
            : <MdLocationOff size={12} />}
          {prefs.useLocation ? "Location On" : "Location Off"}
        </button>

        <button
          onClick={() => setSettingsOpen(true)}
          className="ml-auto flex items-center gap-1 px-2.5 py-1.5 rounded-full border border-zinc-200 bg-white text-zinc-400 hover:text-zinc-600 hover:border-zinc-300 transition-colors"
        >
          <MdTune size={13} />
        </button>
      </div>

      {/* Main content */}
      <div className="space-y-4">
        {/* Quick questions */}
        <div className="rounded-2xl bg-white shadow-sm p-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-3">
            Quick Questions
          </p>
          <div className="flex flex-wrap gap-2">
            {QUICK_QUESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => handleAsk(q)}
                disabled={isPending}
                className="px-3 py-1.5 rounded-full border border-zinc-200 text-xs font-medium text-zinc-600 hover:border-sky-400 hover:text-sky-600 hover:bg-sky-50 transition-colors disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Input + button */}
        <div className="rounded-2xl bg-white shadow-sm p-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-3">
            Ask Anything
          </p>
          <div className="flex gap-2">
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAsk()}
              placeholder="Ask about snow conditions..."
              disabled={isPending}
              suppressHydrationWarning
              className="flex-1 rounded-xl border border-zinc-200 px-3 py-2 text-sm text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-sky-400 transition-colors disabled:opacity-50"
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
          <div className="rounded-2xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-500">
            {error.message}
          </div>
        )}

        {/* Loading */}
        {isPending && (
          <div className="rounded-2xl bg-white shadow-sm px-4 py-6 text-center text-sm text-zinc-400">
            Analyzing conditions...
          </div>
        )}

        {/* Answer */}
        {answer && !isPending && (
          <div className="rounded-2xl bg-white shadow-sm overflow-hidden">
            <div className="h-1 w-full bg-gradient-to-r from-sky-400 to-orange-400" />
            <div className="p-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-3">
                Answer
              </p>
              <p className="text-sm text-zinc-700 leading-relaxed whitespace-pre-wrap">
                {answer}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
