// components
import PageHeader from '@layout/PageHeader';
import AppGrid from '@layout/AppGrid';
import VetragButton from "@widgets/VetragButton";
import {useEffect, useState} from "react";
import AuthService from "../network/AuthService";

const widgets = {
    merch: <VetragButton />
}

const Vetrag = () => {
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

    return (
        <>
            <PageHeader title="My Tickets" />
            <AppGrid id="vertrag" widgets={widgets}/>
        </>
    )
}

export default Vetrag