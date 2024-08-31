import React from 'react';
import { useParams } from 'react-router-dom';

// components
import PageHeader from '@layout/PageHeader';
import AppGrid from '@layout/AppGrid';
import UpdatePlayer from "@widgets/UpdatePlayer";

const SpielerDetail = () => {
    const { id } = useParams(); // Get the player ID from the URL parameters

    const widgets = {
        form: <UpdatePlayer playerId={id} /> // Pass the playerId to UpdatePlayer
    };

    return (
        <>
            <PageHeader title="Spieler Detail" />
            <AppGrid id="player_detail" widgets={widgets} />
        </>
    );
};

export default SpielerDetail;
