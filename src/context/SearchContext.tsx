import {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
    ReactNode,
} from "react";
import { usePathname } from "expo-router";

interface SearchContextType {
    search: string;
    setSearch: (value: string) => void;
    debouncedSearch: string;
    isSearchEnabled: boolean;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
    const pathname = usePathname();

    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    // Enable search only on specific routes
    const allowedRoutes = ["/policy", "/renewal", "/ledger", "/ledger-detail", "/notification"];
    const isSearchEnabled = allowedRoutes.includes(pathname);

    // Debounce logic
    useEffect(() => {
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        debounceRef.current = setTimeout(() => {
            setDebouncedSearch(search);
        }, 500);

        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };
    }, [search]);

    // Reset search when route changes
    useEffect(() => {
        setSearch("");
        setDebouncedSearch("");
    }, [pathname]);

    return (
        <SearchContext.Provider
            value={{
                search,
                setSearch,
                debouncedSearch,
                isSearchEnabled,
            }}
        >
            {children}
        </SearchContext.Provider>
    );
}

export function useSearch() {
    const context = useContext(SearchContext);
    if (!context) {
        throw new Error("useSearch must be used within SearchProvider");
    }
    return context;
}
