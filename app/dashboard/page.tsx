import { CommandCenter } from "@/components/command-center/CommandCenter";
import { buildCommandCenter } from "@/lib/command-center";

export default function DashboardPage() {
  return <CommandCenter vm={buildCommandCenter()} />;
}
