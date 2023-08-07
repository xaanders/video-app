import axios from "axios";

export async function addingNewVideo(data) {
    const result = await axios.post('/api/new-video', data);

    console.log(result.data)

}