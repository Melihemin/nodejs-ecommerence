// Package :
const express = require('express');
const arsa = require('../models/arsa');
const router = express.Router()
const Category = require('../models/Category');

// URL :
router.get('/', (req, res) => {
    console.log(req.session)
    res.render('site/home');
})

router.get('/ilanlar', (req, res) => {

  const arsaPerPage = 12
  const page = req.query.page || 1


  arsa.find({}).sort({$natural:-1})
    .skip((arsaPerPage * page) - arsaPerPage)
    .limit(arsaPerPage)
    .then(arsas => {
    arsa.countDocuments().then(arsaCount => {
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
        res.render('site/ilanlar', 
          {arsas:arsas, 
           categories:categories,
           current: parseInt(page),
           pages:Math.ceil(arsaCount/arsaPerPage)
        })
      })
    })
  })
});

router.get('/iletisim', (req, res) => {
  res.render('site/contact')
})

router.get('/hakkimizda' , (req, res) => {
  res.render('site/about')
})



// Router :
module.exports = router