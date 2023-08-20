import { ConnectToDatabase } from '@/helpers/dbConnection';
import axios from 'axios';
export const config = {
    api: {
        bodyParser: {
            sizeLimit: '10mb' // Set desired value here
        }
    }
}

let { Vimeo } = require('vimeo');

const handler = async (req, res) => {
    if (req.method === 'PATCH') {
        const videoId = req.body.id;
        const file = req.body.image;

        // const { db, dbClient } = await ConnectToDatabase(process.env.MONGODB_URL);
        // const videosCollection = db.collection('videos');

        let client = new Vimeo(process.env.VIMEO_CLIENT, process.env.VIMEO_SECRET, process.env.VIMEO_ACCESS_TOKEN);
        const uri = `${process.env.VIMEO_THUMBNAIL_URL}/${videoId}/pictures`
        const headers = {
            Authorization: `bearer ${process.env.VIMEO_ACCESS_TOKEN}`,
            Accept: 'application/vnd.vimeo.*+json;version=3.4'
        };
        try {
            // Step 1: Upload the thumbnail image
            const response = await axios.get(`https://api.vimeo.com/videos/${videoId}?fields=metadata.connections.pictures.uri`, { headers });
            const picturesUri = response.data.metadata.connections.pictures.uri;
            const response1 = await axios.post(`https://api.vimeo.com${picturesUri}`, null, {
                headers: {
                    Authorization: `Bearer ${process.env.VIMEO_ACCESS_TOKEN}`,
                    Accept: "application/vnd.vimeo.*+json;version=3.4"
                },
            });
            const uploadLink = response1.data.link;
            const a = await axios.put(uploadLink, file, {
                headers: {
                    'Content-Type': 'image/png',
                    Accept: 'application/vnd.vimeo.*+json;version=3.4'
                }
            });

            console.log(a)
            // // Step 3: Set Thumbnail as Active
            // const activePatchData = { active: true };

            // await axios.patch(`https://api.vimeo.com/videos/${videoId}/pictures`, activePatchData, {
            //     headers: {
            //         Authorization: `bearer ${accessToken}`,
            //         'Content-Type': 'application/json',
            //         Accept: 'application/vnd.vimeo.*+json;version=3.4'
            //     }
            // });

            // console.log('Thumbnail Set as Active:', patchResponse.status);

            return res.status(200).json({ message: '' })

        } catch (error) {
            console.log('error: ' + error);
            return res.status(500).json({ message: error })

        }

    }
}




export default handler