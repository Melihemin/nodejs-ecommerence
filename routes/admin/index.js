// Package :
const express = require("express");
const Category = require("../../models/Category");
const arsa = require("../../models/arsa");
const router = express.Router();
const path = require('path');
const { post } = require("../arsa");



router.get('/', (req, res) => {
    if(!req.session.userId){
        res.redirect('/users/login')
    }
    res.render('admin/index')
});

router.get('/categories', (req, res) => {
    if(!req.session.userId){
        res.redirect('/users/login')
    }
    
    Category.find({}).sort({$natural:-1}).then(categories => {
        res.render('admin/categories', {categories:categories})
    })
});

router.post('/categories', (req, res) => {
    if(!req.session.userId){
        res.redirect('/users/login')
    }
    Category.create(req.body, (error, category) => {
        if(!error) {
            res.redirect('/admin/categories')
        }
})})

router.delete('/categories/:id', (req, res) => {
    if(!req.session.userId){
        res.redirect('/users/login')
    }
    Category.remove({_id : req.params.id}).then(()=> {
        res.redirect('/admin/categories')
    })
});

router.get('/ilanlar', (req, res) => {
    if(!req.session.userId){
        res.redirect('/users/login')
    }
    arsa.find({}).populate({path:'category', model: Category}).sort({$natural:-1}).then(arsas => {
          res.render('admin/ilanlar', {arsas:arsas})
      })
});

router.delete('/ilanlar/:id', (req, res) => {
    if(!req.session.userId){
        res.redirect('/users/login')
    }
    arsa.remove({_id : req.params.id}).then(()=> {
        res.redirect('/admin/ilanlar')
    })
});

router.get('/ilanlar/edit/:id', (req, res) => {
    if(!req.session.userId){
        res.redirect('/users/login')
    }
    arsa.findOne({_id: req.params.id}).then(arsa => {
        Category.find({}).then(categories => {
            res.render('admin/editpost', {arsa:arsa , categories:categories})
        })
    })
});

router.put('/ilanlar/:id', (req, res) => {
    if(!req.session.userId){
        res.redirect('/users/login')
    }
  let post_image = req.files.post_image;
    post_image.mv(
        path.resolve(__dirname, "../../public/img/postimages", post_image.name)
    ) 

    arsa.findOne({_id: req.params.id}).then(arsa => {
        arsa.title = req.body.title
        arsa.content = req.body.content
        arsa.date = req.body.date
        arsa.category = req.body.category
        arsa.m2 = req.body.m2
        arsa.m2fiyati = req.body.m2fiyati
        arsa.imardurumu = req.body.imardurumu
        arsa.adano = req.body.adano
        arsa.parselno = req.body.parselno
        arsa.paftano= req.body.paftano
        arsa.kaks= req.body.kaks
        arsa.gabari = req.body.gabari
        arsa.tapudurumu = req.body.tapudurumu
        arsa.katkarsilik = req.body.katkarsilik
        arsa.krediuygunluk = req.body.krediuygunluk
        arsa.takas = req.body.takas
        arsa.adres = req.body.adres
        arsa.cash = req.body.cash
        arsa.post_image = `/img/postimages/${post_image.name}`
        
        arsa.save().then(arsa => {
            res.redirect('/admin/ilanlar')
        })
    })
})

// Router :
module.exports = router;
