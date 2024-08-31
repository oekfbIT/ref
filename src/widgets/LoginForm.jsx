import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import PasswordInput from "@components/PasswordInput";
import BasicCheckbox from "@ui/BasicCheckbox";
import ResetPasswordPopup from "@components/ResetPasswordPopup";
import { useAuth } from "../network/authContext";
import classNames from "classnames";

// Helper function to get cookie by name
const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
};

const LoginForm = () => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const { register, handleSubmit, setValue, watch, formState: { errors }, control } = useForm({
        defaultValues: {
            email: "",
            password: "",
            rememberMe: false,
        },
    });

    // Watch the email field for changes
    const email = watch("email");

    useEffect(() => {
        // Check for cookies on component mount
        const refID = getCookie("refID");
        const authToken = getCookie("authToken");

        if (refID && authToken) {
            console.log("Cookie found: refID and authToken exist.");
        } else {
            console.log("Cookie not found: refID or authToken missing.");
        }
    }, []);

    useEffect(() => {
        if (email) {
            // Trim the email whenever it changes
            setValue("email", email.trim());
        }
    }, [email, setValue]);

    const handleResetPassword = (e) => {
        e.preventDefault();
        setOpen(true);
    };

    const onSubmit = async (data) => {
        setLoading(true);
        const { email, password } = data;

        // Trim the email before using it
        const trimmedEmail = email.trim();

        const result = await login(trimmedEmail, password);
        setLoading(false);

        if (result.success) {
            message.success("Login successful");

            // Redirect to the appropriate page based on user type or role
            navigate("/kader"); // Assuming "/kader" is the main page for teams
        } else {
            message.error(result.message);
        }
    };

    return (
        <>
            <h1>Mannschaft Login</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="d-flex flex-column g-10" style={{ margin: "20px 0 30px" }}>
                    <div className="d-flex flex-column g-20">
                        <input
                            className={classNames("field", { "field--error": errors.email })}
                            type="text"
                            placeholder="E-mail"
                            {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
                            style={{
                                width: "100%",
                                padding: "10px",
                                marginBottom: "15px",
                                border: "1px solid #888888",
                                borderRadius: "4px",
                                background: "#000000",
                                color: "#e0e0e0",
                                fontSize: "1rem",
                            }}
                        />
                        <Controller
                            control={control}
                            name="password"
                            rules={{ required: true }}
                            render={({
                                         field: { ref, onChange, value },
                                         fieldState: { error },
                                     }) => (
                                <PasswordInput
                                    className={classNames("field", { "field--error": error })}
                                    value={value}
                                    onChange={(e) => onChange(e.target.value)}
                                    placeholder="Password"
                                    innerRef={ref}
                                    style={{
                                        width: "100%",
                                        padding: "10px",
                                        marginBottom: "15px",
                                        border: "1px solid #888888",
                                        borderRadius: "4px",
                                        background: "#000000",
                                        color: "#e0e0e0",
                                        fontSize: "1rem",
                                    }}
                                />
                            )}
                        />
                    </div>
                    <div className="d-flex align-items-center g-10">
                        <Controller
                            control={control}
                            name="rememberMe"
                            render={({ field: { ref, onChange, value } }) => (
                                <BasicCheckbox
                                    id="rememberMe"
                                    checked={value}
                                    onChange={(e) => onChange(e.target.checked)}
                                    innerRef={ref}
                                />
                            )}
                        />
                        <label htmlFor="rememberMe" style={{ color: "#e0e0e0" }}>
                            Eingeloggt bleiben
                        </label>
                    </div>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                    <button className="btn btn--sm" type="submit" disabled={loading}>
                        {loading ? "Laden..." : "Einloggen"}
                    </button>
                    {/*<button*/}
                    {/*    className="text-button text-button--sm"*/}
                    {/*    onClick={handleResetPassword}*/}
                    {/*>*/}
                    {/*    Reset password*/}
                    {/*</button>*/}
                </div>
            </form>
            <ResetPasswordPopup open={open} onClose={() => setOpen(false)} />
        </>
    );
};

export default LoginForm;
