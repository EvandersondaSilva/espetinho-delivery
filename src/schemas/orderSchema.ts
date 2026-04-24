import { z } from "zod";

const orderStatusSchema = z.enum(["RECEBIDO", "PREPARANDO", "SAIU", "ENTREGUE"]);

export const createOrderSchema = z.object({
    body: z.object({
        customerName: z.string().min(1, { message: "Nome do cliente e obrigatorio" }),
        phone: z.string().min(1, { message: "Telefone e obrigatorio" }),
        address: z.string().min(1, { message: "Endereco e obrigatorio" }),
        deliveryFee: z.number().int().min(0, { message: "Taxa de entrega invalida" }).optional(),
        items: z.array(
            z.object({
                productId: z.string().min(1, { message: "Id do produto e obrigatorio" }),
                quantity: z.number().int().min(1, { message: "Quantidade precisa ser maior que zero" }),
            })
        ).min(1, { message: "Pedido precisa ter ao menos 1 item" }),
    }),
});

export const getOrderByIdSchema = z.object({
    params: z.object({
        id: z.string().min(1, { message: "Id do pedido e obrigatorio" }),
    }),
});

export const updateOrderStatusSchema = z.object({
    params: z.object({
        id: z.string().min(1, { message: "Id do pedido e obrigatorio" }),
    }),
    body: z.object({
        status: orderStatusSchema,
    }),
});

export const deleteOrderSchema = z.object({
    params: z.object({
        id: z.string().min(1, { message: "Id do pedido e obrigatorio" }),
    }),
});

export const createOrderItemSchema = z.object({
    body: z.object({
        orderId: z.string().min(1, { message: "Id do pedido e obrigatorio" }),
        productId: z.string().min(1, { message: "Id do produto e obrigatorio" }),
        quantity: z.number().int().min(1, { message: "Quantidade precisa ser maior que zero" }),
    }),
});

export const deleteOrderItemSchema = z.object({
    params: z.object({
        id: z.string().min(1, { message: "Id do item do pedido e obrigatorio" }),
    }),
});
