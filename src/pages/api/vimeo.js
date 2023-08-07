import axios from "axios";
import { Vimeo } from "vimeo";


const handler = async (req, res) => {
    if (req.method === "POST") {
        const size = req.body.size;
        const name = req.body.name;
        const body = {
            upload: {
                approach: "tus",
                size,
            },
            name,
            privacy: {
                view: "anybody",
                embed: "public"
            },
            embed: {
                color: "#4338CA",
            }
        };
        const headers = {
            Authorization: `bearer ${process.env.VIMEO_ACCESS_TOKEN}`,
            "Content-Type": "application/json",
            Accept: "application/vnd.vimeo.*+json;version=3.4"
        };
        try {
            const response = await axios.post(
                process.env.VIMEO_API_URL,
                body,
                { headers }
            );
            res.status(200).json(response.data);

        } catch (error) {
            console.log(error)
            res.status(500).json(error);

        }

    }
    if (req.method === "GET") {
        let client = new Vimeo(process.env.VIMEO_CLIENT, process.env.VIMEO_SECRET, process.env.VIMEO_ACCESS_TOKEN);

        client.request(process.env.VIMEO_API_URL, function (error, body, status_code, headers) {
            console.log('status code:' + status_code);
            console.log('headers:' + headers);

            if (error) {
                console.log('error:' + error);
                res.status(500).json(error)

            }
            console.log(body);
            res.status(200).json(body)
        })

    } else {
        console.log('403')
        res.status(403).json({ error: 'No route' })
    }
};

export default handler