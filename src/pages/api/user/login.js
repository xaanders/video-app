import { ConnectToDatabase } from "@/helpers/dbConnection";
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcrypt";
import NextAuth from "next-auth/next";

export const authOptions = {
    session: {
        jwt: true
    },
    providers: [
        CredentialsProvider({
            name: "credentials",
            authorize: async (credentials) => {
                if (!credentials) return null;
                const { db, dbClient } = await ConnectToDatabase(process.env.MONGODB_URL);
                const usersCollection = db.collection('users');
                const user = await usersCollection.findOne({ email: credentials.email });

                if (!user) {
                    dbClient.close();
                    throw new Error('No user found!')
                }

                const passwordIsValid = await compare(credentials.password, user.password);

                if (!passwordIsValid) {
                    dbClient.close();
                    throw new Error('Invalid password! Try again!')
                }
                dbClient.close();

                const newUser = {
                    name: user.name,
                    email: user.email,
                    id: user._id,
                    image: ''
                }
                if (user) {
                    return newUser
                }
                return null

            },
            credentials: {
                email: {},
                password: {}
            },

        })
    ],
    callbacks: {
        async jwt({ token, account }) {
            if (account) {
                token.idToken = account.providerAccountId;
            }
            return token

        },
        async session({ session, token, user }) {
            if (token) {
                session.user.id = token.idToken
            }
            return session;
        }
    },
    secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions)