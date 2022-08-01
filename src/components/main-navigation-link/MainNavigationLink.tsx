import React from 'react';
import { Badge, BadgeSeverityType } from 'primereact/badge';
import { NavLink } from 'react-router-dom';

interface Props {
    label: string;
    url?: string;
    className?: string;
    icon?: string;
    labelClassName?: string;
    badgeValue?: number;
    severity?: BadgeSeverityType;
}

export const MainNavigationLink: React.FC<Props> = ({ url, className, icon, label, labelClassName, badgeValue, severity = 'info' }) => {

    const isBadge = badgeValue >= 0;

    return (
        <NavLink to={url} className={className}>
            <span className={icon}></span>
            <span className={labelClassName + ' ml-2'}>{label}</span>
            {isBadge && <Badge className={'ml-2 ' + (badgeValue === 0 && 'hidden')} value={badgeValue} severity={severity} />}
        </NavLink>
    );
};