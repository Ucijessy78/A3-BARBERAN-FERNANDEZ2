import axios from "axios";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import React, { useEffect, useRef, useState } from "react";

interface Categoria {
    categoria_id: number;
    nombre_categoria: string;
    descripcion: string;
}

export const GestionCategorias: React.FC = () => {  

    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [categoriaDialog, setCategoriaDialog] = useState(false);
    const [deleteCategoriaDialog, setDeleteCategoriaDialog] = useState(false);
    const [categoria, setCategoria] = useState<Categoria>({ categoria_id: 0, nombre_categoria: "", descripcion: "" });
    const [selectedCategoria, setSelectedCategoria] = useState<Categoria | null>(null); // Changed to a single item
    const [submitted, setSubmitted] = useState(false);
    const toast = useRef<any>(null);  

    useEffect(() => {
        axios.get("http://localhost:5000/categorias")
            .then(response => setCategorias(response.data))
            .catch(error => console.error("Error al obtener categorías:", error));
    }, []);

    const openNew = () => {
        setCategoria({ categoria_id: 0, nombre_categoria: "", descripcion: "" });
        setSubmitted(false);
        setCategoriaDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setCategoriaDialog(false);
    };

    const hideDeleteCategoriaDialog = () => {
        setDeleteCategoriaDialog(false);
    };

    const saveCategoria = () => {
        setSubmitted(true);

        if (categoria.nombre_categoria.trim()) {
            if (categoria.categoria_id) {  // Use 'categoria_id' instead of 'id'
                axios.put(`http://localhost:5000/categorias/${categoria.categoria_id}`, categoria)
                    .then(() => {
                        toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Categoría actualizada', life: 3000 });
                        setCategorias(categorias.map(cat => cat.categoria_id === categoria.categoria_id ? categoria : cat));
                    });
            } else {
                axios.post("http://localhost:5000/categorias", categoria)
                    .then(response => {
                        toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Categoría creada', life: 3000 });
                        setCategorias([...categorias, { ...categoria, categoria_id: response.data.categoria_id }]);
                    });
            }

            setCategoriaDialog(false);
            setCategoria({ categoria_id: 0, nombre_categoria: "", descripcion: "" });
        }
    };

    const editCategoria = (categoria: Categoria) => {
        setCategoria({ ...categoria });
        setCategoriaDialog(true);
    };

    const confirmDeleteCategoria = (categoria: Categoria) => {
        setCategoria(categoria);
        setDeleteCategoriaDialog(true);
    };

    const deleteCategoria = () => {
        axios.delete(`http://localhost:5000/categorias/${categoria.categoria_id}`)
            .then(() => {
                toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Categoría eliminada', life: 3000 });
                setCategorias(categorias.filter(cat => cat.categoria_id !== categoria.categoria_id));
                setDeleteCategoriaDialog(false);
                setCategoria({ categoria_id: 0, nombre_categoria: "", descripcion: "" });
            });
    };

    const categoriaDialogFooter = (
        <React.Fragment>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" className="p-button-text" onClick={saveCategoria} />
        </React.Fragment>
    );

    const deleteCategoriaDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteCategoriaDialog} />
            <Button label="Sí" icon="pi pi-check" className="p-button-text" onClick={deleteCategoria} />
        </React.Fragment>
    );

    return (
        <div>
            <h1>Gestión Categorías</h1>

            <Toast ref={toast} />
            <div className="card">
                <h5>Gestión de Categorías</h5>
                <Button label="Nueva Categoría" icon="pi pi-plus" className="p-button-success" onClick={openNew} />
                <DataTable 
                    value={categorias} 
                    selection={selectedCategoria} 
                    onSelectionChange={(e) => setSelectedCategoria(e.value as Categoria)}
                    dataKey="categoria_id" 
                    selectionMode="single"
                >
                    <Column field="nombre_categoria" header="Nombre" sortable key="nombre_categoria" />
                    <Column field="descripcion" header="Descripción" sortable key="descripcion" />
                    <Column body={(rowData: Categoria) => (
                        <>
                            <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editCategoria(rowData)} />
                            <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => confirmDeleteCategoria(rowData)} />
                        </>
                    )} key="actions" />
                </DataTable>

                <Dialog visible={categoriaDialog} style={{ width: '450px' }} header="Detalles de Categoría" modal className="p-fluid" footer={categoriaDialogFooter} onHide={hideDialog}>
                    <div className="field">
                        <label htmlFor="nombre_categoria">Nombre</label>
                        <InputText 
                            id="nombre_categoria" 
                            value={categoria.nombre_categoria} 
                            onChange={(e) => setCategoria({ ...categoria, nombre_categoria: e.target.value })} 
                            required 
                            autoFocus 
                            className={submitted && !categoria.nombre_categoria ? 'p-invalid' : ''} 
                        />
                        {submitted && !categoria.nombre_categoria && <small className="p-error">El nombre es obligatorio.</small>}
                    </div>
                    <div className="field">
                        <label htmlFor="descripcion">Descripción</label>
                        <InputText 
                            id="descripcion" 
                            value={categoria.descripcion} 
                            onChange={(e) => setCategoria({ ...categoria, descripcion: e.target.value })} 
                            required 
                            className={submitted && !categoria.descripcion ? 'p-invalid' : ''} 
                        />
                        {submitted && !categoria.descripcion && <small className="p-error">La descripción es obligatoria.</small>}
                    </div>
                </Dialog>

                <Dialog visible={deleteCategoriaDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deleteCategoriaDialogFooter} onHide={hideDeleteCategoriaDialog}>
                    <div className="confirmation-content">
                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                        {categoria && <span>¿Estás seguro de que quieres eliminar la categoría <b>{categoria.nombre_categoria}</b>?</span>}
                    </div>
                </Dialog>
            </div>
        </div>
    );
};
