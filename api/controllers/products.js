/* eslint-disable no-console */
const mongoose = require('mongoose');
const Product = require('../models/product');

exports.products_get_all = (req, res) => {
  Product.find()
    .select('name _id price productImage')
    .exec()
    .then((docs) => {
      const response = {
        count: docs.length,
        products: docs.map((doc) => ({
          name: doc.name,
          price: doc.price,
          productImage: doc.productImage,
          // eslint-disable-next-line no-underscore-dangle
          _id: doc._id,
          request: {
            type: 'GET',
            url: `http://localhost:3000/products/${doc.id}`,
          },
        })),
      };
      console.log(response);
      res.status(200).json(response);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

exports.products_create_new = (req, res) => {
  console.log(req.file);
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path,
  });
  product
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: 'Created Product Successfully',
        createdProduct: {
          name: result.name,
          price: result.price,
          // eslint-disable-next-line no-underscore-dangle
          _id: result._id,
          request: {
            type: 'GET',
            url: `http://localhost:3000/products/${result.id}`,
          },
        },
      });
    }).catch(
      (err) => {
        console.log(err);
        res.status(500).json({ error: err });
      },
    );
};

exports.products_get_single = (req, res) => {
  const id = req.params.productId;
  Product.findById(id)
    .exec()
    .then((doc) => {
      console.log('From Database ', doc);
      if (doc) {
        res.status(200).json({
          product: {
            // eslint-disable-next-line no-underscore-dangle
            _id: doc._id,
            name: doc.name,
            price: doc.price,
          },
          request: {
            type: 'GET',
            url: 'http://localhost:3000/products/',
          },
        });
      } else {
        res.status(404).json({ message: 'No valid entry found' });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

exports.products_update_single = (req, res) => {
  const id = req.params.productId;
  const updateOps = {};
  // eslint-disable-next-line no-restricted-syntax
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Product.update({ _id: id }, { $set: updateOps })
    .exec()
    .then((result) => {
      console.log(result);
      res.status(200).json({
        message: 'Product Updated',
        result,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};


exports.product_delete_single = (req, res) => {
  const id = req.params.productId;
  Product.remove({ _id: id })
    .exec()
    // eslint-disable-next-line no-unused-vars
    .then((result) => {
      res.status(200).json({
        message: 'Order deleted',
        request: {
          type: 'POST',
          url: 'http://localhost:3000/orders/',
          body: {
            productId: 'ID',
            quantity: 'Number',
          },
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};
