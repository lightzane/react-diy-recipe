import React from 'react';
import style from './RecipeItem.module.scss';
import { Card } from 'primereact/card';
import { Ingredient, Recipe } from '../../shared/interfaces';
import { Badge } from 'primereact/badge';
import { Button } from 'primereact/button';
import { PrimeIcons } from 'primereact/api';
import { Dialog } from 'primereact/dialog';
import { useState } from 'react';
import { useContext } from 'react';
import { GlobalContext } from '../../store';
import { HttpService } from '../../shared/services/http.service';
import { useRef } from 'react';
import { Toast } from 'primereact/toast';
// import { useNavigate } from 'react-router-dom';
import { FavoriteContext } from '../../store/favorite.context';
import { AxiosResponse } from 'axios';
import { ChallengesContext } from '../../store/challenges.context';

type MyDialogType = 'displayDialog';

interface Props {
    /** Should usually come from the `Recipes` list (other lists are: `Inventory` and `Resources`) */
    recipe: Recipe;
}

export const RecipeItem: React.FC<Props> = ({ recipe }) => {

    const globalCtx = useContext(GlobalContext);

    const favoriteCtx = useContext(FavoriteContext);

    const challengeCtx = useContext(ChallengesContext);

    // const navigate = useNavigate();

    const inventory = globalCtx.inventory;

    const resources = globalCtx.resources;
    /** Merged list of `inventory` and `resources` */
    const stock = [...inventory, ...resources];

    const [isFavorite, setIsFavorite] = useState(!!recipe.isFavorite);

    const toast = useRef<Toast>();

    const [created, setCreated] = useState(false);

    const [isRemoveClicked, setIsRemoveClicked] = useState(false);

    const [displayDialog, setDisplayDialog] = useState(false);

    const [missingIngredients, setMissingIngredients] = useState<Ingredient[]>([]);

    const dialogFuncMap = {
        'displayDialog': setDisplayDialog
    };

    const dialogOnClick = (name: MyDialogType) => {
        dialogFuncMap[name](true);
    };

    const dialogOnHide = (name: MyDialogType) => {
        dialogFuncMap[name](false);
    };

    const header = () => <>
        <Badge
            value='-'
            className={'remove-button bg-red-400 ' + (isRemoveClicked && 'hidden')}
            onClick={removeRecipe}
        />
    </>;

    function removeRecipe(): void {
        setIsRemoveClicked(true);
        HttpService.removeRecipe(recipe._id)
            .then(response => {
                if (response.data) {
                    globalCtx.removeRecipe(recipe._id);
                    challengeCtx.removeChallenge(recipe._id);
                    if (isFavorite) {
                        favoriteCtx.toggleFavorite(recipe);
                    }
                    setIsRemoveClicked(false);
                }
            });
    }

    function toggleFavorite(): void {
        recipe.isFavorite = !isFavorite;
        favoriteCtx.toggleFavorite(recipe);
        globalCtx.updateRecipe(recipe);
        setIsFavorite(recipe.isFavorite);
    }

    function create(): void {
        setCreated(true);
        recipe.quantity = recipe.produceQuantity;

        const successResponse = (response: AxiosResponse<Recipe>, action: (data: any) => void) => {
            const data = response?.data;
            if (data) {
                action(data);
                // consume resources and items in inventory
                data.ingredients.forEach(ingredient => {
                    resources.map(resource => {
                        if (resource.name.toLowerCase() === ingredient.name.toLowerCase()) {
                            resource.quantity -= ingredient.quantity;
                        }
                        return resource;
                    });
                    inventory.map(item => {
                        if (item.name.toLowerCase() === ingredient.name.toLowerCase()) {
                            item.quantity -= ingredient.quantity;
                            if (item.quantity === 0) {
                                HttpService.removeItem(item._id);
                                globalCtx.removeItem(item._id);
                            } else {
                                HttpService.updateItem(item);
                            }
                        }
                        return item;
                    });
                });
                globalCtx.updateResourceCapacity();

                const challenge = challengeCtx.challenges.find(c => c.recipeId === data.recipeId);
                challenge.progress += data.produceQuantity;

                // update progress in challenges
                challengeCtx.updateProgress(challenge);

                // toast may be undefined since Toast is only declared on this 'page' component
                // it may be undefined when user quickly switch page
                toast?.current?.show({
                    summary: 'Recipe created',
                    detail: data.name,
                    severity: 'success'
                });
            }
            setCreated(false);
        };

        const missingIngredients = checkMissingIngredients(recipe);

        if (missingIngredients.length) {
            setMissingIngredients(missingIngredients);
            dialogOnClick('displayDialog');
            setCreated(false);
            return;
        }

        // check if item is existing
        const existingItem = inventory.find(item => item.recipeId === recipe._id);

        if (existingItem) {
            existingItem.quantity += recipe.quantity;
            HttpService.updateItem(existingItem)
                .then(response => {
                    successResponse(response, globalCtx.updateItem);
                });
        } else {
            recipe.recipeId = recipe._id;
            HttpService.addItem(recipe)
                .then(response => {
                    successResponse(response, globalCtx.addItem);
                });
        }
    }

    function checkMissingIngredients(recipe: Recipe): Ingredient[] {
        const missingIngredients: Ingredient[] = [];

        recipe.ingredients.forEach(ingredient => {
            const missingIngredient = { ...ingredient };
            const itemInStock = stock.find(item => item.name.toLowerCase() === ingredient.name.toLowerCase());

            const qty = itemInStock?.quantity - ingredient.quantity || ingredient.quantity;

            if (itemInStock && qty < 0) {
                // check quantity
                missingIngredient.quantity = Math.abs(qty);
                missingIngredients.push(missingIngredient);
            } else if (!itemInStock || qty === 0) {
                missingIngredients.push(missingIngredient);
            }
        });

        return missingIngredients;
    }

    function navigateToHome(): void {
        // navigate('/', { replace: true });
    }

    return (
        <Card className={'resource-item ' + style.class} header={header}>
            <Toast position='top-center' onHide={navigateToHome} ref={toast} />
            <Dialog dismissableMask className={style.class} header='Missing Ingredients' visible={displayDialog} onHide={() => dialogOnHide('displayDialog')}>
                <ul className='p-0'>
                    {
                        missingIngredients.map(ingredient => (
                            <li key={ingredient.name} className='flex align-items-center justify-content-between'>
                                <span className='flex align-items-center'>
                                    <img alt={ingredient.name} src={ingredient.imageUrl} width='20rem' />
                                    <span className='ml-2'>{ingredient.name}</span>
                                </span>
                                <span><Badge value={ingredient.quantity} severity='danger' /></span>
                            </li>
                        ))
                    }
                </ul>
            </Dialog>
            <h3 className='m-0'>{recipe.name}</h3>
            <img alt={recipe.name} src={recipe.imageUrl} className='border-round mx-auto block mt-3' width='100rem' />
            <div className='flex mt-3 justify-content-between'>
                <Button
                    label='Create'
                    icon={PrimeIcons.BOLT}
                    loading={created}
                    disabled={created || isRemoveClicked}
                    className='p-button-info p-button-rounded p-button-sm'
                    onClick={create}
                />
                <Button
                    icon={isFavorite ? PrimeIcons.HEART_FILL : PrimeIcons.HEART}
                    className={'p-button-rounded p-button-sm ' + (isFavorite ? 'p-button-danger' : 'p-button-outlined p-button-help')}
                    disabled={isRemoveClicked}
                    onClick={toggleFavorite}
                />
            </div>
            <div className='mt-3'>
                <span className='mr-3'>Produce Qty</span>
                <Badge value={recipe.produceQuantity} className='surface-400' />
            </div>
            <div className='text-center mt-1'>
                <ul className='p-0'>
                    {
                        recipe.ingredients.map(ingredient => (
                            <li key={ingredient.name} className='flex align-items-center justify-content-between mb-2'>
                                <span className='flex align-items-center'>
                                    <img alt={ingredient.name} src={ingredient.imageUrl} width='25rem' className='border-circle' />
                                    <span className='ml-2'>{ingredient.name}</span>
                                </span>
                                <span>
                                    <Badge className='mr-2' value={'x ' + ingredient.quantity} />
                                </span>
                            </li>
                        ))
                    }
                </ul>
            </div>
        </Card>
    );
};