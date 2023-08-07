const { ConnectToDatabase } = require("@/helpers/dbConnection");


const handler = async (req, res) => {
    if (req.method === "GET") {

        const { db, dbClient } = await ConnectToDatabase(process.env.MONGODB_URL);
        const videosCollection = db.collection('videos');

        try {
            const result = await videosCollection.find({}).toArray();

            res.status(200).json({videos: result})

        } catch (error) {
            res.status(500).json({message: error});

        }




    }
} 

export default handler