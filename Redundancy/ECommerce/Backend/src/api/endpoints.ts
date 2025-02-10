// src/routes.ts
import express from 'express';
import Product from '../models/Products'; 
import Order from '../models/Order';
import Cart from '../models/Cart';
import { CartProduct } from '../models/CartProduct';

const router = express.Router();

// Products Routes

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Retrieves a list of all products
 *     responses:
 *       200:
 *         description: A JSON array of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *                   price:
 *                     type: number
 *                   category:
 *                     type: string
 *                   stock:
 *                     type: integer
 */
router.get('/products', async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Fetches detailed information about a specific product
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the product
 *     responses:
 *       200:
 *         description: Detailed information of the product
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 price:
 *                   type: number
 *                 category:
 *                   type: string
 *                 stock:
 *                   type: integer
 *       404:
 *         description: Product not found
 */
router.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


/**
 * @swagger
 * /products:
 *   post:
 *     summary: Adds a new product to the store
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               category:
 *                 type: string
 *               stock:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Created product
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 price:
 *                   type: number
 *                 category:
 *                   type: string
 *                 stock:
 *                   type: integer
 *       500:
 *         description: Internal Server Error
 */
router.post('/products', async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Updates the details of an existing product
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the product
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               category:
 *                 type: string
 *               stock:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Updated product details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 price:
 *                   type: number
 *                 category:
 *                   type: string
 *                 stock:
 *                   type: integer
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal Server Error
 */
router.put('/products/:id', async (req, res) => {
  try {
    const [updated] = await Product.update(req.body, {
      where: { id: req.params.id },
    });
    if (updated) {
      const updatedProduct = await Product.findByPk(req.params.id);
      res.status(200).json(updatedProduct);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Removes a product from the store by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the product
 *     responses:
 *       204:
 *         description: Product deleted
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal Server Error
 */
router.delete('/products/:id', async (req, res) => {
  try {
    const deleted = await Product.destroy({
      where: { id: req.params.id },
    });
    if (deleted) {
      res.status(204).send('Product deleted');
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Orders Routes

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Creates a new order with selected products
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *               products:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: integer
 *                     quantity:
 *                       type: integer
 *     responses:
 *       201:
 *         description: Created order
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 userId:
 *                   type: integer
 *                 products:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       productId:
 *                         type: integer
 *                       quantity:
 *                         type: integer
 *                 totalPrice:
 *                   type: number
 *                 status:
 *                   type: string
 *       500:
 *         description: Internal Server Error
 */
router.post('/orders', async (req, res) => {
  try {
    const { userId, products } = req.body;
    let totalPrice = 0;

    for (const item of products) {
      const product = await Product.findByPk(item.productId);
      if (product) {
        totalPrice += product.price * item.quantity;
      } else {
        res.status(404).json({ error: `Product with ID ${item.productId} not found` });
        return;
      }
    }

    const order = await Order.create({ userId, products, totalPrice });
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



/**
 * @swagger
 * /orders/{userId}:
 *   get:
 *     summary: Retrieves all orders placed by a specific user
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: A list of orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   userId:
 *                     type: integer
 *                   products:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         productId:
 *                           type: integer
 *                         quantity:
 *                           type: integer
 *                   totalPrice:
 *                     type: number
 *                   status:
 *                     type: string
 *       500:
 *         description: Internal Server Error
 */
router.get('/orders/:userId', async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.params.userId },
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Cart Routes


/**
 * @swagger
 * /cart/{userId}:
 *   post:
 *     summary: Adds a product to the user's shopping cart
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: integer
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Updated cart contents
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: integer
 *                 products:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       quantity:
 *                         type: integer
 *                 totalPrice:
 *                   type: number
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal Server Error
 */
router.post('/cart/:userId', async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const product = await Product.findByPk(productId);

    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    let cart = await Cart.findByPk(req.params.userId);
    if (!cart) {
      cart = await Cart.create({ userId: req.params.userId, products: [], totalPrice: 0 });
    }

    // Log the current state of the cart
    console.log('Current cart:', cart);

    // Check if the product is already in the cart
    const existingItem = cart.products.find((item: CartProduct) => item.id === productId);
    if (existingItem) {
      // If it exists, update the quantity
      existingItem.quantity += quantity;
      console.log(`Updated quantity for product ID ${productId}:`, existingItem.quantity);
    } else {
      // If it doesn't exist, add a new item with price and quantity
      cart.products.push({ id: productId, quantity, price: product.price });
      console.log(`Added new product ID ${productId} to cart with quantity ${quantity}`);
    }

    // Log the updated products array
    console.log('Updated products array:', cart.products);

    // Recalculate the total price
    cart.totalPrice = cart.products.reduce((total: number, item: CartProduct) => {
      return total + (item.price * item.quantity);
    }, 0);

    // Log the recalculated total price
    console.log('Recalculated total price:', cart.totalPrice);

    cart.setDataValue('products', [...cart.products]); 
    // Save the updated cart
    await Cart.update(
      { products: cart.products, totalPrice: cart.totalPrice },
      { where: { userId: req.params.userId } }
    );

    // Log the saved cart
    console.log('Saved cart:', cart);

    res.status(200).json(cart);
  } catch (error) {
    console.error('Error adding item to cart:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


/**
 * @swagger
 * /cart/{userId}:
 *   get:
 *     summary: Retrieves the current state of a user's shopping cart
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: Contents of the cart
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: integer
 *                 products:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       quantity:
 *                         type: integer
 *                 totalPrice:
 *                   type: number
 *       404:
 *         description: Cart not found
 *       500:
 *         description: Internal Server Error
 */
router.get('/cart/:userId', async (req, res) => {
  try {
    const cart = await Cart.findByPk(req.params.userId);
    if (cart) {
      res.json(cart);
    } else {
      res.status(404).json({ error: 'Cart not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



/**
 * @swagger
 * /cart/{userId}/item/{productId}:
 *   delete:
 *     summary: Removes a specific product from the user's shopping cart
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the product to remove
 *     responses:
 *       200:
 *         description: Updated cart contents
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: integer
 *                 products:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       quantity:
 *                         type: integer
 *                 totalPrice:
 *                   type: number
 *       404:
 *         description: Cart or product not found
 *       500:
 *         description: Internal Server Error
 */
router.delete('/cart/:userId/item/:productId', async (req, res) => {
  try {
    const cart = await Cart.findByPk(req.params.userId);
    if (cart) {
      // Filter out the removed item
      cart.products = cart.products.filter(
        (item: any) => item.id !== parseInt(req.params.productId)
      );

      // Log the products array to verify its structure
      console.log('Products after removal:', cart.products);

      // Recalculate the total price
      cart.totalPrice = cart.products.reduce((total: number, item: any) => {
        console.log('Item:', item); // Log each item to verify its properties
        if (item.price !== undefined && item.quantity !== undefined) {
          return total + (item.price * item.quantity);
        } else {
          console.error('Item missing price or quantity:', item);
          return total;
        }
      }, 0);

      // Log the calculated total price
      console.log('Recalculated total price:', cart.totalPrice);

      await cart.save();
      res.status(200).json(cart);
    } else {
      res.status(404).json({ error: 'Cart not found' });
    }
  } catch (error) {
    console.error('Error removing item from cart:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
