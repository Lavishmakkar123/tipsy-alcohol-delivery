const express = require('express');
const { listWishlist, addWishlistItem, removeWishlistItem } = require('../controllers/wishlist.controller');
const { requireAuth } = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/', requireAuth, listWishlist);
router.post('/:productId', requireAuth, addWishlistItem);
router.delete('/:productId', requireAuth, removeWishlistItem);

module.exports = router;
