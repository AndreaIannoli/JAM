import "./config/FirebaseConfig";
import RootNavigation from "./navigation/Index";
import {StreetsInfosProvider} from "./components/StreetsInfosProvider";
export default function App() {
    return (
        <StreetsInfosProvider>
            <RootNavigation />
        </StreetsInfosProvider>
    )
}
