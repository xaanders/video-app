import MediaUploaderVimeo from '@/utils/media-uploader-vimeo';
import React, { useState } from 'react'
import { addingNewVideo } from '@/helpers/ManagingVideo';
function MediaUploader() {
    const [file, setFile] = useState(null);
    const [progress, setProgress] = useState(0);
    const [isUploading, setUploading] = useState(false);
    const [videoName, setVideoName] = useState('')
    const [videoDescriptiom, setVideoDescription] = useState('')
    const setFileHandler = (e) => {
        setFile(e.target.files[0])
    }

    const uploadingHandler = async (e) => {
        if (file) {
            setProgress(0);
            setUploading(true);
            const uploader = new MediaUploaderVimeo();
            const videoMeta = await uploader.upload(
                file, videoName, videoDescriptiom,
                (bytesUploaded, bytesTotal) => {
                    setProgress((bytesUploaded * 100) / bytesTotal)
                }
            );
            addingNewVideo({ id: videoMeta.id, name: videoName, description: videoDescriptiom })
            setUploading(false)
        }
    }
    const InputChangeHandler = (e) => {
        setVideoName(e.target.value)
    }
    const TextChangeHandler = (e) => {
        setVideoDescription(e.target.value)
    }
    const submitHandler = (e) => {
        e.preventDefault();
   
        uploadingHandler();
    }

    return (

        <>
            <form>
                <div>
                    <input
                        type="file"
                        accept='video/*'
                        onChange={setFileHandler} />


                </div>

                <div>
                    <label style={{ display: 'block' }} htmlFor='nameField'>Name</label>
                    <input type="text" name="nameField" id="nameField" onChange={InputChangeHandler}/>

                </div>

                <div>
                    <label style={{ display: 'block' }} htmlFor='descrField'>Description:</label>
                    <textarea style={{ width: '300px', height: '300px' }} id="descrField" onChange={TextChangeHandler}/>
                </div>
                <button
                    disabled={!file}
                    onClick={submitHandler}>
                    Upload
                </button>
            </form>

            {isUploading && <div>Progress: {Math.floor(progress)}%</div>}
        </>
    )
}

export default MediaUploader

