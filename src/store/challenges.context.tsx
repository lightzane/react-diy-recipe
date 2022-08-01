import { Toast } from 'primereact/toast';
import React, { createContext } from 'react';
import { useContext } from 'react';
import { useRef } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { Challenge, Recipe } from '../shared/interfaces';
import { GlobalContext } from './global.context';

export const MAX_CHALLENGES = 5;

export interface ChallengesContextType {
    challenges: Challenge[];
    updateChallenge: () => void;
    removeChallenge: (recipeId: string) => void;
    updateProgress: (challenge: Challenge) => void;
}

export const ChallengesContext: React.Context<ChallengesContextType> = createContext({
    challenges: [],
    updateChallenge: () => { },
    removeChallenge: () => { },
    updateProgress: () => { }
});

export const ChallengesProvider: React.FC<{ children: React.ReactNode; }> = ({ children }) => {

    const globalCtx = useContext(GlobalContext);

    const recipes = globalCtx.recipes;

    const [challenges, setChallenges] = useState<Challenge[]>([]);

    const toast = useRef<Toast>();

    useEffect(() => {
        updateChallenge();
        // We recommend using the exhaustive-deps rule as part of our eslint-plugin-react-hooks package. It warns when dependencies are specified incorrectly and suggests a fix.
    }, [recipes]); // eslint-disable-line react-hooks/exhaustive-deps

    const updateChallenge = () => {

        if (challenges.length === MAX_CHALLENGES) {
            return;
        }

        if (recipes.length < MAX_CHALLENGES) {
            recipes.forEach(recipe => {
                nominateChallenge(recipe);
            });
        }

        else if (recipes.length > MAX_CHALLENGES) {
            recipes.forEach(recipe => {
                nominateChallenge(recipe, true);
            });
        }
    };

    const nominateChallenge = (recipe: Recipe, chance = false) => {

        if (challenges.some(r => r.recipeId === recipe._id && r.progress < r.goal)) {
            // already exists 
            return;
        }

        let nominateChance = 1;

        if (chance) {
            nominateChance = Math.random();
        }

        const goal = Math.floor(Math.random() * recipe.produceQuantity * 3 + recipe.produceQuantity);

        const challenge: Challenge = {
            id: Date.now().toString().replace(/./g, () => Math.floor(Math.random() * 16).toString(16)),
            recipeId: recipe._id,
            progress: 0,
            goal,
            description: `Create ${goal} ${recipe.name}`,
            imageUrl: recipe.imageUrl
        };

        // odds to 50%
        if (nominateChance > 0.5 && challenges.length < MAX_CHALLENGES) {
            setChallenges(current => current.concat(challenge));
        }
    };

    const removeChallenge = (recipeId: string) => {
        setChallenges(current => current.filter(c => c.recipeId !== recipeId));
    };

    const updateProgress = (challenge: Challenge) => {

        if (challenge.progress >= challenge.goal) {
            setChallenges(current => current.filter(c => c.id !== challenge.id));
            updateChallenge();
            toast.current.show({
                summary: 'Challenge completed',
                detail: challenge.description,
                severity: 'info'
            });
        } else {
            const newState = challenges.map(c => {
                if (c.id === challenge.id) {
                    return challenge;
                }
                return c;
            });
            setChallenges(newState);
        }
    };

    const context: ChallengesContextType = {
        challenges,
        updateChallenge,
        removeChallenge,
        updateProgress
    };

    return <ChallengesContext.Provider value={context}>
        <Toast position='bottom-right' ref={toast} />
        {children}
    </ChallengesContext.Provider>;
};
