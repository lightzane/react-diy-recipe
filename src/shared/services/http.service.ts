import axios, { AxiosResponse } from 'axios';
import { Recipe } from '../interfaces';

const API = 'https://lightzane-db.herokuapp.com/react-diy-recipe-56781';
const COLLECTION_RECIPE = `${API}-recipes`;
const COLLECTION_INVENTORY = `${API}-inventory`;
const COLLECTION_RESOURCES = `${API}-resources`;

export class HttpService {
    /** 
     * Store recipe in `Recipes` collection
     * @param recipe the recipe to store
     * @returns the created recipe
     */
    static addRecipe(recipe: Recipe): Promise<AxiosResponse<Recipe>> {
        return axios.post<Recipe>(COLLECTION_RECIPE, recipe);
    }

    /** Retrieve recipes from `Recipes` collection */
    static getAllRecipes(): Promise<AxiosResponse<Recipe[]>> {
        return axios.get<Recipe[]>(COLLECTION_RECIPE);
    }

    /**
     * Remove the recipe out of the `Recipe` collection
     * @param _id the _id of the recipe to be deleted
     * @returns the deleted recipe
     */
    static removeRecipe(_id: string): Promise<AxiosResponse<Recipe>> {
        return axios.delete<Recipe>(`${COLLECTION_RECIPE}/${_id}`);
    }

    /**
     * Store item in `Inventory` collection
     * @param recipe the item to store
     * @returns the created item
     */
    static addItem(recipe: Recipe): Promise<AxiosResponse<Recipe>> {
        return axios.post<Recipe>(COLLECTION_INVENTORY, recipe);
    }

    /** Retrive all items in the `Inventory` collection */
    static getAllInventory(): Promise<AxiosResponse<Recipe[]>> {
        return axios.get<Recipe[]>(COLLECTION_INVENTORY);
    }

    /**
     * Update an existing item in the `Inventory` collection
     * @param recipe the item to update
     * @returns the updated item
     */
    static updateItem(recipe: Recipe): Promise<AxiosResponse<Recipe>> {
        return axios.patch<Recipe>(COLLECTION_INVENTORY, recipe);
    }

    /**
     * Remove an item out from the `Inventory` collection
     * @param _id the _id of item to be deleted
     * @returns the deleted item
     */
    static removeItem(_id: string): Promise<AxiosResponse<Recipe>> {
        return axios.delete<Recipe>(`${COLLECTION_INVENTORY}/${_id}`);
    }

    /**
     * Add resource to `Resources` collection
     * @param recipe the resource to store
     * @returns the created resource
     */
    static addResource(recipe: Recipe): Promise<AxiosResponse<Recipe>> {
        return axios.post<Recipe>(COLLECTION_RESOURCES, recipe);
    }

    /**
     * Remove the resource from the `Resources` collection
     * @param _id the _id of the resource to delete
     * @returns the deleted resource
     */
    static removeResource(_id: string): Promise<AxiosResponse<Recipe>> {
        return axios.delete<Recipe>(`${COLLECTION_RESOURCES}/${_id}`);
    }

    /** Retrieve all resources from `Resources` collection */
    static getAllResources(): Promise<AxiosResponse<Recipe[]>> {
        return axios.get<Recipe[]>(COLLECTION_RESOURCES);
    }
}

