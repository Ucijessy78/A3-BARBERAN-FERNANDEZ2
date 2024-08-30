const express = require('express');
const fs = require('fs');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(bodyParser.json());
app.use(cors());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    port: 3306,
    database: 'a3_inventario'
});

db.connect(error => {
    if (error) {
        console.log("Error al establecer la conexión");
        return;
    }
    console.log("Conexión exitosa");
});

app.listen(5000, () => {
    console.log("Server listening on Port 5000");
});

app.get("/", (req, res) => {
    res.send("Bienvenidos a la API de la Distribuidora Barberan ");
});

// Gestión de Categorías
app.get("/categorias", (req, res) => {
    const query = "SELECT * FROM Categorias";
    db.query(query, (error, results) => {
        if (error) {
            res.status(500).send('Error al recibir datos de categorías');
            return;
        }
        res.status(200).json(results);
    });
});

app.post("/categorias", (req, res) => {
    const { nombre_categoria, descripcion } = req.body;
    const query = "INSERT INTO Categorias(nombre_categoria, descripcion) VALUES(?, ?)";
    db.query(query, [nombre_categoria, descripcion], (error, results) => {
        if (error) {
            res.status(500).json('Error al registrar la categoría');
            return;
        }
        res.status(200).json(`Categoría registrada con el ID: ${results.insertId}`);
    });
});

app.put("/categorias/:id", (req, res) => {
    const { id } = req.params;
    const { nombre_categoria, descripcion } = req.body;
    const query = "UPDATE Categorias SET nombre_categoria = ?, descripcion = ? WHERE categoria_id = ?";
    
    db.query(query, [nombre_categoria, descripcion, id], (error, results) => {
        if (error) {
            res.status(500).json('Error al actualizar la categoría');
            return;
        }
        if (results.affectedRows === 0) {
            res.status(404).json('Categoría no encontrada');
            return;
        }
        res.status(200).json(`Categoría con ID: ${id} actualizada correctamente`);
    });
});

app.delete("/categorias/:id", (req, res) => {
    const { id } = req.params;
    const query = "DELETE FROM Categorias WHERE categoria_id = ?";
    
    db.query(query, [id], (error, results) => {
        if (error) {
            res.status(500).json('Error al eliminar la categoría');
            return;
        }
        if (results.affectedRows === 0) {
            res.status(404).json('Categoría no encontrada');
            return;
        }
        res.status(200).json(`Categoría con ID: ${id} eliminada correctamente`);
    });
});

// Gestión de Productos
app.get("/productos", (req, res) => {
    const query = "SELECT * FROM Productos";
    db.query(query, (error, results) => {
        if (error) {
            res.status(500).send('Error al recibir datos de productos');
            return;
        }
        res.status(200).json(results);
    });
});

app.post("/productos", (req, res) => {
    const { nombre_producto, precio, stock, categoria_id } = req.body;
    const query = "INSERT INTO Productos(nombre_producto, precio, stock, categoria_id) VALUES(?, ?, ?, ?)";
    db.query(query, [nombre_producto, precio, stock, categoria_id], (error, results) => {
        if (error) {
            res.status(500).json('Error al registrar el producto');
            return;
        }
        res.status(200).json(`Producto registrado con el ID: ${results.insertId}`);
    });
});

app.put("/productos/:id", (req, res) => {
    const { id } = req.params;
    const { nombre_producto, precio, stock, categoria_id } = req.body;
    const query = "UPDATE Productos SET nombre_producto = ?, precio = ?, stock = ?, categoria_id = ? WHERE producto_id = ?";
    
    db.query(query, [nombre_producto, precio, stock, categoria_id, id], (error, results) => {
        if (error) {
            res.status(500).json('Error al actualizar el producto');
            return;
        }
        if (results.affectedRows === 0) {
            res.status(404).json('Producto no encontrado');
            return;
        }
        res.status(200).json(`Producto con ID: ${id} actualizado correctamente`);
    });
});

app.delete("/productos/:id", (req, res) => {
    const { id } = req.params;
    const query = "DELETE FROM Productos WHERE producto_id = ?";
    
    db.query(query, [id], (error, results) => {
        if (error) {
            res.status(500).json('Error al eliminar el producto');
            return;
        }
        if (results.affectedRows === 0) {
            res.status(404).json('Producto no encontrado');
            return;
        }
        res.status(200).json(`Producto con ID: ${id} eliminado correctamente`);
    });
});
