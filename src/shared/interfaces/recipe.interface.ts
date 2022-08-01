import { Ingredient } from './ingredient.interface';

export interface Recipe {
    _id?: string;
    /** The `_id` of the recipe, `IF` the recipe is `item` type (inventory), then it has to be crafted from a Recipe */
    recipeId?: string;
    name: string;
    isFavorite?: boolean;
    price: number;
    quantity: number;
    produceQuantity: number;
    imageUrl: string;
    ingredients: Ingredient[];
}