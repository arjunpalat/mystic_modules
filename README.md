
# MENU BACKEND

A Node.js backend server for menu management with MongoDB Atlas for database.


## Live Demo

https://arjun-menubackend.onrender.com/

## Simple API Design Example

https://excalidraw.com/#json=dxecq4jb83iRdG1jCL7h0,Gd0t5iKMhuvBe5Znvdk3Cw


## Installation

To run the app locally on your system, follow the instructions.

 ### Pre-requisites
   1. Node.js
   2. Git (optional; to clone the repository)

 ### Instructions




1) Download the project files or use Git Clone using your Terminal at the desired directory
```bash
git clone https://github.com/arjunpalat/mystic_modules.git
```  
2) Install dependencies (might take some time)

```bash
npm install
```
3) Refer .env.example to configure your .env file. Provide your MongoDB URIs for Test and Development, SECRET for Authorization and PORT for Node.js server.

4) Start the server

```bash
npm run dev
```

Once the server starts running, the project opens automatically in your default browser. If not, it can be accessed via the link:

http://localhost:3001/

#### Note
When locally testing for POST and PATCH endpoints, Bearer {SECRET} is to be provided as Authorization header. Provide any SECRET in .env file.

## API Documentation

### GET
| Description | Method | Endpoint Example |
|-------------|--------|------------------|
| GET All Catetgories | GET | /api/categories |
| GET Catetgory By Name | GET | /api/categories?name=Main%20Course |
| GET Catetgory By ID | GET | /api/categories?id=66c0ee9c08d5f0b921d9156d |
| GET All Subcatetgories | GET | /api/subcategories |
| GET Subcatetgory By Name | GET | /api/subcategories?name=Ice%20Cream |
| GET Subcategory By ID | GET | /api/subcategories?id=66c0ee9c08d5f0b921d91577 |
| GET All Items | GET | /api/items |
| GET Item By Name | GET | /api/items?name=Biriyani |
| GET Item By ID | GET | /api/items?id=66c0ee9c08d5f0b921d91583 |
| GET Items By Category ID | GET | /api/items?category=66c0ee9c08d5f0b921ef76ea |
| GET Items By Subcategory ID | GET | /api/items?subcategory=66c0ee9c08d5f0b921du81wn |
| SEARCH Item By Name | GET | /api/search?name=Samosa |

### POST
| Description | Method | Endpoint Example |
|-------------|--------|------------------|
| Create New Category | POST | /api/categories |
| Create New Subcategory | POST | /api/subcategories |
| Create New Item | POST | /api/items |


### PATCH
| Description | Method | Endpoint Example |
|-------------|--------|------------------|
| Update Category By ID | PATCH | /api/categories?id=66c0ee9c08d5f0b921d9156d |
| Update Subcategory By ID | PATCH | /api/subcategories?id=66c0ee9c08d5f0b921d91577 |
| Update Item By ID | PATCH | /api/items?id=66c0ee9c08d5f0b921d91583 |





