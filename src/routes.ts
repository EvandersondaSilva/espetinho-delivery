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
import { createProductSchema, deleteProductSchema, disableProductSchema, enableProductSchema, listProductsByCategorySchema, productParamSchema, updateProductSchema } from "./schemas/productSchema";
import { ListProductsByCategoryController } from "./controllers/product/listProductsByCategoryController";
import { UpdateProductController } from "./controllers/product/updateProductController";
import { DeleteProductController } from "./controllers/product/deleteProductController";
import { DisableProductController } from "./controllers/product/disableProductController";
import { EnableProductController } from "./controllers/product/enableProductController";
import { createOrderItemSchema, createOrderSchema, deleteOrderItemSchema, deleteOrderSchema, getOrderByIdSchema, listOrdersSchema, updateOrderStatusSchema } from "./schemas/orderSchema";
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
import { createComboSchema, updateComboSchema, comboParamSchema, deleteComboSchema, disableComboSchema, enableComboSchema } from "./schemas/comboSchema";
import { CreateComboController } from "./controllers/combo/createComboController";
import { UpdateComboController } from "./controllers/combo/updateComboController";
import { ListCombosController } from "./controllers/combo/listCombosController";
import { ListPublicCombosController } from "./controllers/combo/listPublicCombosController";
import { GetComboByIdController } from "./controllers/combo/getComboByIdController";
import { DisableComboController } from "./controllers/combo/disableComboController";
import { EnableComboController } from "./controllers/combo/enableComboController";
import { DeleteComboController } from "./controllers/combo/deleteComboController";
import { updateStoreStatusSchema } from "./schemas/settingsSchema";
import { GetSettingsController } from "./controllers/settings/getSettingsController";
import { UpdateStoreStatusController } from "./controllers/settings/updateStoreStatusController";

const routes = Router();
const upload = multer(uploadConfig)

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
routes.post("/product", isAuthenticated, upload.single('file'), validateSchema(createProductSchema), new CreateProductController().handle)

// editar produto
routes.put("/product/:id", isAuthenticated, validateSchema(productParamSchema), upload.single('file'), validateSchema(updateProductSchema), new UpdateProductController().handle)

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
routes.post("/order-item", isAuthenticated, validateSchema(createOrderItemSchema), new AddOrderItemController().handle)

// remover item do pedido
routes.delete("/order-item/:id", isAuthenticated, validateSchema(deleteOrderItemSchema), new DeleteOrderItemController().handle)

// listar pedidos
routes.get("/orders", isAuthenticated, validateSchema(listOrdersSchema), new ListOrdersController().handle)

// detalhar pedido
routes.get("/order/:id", isAuthenticated, validateSchema(getOrderByIdSchema), new GetOrderByIdController().handle)

// atualizar status do pedido
routes.patch("/order/:id/status", isAuthenticated, validateSchema(updateOrderStatusSchema), new UpdateOrderStatusController().handle)

// cancelar pedido
routes.delete("/order/:id", isAuthenticated, validateSchema(deleteOrderSchema), new DeleteOrderController().handle)

// criar combo
routes.post("/combo", isAuthenticated, upload.single('file'), validateSchema(createComboSchema), new CreateComboController().handle)

// editar combo
routes.put("/combo/:id", isAuthenticated, validateSchema(comboParamSchema), upload.single('file'), validateSchema(updateComboSchema), new UpdateComboController().handle)

// listar combos (admin, todos)
routes.get("/combo", isAuthenticated, new ListCombosController().handle)

// detalhar combo
routes.get("/combo/:id", isAuthenticated, validateSchema(comboParamSchema), new GetComboByIdController().handle)

// desabilitar combo
routes.patch("/combo/:id/disable", isAuthenticated, validateSchema(disableComboSchema), new DisableComboController().handle)

// habilitar combo
routes.patch("/combo/:id/enable", isAuthenticated, validateSchema(enableComboSchema), new EnableComboController().handle)

// deletar combo
routes.delete("/combo/:id", isAuthenticated, validateSchema(deleteComboSchema), new DeleteComboController().handle)

// listar combos disponiveis (publico)
routes.get("/combos", new ListPublicCombosController().handle)

// buscar configuracoes da loja
routes.get("/settings", new GetSettingsController().handle)

// atualizar status aberto/fechado da loja
routes.patch("/settings/store-status", isAuthenticated, validateSchema(updateStoreStatusSchema), new UpdateStoreStatusController().handle)

export default routes;