"use client"

import { useState, useEffect } from "react"
import { X, ShoppingBag, Plus, Minus } from "lucide-react"
import {
  createPedido,
  updatePedido,
  fetchClientes,
  fetchProductos,
} from "../api/pedidoservice.js";

import FormField from "../../clientes/components/form/FormField.jsx";
import SelectField from "../../clientes/components/form/SelectField.jsx";




const PedidoForm = ({ pedido, onClose, onSave }) => {
  const initialFormData = {
    id_cliente: "",
    id_producto: "",
    cantidad: 1,
    direccion_envio: "",
  }

  const [formData, setFormData] = useState(initialFormData)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [clientes, setClientes] = useState([])
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedProducto, setSelectedProducto] = useState(null)

  // Cargar datos iniciales
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const [clientesData, productosData] = await Promise.all([fetchClientes(), fetchProductos()])
        setClientes(clientesData)
        setProductos(productosData)
      } catch (error) {
        console.error("Error al cargar datos:", error)
        setSubmitError("Error al cargar datos: " + error.message)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Si hay un pedido para editar, cargar sus datos
  useEffect(() => {
    if (pedido) {
      setFormData({
        id_cliente: pedido.id_cliente.toString(),
        id_producto: pedido.id_producto.toString(),
        cantidad: pedido.cantidad,
        direccion_envio: pedido.direccion_envio || "",
      })

      // Establecer el producto seleccionado
      const producto = productos.find((p) => p.id === pedido.id_producto)
      if (producto) {
        setSelectedProducto(producto)
      }
    }
  }, [pedido, productos])

  // Actualizar producto seleccionado cuando cambia el id_producto
  useEffect(() => {
    if (formData.id_producto) {
      const producto = productos.find((p) => p.id.toString() === formData.id_producto)
      setSelectedProducto(producto || null)
    } else {
      setSelectedProducto(null)
    }
  }, [formData.id_producto, productos])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Limpiar error del campo cuando cambia
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleCantidadChange = (increment) => {
    setFormData((prev) => {
      const newCantidad = Math.max(1, prev.cantidad + increment)
      return { ...prev, cantidad: newCantidad }
    })
  }

  // Validaciones de formulario
  const validations = {
    id_cliente: (value) => (!value ? "El cliente es obligatorio" : ""),
    id_producto: (value) => (!value ? "El producto es obligatorio" : ""),
    direccion_envio: (value) => (!value.trim() ? "La dirección de envío es obligatoria" : ""),
  }

  const validateForm = () => {
    const newErrors = {}

    // Validar cada campo
    Object.keys(validations).forEach((field) => {
      const error = validations[field](formData[field])
      if (error) newErrors[field] = error
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)
    setSubmitError("")

    try {
      if (pedido) {
        await updatePedido(pedido.id, formData)
      } else {
        await createPedido(formData)
      }

      onSave()
    } catch (error) {
      console.error("Error al guardar pedido:", error)
      setSubmitError(error.message || "Error al guardar el pedido")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Calcular el total estimado
  const calcularTotal = () => {
    if (!selectedProducto) return 0
    return selectedProducto.precio * formData.cantidad
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-gray-900 rounded-xl shadow-2xl w-full max-w-2xl p-6 border-r-2 border-orange-500 animate-fade-in">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-600"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-xl shadow-2xl w-full max-w-2xl border-r-2 border-orange-500 animate-fade-in">
        <div className="flex justify-between items-center p-6 border-b border-gray-800">
          <h2 className="text-xl font-bold text-white flex items-center">
            <ShoppingBag className="mr-2 text-orange-500" size={24} />
            {pedido ? "Editar Pedido" : "Nuevo Pedido"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white hover:rotate-90 transition-all bg-gray-800 p-2 rounded-full"
            title="Cerrar"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {submitError && (
            <div className="bg-red-900 text-white p-4 rounded-lg mb-6 animate-pulse border border-red-500">
              {submitError}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Cliente */}
            <SelectField
              name="id_cliente"
              label="Cliente"
              value={formData.id_cliente}
              options={[
                { value: "", label: "Seleccionar cliente" },
                ...clientes.map((cliente) => ({
                  value: cliente.id.toString(),
                  label: cliente.nombreCompleto,
                })),
              ]}
              onChange={handleChange}
              error={errors.id_cliente}
              className={errors.id_cliente ? "border-red-500" : ""}
            />

            {/* Dirección de envío */}
            <FormField
              type="text"
              name="direccion_envio"
              label="Dirección de Envío"
              value={formData.direccion_envio}
              error={errors.direccion_envio}
              onChange={handleChange}
            />

            {/* Producto */}
            <div className="md:col-span-2">
              <SelectField
                name="id_producto"
                label="Producto"
                value={formData.id_producto}
                options={[
                  { value: "", label: "Seleccionar producto" },
                  ...productos.map((producto) => ({
                    value: producto.id.toString(),
                    label: `${producto.nombre} - $${producto.precio.toLocaleString("es-CO")}`,
                  })),
                ]}
                onChange={handleChange}
                error={errors.id_producto}
                className={errors.id_producto ? "border-red-500" : ""}
              />
            </div>

            {/* Detalles del producto seleccionado */}
            {selectedProducto && (
              <div className="md:col-span-2 bg-gray-800 p-4 rounded-lg border border-gray-700">
                <div className="flex items-center">
                  <img
                    src={selectedProducto.imagen || "/placeholder.svg"}
                    alt={selectedProducto.nombre}
                    className="w-16 h-16 rounded-lg object-cover mr-4"
                  />
                  <div>
                    <h4 className="text-white font-medium">{selectedProducto.nombre}</h4>
                    <p className="text-gray-400 text-sm">{selectedProducto.categoria}</p>
                    <p className="text-orange-400 font-bold">${selectedProducto.precio.toLocaleString("es-CO")}</p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={() => handleCantidadChange(-1)}
                      className="bg-gray-700 text-white p-2 rounded-l-lg hover:bg-gray-600 transition-colors"
                    >
                      <Minus size={16} />
                    </button>
                    <input
                      type="number"
                      name="cantidad"
                      value={formData.cantidad}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          cantidad: Math.max(1, Number.parseInt(e.target.value) || 1),
                        }))
                      }
                      className="w-16 text-center bg-gray-700 text-white border-0 py-2"
                      min="1"
                    />
                    <button
                      type="button"
                      onClick={() => handleCantidadChange(1)}
                      className="bg-gray-700 text-white p-2 rounded-r-lg hover:bg-gray-600 transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  <div className="text-right">
                    <p className="text-gray-400 text-sm">Total Estimado:</p>
                    <p className="text-white font-bold text-lg">${calcularTotal().toLocaleString("es-CO")}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors border border-gray-700"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={`px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2 border border-orange-500 ${
                isSubmitting ? "opacity-70 cursor-not-allowed" : ""
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                  Guardando...
                </>
              ) : (
                "Guardar Pedido"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PedidoForm

