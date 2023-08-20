import { ConnectToDatabase } from '@/helpers/dbConnection';

import { hash } from "bcrypt";

const handler = async (req, res) => {
    if (req.method !== "POST") {
        return;
    }
    const {
        name,
        email,
        password
    } = req.body;


    const { db, dbClient } = await ConnectToDatabase(process.env.MONGODB_URL);
    const usersCollection = db.collection('users');

    try {
        console.log(password)
        const hashedPassword = await hash(password, 12);
        await usersCollection.insertOne({
            name,
            email,
            password: hashedPassword,
        });
        dbClient.close();
        return res.status(201).json({ message: "User successfully created!", redirect: true });
    } catch (error) {
        dbClient.close();
        return res.status(500).json({ message: "We couldn't create a new user!" });
    }

}

export default handler;