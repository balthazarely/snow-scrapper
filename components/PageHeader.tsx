type Props = {
  title: string;
  subtitle?: string;
};

export default function PageHeader({ title, subtitle }: Props) {
  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-900">{title}</h1>
      {subtitle && <p className="mt-0.5 text-sm text-zinc-400">{subtitle}</p>}
    </div>
  );
}
