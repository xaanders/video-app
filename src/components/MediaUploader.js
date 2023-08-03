import MediaUploaderVimeo from '@/utils/media-uploader-vimeo';
import React, { useState } from 'react'

function MediaUploader() {
    const [file, setFile] = useState(null);
    const [progress, setProgress] = useState(0);
    const [isUploading, setUploading] = useState(false);

    const setFileHandler = (e) => {
        setFile(e.target.files[0])
    }

    const uploadingHandler = async (e) => {
        if (file) {
            setProgress(0);
            setUploading(true);
            const uploader = new MediaUploaderVimeo();
            const videoMeta = await uploader.upload(
                file, 'kelly shmelly ',
                (bytesUploaded, bytesTotal) => {
                    setProgress((bytesUploaded * 100) / bytesTotal)
                }
            );
            console.log(videoMeta)
            setUploading(false)
        }
    }
    
    return (

        <>
            <input
                type="file"
                accept='video/*'
                onChange={setFileHandler} />
            <button
                disabled={!file}
                onClick={uploadingHandler}>
                Upload
            </button>

            {isUploading && <div>Progress: {Math.floor(progress)}%</div>}
        </>
    )
}

export default MediaUploader

