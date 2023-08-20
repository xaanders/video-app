import axios from 'axios';
import Image from 'next/image';
import React, { useState } from 'react'

function ChangeThumbnail({ videoId }) {
    const [isEdit, setIsEdit] = useState('');
    const [selectedFile, setSelectedFile] = useState('')
    const [isLoading, setIsloading] = useState(false)
    const [isMessage, setIsMessage] = useState('')


    const handleFileInputChange = (e) => {
        const file = e.target.files[0];
        previewFile(file)
    }

    const previewFile = (file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setSelectedFile(reader.result)
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedFile || isLoading) return;
        uploadImage(selectedFile)
    }

    const uploadImage = async (base64EncodedImage) => {
        if (!isLoading) {
            setIsloading(true);
            try {
                const response = await axios.patch('/api/new-thumbnail', { image: base64EncodedImage, id: videoId });

                if (!response.ok) {
                    throw new Error(response.data)
                }

                setIsMessage({ status: 'success', text: 'You successfuly changed video thumbnail!' })
            } catch (error) {
                setIsMessage({ status: 'error', text: 'Unfortunately something went wrong. Try again a little later.' })
            } finally {
                setIsloading(false)
                setSelectedFile('')
                setIsEdit(false)
                setTimeout(() => {
                    setIsMessage({})

                }, 1000)
            }
        }
    }


    return (
        <>
            <form onSubmit={handleSubmit} style={{ padding: '30px' }}>
                {
                    isLoading ? <p>Loading...</p> :

                        <>
                            {
                                isEdit &&
                                <input type="file" name="image" onChange={handleFileInputChange} />
                            }

                            <button
                                type={isEdit ? 'submit' : 'button'}
                                onClick={() => !isEdit && setIsEdit(true)}>
                                {isEdit ? 'Upload' : 'Edit'}</button>

                        </>
                }
                {isMessage.text &&
                    <p style={{ color: isMessage.status === 'success' ? "green" : "red" }}>{isMessage.text}</p>
                }
            </form>
        </>
    )
}
export const config = {
    api: {
        bodyParser: {
            sizeLimit: '8mb' // Set desired value here
        }
    }
}
export default ChangeThumbnail