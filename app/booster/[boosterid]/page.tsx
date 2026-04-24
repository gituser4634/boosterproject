import { BoosterProfileView } from "@/components/booster/booster-profile-view";

interface Props {
  params: {
    boosterid: string;
  };
}

export default function BoosterProfilePage({ params }: Props) {
  // Pass the boosterid as username for now to display it
  return <BoosterProfileView username={params.boosterid} />;
}
