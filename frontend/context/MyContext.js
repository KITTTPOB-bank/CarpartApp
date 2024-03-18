import { FA5Style } from '@expo/vector-icons/build/FontAwesome5';
import React, { createContext, useState } from 'react';

const MyContext = createContext();

const MyProvider = ({ children }) => {
    const [globalValue, setGlobalValue] = useState(false);
    const [globalValue1, setGlobalValue1] = useState(false);
    const [globalValue2, setGlobalValue2] = useState("");

    const [list, setlist] = useState({ frontbumper: [], backbumper: [], grille: [], headlight: [], backlight: [], door: [], mirror: [] });
    const [carcurret, setcarcurret] = useState('');

    const contextValue = {
        carcurret,
        setcarcurret,
        globalValue,
        setGlobalValue,
        globalValue1,
        setGlobalValue1,
        globalValue2,
        setGlobalValue2,
        list,
        setlist
    };

    return (
        <MyContext.Provider value={contextValue}>
            {children}
        </MyContext.Provider>
    );
};

export { MyProvider, MyContext };