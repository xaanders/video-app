import { ConnectToDatabase } from '@/helpers/dbConnection';

let Vimeo = require('vimeo').Vimeo;

// handler to upload all the pictures to corresponding video

const handler = async (req, res) => {
    if (req.method === 'GET') {
        let vimeoClient = new Vimeo(process.env.VIMEO_CLIENT, process.env.VIMEO_SECRET, process.env.VIMEO_ACCESS_TOKEN);

        const { db, dbClient } = await ConnectToDatabase(process.env.MONGODB_URL);
        const videosCollection = db.collection('videos');
        const imgsCollection = db.collection('images');
        const ids = (await imgsCollection.find({}).toArray()).map(item => item._id);
        const stillWaiting = [];
        if (ids.length > 0) {
            try {
                const requestPromises = ids.map(key => {
                    return new Promise((resolve) => {
                        const uri = `${process.env.VIMEO_THUMBNAIL_URL}/${key}/pictures?sizes=1920x1080`;
                        vimeoClient.request(uri, function (error, body, status_code, headers) {
                            if (error) {
                                console.log('error:' + error);
                                stillWaiting.push(key);
                                resolve();
                            }

                            if (body.data[0]?.sizes[0]?.link) {
                                videosCollection.updateOne({ _id: key }, { $set: { image: body.data[0].sizes[0].link } }).then(() => {
                                    imgsCollection.deleteOne({ _id: key }).then(() => resolve());
                                });
                            } else {
                                stillWaiting.push(key);
                                resolve();
                            }
                        });
                    });
                });

                await Promise.all(requestPromises); // Wait for all requests to complete
                dbClient.close()

                if (stillWaiting.length === 0) {
                    return res.status(200).json({ message: 'Successfully added all the pictures' });
                } else {
                    return res.status(200).json({ message: `Still waiting for update ${stillWaiting.join(', ')}` });
                }

            } catch (error) {
                return res.status(500).json({ message: error || "Something went wrong" })
            }
        } else {
            dbClient.close()
            res.status(200).json({ message: "No pictures to download" });
        }
    }
}

export default handler