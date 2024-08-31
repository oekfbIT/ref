import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import styles from './styles.module.scss';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import classNames from 'classnames';
import ApiService from './../../network/ApiService';

const UpdateTeamForm = ({ teamID }) => {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();
    const apiService = new ApiService();

    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: {
            email: '',
        }
    });

    useEffect(() => {
        const fetchTeam = async () => {
            try {
                const response = await apiService.get(`/teams/${teamID}`);
                if (response) {
                    setEmail(response.usremail);
                }
            } catch (error) {
                console.log('Failed to fetch the team data: ' + error);
                toast.error('Failed to fetch team data.');
            }
        };
        fetchTeam();
    }, [teamID, apiService]);

    const onSubmit = async (data) => {
        try {
            const newEmail = data.email;

            if (newEmail !== email) {
                const response = await apiService.get(`/teams/updateUser/${teamID}/${newEmail}`);
                if (response) {
                    console.log('Email updated successfully!');
                    navigate('/matches');  // Redirect to /teams after successful update
                }
            } else {
                toast.info('No changes were made.');
            }
        } catch (error) {
            console.log('Failed to update the email: ' + error);
            toast.error('Failed to update email.');
        }
    };

    return (
        <form className="d-flex flex-column g-20" onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.row}>
                <input
                    className={classNames('field', { 'field--error': errors.email })}
                    type="email"
                    placeholder="Neue Email Adresse"
                    defaultValue={email}
                    {...register('email', { required: true, pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/ })}
                />
            </div>
            <div className={styles.footer}>
                <button className="btn" type="submit">Email Aktualisieren</button>
                <button className="btn btn--outlined" type="reset" onClick={() => reset({ email })}>Cancel</button>
            </div>
        </form>
    );
};

UpdateTeamForm.propTypes = {
    teamID: PropTypes.string.isRequired,
};

export default UpdateTeamForm;
