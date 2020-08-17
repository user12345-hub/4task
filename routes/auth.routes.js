const {Router} = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
const {check, validationResult} = require('express-validator')
const User = require('../models/user')
const router = Router()

const getDate = () =>{
    const date = new Date()
    const  newDate = date.getFullYear() + '-' +
        (date.getMonth()<10 ? '0' : '') + (date.getMonth()+1) + '-' +
        (date.getDate()<10 ? '0' : '') + date.getDate() + ', ' +
        date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
    return newDate
}

router.post(
    '/register',
    [
        check('email', 'Incorrect email').isEmail(),
        check('password', 'The minimum password length is 1 character')
            .isLength({min: 1})
    ],
    async (req, res) => {
    try{
        const errors = validationResult(req)

        if (!errors.isEmpty()){
            return res.status(400).json({
                errors: errors.array(),
                message: 'Incorrect registration data'
            })
        }

        const {name, email, password} = req.body

        const candidate = await User.findOne({email})

        if (candidate) {
            return res.status(400).json({message: 'This user already exists!'})
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = new User({ name, email, password: hashedPassword, regDate: getDate(), lastLoginDate: getDate()})

        await user.save()

        const token = jwt.sign(
            {userId: user.id},
            config.get('jwtSecret'),
            {expiresIn: '1h'}
        )

        await res.json({token, userId: user.id, userEmail: user.email})

    } catch (e){
        res.status(500).json({message: 'Try again...'})
    }
})


router.post(
    '/login',
    [
        check('email', 'Please enter correct email').isEmail(),
        check('password', 'Enter password').exists()
    ],
    async (req, res) => {
    try{
        const errors = validationResult(req)

        if (!errors.isEmpty()){
            return res.status(400).json({
                errors: errors.array(),
                message: 'Incorrect data'
            })
        }

        const {email, password} = req.body

        const user = await User.findOne({email})

        if (!user){
            return res.status(400).json({message: 'User is not found...'})
        }

        // bcrypt
        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(400).json({message: 'Invalid password. Try again...'})
        }

        const s = await User.updateOne(
            {"email": email},
            { $set: {"lastLoginDate": getDate().toString()}}
            )

        const token = jwt.sign(
            {userId: user.id},
            config.get('jwtSecret'),
            {expiresIn: '1h'}
        )
        if (user.status === 'Block'){
            return res.status(403).json({message: 'User is blocked'})
        }

        await res.json({token, userId: user.id, userEmail: user.email})

    } catch (e){
        await res.status(500).json({message: 'Try again...'})
    }
})

router.post('/table', async (req, res) => {
    try {
        const users = await User.find()
        res.json(users)
    } catch (e){
        res.status(500).json({message: 'Try again...'})
    }
})

router.put('/user/block', async (req, res) => {
    try {
        await User.updateMany({email: {$in: req.body.arr}}, {$set: {status: 'Block'}})
        res.status(200).json({message: 'UPDATE!'})
    } catch (e){
        res.status(500).json({message: 'Try again...'})
    }
})

router.put('/user/unblock', async (req, res) => {
    try {
        await User.updateMany({email: {$in: req.body.arr}}, {$set: {status: 'Unblock'}})
        res.status(200).json({message: 'UPDATE!'})
    } catch (e){
        res.status(500).json({message: 'Try again..'})
    }
})

router.delete('/user/delete',
    async (req, res) => {
    try{
        await User.deleteMany({email: {$in: req.body.arr}})
        res.status(200).json({message: 'DELETE!'})
    } catch (e){
        console.log(e.message)
    }
})


module.exports = router