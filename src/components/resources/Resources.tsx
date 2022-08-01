import React from 'react';
import { Badge } from 'primereact/badge';
import { useContext } from 'react';
import { GlobalContext } from '../../store/global.context';
import { ItemSkeleton } from '../item-skeleton/ItemSkeleton';
import { RawMaterial } from './RawMaterial';
import { MAX_RESOURCE_CAPACITY } from '../../store';

export const Resources: React.FC = () => {

    const globalCtx = useContext(GlobalContext);
    const resources = globalCtx.resources;
    const totalResources = globalCtx.resourceCapacity;
    const additionalResources = () => {
        return (
            <div className='grid'>
                {
                    resources.map(resource => (
                        <div key={resource._id} className='col-12 md:col-6 lg:col-4'>
                            <RawMaterial key={resource._id} recipe={resource} onGiveAway={giveAwayResource} />
                        </div>
                    ))
                }
            </div>
        );
    };

    const contentResources = globalCtx.isLoadingResources ? <ItemSkeleton /> : additionalResources();

    function giveAwayResource(_id: string): void {
        globalCtx.giveAwayResource(_id);
    }

    return (
        <div>
            <h1 className='flex align-items-center justify-content-between md:justify-content-start'>
                Resources
                <Badge
                    className={'ml-3 ' + (globalCtx.isLoadingResources && 'hidden')}
                    value={totalResources >= MAX_RESOURCE_CAPACITY ? 'FULL' : totalResources}
                    size='large'
                    severity={totalResources >= MAX_RESOURCE_CAPACITY ? 'danger' : null}
                />
            </h1>
            {contentResources}
        </div>
    );
};