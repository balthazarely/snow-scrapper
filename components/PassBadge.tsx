import Image from "next/image";

type Props = {
  pass: "Epic" | "Ikon" | null;
};

export default function PassBadge({ pass }: Props) {
  if (!pass) return null;

  return (
    <Image
      src={`/${pass}.png`}
      alt={`${pass} Pass`}
      width={20}
      height={8}
      className="object-contain"
    />
  );
}
