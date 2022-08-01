import React, { createContext, ReactNode, useRef, useState } from 'react';
import { useEffect } from 'react';
import { Toast } from 'primereact/toast';
import { DATA_INITIAL_INVENTORY } from '../shared/data';
import { Recipe } from '../shared/interfaces';
import { HttpService } from '../shared/services/http.service';
import { MAX_RESOURCE_CAPACITY, RawMaterialManager } from './RawMaterialManager';
import { FavoriteProvider } from './favorite.context';
import { ChallengesProvider } from './challenges.context';

interface Props {
    children: ReactNode;
}

export interface GlobalContextType {
    storageCapacity: number;
    inventory: Recipe[];
    resourceCapacity: number;
    /** Contains raw materials that does not need ingredients but produced naturally */
    resources: Recipe[];
    recipes: Recipe[];
    isLoadingResources: boolean;
    isLoadingRecipes: boolean;
    isLoadingInventory: boolean;
    addItem: (recipe: Recipe) => void;
    updateItem: (recipe: Recipe) => void;
    removeItem: (_id: string) => void;
    increaseRawStorageCapacity: () => void;
    addResource: (recipe: Recipe) => void;
    updateResourceCapacity: () => void;
    removeResource: (_id: string) => void;
    giveAwayResource: (_id: string) => void;
    addRecipe: (recipe: Recipe) => void;
    updateRecipe: (recipe: Recipe) => void;
    removeRecipe: (_id: string) => void;
}

export const GlobalContext: React.Context<GlobalContextType> = createContext({
    storageCapacity: 0,
    inventory: [],
    resourceCapacity: 0,
    resources: [],
    recipes: [],
    isLoadingResources: false,
    isLoadingRecipes: false,
    isLoadingInventory: false,
    addItem: () => { },
    updateItem: () => { },
    removeItem: () => { },
    increaseRawStorageCapacity: () => { },
    addResource: () => { },
    updateResourceCapacity: () => { },
    removeResource: () => { },
    giveAwayResource: () => { },
    addRecipe: () => { },
    updateRecipe: () => { },
    removeRecipe: () => { },
});

export const GlobalProvider: React.FC<Props> = ({ children }) => {

    const [inventory, setInventory] = useState<Recipe[]>([]);
    const [resources, setResources] = useState<Recipe[]>(DATA_INITIAL_INVENTORY);
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [resourceCapacity, setResourceCapacity] = useState(0);
    const [isLoadingResources, setIsLoadingResources] = useState(true);
    const [isLoadingRecipes, setIsLoadingRecipes] = useState(true);
    const [isLoadingInventory, setIsLoadingInventory] = useState(true);
    const toast = useRef<Toast>();

    useEffect(() => {
        if (resourceCapacity >= MAX_RESOURCE_CAPACITY) {
            toast.current.show({
                summary: 'Storage for resources is full',
                detail: 'Consume items to continue producing',
                severity: 'info',
                sticky: true // disables auto close
            });
        }
    }, [resourceCapacity]);

    useEffect(() => {
        setIsLoadingResources(true);
        setIsLoadingRecipes(true);
        setIsLoadingInventory(true);

        HttpService.getAllRecipes()
            .then(response => {
                let data = response?.data;
                if (data) {
                    data = data.filter(i => i.ingredients?.length || i.price);
                    setRecipes(current => current.concat(data));
                }
                setIsLoadingRecipes(false);
            });

        HttpService.getAllResources()
            .then(response => {
                const data = response?.data;
                if (data) {
                    setResources(current => current.concat(data));
                }
                setIsLoadingResources(false);
            });

        HttpService.getAllInventory()
            .then(response => {
                const data = response?.data;
                if (data) {
                    setInventory(current => current.concat(data));
                }
                setIsLoadingInventory(false);
            });
    }, []);

    /**
     * Add an item (recipe) in the `inventory` list
     * @param recipe the recipe to be added in the list
     */
    function addItem(recipe: Recipe): void {
        setInventory(current => current.concat(recipe));
    }

    function updateItem(recipe: Recipe): void {
        const newState = inventory.map(item => {
            if (item._id === recipe._id) {
                return recipe; // updated
            } else {
                return item; // as existing
            }
        });
        setInventory(newState);
    }

    function removeItem(_id: string): void {
        setInventory(current => current.filter(i => i._id !== _id));
    }

    function increaseRawStorageCapacity(): void {
        setResourceCapacity(current => current + 1);
    }

    function addResource(recipe: Recipe): void {
        if (!recipe.ingredients?.length && !recipe.price) {
            recipe.quantity = 0;
            setResources(current => current.concat(recipe));
        }
    }

    function updateResourceCapacity(): void {
        setResourceCapacity(resources.reduce((a, b) => a + b.quantity, 0));
    }

    /**
     * Filter out and remove the resource in the `resource` list
     * @param _id the _id of the resource to be removed out from the list
     */
    function removeResource(_id: string): void {
        setResources(current => current.filter(r => r._id !== _id));
    }

    /**
     * Reset the resource quantity and reduce them from the `resourceCapacity`
     * @param _id the _id of the resource to reset quantity to 0
     */
    function giveAwayResource(_id: string): void {
        const resource = resources.find(r => r._id === _id);
        if (resource) {
            setResourceCapacity(current => current - resource.quantity);
            resource.quantity = 0;
        }
    }

    function addRecipe(recipe: Recipe): void {
        setRecipes(current => current.concat(recipe));
    }

    function updateRecipe(recipe: Recipe): void {
        const current = recipes.find(r => r._id === recipe._id);
        Object.assign(current, recipe);
        setRecipes(recipes);
    }

    function removeRecipe(_id: string): void {
        setRecipes(current => current.filter(r => r._id !== _id));
    }

    const context: GlobalContextType = {
        storageCapacity: inventory.reduce((a, b) => a + b.quantity, 0),
        inventory,
        resourceCapacity,
        resources,
        recipes,
        isLoadingResources,
        isLoadingRecipes,
        isLoadingInventory,
        addItem,
        updateItem,
        removeItem,
        increaseRawStorageCapacity,
        addResource,
        updateResourceCapacity,
        removeResource,
        giveAwayResource,
        addRecipe,
        updateRecipe,
        removeRecipe
    };

    return (
        <GlobalContext.Provider value={context}>
            <Toast position='bottom-right' ref={toast} />
            <FavoriteProvider>
                <ChallengesProvider>
                    <RawMaterialManager>
                        {children}
                    </RawMaterialManager>
                </ChallengesProvider>
            </FavoriteProvider>
        </GlobalContext.Provider>
    );
};