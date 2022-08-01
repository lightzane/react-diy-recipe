import React from 'react';
import { Card } from 'primereact/card';
import { Skeleton } from 'primereact/skeleton';

export const ItemSkeleton: React.FC<{ className?: string; }> = ({ className }) => {
    const skeleton = () => {
        return (
            <div className='col-12 md:col-6 lg:col-4'>
                <Card className='raw-material'>
                    <Skeleton width='10rem' height='2rem' />
                    <div className='grid mt-1 align-items-center'>
                        <div className='col-2 col-offset-1'>
                            <Skeleton width='2rem' height='2rem' />
                        </div>
                        <div className='col-9'>
                            <Skeleton className='mx-3' width='70%' />
                        </div>
                        <div className='col-12 flex justify-content-center'>
                            <Skeleton width='50%' height='2rem' />
                        </div>
                    </div>
                </Card>
            </div>
        );
    };

    return (
        <div className={'grid ' + className}>
            {skeleton()}
            {skeleton()}
            {skeleton()}
        </div>
    );
};