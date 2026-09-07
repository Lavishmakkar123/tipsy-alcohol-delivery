const productsService = require('../services/products.service');

async function listProducts(req, res) {
  const { category, q } = req.query;
  const products = await productsService.listProducts({ category, q });
  res.json(products);
}

async function getProduct(req, res) {
  const product = await productsService.getProductById(req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
}

module.exports = { listProducts, getProduct };
