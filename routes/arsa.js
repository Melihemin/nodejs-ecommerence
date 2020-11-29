// Package :
const express = require("express");
const fileUpload = require('express-fileupload');
const arsa = require("../models/arsa");
const router = express.Router();
const path = require("path");
const Category = require("../models/Category");


router.get('/detaylar', (req, res) => {
    res.render('site/product')
});

router.get('/ekle', (req, res) => {
    if(!req.session.userId){
        res.redirect('users/login')
    }
    Category.find({}).then(categories => {
        res.render('site/addarsa', {categories:categories})
    })
});

router.get('/kategori/:categoryId', (req, res) => {
    arsa.find({category:req.params.categoryId}).populate({path:'category', model:Category}).then(arsas => {
      Category.aggregate([
        {
          $lookup:{
            from: 'arsas',
            localField: '_id',
            foreignField: 'category',
            as: 'arsas'
          }
        },
        {
          $project: {
            _id: 1,
            cname: 1,
            num_of_arsas : {$size: '$arsas'}
          }
        }
      ]).then(categories => {
        res.render('site/ilanlar', {arsas:arsas, categories:categories})
      })
    })
})


router.get("/:id", (req, res) => {
  arsa.findById(req.params.id).then((arsa) => {
    res.render("site/product", { arsa: arsa });
  });
});

router.post('/test', (req, res) => {
  let post_image = req.files.post_image;
  post_image.mv(
    path.resolve(__dirname, "../public/img/postimages", post_image.name)
  ),
  arsa.create({
    ...req.body,
    post_image: `/img/postimages/${post_image.name}`,
  }, )
  
  req.session.sessionFlash = {
    type: 'alert alert-info',
    message: 'İlan Başarılı Bir Şekilde Oluşturuldu.'
  }
  
  res.redirect('/ilanlar')
});









/* router.post("/test", (req, res) => {
    let post_image = req.files.post_image;
    post_image.mv(
      path.resolve(__dirname, "../public/img/postimages", post_image.name)
    );
    Post.create({
      ...req.body,
      post_image: `/img/postimages/${post_image.name}`,
    })
    res.redirect("/blog");
}); */

// Router :
module.exports = router;
