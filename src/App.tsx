import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { MainNavigation } from './components/main-navigation/MainNavigation';
import { Challenges } from './pages/Challenges';
import { Favorites } from './pages/Favorites';
import { Home } from './pages/Home';
import { NewRecipe } from './pages/NewRecipe';
import { Recipes } from './pages/Recipes';

export const App: React.FC = () => {
  return (
    <div className='grid justify-content-center'>
      <div className='col-12 p-0'>
        <MainNavigation />
      </div>
      <div className='col-12 md:col-8'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/new-recipe' element={<NewRecipe />} />
          <Route path='/recipes' element={<Recipes />} />
          <Route path='/favorites' element={<Favorites />} />
          <Route path='/challenges' element={<Challenges />} />
        </Routes>
      </div>
    </div>
  );
};
