import React from 'react';
import { Inventory } from '../components/inventory/Inventory';
import { Resources } from '../components/resources/Resources';

export const Home: React.FC = () => {
    return (
        <div>
            <Resources />
            <Inventory />
        </div>
    );
};