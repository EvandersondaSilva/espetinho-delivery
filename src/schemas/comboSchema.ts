import { z } from 'zod';

const comboGroupInputSchema = z.object({
    type: z.enum(["CATEGORY_CHOICE", "FIXED_PRODUCT"], { message: "Tipo de group inválido" }),
    label: z.string().min(1, { message: "Label do group é obrigatório" }),
    categoryId: z.string().min(1).optional(),
    productId: z.string().min(1).optional(),
    minQuantity: z.number().int().min(1, { message: "minQuantity precisa ser >= 1" }),
    maxQuantity: z.number().int().min(1).optional(),
}).superRefine((group, ctx) => {
    if (group.type === "CATEGORY_CHOICE" && !group.categoryId) {
        ctx.addIssue({ code: "custom", path: ["categoryId"], message: "categoryId é obrigatório para group CATEGORY_CHOICE" });
    }

    if (group.type === "FIXED_PRODUCT" && !group.productId) {
        ctx.addIssue({ code: "custom", path: ["productId"], message: "productId é obrigatório para group FIXED_PRODUCT" });
    }

    if (group.maxQuantity !== undefined && group.maxQuantity < group.minQuantity) {
        ctx.addIssue({ code: "custom", path: ["maxQuantity"], message: "maxQuantity não pode ser menor que minQuantity" });
    }
});

const parseGroupsJson = (val: unknown) => {
    if (typeof val === "string") {
        try {
            return JSON.parse(val);
        } catch {
            return val;
        }
    }
    return val;
};

const comboGroupsSchema = z.preprocess(
    parseGroupsJson,
    z.array(comboGroupInputSchema).min(1, { message: "Combo precisa ter ao menos 1 group" })
);

export const createComboSchema = z.object({
    body: z.object({
        name: z.string().min(1, { message: "Name is required" }),
        price: z.string().min(1, { message: "Price is required" }),
        description: z.string().optional(),
        groups: comboGroupsSchema,
    }),
});

export const updateComboSchema = z.object({
    params: z.object({
        id: z.string().min(1, { message: "Id do combo e obrigatorio" }),
    }),
    body: z.object({
        name: z.string().min(1, { message: "Name is required" }),
        price: z.string().min(1, { message: "Price is required" }),
        description: z.string().optional(),
        groups: comboGroupsSchema,
        removeImage: z.string().optional(),
    }),
});

export const comboParamSchema = z.object({
    params: z.object({
        id: z.string().min(1, { message: "Id do combo e obrigatorio" }),
    }),
});

export const deleteComboSchema = comboParamSchema;
export const disableComboSchema = comboParamSchema;
export const enableComboSchema = comboParamSchema;
