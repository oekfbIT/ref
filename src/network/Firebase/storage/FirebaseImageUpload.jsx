import React, { useState } from "react";
import { Upload, message, Button } from "antd";
import {
    RiUpload2Line,
    RiCheckboxCircleLine,
    RiCloseCircleLine,
} from "react-icons/ri";
import FirebaseStorageManager from "./FirebaseStorageManager";
import pdfIcon from "../../../assets/icons_dev/pdficon.png";

const FirebaseImageUpload = ({ onUploadSuccess, path, filename, existingUrl, buttonText }) => {
    const [fileList, setFileList] = useState([]);

    const isImage = (fileUrl) => {
        const imageExtensions = ['.png', '.jpeg', '.jpg', '.gif'];
        return imageExtensions.some(ext => fileUrl.includes(ext));
    };

    const isPDF = (fileUrl) => fileUrl.includes('.pdf');

    const customRequest = async ({ file, onSuccess, onError }) => {
        try {
            const fileUrl = await FirebaseStorageManager.uploadFile(file, path, filename);
            onSuccess({ url: fileUrl });
            message.success({
                content: `${file.name} file uploaded successfully.`,
                icon: <RiCheckboxCircleLine className="remix-icon" />,
            });
            if (onUploadSuccess) {
                onUploadSuccess(fileUrl);
            }
        } catch (error) {
            console.error("Error uploading file:", error);
            onError(error);
            message.error({
                content: `${file.name} file upload failed.`,
                icon: <RiCloseCircleLine className="remix-icon" />,
            });
        }
    };

    const handleChange = (info) => {
        let newFileList = [...info.fileList];
        if (info.file.status === "done" && info.file.response) {
            newFileList = newFileList.map((file) => {
                if (file.response && file.response.url) {
                    return {
                        ...file,
                        url: file.response.url,
                    };
                }
                return file;
            });
        }
        setFileList(newFileList);
        if (info.file.status === "done") {
            console.log("Uploaded Image URL:", info.file.response.url);
        }
    };

    return (
        <div>
            {existingUrl && (
                <div>
                    {isImage(existingUrl) ?
                        <img src={existingUrl} alt="Uploaded File" style={{ height: '120px', margin: 20 }} /> :
                        isPDF(existingUrl) ?
                            <img src={pdfIcon} alt="PDF Icon" style={{ height: '70px', margin: 20 }} /> :
                            null
                    }
                    <Button
                        type="text"
                        href={existingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ margin: '0' }}
                    >
                        Öffnen/herunterladen
                    </Button>
                </div>
            )}
            <Upload
                customRequest={customRequest}
                fileList={fileList}
                onChange={handleChange}
                itemRender={(originNode, file) => {
                    return (
                        <div style={{ backgroundColor: 'orange', marginTop: '10px', padding: "5px", color: "white" }}>
                            {file.name} hochgeladen.
                        </div>
                    );
                }}
            >
                <Button
                    style={{ backgroundColor: "orange" }}
                    type="primary"
                    icon={<RiUpload2Line className="remix-icon" />}
                >
                    {buttonText}
                </Button>
            </Upload>
        </div>
    );
};

export default FirebaseImageUpload;

