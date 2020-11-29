// Package :
const express = require("express");
const User = require("../models/User");
const router = express.Router();

// URL
router.get('/5fbe775bc64faa0588f27f55/75bc64faa0588/88f27f', (req, res) => {
    if(!req.session.userId){
        res.redirect('/users/login')
    }
    res.render('site/register')
})

router.post('/5fbe775bc64faa0588f27f55/75bc64faa0588/88f27f', (req, res) => {
    if(!req.session.userId){
        res.redirect('/users/login')
    }
    User.create(req.body, (error, user) => {
        req.session.sessionFlash = {
            type: 'alert alert-success',
            message: 'Kullanıcı Başarılı Bir Şekilde Oluşturuldu.'
        }
        res.redirect('/users/login')
    })
})

router.get('/login', (req, res) => {
    res.render('site/login');
})

router.post('/login', (req, res) => {
    const {email, password} = req.body

    User.findOne({email},(error, user) => {
        if (user) {
            if (user.password == password) {
                req.session.userId = user._id
                
                res.redirect('/')
            } else {
                res.redirect('/users/login')
            }
        } else {
            res.redirect('/users/login')
        }
    })
})

router.get('/logout', (req, res) => {
    if(!req.session.userId){
        res.redirect('/users/login')
    }
    req.session.destroy(() => {
        res.redirect('/');
    })
})





module.exports = router