import React from 'react';
import { Badge } from 'primereact/badge';
import { ItemSkeleton } from '../item-skeleton/ItemSkeleton';
import { useContext } from 'react';
import { GlobalContext } from '../../store';
import { ResourceItem } from '../resource-item/ResourceItem';
import { ProgressBar } from 'primereact/progressbar';
import { Button } from 'primereact/button';
import { Link } from 'react-router-dom';
import { PrimeIcons } from 'primereact/api';

export const Inventory: React.FC = () => {

    const globalCtx = useContext(GlobalContext);
    const inventory = globalCtx.inventory;
    const isLoading = globalCtx.isLoadingInventory;
    const storageCapacity = globalCtx.storageCapacity;

    const template = <>
        <div className='grid'>
            {
                inventory.map(item => (
                    <div key={item._id} className='col-12 md:col-6 lg:col-4'>
                        <div>
                            <ResourceItem recipe={item} footer={() => <><span>In Stock</span><Badge className='ml-2 bg-blue-300' value={item.quantity} /></>} >
                                <ProgressBar
                                    color='var(--blue-300)'
                                    className='w-full mx-3'
                                    value={(item.quantity / storageCapacity * 100).toFixed(1)}
                                />
                            </ResourceItem>
                        </div>
                    </div>
                ))
            }
        </div>
    </>;

    const emptyTemplate = <>
        <div className='flex justify-content-center'>
            <div className='text-center'>
                <h2>Nothing here</h2>
                <p>Craft some recipes!</p>
                <Link to='/recipes'>
                    <Button label='Go to Recipes' icon={PrimeIcons.FORWARD} className='p-button-info p-button-sm p-button-rounded' />
                </Link>
            </div>
        </div>
    </>;

    const content = isLoading ?
        <ItemSkeleton /> : inventory?.length ?
            template : emptyTemplate;

    return (
        <div>
            <h1 className='flex align-items-center justify-content-between md:justify-content-start'>
                Inventory
                <Badge className={'ml-3 ' + (isLoading && 'hidden')} value={globalCtx.storageCapacity} size='large' />
            </h1>
            {content}
        </div>
    );
};