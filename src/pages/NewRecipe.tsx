import React from 'react';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Link, useNavigate } from 'react-router-dom';
import { PrimeIcons } from 'primereact/api';
import { InputNumber } from 'primereact/inputnumber';
import { AutoComplete } from 'primereact/autocomplete';
import { Toast } from 'primereact/toast';
import { Ingredient, Recipe } from '../shared/interfaces';
import { useState } from 'react';
import { Badge } from 'primereact/badge';
import { useContext } from 'react';
import { GlobalContext } from '../store';
import { useEffect } from 'react';
import { HttpService } from '../shared/services/http.service';
import { useRef } from 'react';

export const NewRecipe: React.FC = () => {

    const globalCtx = useContext(GlobalContext);

    const recipes = globalCtx.recipes;

    const resources = globalCtx.resources;

    const navigate = useNavigate();

    const [isSubmitted, setIsSubmitted] = useState(false);

    const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);

    const [recipeName, setRecipeName] = useState('');

    const [price, setPrice] = useState(0);

    const [produceQuantity, setProduceQuantity] = useState(1);

    const [imageUrl, setImageUrl] = useState('');

    const [selectedIngredient, setSelectedIngredient] = useState<Ingredient>();

    const [addedIngredients, setAddedIngredients] = useState<Ingredient[]>([]);

    const [quantity, setQuantity] = useState(1);

    const [ingredients, setIngredients] = useState<Ingredient[]>([]);

    const [recipesAndResources, setRecipesAndResources] = useState<Recipe[]>();

    const [navigateAwayLink, setNavigateAwayLink] = useState('/');

    const toast = useRef<Toast>();

    useEffect(() => {
        setFilteredRecipes(recipes.concat(resources));
        setRecipesAndResources(recipes.concat(resources));
    }, [recipes, resources]);

    function addIngredient(): void {
        // Add only unique and not existing
        if (selectedIngredient.name && !ingredients.some(i => i.name.toLowerCase() === selectedIngredient.name?.toLowerCase())) {
            const newIngredient: Ingredient = {
                name: selectedIngredient.name,
                quantity: quantity > 10 ? 10 : quantity <= 0 ? 1 : quantity,
                imageUrl: selectedIngredient.imageUrl
            };
            setIngredients((current) => current.concat(newIngredient));
            setAddedIngredients((current) => current.concat(newIngredient));
        }

        setSelectedIngredient(null);
        setQuantity(1);
    }

    function removeIngredient(name: string): void {
        setAddedIngredients((current) => current.filter(item => item.name.toLowerCase() !== name.toLowerCase()));
        setIngredients((current) => current.filter(item => item.name.toLowerCase() !== name.toLowerCase()));
    }

    function searchRecipe(event: { query: string; }): void {
        let filtered: Recipe[] = [];

        recipesAndResources.forEach((recipe) => {
            const regex = new RegExp(event.query, 'gi');

            if (regex.test(recipe.name.toLowerCase())) {
                if (!addedIngredients.some(i => i.name.toLowerCase() === recipe.name.toLowerCase())) {
                    filtered.push(recipe);
                }
            }
        });

        setFilteredRecipes(filtered);
    }

    function handleFormSubmit(e: React.FormEvent): void {
        e.preventDefault();

        if (isSubmitted) { return; }

        setIsSubmitted(true);

        const newRecipe: Recipe = {
            name: recipeName,
            price,
            quantity: 0,
            produceQuantity,
            imageUrl,
            ingredients
        };

        if (newRecipe) {

            if (newRecipe.ingredients?.length || newRecipe.price) {
                HttpService.addRecipe(newRecipe)
                    .then((response) => {
                        const data = response?.data;
                        if (data) {
                            globalCtx.addRecipe(data);
                            setNavigateAwayLink('/recipes');
                            toast.current.show({
                                severity: 'success',
                                summary: 'New recipe added',
                                detail: data.name
                            });
                        }
                    });
            }

            // raw material identified, add to resource
            if (!newRecipe.ingredients?.length && !newRecipe.price) {
                HttpService.addResource(newRecipe)
                    .then(response => {
                        const data = response?.data;
                        if (data) {
                            globalCtx.addResource(data);
                            setNavigateAwayLink('/');
                            toast.current.show({
                                severity: 'success',
                                summary: 'New resource added',
                                detail: data.name
                            });
                        }
                    });
            }
        }
    }

    function navigateAway(): void {
        navigate(navigateAwayLink, { replace: true });
    }

    const contentAddIngredient = () => {
        const btnClass = selectedIngredient ? 'p-button-primary' : 'p-button-secondary';

        return (
            <>
                <div className='col-12 md:col-6'>
                    <label htmlFor='ingredient' className='block mb-2'>Ingredient</label>
                    <div className='p-inputgroup'>
                        <AutoComplete field='name' suggestions={filteredRecipes} completeMethod={searchRecipe} onChange={(e) => setSelectedIngredient(e.value)} value={selectedIngredient} />
                        <Button icon={PrimeIcons.CHECK} className={btnClass} onClick={addIngredient} disabled={!selectedIngredient} type='button' />
                    </div>
                </div>
                <div className='col-12 md:col-offset-2 md:col-4'>
                    <label htmlFor='ingredient' className='block mb-2'>Ingredient Quantity</label>
                    <div className='p-inputgroup'>
                        <InputNumber id='quantity' mode='decimal' max={10} min={0} value={quantity} onChange={(e) => setQuantity(e.value)} />
                    </div>
                </div>
            </>
        );
    };

    return (
        <div className='mt-0 md:mt-3'>

            <Toast ref={toast} position='top-center' onHide={navigateAway} />

            <Link to='/recipes'>
                <Button label='Back to Recipes' icon={PrimeIcons.ANGLE_LEFT} className='p-button-text p-button-plain p-button-rounded' />
            </Link>

            <header className='flex justify-content-center md:block'>
                <h1>Add a new {ingredients.length ? 'recipe' : 'resource'}</h1>
            </header>

            <Card>
                <form className='grid' onSubmit={handleFormSubmit}>
                    <div className='col-12 md:col-6'>
                        <label htmlFor='name' className='block mb-2'>Name</label>
                        <InputText id='name' className='block' required onChange={(e) => setRecipeName(e.currentTarget.value)} />
                    </div>
                    <div className='col-6 md:col-3'>
                        <label htmlFor='price' className='block mb-2'>Price</label>
                        <InputNumber id='price' mode='decimal' min={0} value={0} required onChange={(e) => setPrice(e.value)} />
                    </div>
                    <div className='col-6 md:col-3'>
                        <label htmlFor='produceQuantity' className='block mb-2'>Produce Quantity</label>
                        <InputNumber id='produceQuantity' mode='decimal' max={10} min={1} value={1} required onChange={(e) => setProduceQuantity(e.value)} />
                    </div>
                    <div className='col-12'>
                        <label htmlFor='imageUrl' className='block mb-2'>Image URL</label>
                        <InputText id='imageUrl' className='block' type='url' onChange={(e) => setImageUrl(e.currentTarget.value)} />
                    </div>

                    {recipesAndResources?.length ? contentAddIngredient() : null}

                    {
                        ingredients.map(ingredient => (
                            <div className='col-12 fadein flex align-items-center' key={ingredient.name}>
                                <Button
                                    icon={PrimeIcons.TRASH}
                                    className='mr-2 p-button-text p-button-rounded p-button-danger'
                                    onClick={() => removeIngredient(ingredient.name)}
                                />
                                <Badge value={ingredient.quantity} className={ingredient.quantity > 0 ? 'bg-primary' : 'surface-500'} />
                                <img className='ml-3 border-circle' src={ingredient.imageUrl} alt={ingredient.name} width='50rem' />
                                <span className='ml-3'>{ingredient.name}</span>
                            </div>
                        ))
                    }

                    <div className='flex justify-content-center md:justify-content-end mt-3 px-3 w-full'>
                        <Button
                            icon={PrimeIcons.SEND}
                            label={ingredients.length ? 'Add recipe' : 'Add resource'}
                            className='p-button-rounded'
                            disabled={isSubmitted || !!selectedIngredient}
                            loading={isSubmitted}
                        />
                    </div>

                </form>
            </Card>
        </div>
    );
};