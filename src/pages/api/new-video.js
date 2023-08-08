import { ConnectToDatabase } from '@/helpers/dbConnection';
import { ObjectId } from 'mongodb';

let Vimeo = require('vimeo').Vimeo;


const handler = async (req, res) => {
    if (req.method === 'PUT') {

        const { db, dbClient } = await ConnectToDatabase(process.env.MONGODB_URL);
        const videosCollection = db.collection('videos');
        const imgsCollection = db.collection('images');

        const newVideo = {
            _id: req.body.id,
            name: req.body.name,
            description: req.body.description,
        }

        try {
            await videosCollection.insertOne(newVideo);
            await imgsCollection.insertOne({ _id: req.body.id });
            
            dbClient.close();

            return res.status(200).json(newVideo)

        } catch (error) {
            console.log('error: ' + error);
            return res.status(500).json({message: error})

        }

    }
}

export default handler