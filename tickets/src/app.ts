import express, { Request } from 'express'
import 'express-async-errors'
import { json } from 'body-parser'
import cookieSession from 'cookie-session'
import { errorHandler, NotFoundError } from '@uatickets/common'

const app = express()
app.set('trust proxy', true)
app.use(json())
app.use(cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test'
}))


app.all('*', async () => { // app.all is a shortcut for app.get, app.post, app.put, app.delete
    // it will watch for any kind of method and route
    throw new NotFoundError()
})

app.use(errorHandler)

export { app }