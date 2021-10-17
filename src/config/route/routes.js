import AirdropRoute from "../../app/Airdrop/AirdropRoute";
import MissionRoute from "../../app/Mission/MissionRoute";

const Routes = [
  {
    url: "airdrop",
    route: AirdropRoute,
    gaurd: false,
  },
  {
    url: "mission",
    route: MissionRoute,
    gaurd: false,
  },
];

export default Routes;
