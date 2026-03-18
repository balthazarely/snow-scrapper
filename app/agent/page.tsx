import AIAgent from "@/components/AiAgent";

export default function AgentPage() {
  return (
    <div className="bg-slate-100 min-h-full pb-[calc(5rem+env(safe-area-inset-bottom)+1rem)] p-4">
      <h1 className="text-xl font-bold text-zinc-900">Snow Agent</h1>
      <p className="mt-0.5 text-sm text-zinc-500">
        Ask our AI any questions you have.
      </p>
      <AIAgent />
    </div>
  );
}
