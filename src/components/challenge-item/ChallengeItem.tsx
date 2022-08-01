import React from 'react';
import { Card } from 'primereact/card';
import { ProgressBar } from 'primereact/progressbar';
import { Challenge } from '../../shared/interfaces';

interface Props {
    challenge: Challenge;
}

export const ChallengeItem: React.FC<Props> = ({ challenge }) => {

    const displayValueTemplate = () => {
        return <>
            {challenge.progress} / {challenge.goal}
        </>;
    };

    return <>
        <Card subTitle={challenge.description}>
            <div className='grid align-items-center'>
                <div className='col-3'>
                    <img src={challenge.imageUrl} alt={challenge.description} width='50rem' className='border-round' />
                </div>
                <div className='col-9'>
                    <ProgressBar
                        className='mx-3'
                        value={challenge.progress / challenge.goal * 100}
                        displayValueTemplate={displayValueTemplate}
                    />
                </div>
            </div>
        </Card>
    </>;
};