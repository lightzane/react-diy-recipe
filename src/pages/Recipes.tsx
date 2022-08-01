import React, { useContext } from 'react';
import { PrimeIcons } from 'primereact/api';
import { Button } from 'primereact/button';
import { Link } from 'react-router-dom';
import { ItemSkeleton } from '../components/item-skeleton/ItemSkeleton';
import { RecipeItem } from '../components/recipe-item/RecipeItem';
import { GlobalContext } from '../store';


export const Recipes: React.FC = () => {

    const globalCtx = useContext(GlobalContext);
    const recipes = globalCtx.recipes;

    const addTemplate =
        <>
            <div className='flex justify-content-center md:justify-content-start mt-3'>
                <Link to='/new-recipe'>
                    <Button label='New Recipe' icon={PrimeIcons.PLUS} className='p-button-rounded' />
                </Link>
            </div>
        </>;

    const itemTemplate =
        <>
            {addTemplate}
            <div className='grid mt-3'>
                {
                    recipes.map(item => (
                        <div className='col-12 md:col-6 lg:col-4' key={item._id}>
                            <RecipeItem recipe={item} key={item._id} />
                        </div>
                    ))
                }
            </div>
        </>;

    const emptyTemplate =
        <>
            <div className='flex flex-column mt-8 pt-8 align-items-center'>
                <h2 className='mb-0'>Nothing here</h2>
                <p className='mb-0'>Start adding a recipe now!</p>
                {addTemplate}
            </div>
        </>;

    const content = globalCtx.isLoadingRecipes ?
        <ItemSkeleton className='mt-3' /> : recipes?.length ?
            itemTemplate : emptyTemplate;

    return (
        <div>
            {content}
        </div>
    );
};