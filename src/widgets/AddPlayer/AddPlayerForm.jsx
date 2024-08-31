import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import styles from './styles.module.scss';
import CustomSelect from '@ui/CustomSelect';
import { toast } from 'react-toastify';
import FirebaseImageUpload from '../../network/Firebase/storage/FirebaseImageUpload';
import { useForm, Controller } from 'react-hook-form';
import classNames from 'classnames';
import ApiService from './../../network/ApiService';
import Cities from '../../assets/cities.json';

const AddPlayerForm = ({ teamID }) => {
    const [imageURL, setImageURL] = useState(null);
    const [identificationURL, setIdentificationURL] = useState(null);
    const navigate = useNavigate();
    const apiService = new ApiService();

    const { register, handleSubmit, formState: { errors }, reset, control } = useForm({
        defaultValues: {
            name: '',
            number: '',
            birthday: '',
            nationality: '',
            position: '',
            eligibility: 'Warten',
            email: '',
            bank: '', // Default value for bank
        }
    });

    const getCountriesOptions = () => {
        return Cities.map(country => ({ value: country.country, label: country.country }));
    };

    const generateSID = () => {
        return Math.floor(10000 + Math.random() * 90000).toString();
    };

    const onSubmit = async (data) => {
        try {
            // Prepare the data for POST request
            const newPlayer = {
                name: data.name,
                number: data.number,
                sid: generateSID(),
                birthday: data.birthday,
                nationality: data.nationality?.label || '',
                position: data.position?.label || '', // Extract the label to get "Feldspieler"
                eligibility: data.eligibility,
                registerDate: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
                matchesPlayed: 0,
                goals: 0,
                team: {
                    id: teamID,
                },
                email: data.email, // Added email to POST request
                bank: data.bank === 'JA', // Convert "JA" to true and "NEIN" to false for POST request
                image: imageURL,
                identification: identificationURL,
            };

            const response = await apiService.post('/players', newPlayer);
            if (response) {
                console.log('Player added successfully!');
                navigate('/matches');  // Redirect to /kader after successful addition
            }
        } catch (error) {
            console.log('Failed to add the player.   :' + error);
        }
    };

    return (
        <form className="d-flex flex-column g-20" onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.row}>
                <div className={styles.column}>
                    <label htmlFor="name" style={{ marginBottom: '10px' }}>Name</label>
                    <input
                        id="name"
                        className={classNames('field', { 'field--error': errors.name })}
                        type="text"
                        placeholder="Name"
                        {...register('name', { required: true })}
                    />
                </div>
                <div className={styles.column}>
                    <label htmlFor="number" style={{ marginBottom: '10px' }}>Spieler Nummer</label>
                    <input
                        id="number"
                        className={classNames('field', { 'field--error': errors.number })}
                        type="number"
                        placeholder="Spieler Nummer"
                        {...register('number', { required: true })}
                    />
                </div>
            </div>
            <div className={styles.row}>
                <div className={styles.column}>
                    <label htmlFor="position" style={{ marginBottom: '10px' }}>Position</label>
                    <Controller
                        name="position"
                        control={control}
                        render={({ field }) => (
                            <CustomSelect
                                id="position"
                                options={[
                                    { value: 'feld', label: 'Feldspieler' },
                                    { value: 'goalkeeper', label: 'Tormann' },
                                ]}
                                value={field.value}
                                onChange={field.onChange}
                                placeholder="Position"
                                isSearchable={false}
                                variant="basic"
                                innerRef={field.ref}
                            />
                        )}
                    />
                </div>
                <div className={styles.column}>
                    <label htmlFor="email" style={{ marginBottom: '10px' }}>Email</label>
                    <input
                        id="email"
                        className={classNames('field', { 'field--error': errors.email })}
                        type="email"
                        placeholder="Email"
                        {...register('email', { required: true })}
                    />
                </div>
                <div className={styles.column}>
                    <label htmlFor="bank" style={{ marginBottom: '10px' }}>Ersatzbank Spieler</label>
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
                                value={field.value}
                                onChange={field.onChange}
                                placeholder="Ersatzbank Spieler"
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
                    <label htmlFor="nationality" style={{ marginBottom: '10px' }}>Nationalität</label>
                    <Controller
                        name="nationality"
                        control={control}
                        render={({ field }) => (
                            <CustomSelect
                                id="nationality"
                                options={getCountriesOptions()}
                                value={field.value}
                                onChange={field.onChange}
                                placeholder="Nationalität"
                                isSearchable={true}
                                variant="basic"
                                innerRef={field.ref}
                            />
                        )}
                    />
                </div>
                <div className={styles.column}>
                    <label htmlFor="birthday" style={{ marginBottom: '10px' }}>Geburtstag (Jahr)</label>
                    <input
                        id="birthday"
                        className={classNames('field', { 'field--error': errors.birthday })}
                        type="number"
                        placeholder="Geburtstag (Jahr)"
                        {...register('birthday', { required: true })}
                    />
                </div>
            </div>
            <div className={styles.row}>
                <FirebaseImageUpload
                    onUploadSuccess={setImageURL}
                    path="players/${sid}"
                    filename="player_image"
                    buttonText={"Spieler Foto Hochladen"}
                />
                <FirebaseImageUpload
                    onUploadSuccess={setIdentificationURL}
                    path="players/${sid}"
                    filename="player_identification"
                    buttonText={"Spieler Ausweis Hochladen"}
                />
            </div>
            <div className={styles.footer}>
                <button className="btn" type="submit">Spieler Anmelden</button>
                <button className="btn btn--outlined" type="reset" onClick={() => reset()}>Reset</button>
            </div>
        </form>
    );
};

export default AddPlayerForm;
