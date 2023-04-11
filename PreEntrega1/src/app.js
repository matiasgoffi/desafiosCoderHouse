import express, { urlencoded } from 'express';
import productsRouter from './routes/products.router.js'; //cuando se importa le damos un nombre significativo, em este cas usersRouter y petsRouter
import cartsRouter from './routes/carts.router.js'; 


const PORT = 8080;

const app = express(); //middleware a nivel de aplicacion

app.use(express.json());//middleware a nivel de aplicacion
app.use(urlencoded({extended:true}))//middleware a nivel de aplicacion


app.listen(PORT, ()=>{
    console.log(`Servidor funcionando en el puerto: ${PORT}`)
})

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

