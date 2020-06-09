/* eslint-disable object-shorthand */
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
const express = require('express');
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');

const ProductController = require('../controllers/products');

const storage = multer.diskStorage({
  // eslint-disable-next-line object-shorthand
  // eslint-disable-next-line func-names
  destination: function (req, file, cb) {
    cb(null, './uploads');
  },
  // eslint-disable-next-line func-names
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(new Error('An Error Occured'), false);
  }
};

const router = express.Router();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});


router.get('/', ProductController.products_get_all);

router.post('/', checkAuth, upload.single('productImage'), ProductController.products_create_new);

router.get('/:productId', ProductController.products_get_single);

router.patch('/:productId', checkAuth, ProductController.products_update_single);

router.delete('/:productId', checkAuth, ProductController.product_delete_single);


module.exports = router;
