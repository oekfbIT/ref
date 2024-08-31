import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

// styling
import styles from './styles.module.scss';

// components
import CustomSelect from '@ui/CustomSelect';
import { toast } from 'react-toastify';

// hooks
import { useForm, Controller } from 'react-hook-form';

// utils
import classNames from 'classnames';
import ApiService from './../../network/ApiService';

const UpdatePlayerForm = ({ playerId }) => {
    const [player, setPlayer] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors }, reset, control, setValue } = useForm({
        defaultValues: {
            number: '',
            position: '',
            email: '',
            bank: '',
        }
    });

    useEffect(() => {
        if (!playerId) {
            toast.error("Player ID is missing.");
            setLoading(false);
            return;
        }

        const fetchPlayerData = async () => {
            try {
                const apiService = new ApiService();
                const response = await apiService.get(`/players/${playerId}`);
                if (response) {
                    setPlayer(response);

                    // Set the form fields with the fetched player data
                    setValue('number', response.number || '');
                    setValue('position', response.position || '');
                    setValue('email', response.email || '');
                    setValue('bank', response.bank ? 'JA' : 'NEIN'); // Display "JA" for true and "NEIN" for false
                }
            } catch (error) {
                toast.error('Failed to fetch player data.');
            } finally {
                setLoading(false);
            }
        };

        fetchPlayerData();
    }, [playerId, setValue]);

    const onSubmit = async (data) => {
        console.log('Form data submitted:', data);
        try {
            const apiService = new ApiService();

            // Combine form data with the original player object
            const updatedPlayer = {
                ...player,  // Keep all existing fields from the fetched player object
                number: data.number,
                position: data.position,
                email: data.email,
                bank: data.bank === 'JA', // Convert "JA" to true and "NEIN" to false
            };

            const response = await apiService.patch(`/players/${player.id}`, updatedPlayer);
            console.log('API response:', response);
            if (response) {
                setPlayer(response);
                navigate('/kader');
            }
        } catch (error) {
            console.log('Failed to update the player information.');
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!player) {
        return <p>Player data not found.</p>;
    }

    return (
        <form className="d-flex flex-column g-20" onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.row}>
                <div>
                    <label htmlFor="number">Nummer</label>
                    <input
                        id="number"
                        className={classNames('field', { 'field--error': errors.number })}
                        type="number"
                        placeholder="Nummer"
                        {...register('number')}
                    />
                </div>
                <div className={styles.column}>
                    <label htmlFor="position">Position</label>
                    <Controller
                        name="position"
                        control={control}
                        render={({ field }) => (
                            <CustomSelect
                                id="position"
                                options={[
                                    { value: 'Feldspieler', label: 'Feldspieler' },
                                    { value: 'Tormann', label: 'Tormann' },
                                ]}
                                value={{ value: field.value, label: field.value }}
                                onChange={(selected) => field.onChange(selected.value)}
                                placeholder="Position"
                                isSearchable={false}
                                variant="basic"
                                innerRef={field.ref}
                            />
                        )}
                    />
                </div>
            </div>
            <div className={styles.row}>
                <div className={styles.column}>
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        className={classNames('field', { 'field--error': errors.email })}
                        type="email"
                        placeholder="Email"
                        {...register('email')}
                    />
                </div>
                <div className={styles.column}>
                    <label htmlFor="bank">Bank</label>
                    <Controller
                        name="bank"
                        control={control}
                        render={({ field }) => (
                            <CustomSelect
                                id="bank"
                                options={[
                                    { value: 'JA', label: 'JA' },
                                    { value: 'NEIN', label: 'NEIN' },
                                ]}
                                value={{ value: field.value, label: field.value }}
                                onChange={(selected) => field.onChange(selected.value)}
                                placeholder="Bank"
                                isSearchable={false}
                                variant="basic"
                                innerRef={field.ref}
                            />
                        )}
                    />
                </div>
            </div>
            <div className={styles.footer} >
                <button className="btn" type="submit">Update Profile</button>
                {/*<button className="btn btn--outlined" type="reset" onClick={() => reset()}>Cancel</button>*/}
            </div>
        </form>
    );
};

UpdatePlayerForm.propTypes = {
    playerId: PropTypes.string.isRequired,
};

export default UpdatePlayerForm;
