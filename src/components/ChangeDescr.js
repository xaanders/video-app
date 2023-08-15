import axios from 'axios'
import React, { useState } from 'react'

function ChangeDescr({ title, description, id }) {
    const [inputs, setInputs] = useState({
        inputTitle: title,
        inputDescription: description
    })


    const inputHandler = (e) => {
        setInputs(prev => (
            {
                ...prev,
                [e.target.name]: e.target.value
            }
        ))
    }
    const saveHandler = async (e) => {
        e.preventDefault();
        console.log('sent req ' + id)
        try {
            const res = await axios.patch('/api/edit-video', { videoId: id, title: inputs.inputTitle, description: inputs.inputDescription })
            if (res.status === 200) {
                console.log(res.data)
            }

        } catch (err) {
            console.log(err.response.data.message)
        }
    }
    const refreshHandler = async () => {
        try {
            const res = await axios.patch('/api/updating/refresh', { id: id })

            if (res.status === 200) {
                console.log(res.data)
            }

        } catch (err) {
            console.log(err.response)
        }
    }
    return (
        <>
            <form onSubmit={saveHandler}>
                <label htmlFor='title' style={{ display: 'block' }}>Title</label>
                <input type="text" id="title" value={inputs.inputTitle} name="inputTitle" onChange={inputHandler} />

                <label htmlFor='descr' style={{ display: 'block' }}>Description:</label>
                <textarea type="text" id="descr" value={inputs.inputDescription} name="inputDescription" onChange={inputHandler} />
                <button style={{ margin: "30px" }}>Save</button>
            </form>
            <button onClick={refreshHandler} style={{ margin: "30px" }}>Refresh thumbnail</button>
        </>

    )
}

export default ChangeDescr