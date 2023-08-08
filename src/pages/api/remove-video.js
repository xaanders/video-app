import { ConnectToDatabase } from '@/helpers/dbConnection';
import { ObjectId } from 'mongodb';
import { resolve } from 'styled-jsx/css';

let Vimeo = require('vimeo').Vimeo;


const handler = async (req, res) => {
    if (req.method === 'PATCH') {
        const videoId = req.body.id
        const { db, dbClient } = await ConnectToDatabase(process.env.MONGODB_URL);
        const videosCollection = db.collection('videos');
        let client = new Vimeo(process.env.VIMEO_CLIENT, process.env.VIMEO_SECRET, process.env.VIMEO_ACCESS_TOKEN);


        try {
            const result = new Promise((resolve) => {
                client.request({
                    method: 'DELETE',
                    path: `/videos/${videoId}`
                }, (error, body, status_code) => {
                    if (error) {
                        console.error('Error deleting video: ', error);
                      } else {
                        videosCollection.deleteOne({ _id: videoId }).then(() => resolve())
                        console.log('Video deleted successfully.');
                      }
                });
            }) 

            await result
            dbClient.close()
            return res.status(200).json({ message: 'Successfuly removed video ' + videoId })

        } catch (error) {
            console.log('error: ' + error);
            return res.status(500).json({ message: error })

        }

    }
}

export default handler