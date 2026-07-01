"use client";

import {
    createContext,
    Dispatch,
    SetStateAction,
    useContext,
    useEffect,
    useMemo,
    useState
} from "react";

type GlobalContextType = {
    userKnots: Knot[];
    setUserKnots: Dispatch<SetStateAction<Knot[]>>;
};

const GlobalContext = createContext<GlobalContextType | null>(null);

export function GlobalProvider({ children }: { children: React.ReactNode }) {
    const [userKnots, setUserKnots] = useState<Knot[]>([]);

    useEffect(() => {
        fetch("/api/knots")
            .then(res => res.json())
            .then(data => setUserKnots(data.knots ?? []))
            .catch(err => console.error("Failed to fetch knots:", err));
    }, []);

    const context = useMemo(
        () => ({
            userKnots,
            setUserKnots
        }),
        [userKnots]
    );

    return <GlobalContext.Provider value={context}>{children}</GlobalContext.Provider>;
}

export function useGlobal() {
    const ctx = useContext(GlobalContext);
    if (!ctx) throw new Error("useGlobal must be used inside GlobalProvider");
    return ctx;
}
