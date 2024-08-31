import React, { useEffect, useState } from 'react';
import Spring from '@components/Spring';
import UpdatePlayerForm from "@widgets/UpdatePlayer/UpdatePlayerForm";
import ApiService from './../../network/ApiService';
import { toast } from 'react-toastify';
import UpdateTeamForm from "@widgets/UpdateTeam/UpdateTeamForm";

const UpdateTeam = () => {

    return (
        <Spring className="card d-flex flex-column card-padded max-width[1200px]">
            <h3>Mannschaft Bearbeiten</h3>
            <div className="d-flex flex-column justify-content-between flex-1">
                {<UpdateTeamForm />}
            </div>
        </Spring>
    );
};

export default UpdateTeam;
