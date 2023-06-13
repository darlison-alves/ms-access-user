## Running all app

No projeto **MS-INFO-PRODUCT**, o arquivo docker-compose.yml tem as imagem dos serviços e banco de dados e filas utilizados;

projetos estando nas mesmo pasta 

ms-info-products
ms-course
ms-acess-user

entrando na pasta **'ms-info-products'**


```bash
$ docker-compose up
```

#### API Endpoits

Compra do produto: 

### POST localhost:3000/products/buy 
Endpoint de compra de produto

```
{
  "serviceKey": "318440fb7491", 
  "buyerEmail": "any@email.com",
  "productId": "123456"
}
```

### PUT localhost:3000/products/buy/cancel 
Endpoint de compra de produto

```
{
  "serviceKey": "318440fb7491", 
  "buyerEmail": "any@email.com",
  "productId": "123456"
}
```

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
