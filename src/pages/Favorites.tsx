import { PrimeIcons } from 'primereact/api';
import { Button } from 'primereact/button';
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ItemSkeleton } from '../components/item-skeleton/ItemSkeleton';
import { RecipeItem } from '../components/recipe-item/RecipeItem';
import { GlobalContext } from '../store';
import { FavoriteContext } from '../store/favorite.context';

export const Favorites: React.FC = () => {

    const globalCtx = useContext(GlobalContext);

    const favoriteCtx = useContext(FavoriteContext);

    const favorites = favoriteCtx.favorites;

    const itemTemplate =
        <>
            <div className='grid mt-3'>
                {
                    favorites.map(item => (
                        <div className='col-12 md:col-6 lg:col-4' key={item._id}>
                            <RecipeItem recipe={item} />
                        </div>
                    ))
                }
            </div>
        </>;

    const emptyTemplate =
        <>
            <div className='flex flex-column mt-8 pt-8 align-items-center'>
                <h2 className='mb-0'>Nothing here</h2>
                <p>Start adding favorites now!</p>
                <Link to='/recipes'>
                    <Button label='Go to Recipes' icon={PrimeIcons.FORWARD} className='p-button-sm p-button-rounded p-button-info' />
                </Link>
            </div>
        </>;

    const content = globalCtx.isLoadingRecipes ?
        <ItemSkeleton className='mt-3' /> : favorites?.length ?
            itemTemplate : emptyTemplate;

    return (
        <div>
            <header className='flex justify-content-center md:block'>
                <h1>Favorites</h1>
            </header>
            {content}
        </div>
    );
};