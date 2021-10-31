import AirdropRoute from "../../app/Airdrop/AirdropRoute";
import MissionRoute from "../../app/Mission/MissionRoute";
import WalletRoute from "../../app/Wallet/WalletRoute";
import PurchaseRoute from "../../app/Purchase/PurchaseRoute";

const Routes = [
  {
    url: "purchase",
    route: PurchaseRoute,
    gaurd: false,
  },
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
    url: "wallet",
    route: WalletRoute,
    gaurd: false,
  },
];

export default Routes;
