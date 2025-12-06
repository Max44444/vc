import PinataClient from '@pinata/sdk'
import 'dotenv/config'

export const pinata = new PinataClient({
    pinataApiKey: process.env.PINATA_API_KEY,
    pinataSecretApiKey: process.env.PINATA_API_SECRET,
});
