import axios from "axios";
let Vimeo = require('vimeo').Vimeo;


const handler = async (req, res) => {
    if (req.method === 'GET') {
        let client = new Vimeo(process.env.VIMEO_CLIENT, process.env.VIMEO_SECRET, process.env.VIMEO_ACCESS_TOKEN);
        const VIMEO_API_URL = `https://api.vimeo.com/videos/pictures`

        client.request(VIMEO_API_URL, function (error, body, status_code, headers) {
            console.log('status code:' + status_code);
            console.log('headers:' + headers);

            if (error) {
                console.log('error:' + error);
                res.status(200).json(error)

            }
            console.log(body);
            res.status(200).json(body)
        })

    }
}

export default handler