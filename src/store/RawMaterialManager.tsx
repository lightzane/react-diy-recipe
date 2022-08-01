import React from 'react';
import { useContext } from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { Recipe } from '../shared/interfaces';
import { GlobalContext } from './global.context';

/** Raw materials produced in seconds */
const TIME_PRODUCE_INTERVAL = 10;
/** Max storage capacity for raw materials (having NO ingredients and price) */
export const MAX_RESOURCE_CAPACITY = 50;
/** Max capacity for each invidual raw item */
export const MAX_ITEM_CAPACITY = 10;

interface Props {
    children: React.ReactNode;
}

export const RawMaterialManager: React.FC<Props> = ({ children }) => {

    const globalCtx = useContext(GlobalContext);
    const [items, setItems] = useState<Recipe[]>([]);
    const storageCapacity = globalCtx.resourceCapacity;

    useEffect(() => {
        setItems(globalCtx.resources);

        const interval = setInterval(() => {

            if (storageCapacity >= MAX_RESOURCE_CAPACITY) {
                return false;
            }

            items.forEach(item => {
                if (!item.ingredients?.length && !item.price) {
                    if (item.quantity < MAX_ITEM_CAPACITY && storageCapacity < MAX_RESOURCE_CAPACITY) {
                        item.quantity++;
                        globalCtx.increaseRawStorageCapacity();
                    }
                }
            });

        }, TIME_PRODUCE_INTERVAL * 1000);

        // ! This next line is a MUST to NOT duplicate the timer
        return () => clearInterval(interval);

    }, [globalCtx, items, storageCapacity]);

    return (
        <>
            {children}
        </>
    );
};