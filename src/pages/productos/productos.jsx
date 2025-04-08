"use client"
import { useState, useEffect } from "react"
import {
  fetchProductos,
  deleteProducto
} from "./api/ProductoService"
import ProductoList from "./components/ProductoList"
import ProductoForm from "./components/ProductoForm"
import { PlusCircle, Package } from "lucide-react"

const Producto = () => {
  const [productos, setProductos] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [productoEdit, setProductoEdit] = useState(null)

  const cargarProductos = async () => {
    const res = await fetchProductos()
    setProductos(res.data || [])
  }

  useEffect(() => {
    cargarProductos()
  }, [])

  const handleDelete = async (producto) => {
    if (confirm(`¿Eliminar producto "${producto.nombre}"?`)) {
      await deleteProducto(producto.id)
      cargarProductos()
    }
  }

  const handleEdit = (producto) => {
    setProductoEdit(producto)
    setShowForm(true)
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Package /> Gestión de Productos
        </h1>
        <button
          onClick={() => {
            setProductoEdit(null)
            setShowForm(true)
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <PlusCircle /> Nuevo Producto
        </button>
      </div>

      <ProductoList
        productos={productos}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onRefresh={cargarProductos}

      />

      {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">

        <ProductoForm
          producto={productoEdit}
          onSave={() => {
            setShowForm(false)
            setProductoEdit(null)
            cargarProductos()
          }}
          onClose={() => setShowForm(false)}
        />
        </div>
      )}
    </div>
  )
}

export default Producto
