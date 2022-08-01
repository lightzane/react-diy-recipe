import React from 'react';
import { Button } from 'primereact/button';
import { ProgressBar } from 'primereact/progressbar';
import { Recipe } from '../../shared/interfaces';
import { GlobalContext, MAX_ITEM_CAPACITY } from '../../store';
import { ResourceItem } from '../resource-item/ResourceItem';
import { useContext } from 'react';
import { HttpService } from '../../shared/services/http.service';
import { useState } from 'react';

interface Props {
    recipe: Recipe;
    onGiveAway?: (_id: string) => void;
}

export const RawMaterial: React.FC<Props> = ({ recipe, onGiveAway }) => {

    const globalCtx = useContext(GlobalContext);

    const v = recipe.quantity * MAX_ITEM_CAPACITY;

    const displayValueTemplate = (value: number) => {

        if (v === 100) {
            return (<>FULL</>);
        }

        return (<>
            {value / MAX_ITEM_CAPACITY} / <b>{MAX_ITEM_CAPACITY}</b>
        </>);
    };

    const footer = () => {
        return (<div className='grid justify-content-center'>
            <Button
                onClick={() => onGiveAway(recipe._id)}
                label='Give Away'
                className='p-button-text p-button-danger p-button-rounded m-0'
            />
        </div>);
    };

    const [removeClicked, setRemoveClicked] = useState(false);

    function removeResource(): void {
        setRemoveClicked(true);
        HttpService.removeResource(recipe._id)
            .then(response => {
                if (response.data) {
                    globalCtx.giveAwayResource(recipe._id);
                    globalCtx.removeResource(recipe._id);
                    setRemoveClicked(false);
                }
            });
    }

    return (
        <ResourceItem recipe={recipe} footer={footer} showRemoveButton={!removeClicked} onRemoveButtonClick={removeResource}>
            <ProgressBar
                color={v === 100 ? 'var(--pink-300)' : 'var(--primary-color)'}
                value={recipe.quantity * MAX_ITEM_CAPACITY}
                className='w-full mx-3'
                displayValueTemplate={displayValueTemplate}
            />
        </ResourceItem>
    );
};