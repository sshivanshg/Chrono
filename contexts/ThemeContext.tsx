import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';

type ThemePreference = 'light' | 'dark' | 'system';
type ColorScheme = 'light' | 'dark';

interface ThemeContextType {
    theme: ThemePreference;
    setTheme: (theme: ThemePreference) => Promise<void>;
    colorScheme: ColorScheme;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'theme_preference';

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const systemColorScheme = useSystemColorScheme();
    const [theme, setThemeState] = useState<ThemePreference>('system');
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        loadThemePreference();
    }, []);

    const loadThemePreference = async () => {
        try {
            const storedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
            if (storedTheme) {
                setThemeState(storedTheme as ThemePreference);
            }
        } catch (error) {
            console.error('Failed to load theme preference:', error);
        } finally {
            setIsLoaded(true);
        }
    };

    const setTheme = async (newTheme: ThemePreference) => {
        try {
            setThemeState(newTheme);
            await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
        } catch (error) {
            console.error('Failed to save theme preference:', error);
        }
    };

    const colorScheme: ColorScheme =
        theme === 'system' ? (systemColorScheme ?? 'light') : theme;

    if (!isLoaded) {
        return null; // Or a loading spinner
    }

    return (
        <ThemeContext.Provider value={{ theme, setTheme, colorScheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
