import axios from "axios";

export async function addingNewVideo(data) {
    const result = await axios.put('/api/new-video', data);

    console.log(result.data)

}

export async function removingVideo(data) {
    const result = await axios.patch('/api/remove-video', data);

    console.log(result.data)
}