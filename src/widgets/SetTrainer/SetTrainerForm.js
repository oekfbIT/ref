import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import styles from './styles.module.scss';
import { useForm } from 'react-hook-form';
import classNames from 'classnames';
import ApiService from './../../network/ApiService';
import FirebaseImageUpload from '../../network/Firebase/storage/FirebaseImageUpload';

const SetTrainerForm = ({ teamID }) => {
    const [team, setTeam] = useState(null);
    const [coachImageURL, setCoachImageURL] = useState(null);  // State for the coach's image URL
    const navigate = useNavigate();

    // Using useRef to store the ApiService instance
    const apiServiceRef = useRef(new ApiService());

    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: {
            coachName: '',
            coachEmail: '',
            coachImageURL: '',  // Default value for coach image URL
        }
    });

    useEffect(() => {
        const fetchTeam = async () => {
            try {
                const response = await apiServiceRef.current.get(`/teams/${teamID}`);
                if (response) {
                    setTeam(response);
                    setCoachImageURL(response.coach.image);  // Set the image URL from the fetched data
                }
            } catch (error) {
                console.log('Failed to fetch team data: ' + error);
            }
        };

        if (teamID) {
            fetchTeam();
        }
    }, [teamID]);

    const onSubmit = async (data) => {
        try {
            const updatedTeam = {
                ...team,
                coach: {
                    name: data.coachName,
                    imageURL: coachImageURL,  // Use the state value for the image URL
                    email: data.coachEmail,
                }
            };

            const response = await apiServiceRef.current.patch(`/teams/${teamID}`, updatedTeam);
            if (response) {
                console.log('Trainer updated successfully!');
                navigate('/matches');  // Redirect to team overview or desired page
            }
        } catch (error) {
            console.log('Failed to update the trainer: ' + error);
        }
    };

    return (
        <form className="d-flex flex-column g-20" onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.row}>
                <input
                    className={classNames('field', { 'field--error': errors.coachName })}
                    type="text"
                    placeholder="Trainer Name"
                    {...register('coachName', { required: true })}
                />
            </div>
            <div className={styles.row}>
                <input
                    className={classNames('field', { 'field--error': errors.coachEmail })}
                    type="email"
                    placeholder="Trainer Email"
                    {...register('coachEmail', { required: true })}
                />
            </div>
            <div className={styles.row}>
                <FirebaseImageUpload
                    onUploadSuccess={setCoachImageURL}  // Set the uploaded image URL
                    path={`teams/${teamID}/trainer`}
                    filename="coach"
                    buttonText={"Trainer Foto auswahl"}
                />
            </div>
            <div className={styles.footer}>
                <button className="btn" type="submit">Trainer Anlegen</button>
                <button className="btn btn--outlined" type="reset" onClick={() => reset()}>Reset</button>
            </div>
        </form>
    );
};

SetTrainerForm.propTypes = {
    teamID: PropTypes.string.isRequired,
};

export default SetTrainerForm;
