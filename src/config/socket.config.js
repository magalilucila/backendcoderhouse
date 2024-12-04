import { Server } from "socket.io";
import { ProductManager } from "../services/productManager.js"

const productManager = new ProductManager();
let serverSocket = null;

const config = (serverHTTP) => {
    serverSocket = new Server(serverHTTP);

    serverSocket.on("connection", async (socket) => {
        const products = await productManager.getProducts();
        console.log("Socket connected");

        // Envía la lista de productos al conectarse
        serverSocket.emit("products-list", { products });

        socket.on("delete-product", async (data) => {
            await productManager.deleteOneById(Number(data.id));
            const products = await productManager.getProducts();

            // Envía la lista de productos actualizada después de eliminar
            serverSocket.emit("products-list", { products });
        });
    });
};

const updateProductsList = async () => {
    const products = await productManager.getProducts();

    // Envía la lista de productos actualizada
    serverSocket.emit("products-list", { products });
};

export default {
    config,
    updateProductsList,
};