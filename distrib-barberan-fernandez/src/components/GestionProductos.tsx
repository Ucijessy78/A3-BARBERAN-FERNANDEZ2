import axios from "axios";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import React, { useEffect, useRef, useState } from "react";

// Actualizar la interfaz con los campos correctos
interface Producto {
    producto_id: number;
    nombre_producto: string;
    precio: number;
    stock: number;
    categoria_id: number;
}

export const GestionProductos: React.FC = () => {  
    const [productos, setProductos] = useState<Producto[]>([]);
    const [productoDialog, setProductoDialog] = useState(false);
    const [deleteProductoDialog, setDeleteProductoDialog] = useState(false);
    const [producto, setProducto] = useState<Producto>({ producto_id: 0, nombre_producto: "", precio: 0, stock: 0, categoria_id: 0 });
    const [selectedProducto, setSelectedProducto] = useState<Producto | null>(null);
    const [submitted, setSubmitted] = useState(false);
    const toast = useRef<any>(null);  

    useEffect(() => {
        axios.get("http://localhost:5000/productos")
            .then(response => setProductos(response.data))
            .catch(error => console.error("Error al obtener productos:", error));
    }, []);

    const openNew = () => {
        setProducto({ producto_id: 0, nombre_producto: "", precio: 0, stock: 0, categoria_id: 0 });
        setSubmitted(false);
        setProductoDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setProductoDialog(false);
    };

    const hideDeleteProductoDialog = () => {
        setDeleteProductoDialog(false);
    };

    const saveProducto = () => {
        setSubmitted(true);

        if (producto.nombre_producto.trim()) {
            if (producto.producto_id) {
                axios.put(`http://localhost:5000/productos/${producto.producto_id}`, producto)
                    .then(() => {
                        toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Producto actualizado', life: 3000 });
                        setProductos(productos.map(p => p.producto_id === producto.producto_id ? producto : p));
                    });
            } else {
                axios.post("http://localhost:5000/productos", producto)
                    .then(response => {
                        toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Producto creado', life: 3000 });
                        setProductos([...productos, { ...producto, producto_id: response.data.producto_id }]);
                    });
            }

            setProductoDialog(false);
            setProducto({ producto_id: 0, nombre_producto: "", precio: 0, stock: 0, categoria_id: 0 });
        }
    };

    const editProducto = (producto: Producto) => {
        setProducto({ ...producto });
        setProductoDialog(true);
    };

    const confirmDeleteProducto = (producto: Producto) => {
        setProducto(producto);
        setDeleteProductoDialog(true);
    };

    const deleteProducto = () => {
        axios.delete(`http://localhost:5000/productos/${producto.producto_id}`)
            .then(() => {
                toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Producto eliminado', life: 3000 });
                setProductos(productos.filter(p => p.producto_id !== producto.producto_id));
                setDeleteProductoDialog(false);
                setProducto({ producto_id: 0, nombre_producto: "", precio: 0, stock: 0, categoria_id: 0 });
            });
    };

    const productoDialogFooter = (
        <React.Fragment>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" className="p-button-text" onClick={saveProducto} />
        </React.Fragment>
    );

    const deleteProductoDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductoDialog} />
            <Button label="Sí" icon="pi pi-check" className="p-button-text" onClick={deleteProducto} />
        </React.Fragment>
    );

    return (
        <div>
            <h1>Gestión de Productos</h1>

            <Toast ref={toast} />
            <div className="card">
                <h5>Gestión de Productos</h5>
                <Button label="Nuevo Producto" icon="pi pi-plus" className="p-button-success" onClick={openNew} />
                <DataTable 
                    value={productos} 
                    selection={selectedProducto} 
                    onSelectionChange={(e) => setSelectedProducto(e.value as Producto)}
                    dataKey="producto_id" 
                    selectionMode="single"
                >
                    <Column field="nombre_producto" header="Nombre" sortable key="nombre_producto" />
                    <Column field="precio" header="Precio" sortable key="precio" />
                    <Column field="stock" header="Stock" sortable key="stock" />
                    <Column field="categoria_id" header="Categoría ID" sortable key="categoria_id" />
                    <Column body={(rowData: Producto) => (
                        <>
                            <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editProducto(rowData)} />
                            <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => confirmDeleteProducto(rowData)} />
                        </>
                    )} key="actions" />
                </DataTable>

                <Dialog visible={productoDialog} style={{ width: '450px' }} header="Detalles del Producto" modal className="p-fluid" footer={productoDialogFooter} onHide={hideDialog}>
                    <div className="field">
                        <label htmlFor="nombre_producto">Nombre</label>
                        <InputText 
                            id="nombre_producto" 
                            value={producto.nombre_producto} 
                            onChange={(e) => setProducto({ ...producto, nombre_producto: e.target.value })} 
                            required 
                            autoFocus 
                            className={submitted && !producto.nombre_producto ? 'p-invalid' : ''} 
                        />
                        {submitted && !producto.nombre_producto && <small className="p-error">El nombre es obligatorio.</small>}
                    </div>
                    <div className="field">
                        <label htmlFor="precio">Precio</label>
                        <InputText 
                            id="precio" 
                            type="number"
                            value={producto.precio.toString()} 
                            onChange={(e) => setProducto({ ...producto, precio: parseFloat(e.target.value) })} 
                            required 
                            className={submitted && !producto.precio ? 'p-invalid' : ''} 
                        />
                        {submitted && !producto.precio && <small className="p-error">El precio es obligatorio.</small>}
                    </div>
                    <div className="field">
                        <label htmlFor="stock">Stock</label>
                        <InputText 
                            id="stock" 
                            type="number"
                            value={producto.stock.toString()} 
                            onChange={(e) => setProducto({ ...producto, stock: parseInt(e.target.value) })} 
                            required 
                            className={submitted && !producto.stock ? 'p-invalid' : ''} 
                        />
                        {submitted && !producto.stock && <small className="p-error">El stock es obligatorio.</small>}
                    </div>
                    <div className="field">
                        <label htmlFor="categoria_id">Categoría ID</label>
                        <InputText 
                            id="categoria_id" 
                            type="number"
                            value={producto.categoria_id.toString()} 
                            onChange={(e) => setProducto({ ...producto, categoria_id: parseInt(e.target.value) })} 
                            required 
                            className={submitted && !producto.categoria_id ? 'p-invalid' : ''} 
                        />
                        {submitted && !producto.categoria_id && <small className="p-error">La categoría ID es obligatoria.</small>}
                    </div>
                </Dialog>

                <Dialog visible={deleteProductoDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deleteProductoDialogFooter} onHide={hideDeleteProductoDialog}>
                    <div className="confirmation-content">
                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                        {producto && <span>¿Estás seguro de que quieres eliminar el producto <b>{producto.nombre_producto}</b>?</span>}
                    </div>
                </Dialog>
            </div>
        </div>
    );
};
