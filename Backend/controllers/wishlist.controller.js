const wishlistService = require('../services/wishlist.service');

async function listWishlist(req, res) {
  const products = await wishlistService.getWishlist(req.user.id);
  res.json(products);
}

async function addWishlistItem(req, res) {
  await wishlistService.addToWishlist(req.user.id, req.params.productId);
  res.status(204).end();
}

async function removeWishlistItem(req, res) {
  await wishlistService.removeFromWishlist(req.user.id, req.params.productId);
  res.status(204).end();
}

module.exports = { listWishlist, addWishlistItem, removeWishlistItem };
