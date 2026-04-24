# Contexto do Projeto — Backend `espetinho-nilson`

Documento de referência do backend: **arquitetura**, **organização**, **endpoints**, **validações**, **middlewares**, **modelagem do banco** e **versões**.

## Stack e versões

As versões abaixo foram extraídas do `package.json`.

### Runtime / Linguagem
- **Node.js**: (não fixado no repositório; recomendado fixar via `.nvmrc`/`.node-version`)
- **TypeScript**: `^5.9.3`
- **Execução em dev**: `tsx` `^4.21.0` (watch)

### HTTP / API
- **Express**: `^5.2.1`
- **CORS**: `^2.8.6`
- **dotenv**: `^17.3.1`

### Autenticação
- **jsonwebtoken**: `^9.0.3` (JWT no header `Authorization`)
- **bcryptjs**: `^3.0.3` (hash de senha)

### Banco de dados
- **PostgreSQL driver**: `pg` `^8.20.0`
- **Prisma**:
  - `prisma` (dev): `^7.5.0`
  - `@prisma/client`: `^7.5.0`
  - `@prisma/adapter-pg`: `^7.5.0`

### Upload de imagem
- **multer**: `^2.1.1` (upload multipart)
- **cloudinary**: `^2.9.0` (armazenamento de imagens)

### Validação
- **zod**: `^4.3.6`

## Scripts (como rodar)

Definido em `package.json`:

- **Dev**: `npm run dev` → `tsx watch src/server.ts`

## Arquitetura (padrão usado)

Arquitetura baseada em camadas:

- **Rotas** (`src/routes.ts`)
  - Definem os endpoints e aplicam middlewares (autenticação, validação, upload etc.)
- **Controllers** (`src/controllers/**`)
  - Recebem `Request/Response`
  - Extraem dados (body/params/query)
  - Chamam o **Service**
  - Retornam a resposta ao cliente
- **Services** (`src/services/**`)
  - Implementam a lógica de negócio
  - Falam com banco via **Prisma**
  - Integram com serviços externos (ex.: Cloudinary)
  - Retornam o resultado ao controller

Fluxo (exemplo):

- **Rotas → (middlewares) → Controller → Service → (Prisma/Cloudinary/JWT) → Controller → Cliente**

## Organização de pastas

Estrutura atual (principal):

- `src/server.ts` — bootstrap do servidor (Express + middlewares globais + rotas + handler de erro)
- `src/routes.ts` — definição dos endpoints
- `src/controllers/` — controllers por domínio
  - `category/`
  - `product/`
  - `order/`
  - `user/`
- `src/services/` — services por domínio
  - `category/`
  - `product/`
  - `order/`
  - `user/`
- `src/schemas/` — schemas Zod (validação de body/params/query)
  - `categorySchema.ts`
  - `productSchema.ts`
  - `orderSchema.ts`
  - `userSchema.ts`
- `src/middlewares/`
  - `validateSchema.ts` — validação Zod
  - `isAuthenticated.ts` — JWT Bearer
- `src/@types/express/index.d.ts` — extensão de `Request` (`user_id`)
- `src/config/` — configurações de infraestrutura
  - `cloudinary.ts`
  - `multer.ts`
- `src/prisma/index.ts` — instância do Prisma Client (com adapter `@prisma/adapter-pg`)
- `prisma/schema.prisma` — modelagem do banco (Prisma)
- `src/generated/prisma/` — Prisma Client gerado (output configurado no schema)

## Middlewares e configurações globais

Em `src/server.ts`:

- **`express.json()`**: habilita JSON no body
- **`cors()`**: habilita CORS (config padrão)
- **`routes`**: registra `src/routes.ts`
- **Handler de erro** (4 argumentos): se `error instanceof Error`, responde **400** com `{ error: error.message }`; caso contrário **500** com mensagem genérica

Em `src/middlewares/validateSchema.ts`:

- **`validateSchema(schema)`**:
  - Executa `schema.parseAsync({ body, params, query })`
  - Em erro de validação (`ZodError`): retorna **400** com detalhes
  - Em erro inesperado: retorna **500**

Em `src/middlewares/isAuthenticated.ts`:

- **`isAuthenticated`**:
  - Espera header **`Authorization`** no formato `Bearer <token>`
  - Valida o JWT com **`JWT_SECRET`** (`verify` do `jsonwebtoken`)
  - Payload usa **`sub`** como id do usuário → atribui a **`req.user_id`** (tipado em `src/@types/express/index.d.ts`)
  - Sem token: **401** `{ error: "token não fornecido" }`
  - Token inválido: **401** `{ error: "Token inválido" }`

## Validação por schema (Zod)

Os schemas são definidos em `src/schemas/*` e aplicados nas rotas via:

- `validateSchema(nomeDoSchema)`

### `categorySchema.ts`
- **`createCategorySchema`**:
  - body: `{ name: string (min 2) }`
- **`updateCategorySchema`**:
  - params: `{ id: string (min 1) }`
  - body: `{ name: string (min 3) }`
- **`deleteCategorySchema`**:
  - params: `{ id: string (min 1) }`

### `productSchema.ts`
- **`createProductSchema`**:
  - body: `{ name, price, description, categoryId: string (cada um min 1) }`
- **`updateProductSchema`**:
  - params: `{ id: string (min 1) }`
  - body: igual ao create (strings obrigatórias)
- **`listProductsByCategorySchema`**:
  - params: `{ id: string (min 1) }`
- **`deleteProductSchema`**, **`disableProductSchema`**, **`enableProductSchema`**:
  - params: `{ id: string (min 1) }`

Observação: em produto, **`price` entra como string** no schema e é convertido no controller (`parseInt(price)`).

### `userSchema.ts`
- **`createUserSchema`**:
  - body: `{ name: string (min 3), email: email válido (z.email), password: string (min 6) }`
- **`authUserSchema`**:
  - body: `{ email: email válido, password: string (min 1) }`

### `orderSchema.ts`
- **`createOrderSchema`**:
  - body: `{ customerName, phone, address: string (min 1); deliveryFee?: number int ≥ 0; items: [{ productId: string (min 1), quantity: int ≥ 1 }] (mínimo 1 item) }`
- **`getOrderByIdSchema`**:
  - params: `{ id: string (min 1) }`
- **`updateOrderStatusSchema`**:
  - params: `{ id: string (min 1) }`
  - body: `{ status: "RECEBIDO" | "PREPARANDO" | "SAIU" | "ENTREGUE" }`
- **`deleteOrderSchema`**:
  - params: `{ id: string (min 1) }`
- **`createOrderItemSchema`**:
  - body: `{ orderId, productId: string (min 1); quantity: int ≥ 1 }`
- **`deleteOrderItemSchema`**:
  - params: `{ id: string (min 1) }`

## Upload de arquivos (multer) + Cloudinary

### Multer (`src/config/multer.ts`)
- **Storage**: `multer.memoryStorage()` (arquivo fica em memória → enviado ao Cloudinary)
- **Limite**: `5MB`
- **Tipos permitidos**: `image/jpeg`, `image/png`, `image/jpg`
- Campo esperado nas rotas de produto:
  - `upload.single('file')` (instância multer configurada em `routes.ts`)

### Cloudinary (`src/config/cloudinary.ts`)
- Configurado via variáveis de ambiente:
  - `CLOUDINARY_CLOUD_NAME`
  - `CLOUDINARY_API_KEY`
  - `CLOUDINARY_API_SECRET`

### Fluxo de criação/edição de produto (imagem)
- Controller exige `req.file` na criação (se não houver: **400** “Image is required”).
- Service faz upload por `cloudinary.uploader.upload_stream` em `folder: "products"`.
- URL final usada no banco: `result.secure_url` → `Product.imageUrl`.

## Banco de dados (Prisma + PostgreSQL)

### Conexão / Client
Em `src/prisma/index.ts`:
- Usa `DATABASE_URL` para montar o `connectionString`
- Usa adapter `@prisma/adapter-pg` (`PrismaPg`)
- Prisma Client é importado de `src/generated/prisma/client` (output customizado no schema)

### Modelagem (`prisma/schema.prisma`)

Enums:
- **`Role`**: `ADMIN`
- **`OrderStatus`**: `RECEBIDO` | `PREPARANDO` | `SAIU` | `ENTREGUE`

Tabelas (com `@@map`):

#### `users` (`model User`)
- `id` (uuid, PK)
- `name`, `email` (unique), `password`
- `role` (`Role`, default `ADMIN`)
- `createdAt`, `updatedAt`

#### `categories` (`model Category`)
- `id` (uuid, PK)
- `name`
- relação: `products: Product[]`
- `createdAt`, `updatedAt`

#### `products` (`model Product`)
- `id` (uuid, PK)
- `name`
- `description` (opcional)
- `price` (int, **em centavos**)
- `imageUrl` (opcional)
- `available` (boolean, default `true`)
- `categoryId` (FK) → `categories.id` (cascade)
- relação: `items: OrderItem[]`
- `createdAt`, `updatedAt`

#### `orders` (`model Order`)
- `id` (uuid, PK)
- `customerName`, `phone`, `address`
- `total` (int, **em centavos**)
- `deliveryFee` (int, default `0`)
- `status` (`OrderStatus`, default `RECEBIDO`)
- relação: `items: OrderItem[]`
- `createdAt`, `updatedAt`

#### `order_items` (`model OrderItem`)
- `id` (uuid, PK)
- `quantity` (int)
- `price` (int, **preço no momento da compra**)
- `orderId` (FK) → `orders.id` (cascade)
- `productId` (FK) → `products.id` (cascade)
- `createdAt`, `updatedAt`

## Endpoints (HTTP API)

Definidos em `src/routes.ts`. Quando **`isAuthenticated`** aparece, o cliente deve enviar **`Authorization: Bearer <jwt>`**.

### Usuário e sessão
- **POST** `/users`
  - **Middleware**: `isAuthenticated`, `validateSchema(createUserSchema)`
  - **Controller**: `CreateUserController.handle`
- **POST** `/session`
  - **Middleware**: `validateSchema(authUserSchema)`
  - **Controller**: `AuthUserController.handle` (login)
  - **Resposta (sucesso)**: JSON com `id`, `name`, `role`, `token` (JWT, `expiresIn` 30 dias; `subject` = id do usuário)
- **GET** `/me`
  - **Middleware**: `isAuthenticated`
  - **Controller**: `DetailUserController.handle`

### Category
- **POST** `/category`
  - **Middleware**: `isAuthenticated`, `validateSchema(createCategorySchema)`
  - **Controller**: `CreateCategoryController.handle`
- **GET** `/category`
  - **Controller**: `ListCategoryController.handle` (público)
- **GET** `/category/:id/products`
  - **Middleware**: `validateSchema(listProductsByCategorySchema)`
  - **Controller**: `ListProductsByCategoryController.handle`
- **PUT** `/category/:id`
  - **Middleware**: `isAuthenticated`, `validateSchema(updateCategorySchema)`
  - **Controller**: `UpdateCategoryController.handle`
- **DELETE** `/category/:id`
  - **Middleware**: `isAuthenticated`, `validateSchema(deleteCategorySchema)`
  - **Controller**: `DeleteCategoryController.handle`

### Product
- **POST** `/product`
  - **Middleware**: `isAuthenticated`, `upload.single('file')`, `validateSchema(createProductSchema)`
  - **Controller**: `CreateProductController.handle`
- **PUT** `/product/:id`
  - **Middleware**: `isAuthenticated`, `validateSchema(updateProductSchema)`, `upload.single('file')`
  - **Controller**: `UpdateProductController.handle`
- **PATCH** `/product/:id/disable`
  - **Middleware**: `isAuthenticated`, `validateSchema(disableProductSchema)`
  - **Controller**: `DisableProductController.handle`
- **PATCH** `/product/:id/enable`
  - **Middleware**: `isAuthenticated`, `validateSchema(enableProductSchema)`
  - **Controller**: `EnableProductController.handle`
- **GET** `/product`
  - **Controller**: `ListProductController.handle` (público)
- **DELETE** `/product/:id`
  - **Middleware**: `isAuthenticated`, `validateSchema(deleteProductSchema)`
  - **Controller**: `DeleteProductController.handle`

### Order (pedidos)
- **POST** `/order`
  - **Middleware**: `validateSchema(createOrderSchema)`
  - **Controller**: `CreateOrderController.handle` (criação com itens no body; sem auth — fluxo de cliente)
- **POST** `/order-item`
  - **Middleware**: `validateSchema(createOrderItemSchema)`
  - **Controller**: `AddOrderItemController.handle`
- **DELETE** `/order-item/:id`
  - **Middleware**: `validateSchema(deleteOrderItemSchema)`
  - **Controller**: `DeleteOrderItemController.handle`
- **GET** `/orders`
  - **Middleware**: `isAuthenticated`
  - **Controller**: `ListOrdersController.handle`
- **GET** `/order/:id`
  - **Middleware**: `isAuthenticated`, `validateSchema(getOrderByIdSchema)`
  - **Controller**: `GetOrderByIdController.handle`
- **PATCH** `/order/:id/status`
  - **Middleware**: `isAuthenticated`, `validateSchema(updateOrderStatusSchema)`
  - **Controller**: `UpdateOrderStatusController.handle`
- **DELETE** `/order/:id`
  - **Middleware**: `isAuthenticated`, `validateSchema(deleteOrderSchema)`
  - **Controller**: `DeleteOrderController.handle`

## Variáveis de ambiente (necessárias)

Identificadas pelo código:

- **`PORT`**: porta HTTP (em `src/server.ts`; fallback `3333`)
- **`DATABASE_URL`**: string de conexão do Postgres (em `src/prisma/index.ts`)
- **`JWT_SECRET`**: segredo para assinar/validar JWT (em `isAuthenticated` e fluxo de auth)
- **Cloudinary**:
  - `CLOUDINARY_CLOUD_NAME`
  - `CLOUDINARY_API_KEY`
  - `CLOUDINARY_API_SECRET`

## Observações de consistência (estado atual)

- Em `src/server.ts`, a expressão `process.env.PORT! || 3333` usa `!` (non-null assertion). Na prática, se `PORT` estiver vazio/undefined, cai no `3333`.
- O middleware global de erro trata qualquer `Error` como **400**; erros não-`Error` caem em **500**. Para distinção 4xx/5xx por tipo de falha, seria necessário classificar erros (ex.: `AppError` com `statusCode`).
- Nos services, alguns fluxos lançam `Error`; o handler acima converte a mensagem em resposta **400** quando a exceção propagar até o middleware de erro (desde que seja instância de `Error`).
