export const productSelect = {
    id: true,
    name: true,
    price: true,
    description: true,
    imageUrl: true,
    available: true,
    stock: true,
    categoryId: true,
    createdAt: true,
} as const

export const orderItemSelect = {
    id: true,
    productId: true,
    quantity: true,
    price: true,
    product: {
        select: {
            id: true,
            name: true,
            imageUrl: true,
        },
    },
} as const

export const orderComboItemSelect = {
    id: true,
    productId: true,
    quantity: true,
    product: {
        select: {
            id: true,
            name: true,
            imageUrl: true,
        },
    },
} as const

export const orderComboSelect = {
    id: true,
    comboId: true,
    price: true,
    combo: {
        select: {
            id: true,
            name: true,
            imageUrl: true,
        },
    },
    items: {
        select: orderComboItemSelect,
    },
} as const

export const orderSelect = {
    id: true,
    customerName: true,
    phone: true,
    address: true,
    deliveryFee: true,
    total: true,
    status: true,
    paymentMethod: true,
    changeFor: true,
    noChangeNeeded: true,
    autoPrinted: true,
    createdAt: true,
    items: {
        select: orderItemSelect,
    },
    combos: {
        select: orderComboSelect,
    },
} as const

export const comboGroupSelect = {
    id: true,
    type: true,
    label: true,
    categories: {
        select: {
            category: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
    },
    fixedItems: {
        select: {
            productId: true,
            quantity: true,
            product: {
                select: productSelect,
            },
        },
    },
    minQuantity: true,
    maxQuantity: true,
} as const

export const comboSelect = {
    id: true,
    name: true,
    description: true,
    price: true,
    imageUrl: true,
    available: true,
    createdAt: true,
    groups: {
        select: comboGroupSelect,
    },
} as const

export const publicComboGroupSelect = {
    id: true,
    type: true,
    label: true,
    categories: {
        select: {
            category: {
                select: {
                    id: true,
                    name: true,
                    products: {
                        where: { available: true },
                        select: productSelect,
                    },
                },
            },
        },
    },
    fixedItems: {
        select: {
            productId: true,
            quantity: true,
            product: {
                select: productSelect,
            },
        },
    },
    minQuantity: true,
    maxQuantity: true,
} as const

export const settingsSelect = {
    id: true,
    isStoreOpen: true,
    minOrderValue: true,
    createdAt: true,
    updatedAt: true,
} as const

export const publicComboSelect = {
    id: true,
    name: true,
    description: true,
    price: true,
    imageUrl: true,
    available: true,
    createdAt: true,
    groups: {
        select: publicComboGroupSelect,
    },
} as const
