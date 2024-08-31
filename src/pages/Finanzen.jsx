import React from 'react';
import PageHeader from '@layout/PageHeader';
import AppGrid from '@layout/AppGrid';
import RechnungList from '@widgets/Finanzen/FianzenList';
import styles from './Finanzen.module.css';

const widgets = {
    match_result: <RechnungList />,
};

const Finanzen = () => {
    return (
        <>
            <PageHeader title="Finanzen" className={styles.pageHeader} />
            <AppGrid id="finanzen" className={styles.grid} widgets={widgets} />
        </>
    );
};

export default Finanzen;
