import React from 'react';
import logo from '../../logo.svg';
import style from './MainNavigation.module.scss';
import { Menubar } from 'primereact/menubar';
import { MenuItem } from 'primereact/menuitem';
import { PrimeIcons } from 'primereact/api';
import { Link } from 'react-router-dom';
import { MainNavigationLink } from '../main-navigation-link/MainNavigationLink';
import { useState } from 'react';
import { FavoriteContext } from '../../store/favorite.context';
import { useContext } from 'react';
import { ChallengesContext } from '../../store/challenges.context';

export const MainNavigation: React.FC = () => {

    const favoriteCtx = useContext(FavoriteContext);

    const challengesCtx = useContext(ChallengesContext);

    const title = 'Recipe';

    const [isLight, setIsLight] = useState(true);

    const start = (
        <Link to='/' className='hidden md:flex mr-3 align-items-center'>
            <img alt='logo' src={logo} width="50px" />
            <h2 className='m-0 cursor-pointer'>{title}</h2>
        </Link>
    );

    const end = (
        <>
            <Link to='/' className='flex md:hidden align-items-center'>
                <h2 className='m-0 cursor-pointer'>{title}</h2>
                <img alt='logo' src={logo} width="50px" />
            </Link>
        </>
    );

    const menuItem: MenuItem[] = [
        {
            label: 'Home',
            icon: PrimeIcons.HOME,
            url: '#/'
        },
        {
            label: 'Recipes',
            icon: PrimeIcons.BOOK,
            url: '#/recipes'
        },
        {
            label: 'Favorites',
            template: (item, options) => (
                <MainNavigationLink
                    url='/favorites'
                    label={item.label}
                    labelClassName={options.labelClassName}
                    className={options.className}
                    icon={PrimeIcons.STAR}
                    badgeValue={favoriteCtx.favorites.length}
                />
            )
        },
        {
            label: 'Challenges',
            icon: PrimeIcons.BOOKMARK,
            template: (item, options) => (
                <MainNavigationLink
                    url='/challenges'
                    label={item.label}
                    labelClassName={options.labelClassName}
                    className={options.className}
                    icon={PrimeIcons.BOOKMARK}
                    badgeValue={challengesCtx.challenges.length}
                    severity='warning'
                />
            ),
        },
        {
            label: 'Theme',
            icon: isLight ? PrimeIcons.MOON : PrimeIcons.SUN,
            command: () => {
                setIsLight(!isLight);
                const appTheme = document.getElementById('app-theme') as HTMLLinkElement;
                if (isLight) {
                    appTheme.href = appTheme.href.replace(/light/, 'dark');
                } else {
                    appTheme.href = appTheme.href.replace(/dark/, 'light');
                }
            }
        }
    ];

    return (
        <div className='m-0'>
            <Menubar className={style.class} model={menuItem} start={start} end={end} />
        </div>
    );
};