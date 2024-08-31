import React, { useEffect, useState } from 'react';
import PageHeader from '@layout/PageHeader';
import AddPlayerForm from "@widgets/AddPlayer/AddPlayerForm";
import AppGrid from "@layout/AppGrid";
import AuthService from "../network/AuthService";
import UpdateTeamForm from "@widgets/UpdateTeam/UpdateTeamForm";

const UpdateTeamPage = () => {
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
        form: <UpdateTeamForm teamID={teamID} />
    };

    return (
        <>
            <PageHeader title="Kontakt Daten Aktualisieren" />
            <AppGrid id="updateTeam" widgets={widgets} />
        </>
    );
};

export default UpdateTeamPage;
