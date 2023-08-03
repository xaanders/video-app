import axios from "axios";


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
                VIMEO_API_URL,
                body,
                { headers }
            );
            res.status(200).json(response.data);

        } catch (error) {
            console.log(error)
            res.status(500).json(error);

        }

    } else {
        console.log('403')
        res.status(403).json({ error: 'No route' })
    }
};

export default handler