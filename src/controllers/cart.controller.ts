import { Request, Response } from "express";
import { getRepository } from "typeorm";
import Cart from "../entities/Cart";
import CartItem from "../entities/CartItem";

class CartController {
  static createAndAddToCart = async (req: Request, res: Response) => {
    let { productId } = req.body;
    const { userId } = res.locals;

    const cartRepository = getRepository(Cart);
    const cartId = await cartRepository.findOne({
      where: {
        user: userId,
      },
    });

    try {
      const cartItemRepository = getRepository(CartItem);
      const cartFind = await cartRepository.findOne({ user: userId });
      let cartItem = new CartItem();

      if (cartFind) {
        cartItem["cart"] = cartFind;
        cartItem["product"] = productId;

        const itemInCart = await cartItemRepository.findOne({
          where: {
            cart: cartId,
            product: productId,
          },
        });

        if (itemInCart) {
          itemInCart.quantity = itemInCart.quantity + 1;
          cartItemRepository
            .save(itemInCart)
            .then(() => {
              res.json({
                message: "Add to Cart Successfully !!",
                status: "OK",
              });
            })
            .catch((err) =>
              res.json({
                cartItem: "CartItem - Case Update Quantity",
                err,
              })
            );
        } else {
          cartItem.quantity = 1;
          cartItemRepository
            .save(cartItem)
            .then(() => {
              res.json({
                message: "Add to Cart Successfully !!",
                status: "OK",
              });
            })
            .catch((err) =>
              res.json({
                cartItem: "CartItem - Case Add New Product",
                err,
              })
            );
        }
      }else{
        res.json({ "message": "No cart found !!" });
      }
    } catch (error) {
      res.json(error);
    }
  };

  static getCartById = async (req: Request, res: Response) => {
    const { userId } = res.locals;
    const cartRepository = getRepository(Cart);

    console.log(userId);

    try {
      const cart = await cartRepository
        .createQueryBuilder("cart")
        .where({ user: userId })
        .leftJoinAndSelect("cart.cartItem", "cartItem")
        .leftJoinAndSelect("cartItem.product", "product")
        .getOne();

      let totalPriceInCart = 0;

      if (cart.cartItem.length) {
        totalPriceInCart = cart.cartItem
          .map((c) => c.product.price * c.quantity)
          .reduce((a, b) => a + b);
      }

      const cartToSend = {
        ...cart,
        totalPriceInCart,
        totalItem: cart.cartItem.length,
      };

      res.json(cartToSend);
    } catch (error) {
      res.status(200).json({
        cartItem: [],
        totalPriceInCart: 0,
        totalItem: 0,
      });
    }
  };

  static deteleProductInCart = async (req: Request, res: Response) => {
    const { cartItemId } = req.params;
    const cartItemRepository = getRepository(CartItem);

    const cart = await cartItemRepository.findOne(cartItemId);

    if (cart) {
      cartItemRepository
        .delete(cartItemId)
        .then(() => {
          const status = {
            message: `Delete ProductId ${cartItemId} Successfully !!`,
          };

          res.json(status);
        })
        .catch((err) => res.status(400).json(err));
    } else {
      const status = {
        message: `No Cart Item Found !!`,
      };

      res.json(status);
    }
  };

  static deteleAllProductInCart = async (req: Request, res: Response) => {
    const { userId } = res.locals;

    const cartRepository = getRepository(Cart);
    const cartItemRepository = getRepository(CartItem);

    const cart = await cartRepository.findOne({
      where: {
        user: userId,
      },
    });

    const cartItem = await cartItemRepository.find({
      where: {
        cart,
      },
    });

    if (cartItem.length) {
      cartItemRepository
        .remove(cartItem)
        .then(() => {
          const status = {
            message: `Remove Cart Successfully !!`,
          };

          res.json(status);
        })
        .catch((err) => res.status(400).json(err));
    } else {
      const status = {
        message: `No Cart Found !!`,
      };

      res.json(status);
    }
  };

  static editCart = async (req: Request, res: Response) => {
    const { cartItemId, action = "plus" } = req.body;
    const cartItemRepository = getRepository(CartItem);

    const itemInCart = await cartItemRepository.findOne(cartItemId);

    if (itemInCart) {
      if (action === "plus") {
        itemInCart.quantity += 1;
      } else {
        itemInCart.quantity -= 1;
        if (itemInCart.quantity <= 0) {
          itemInCart.quantity = 0;
        }
      }

      if (itemInCart.quantity >= 1) {
        cartItemRepository
          .save(itemInCart)
          .then(() => {
            const status = {
              message: `${
                action === "plus" ? "Plus" : "Minus"
              } Quantity Successfully !!`,
            };

            res.json(status);
          })
          .catch((err) => res.status(400).json(err));
      }
    } else {
      const status = {
        message: `No Cart Item Found !!`,
      };

      res.json(status);
    }
  };
}

export default CartController;
