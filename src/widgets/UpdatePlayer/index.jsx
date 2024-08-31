import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Spring from '@components/Spring';
import UpdatePlayerForm from "@widgets/UpdatePlayer/UpdatePlayerForm";
import ApiService from './../../network/ApiService';
import { toast } from 'react-toastify';

const UpdatePlayer = ({ playerId }) => {
    const [player, setPlayer] = useState(null);

    useEffect(() => {
        const fetchPlayerData = async (playerId) => {
            try {
                const apiService = new ApiService();
                const response = await apiService.get(`/players/${playerId}`);
                if (response) {
                    setPlayer(response);
                }
            } catch (error) {
                toast.error('Failed to fetch player data.');
            }
        };

        if (playerId) {
            fetchPlayerData(playerId);
        }
    }, [playerId]);

    return (
        <Spring className="card d-flex flex-column card-padded">
            <h3>Spieler Bearbeiten: {player ? player.name : 'Loading...'}</h3>
            <div className="d-flex flex-column justify-content-between flex-1">
                {player ? <UpdatePlayerForm playerId={player.id} /> : <p>Loading...</p>}
            </div>
        </Spring>
    );
};

UpdatePlayer.propTypes = {
    playerId: PropTypes.string.isRequired, // Ensure playerId is passed and is required
};

export default UpdatePlayer;
