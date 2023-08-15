


import { ConnectToDatabase } from '@/helpers/dbConnection';

let { Vimeo } = require('vimeo');

const handler = async (req, res) => {
    if (req.method === 'PATCH') {
        const id = req.body.videoId,
            name = req.body.title,
            description = req.body.description;

        let client = new Vimeo(process.env.VIMEO_CLIENT, process.env.VIMEO_SECRET, process.env.VIMEO_ACCESS_TOKEN);
        const { db, dbClient } = await ConnectToDatabase(process.env.MONGODB_URL);
        const videosCollection = db.collection('videos');

        try {
            const result = await new Promise((resolve, reject) => {
                client.request({
                    method: 'PATCH',
                    path: '/videos/' + id,
                    query: {
                        name,
                        description
                    }
                }, function (error, body, status_code, headers) {
                    if (error) {
                        reject(JSON.parse(error.message) || "Something went wrong... Try again later.");

                    }

                    if (status_code === 200) {
                        console.log('222');
                        videosCollection.findOneAndUpdate({ _id: id }, { $set: { name, description } }).then(() => resolve({success: "Successfuly updated video information"}));

                    }
                });
            })
            await result
            if(result.error) {
                throw new Error(result.error);
            } 

            return res.status(200).json(result)


        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: "Something went wrong... Try again later." })

        }

    }
}
export default handler