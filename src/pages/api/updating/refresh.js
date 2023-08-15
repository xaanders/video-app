import { ConnectToDatabase } from '@/helpers/dbConnection';
import { ObjectId } from 'mongodb';

let Vimeo = require('vimeo').Vimeo;


const handler = async (req, res) => {
    if (req.method === 'PATCH') {
        const { db, dbClient } = await ConnectToDatabase(process.env.MONGODB_URL);
        const imgsCollection = db.collection('images');
        try {
            await imgsCollection.insertOne({ _id: req.body.id });
            await dbClient.close();
            return res.status(200).json({message: 'Added to refreshing array'})

        } catch (error) {
            console.log('error: ' + error);
            return res.status(500).json({message: error})

        }

    }
}

export default handler