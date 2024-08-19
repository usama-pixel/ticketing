import { currentUser } from '@uatickets/common'
import express from 'express'

const router = express.Router()

router.get(
    '/api/users/currentuser',
    currentUser,
    (req, res) => {
    return res.send({currentUser: req.currentUser || null})
})

export { router as currentUserRouter } 