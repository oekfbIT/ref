import React, { useState } from 'react';
import PropTypes from 'prop-types';

const KaderInfoTabsNav = ({ variant = 'kader' }) => {
    const [active, setActive] = useState('profile');

    return (
        <div className="d-grid col-2">
            <button className={`btn--switch ${active === 'profile' && 'active'} ${variant} `}
                    onClick={() => setActive('profile')}>
                <span className="p-relative z-2">
                    Profile
                </span>
            </button>
            <button className={`btn--switch ${active === 'stats' && 'active'} ${variant} `}
                    onClick={() => setActive('stats')}>
                <span className="p-relative z-2">
                    Stats
                </span>
            </button>
        </div>
    )
}

KaderInfoTabsNav.propTypes = {
    variant: PropTypes.oneOf(['kader', 'alt'])
};

export default KaderInfoTabsNav;
