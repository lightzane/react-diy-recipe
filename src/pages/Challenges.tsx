import React from 'react';
import { useContext } from 'react';
import { ChallengesContext } from '../store/challenges.context';
import { ChallengeItem } from '../components/challenge-item/ChallengeItem';

export const Challenges: React.FC = () => {

    const challengesCtx = useContext(ChallengesContext);

    const challenges = challengesCtx.challenges;

    return <>
        <div>
            <header className='flex justify-content-center md:block'>
                <h1>Challenges</h1>
            </header>
            <div className='grid justify-content-center'>
                {
                    challenges.map(challenge => (
                        <div key={challenge.id} className='col-12 md:col-5'>
                            <ChallengeItem challenge={challenge} />
                        </div>
                    ))
                }
            </div>
        </div>
    </>;
};