// MatchDetailPage.js
import React from 'react';
import { useParams } from 'react-router-dom';
import PageHeader from '@layout/PageHeader';
import AppGrid from '@layout/AppGrid';
import RefDetailContainer from '@widgets/MatchDetailContainer';

const MatchDetailPage = () => {
    const { id } = useParams();

    return (
        <>
            <PageHeader title="Match Detail" />
            <AppGrid id="matchDetail"
                     widgets={{
                         container: <RefDetailContainer id={id} />
            }} />
        </>
    );
};

export default MatchDetailPage;
