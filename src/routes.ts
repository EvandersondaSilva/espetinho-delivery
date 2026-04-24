import { Router } from "express";
import multer from "multer";
import uploadConfig from './config/multer'
import { validateSchema } from "./middlewares/validateSchema";
import { createCategorySchema, deleteCategorySchema, updateCategorySchema } from "./schemas/categorySchema";
import { CreateCategoryController } from "./controllers/category/createCategoryController";
import { ListCategoryController } from "./controllers/category/listCategoryController";
import { UpdateCategoryController } from "./controllers/category/updateCategoryController";
import { DeleteCategoryController } from "./controllers/category/deleteCategoryController";
import { CreateProductController } from "./controllers/product/createProductController";
import { ListProductController } from "./controllers/product/listProductController";
import { createProductSchema, deleteProductSchema, disableProductSchema, enableProductSchema, listProductsByCategorySchema, updateProductSchema } from "./schemas/productSchema";
import { ListProductsByCategoryController } from "./controllers/product/listProductsByCategoryController";
import { UpdateProductController } from "./controllers/product/updateProductController";
import { DeleteProductController } from "./controllers/product/deleteProductController";
import { DisableProductController } from "./controllers/product/disableProductController";
import { EnableProductController } from "./controllers/product/enableProductController";
import { createOrderItemSchema, createOrderSchema, deleteOrderItemSchema, deleteOrderSchema, getOrderByIdSchema, updateOrderStatusSchema } from "./schemas/orderSchema";
import { CreateOrderController } from "./controllers/order/createOrderController";
import { AddOrderItemController } from "./controllers/order/addOrderItemController";
import { DeleteOrderItemController } from "./controllers/order/deleteOrderItemController";
import { ListOrdersController } from "./controllers/order/listOrdersController";
import { GetOrderByIdController } from "./controllers/order/getOrderByIdController";
import { UpdateOrderStatusController } from "./controllers/order/updateOrderStatusController";
import { DeleteOrderController } from "./controllers/order/deleteOrderController";
import { CreateUserController } from "./controllers/user/createUserController";
import { authUserSchema, createUserSchema } from "./schemas/userSchema";
import { AuthUserController } from "./controllers/user/authUserController";
import { DetailUserController } from "./controllers/user/detailsUserController";
import { isAuthenticated } from "./middlewares/isAuthenticated";

const routes = Router();
const upoload = multer(uploadConfig)

// users
routes.post("/users", isAuthenticated, validateSchema(createUserSchema), new CreateUserController().handle)

// login
routes.post("/session", validateSchema(authUserSchema), new AuthUserController().handle)

// buscar detalhes do usuario
routes.get("/me", isAuthenticated, new DetailUserController().handle)

// criando categoria
routes.post("/category", isAuthenticated, validateSchema(createCategorySchema), new CreateCategoryController().handle)

// listar categorias
routes.get("/category", new ListCategoryController().handle)

// listar produtos por categoria
routes.get("/category/:id/products", validateSchema(listProductsByCategorySchema), new ListProductsByCategoryController().handle)

// editar categoria
routes.put("/category/:id", isAuthenticated, validateSchema(updateCategorySchema), new UpdateCategoryController().handle)

// deletar categoria
routes.delete("/category/:id", isAuthenticated, validateSchema(deleteCategorySchema), new DeleteCategoryController().handle)

// criando produto
routes.post("/product", isAuthenticated, upoload.single('file'), validateSchema(createProductSchema), new CreateProductController().handle)

// editar produto
routes.put("/product/:id", isAuthenticated, upoload.single('file'), validateSchema(updateProductSchema), new UpdateProductController().handle)

// desabilitar produto
routes.patch("/product/:id/disable", isAuthenticated, validateSchema(disableProductSchema), new DisableProductController().handle)

// habilitar produto
routes.patch("/product/:id/enable", isAuthenticated, validateSchema(enableProductSchema), new EnableProductController().handle)

// listar produtos
routes.get("/product", new ListProductController().handle)

// deletar produto
routes.delete("/product/:id", isAuthenticated, validateSchema(deleteProductSchema), new DeleteProductController().handle)

// criar pedido
routes.post("/order", validateSchema(createOrderSchema), new CreateOrderController().handle)

// adicionar item ao pedido
routes.post("/order-item", validateSchema(createOrderItemSchema), new AddOrderItemController().handle)

// remover item do pedido
routes.delete("/order-item/:id", validateSchema(deleteOrderItemSchema), new DeleteOrderItemController().handle)

// listar pedidos
routes.get("/orders", isAuthenticated, new ListOrdersController().handle)

// detalhar pedido
routes.get("/order/:id", isAuthenticated, validateSchema(getOrderByIdSchema), new GetOrderByIdController().handle)

// atualizar status do pedido
routes.patch("/order/:id/status", isAuthenticated, validateSchema(updateOrderStatusSchema), new UpdateOrderStatusController().handle)

// cancelar pedido
routes.delete("/order/:id", isAuthenticated, validateSchema(deleteOrderSchema), new DeleteOrderController().handle)

export default routes;