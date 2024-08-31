import React, { useEffect, useState } from 'react';
import PageHeader from '@layout/PageHeader';
import AddPlayerForm from "@widgets/AddPlayer/AddPlayerForm";
import AppGrid from "@layout/AppGrid";
import AuthService from "../network/AuthService";

const AddPlayerPage = () => {
    const authService = new AuthService();
    const [teamID, setTeamID] = useState("");

    useEffect(() => {
        if (authService.isAuthenticated()) {
            const storedTeamID = authService.getTeamID();
            if (storedTeamID) {
                setTeamID(storedTeamID);
            }
        }
    }, [authService]);

    const widgets = {
        form: <AddPlayerForm teamID={teamID} />
    };

    return (
        <>
            <PageHeader title="Spieler Anmelden" />
            <AppGrid id="addPlayer" widgets={widgets} />
        </>
    );
};

export default AddPlayerPage;
