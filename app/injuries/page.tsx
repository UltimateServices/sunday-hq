import { PageHeader } from "@/components/shared/PageHeader";
import { InjuriesBoard } from "@/components/boards/InjuriesBoard";

export default function InjuriesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        layer="Research board"
        title="Injuries"
        lede="Exact health vocabulary only. Never 100% healthy. SOURCE CONFLICT is a first-class state. Practice trend is parsed from seed copy — not a new report."
      />
      <InjuriesBoard />
    </div>
  );
}
