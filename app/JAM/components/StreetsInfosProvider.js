// Create a context to manage streetsInfos
import {createContext, useState} from "react";

export const StreetsInfosContext = createContext();

export function StreetsInfosProvider({ children }) {
    const [streetsInfos, setStreetsInfos] = useState(new Map());
    const [update, setUpdate] = useState(0);
    const [updateFavs, setUpdateFavs] = useState(0);
    const [updateNotifications, setUpdateNotifications] = useState(0);
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);

    return (
        <StreetsInfosContext.Provider value={{ streetsInfos, setStreetsInfos,
            update, setUpdate,
            location, setLocation,
            errorMsg, setErrorMsg,
            updateFavs, setUpdateFavs,
            updateNotifications, setUpdateNotifications}}>
            {children}
        </StreetsInfosContext.Provider>
    );
}
