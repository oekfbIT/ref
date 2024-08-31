import React, { useEffect, useState } from 'react';
import PageHeader from '@layout/PageHeader';
import SetTrainerForm from "@widgets/SetTrainer/SetTrainerForm";
import AppGrid from "@layout/AppGrid";
import AuthService from "../network/AuthService";

const SetTrainerPage = () => {
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
        form: <SetTrainerForm teamID={teamID} />
    };

    return (
        <>
            <PageHeader title="Trainer Anlegen/Ändern" />
            <AppGrid id="setTrainer" widgets={widgets} />
        </>
    );
};

export default SetTrainerPage;
