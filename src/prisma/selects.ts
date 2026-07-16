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

export const orderSelect = {
    id: true,
    customerName: true,
    phone: true,
    address: true,
    deliveryFee: true,
    total: true,
    status: true,
    createdAt: true,
    items: {
        select: orderItemSelect,
    },
} as const
