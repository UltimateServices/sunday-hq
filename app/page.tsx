import { CommandCenter } from "@/components/command-center/CommandCenter";
import { buildCommandCenter } from "@/lib/command-center";

export default function HomePage() {
  const vm = buildCommandCenter();
  return <CommandCenter vm={vm} />;
}
