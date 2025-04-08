"use client"

import { useState } from "react"
import { Edit, Trash2, Eye, Tag } from "lucide-react"
import DeleteConfirmModal from "../../categorias/modals/DeleteConfirmModal"
import ProductoDetailModal from "../modals/ProductDetailModal"
import { deleteProducto } from "../api/ProductoService"

const ProductList = ({ productos, onEdit, onRefresh }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedProducto, setSelectedProducto] = useState(null)

  const handleViewClick = (producto) => {
    setSelectedProducto(producto)
    setShowDetailModal(true)
  }

  const handleDeleteClick = (producto) => {
    setSelectedProducto({ ...producto, id: Number(producto.id) })
    setShowDeleteModal(true)
  }


  
  
  const handleConfirmDelete = async () => {
    try {
      if (!selectedProducto?.id) {
        console.error("ID no definido al eliminar producto");
        return;
      }
      
      console.log("Intentando eliminar producto con ID:", selectedProducto.id);
      await deleteProducto(Number(selectedProducto.id));
      console.log("Producto eliminado exitosamente");
      
      onRefresh(); // Actualiza la lista después de eliminar
    } catch (error) {
      console.error("Error al eliminar producto:", error.response ? error.response.data : error);
      // Puedes mostrar un mensaje de error al usuario aquí
    } finally {
      setShowDeleteModal(false);
    }
  };
  return (
    <>
      {productos.length > 0 ? (
        productos.map((producto) => (
          <div key={producto.id} className="p-4 bg-gray-800 rounded-lg mb-2">
            <div className="flex items-start justify-between">
              <div
                className="flex-1 cursor-pointer"
                onClick={() => handleViewClick(producto)}
              >
                <div className="flex items-center gap-2">
                  <h3 className="text-white text-lg font-semibold">
                    {producto.nombre}
                  </h3>
                  {producto.categoria && (
                    <span className="flex items-center text-sm text-gray-400">
                      <Tag size={14} className="mr-1" />
                      {producto.categoria.nombre}
                    </span>
                  )}
                </div>
                <p className="text-orange-400 mt-1">
                  ${producto.precio?.toFixed(2) || "0.00"}
                </p>
              </div>
            </div>
            <div className="flex space-x-2 mt-2">
              <button
                onClick={() => handleViewClick(producto)}
                className="text-gray-400 hover:text-blue-500 transition-colors p-1"
                title="Ver detalles"
              >
                <Eye size={16} />
              </button>
              <button
                onClick={() => onEdit(producto)}
                className="text-gray-400 hover:text-orange-500 transition-colors p-1"
                title="Editar"
              >
                <Edit size={16} />
              </button>
              <button
                onClick={() => handleDeleteClick(producto)}
                className="text-gray-400 hover:text-red-500 transition-colors p-1"
                title="Eliminar"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-400 p-4 text-center">No hay productos disponibles.</p>
      )}

      {showDetailModal && (
        <ProductoDetailModal
          producto={selectedProducto}
          onClose={() => setShowDetailModal(false)}
          onEdit={() => {
            setShowDetailModal(false)
            onEdit(selectedProducto)
          }}
        />
      )}

      {showDeleteModal && (
        <DeleteConfirmModal
          item={selectedProducto}
          onConfirm={handleConfirmDelete}
          onCancel={() => setShowDeleteModal(false)}
          itemName="producto"
          itemField="nombre"
          warningMessage={
            selectedProducto?.categoria
              ? `Se eliminará el producto y ya no estará asociado a la categoría ${selectedProducto.categoria.nombre}`
              : undefined
          }
        />
      )}

    </>
  )
}

export default ProductList