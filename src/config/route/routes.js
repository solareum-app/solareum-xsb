import AirdropRoute from "../../app/Airdrop/AirdropRoute";
import MissionRoute from "../../app/Mission/MissionRoute";
import DeviceRoute from "../../app/Device/DeviceRoute";

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
  {
    url: "device",
    route: DeviceRoute,
    gaurd: false,
  },
];

export default Routes;
