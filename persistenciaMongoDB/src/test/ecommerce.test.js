import chai from "chai";
import supertest from "supertest";
import { productsModel } from "../Dao/models/products.js";
import userModel from "../Dao/models/User.model.js";
import { cartsModel } from "../Dao/models/carts.js";
import {app} from "../app.js"


const expect = chai.expect;
const requester = supertest(app);
const userTest = "adminCoder@coder.com";

describe('testing  del e-commerce',()=>{

    describe("Test Sessions", ()=>{
        before(async function(){
            this.cookie;
            await userModel.deleteMany({})
        })

        it("Registro de un usuario en la aplicación", async function(){
            this.timeout(10000);
            const userMock = {
                first_name:"Matias",
                last_name:"Goffi",
                email:userTest,
                password:"adminCod3r123",
            }
            const responseSignup = await requester.post("/api/session/register").send(userMock);
            expect(responseSignup.statusCode).to.be.equal(200);
        })
        
        it("setear cookie en el login correctamente", async function(){
            this.timeout(10000);
            const credentialsMock = {
                email: userTest,
                password: "adminCod3r123",
              };
            const response = await requester.post('/api/session/').send(credentialsMock);
            const cookiesResult = response.headers['set-cookie'][0];
            expect(cookiesResult).to.be.ok;
            this.cookie = {
                name: cookiesResult.split('=')[0],
                value: cookiesResult.split('=')[1],
                }
        });

        it("Que el endpoint current devuelva al usuario logueado.", async function(){
            this.timeout(10000);
            const {_body : { payload }} = await requester.get("/api/session/current")
            .set("Cookie", `${this.cookie.name}=${this.cookie.value}`);
            expect(payload.email).to.be.equal(userTest)
        })
        
    })
    
    describe("Test productos", ()=>{
  
        beforeEach(function () {
            this.timeout(10000); 
        });
            it("El endpoint para recibir lo productos de la base de datos deve devolver un arreglo", async()=>{
                const result = await requester.get("/api/products/limit");
                const {statusCode,_body} = result;
                expect(statusCode).to.be.equal(200);
                expect(_body.status).to.be.equal("success");
                expect(Array.isArray(_body.payload)).to.deep.equal(true);

            })
            it("prueba para corroborar la creacion de un producto en la base de datos", async()=>{
                const mockProduct = {
                    title: "zapatillas nike",
                    description: "zapatillas trekking.",
                    price: 45000,
                    code: 3043,
                    status: "false",
                    thumbnails: ["https://newsport.vtexassets.com/arquivos/ids/16130385-1200-auto?v=638208793327870000&width=1200&height=auto&aspect=true"],
                    stock: 100,
                    category: "zapatillas"
                }
                const result = await requester.post("/api/products").send(mockProduct);
                const {statusCode,_body} = result;
                expect(statusCode).to.be.equal(200);
            })
            it("prueba para corroborar la eliminacion de un producto en la base de datos", async()=>{
                const products = await requester.get("/api/products/limit");
                let idProduct = products.body.payload[0]._id;
                const deleteProduct = await requester.delete(`/api/products/${idProduct}`);
                expect(deleteProduct.text).to.be.equal(`producto con id ${idProduct} eliminado exitosamente`);
            })
        })
    
    describe("Test Carritos", ()=>{
  
        beforeEach(async()=>{
            const user = {
                first_name:"Test2",
                last_name:"User",
                email:"test@email.com",
                password:"1234",
            };
           await requester.post("/api/session/register").send(user);
          })

            it("El endpoint debe crear un carrito correctamente en la base de datos", async()=>{
                const cart = await requester.post("/api/carts");
                const cartId = cart.body.nuevoCarrito.id
                const carritoAgregado = await cartsModel.findById(cartId);
                expect((carritoAgregado._id).toString()).to.be.equal(cartId.toString());
             })
             it("El endpoint  debe agregar un producto correctamente al carrito", async()=>{
                const credentialsMock = {
                    email: "test@email.com",
                    password:"1234",
                };
                await requester.post('/api/session/logout');
                await requester.post('/api/session/').send(credentialsMock);
                const users = await userModel.find();
                const userCartId = (users[1].cart).toString();
                const productos = await productsModel.find();
                const productId = (productos[0]._id).toString();
                const agregarProducto = await requester.post(`/api/carts/${userCartId}/products/${productId}`);
                expect(agregarProducto.body.products[0]).to.have.property('_id');
                let newProductId = agregarProducto.body.products[0]._id;
                expect(productId).to.be.equal(newProductId)  
             })
             it("El endpoint  debe actualizar los productos del carrito correctamente", async()=>{
                const credentialsMock = {
                    email: "test@email.com",
                    password:"1234",
                };
                let updateData = {
                    "products": [
                      {
                        "producto": "ID_DEL_PRODUCTO_1",
                        "quantity": 10
                      },
                      {
                        "producto": "ID_DEL_PRODUCTO_2",
                        "quantity": 7
                      }
                    ]
                  }
                await requester.post('/api/session/logout');
                await requester.post('/api/session/').send(credentialsMock);
                const users = await userModel.find();
                const userCartId = (users[1].cart).toString();
                const productos = await productsModel.find();
                const productId = (productos[0]._id).toString();
                await requester.post(`/api/carts/${userCartId}/products/${productId}`);
                const updatedCart = await requester.put(`/api/carts/${userCartId}`).send(updateData);
                expect(updatedCart.body).to.be.equal(true);
             })   
    })
})






