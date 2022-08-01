import React from 'react';
import { Card } from 'primereact/card';
import { Recipe } from '../../shared/interfaces';
import './ResourceItem.scss';
import { Badge } from 'primereact/badge';

interface Props {
    recipe: Recipe;
    children?: React.ReactNode,
    footer?: React.FC;
    showRemoveButton?: boolean;
    onRemoveButtonClick?: () => void;
}

export const ResourceItem: React.FC<Props> = ({ recipe, children, footer, showRemoveButton, onRemoveButtonClick }) => {

    const removeButtonTemplate = <>
        <Badge value='-' className='remove-button bg-red-400' onClick={onRemoveButtonClick} />
    </>;

    return (
        <Card className='resource-item' title={recipe.name} footer={footer} header={showRemoveButton && removeButtonTemplate}>
            <div className='grid'>
                <div className='col-2 col-offset-1 flex justify-content-center'>
                    <img src={recipe.imageUrl} alt={recipe.name} width='50rem' className='border-round' />
                </div>
                <div className='col-9 flex align-items-center'>
                    {children}
                </div>
            </div>
        </Card>
    );
};