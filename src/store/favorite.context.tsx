import React from 'react';
import { useState } from 'react';
import { createContext } from 'react';
import { Recipe } from '../shared/interfaces';

// ? How to determine if we should seperate a React Context
// ! Favorites has been removed out of the Global Context
// * This is because RawMaterialManager has a setInterval inside the useEffect
// * AND its useEffect depends on the GlobalCtx
// * SO if favorite is still part of Global Context ...
// * AND if every time favorite[] is changed, Global Context will rerun and reset the interval 
// * ..which leads to not firing the interval delay since it is always restarted

export interface FavoriteContextType {
    favorites: Recipe[];
    toggleFavorite: (recipe: Recipe) => void;
}

export const FavoriteContext: React.Context<FavoriteContextType> = createContext({
    favorites: [],
    toggleFavorite: () => { }
});

export const FavoriteProvider: React.FC<{ children: React.ReactNode; }> = ({ children }) => {

    const [favorites, setFavorites] = useState<Recipe[]>([]);

    function toggleFavorite(recipe: Recipe): void {

        if (favorites.some(r => r._id === recipe._id)) {
            setFavorites(current => current.filter(r => r._id !== recipe._id));
        } else {
            setFavorites(current => current.concat(recipe));
        }
    }

    const context: FavoriteContextType = {
        favorites,
        toggleFavorite
    };

    return (
        <FavoriteContext.Provider value={context}>
            {children}
        </FavoriteContext.Provider>
    );
};