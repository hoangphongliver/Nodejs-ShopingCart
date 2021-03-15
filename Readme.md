# Awesome Project Build with TypeORM

Steps to run this project:

1. Run `npm i` command
2. Create database (MySQL)
3. Setup database settings inside `ormconfig.json` file
4. Run `npm start` command


API in project: Api base url: `localhost:8000`


1. Import postman collection to Postman app ( postman colection name: NodeJS_MySQL.postman_collection ,  same folder with readme.md )
2. Create User
3. Login
4. Get access token and add to Authorization ( type Bearer )


Example: ( Using `axios` )

1. Create User
```javascript
axios({
    method: 'POST',
    url: 'http://localhost:8000/api/user/create',
    data: {
        {
            "username": "namabc",
            "password": "121212",
            "email": "name@gmail.com",
            "phoneNumber": "54545555",
            "firstName": "Name",
            "lastName": "Le",
            "birthDay": "07/12/1999"
        }
    }
})
```

2. Login

```javascript
axios({
    method: 'POST',
    url: "http://localhost:8000/api/auth/login",
    data: {
        {
            "username": "namabc",
            "password": "121212"
        }
    }
})
```

3. Get Products
```javascript
axios({
    method: 'GET',
    url: "http://localhost:8000/api/product/getAllProducts",
})
```

4. Get Products, Category with Params ( sortBy , itemPerPage , pageIndex , orderBy: DESC or ASC , searchPhase )
```javascript
axios({
    method: 'GET',
    url: "http://localhost:8000/api/product/getAllProducts?sortBy=name&itemPerPage=5&pageIndex=0&orderBy=DESC&searchPhase=noki",
})
```