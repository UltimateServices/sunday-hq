import { StubRoute } from "@/components/shared/StubRoute";

export default function MyCardPage() {
  return (
    <StubRoute
      title="My Card"
      phase={5}
      readiness="PENDING"
      lede="Persisted Sunday card with unit caps. Binding when this ships: no loss chasing and no unit inflation after early games."
    />
  );
}
