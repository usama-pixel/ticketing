import mongoose from "mongoose";
import { MongoMemoryServer } from 'mongodb-memory-server'
import jwt from 'jsonwebtoken'

declare global {
    var signin: () => string[];
}

jest.mock('../nats-wrapper')

let mongo: any
beforeAll(async () => {
    process.env.JWT_KEY = 'abc'
    // process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    mongo = await MongoMemoryServer.create()
    const mongoUri = mongo.getUri()
    await mongoose.connect(mongoUri, {})
})

beforeEach(async () => {
    jest.clearAllMocks()
    const collections = await mongoose.connection.db?.collections()
    if (!collections) return
    for (let collection of collections) {
        await collection.deleteMany({})
    }
})

afterAll(async () => {
    if(mongo) {
        await mongo.stop()
    }
    await mongoose.connection.close()
})

global.signin = () => {
    const id = new mongoose.Types.ObjectId().toHexString()
    const payload = {
        id: id,
        email: 'test@test.com'
    }
    const token = jwt.sign(payload, process.env.JWT_KEY!)
    const session = { jwt: token }
    const sessionJSON = JSON.stringify(session)
    const base64 = Buffer.from(sessionJSON).toString('base64')
    return [`session=${base64}`];
}