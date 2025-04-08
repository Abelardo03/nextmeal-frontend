"use client"
import { useState, useEffect } from "react"
import { Save, X, Loader2 } from "lucide-react"
import FormField, { TextAreaField } from "../../categorias/componentes/form/FormField"
import SelectField from "../../categorias/componentes/form/SelectField"
import { crearProducto, actualizarProducto, fetchCategorias, fetchProductos } from "../api/ProductoService"

const ProductoForm = ({ producto, onSave, onClose }) => {
  // Estados del formulario
  const [formData, setFormData] = useState({
    nombre: producto?.nombre || "",
    precio: producto?.precio || "",
    estado: producto?.estado || "activo",
    cantidad: producto?.cantidad || "",
    descripcion: producto?.descripcion || "",
    Id_Categoria: producto?.Id_Categoria || ""
  })
  
  // Estados para datos y carga
  const [categorias, setCategorias] = useState([])
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState({
    categorias: false,
    productos: false,
    submit: false
  })
  const [error, setError] = useState(null)


  
  // Cargar datos iniciales
  useEffect(() => {
    const cargarDatosIniciales = async () => {
      try {
        setLoading(prev => ({ ...prev, categorias: true, productos: true }))
        setError(null)

        // Cargar categorías y productos en paralelo
        const [resCategorias, resProductos] = await Promise.all([
          fetchCategorias(),
          fetchProductos()
        ])

        setCategorias(resCategorias.data || [])
        setProductos(resProductos.data || [])
      } catch (err) {
        console.error("Error al cargar datos iniciales:", err)
        setError("Error al cargar datos necesarios")
      } finally {
        setLoading(prev => ({ ...prev, categorias: false, productos: false }))
      }
    }

    cargarDatosIniciales()
  }, [])

  // Validar nombre único
  const validarNombreUnico = (nombre) => {
    return !productos.some(
      prod => prod.nombre.toLowerCase() === nombre.toLowerCase() &&
        (!producto || prod._id !== producto._id)
    )
  }

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'precio' || name === 'cantidad' || name === 'Id_Categoria'
        ? parseInt(value) || 0
        : value
    }))
  }
  
  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    // Validaciones
    if (!formData.nombre.trim()) {
      setError("El nombre del producto es obligatorio")
      return
    }

    if (!validarNombreUnico(formData.nombre)) {
      setError("Ya existe un producto con ese nombre")
      return
    }

    if (!formData.precio || formData.precio <= 0) {
      setError("El precio debe ser mayor a 0")
      return
    }

    if (!formData.Id_Categoria) {
      setError("Debe seleccionar una categoría")
      return
    }

    try {
      setLoading(prev => ({ ...prev, submit: true }))

      const productoData = {
        nombre: formData.nombre.trim(),
        precio: formData.precio,
        cantidad: parseInt(formData.cantidad),
        descripcion: formData.descripcion?.trim(),
        estado: formData.estado,
        Id_Categoria: formData.Id_Categoria  
      }
      

      if (producto) {
        await actualizarProducto(producto.id, productoData)
        console.log("DATOS QUE LLEGAN AL EDITAR",producto.id,productoData);

      } else {
        await crearProducto(productoData)
        console.log("DATOS QUE LLEGAN",productoData);
        
      }

      onSave()
    } catch (error) {
      console.error("Error al guardar producto:", error)
      setError(error.response?.data?.message || "Error al guardar el producto")
    }
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 shadow-lg max-w-md mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white">
          {producto ? "Editar Producto" : "Nuevo Producto"}
        </h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors"
          disabled={loading.submit}
        >
          <X size={24} />
        </button>
      </div>

      {/* Mostrar errores */}
      {error && (
        <div className="bg-red-900/50 text-red-300 p-3 rounded mb-4 text-sm">
          {error}
        </div>
      )}

      {/* Mostrar carga inicial */}
      {(loading.categorias || loading.productos) && (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="animate-spin h-8 w-8 text-orange-500" />
        </div>
      )}

      {/* Formulario */}
      {!(loading.categorias || loading.productos) && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              disabled={loading.submit}
            />

            <FormField
              label="Precio"
              type="number"
              name="precio"
              value={formData.precio}
              onChange={handleChange}
              min="0.01"
              step="0.01"
              required
              disabled={loading.submit}
            />

            <FormField
              label="Cantidad"
              type="number"
              name="cantidad"
              value={formData.cantidad}
              onChange={handleChange}
              min="0.01"
              step="0.01"
              required
              disabled={loading.submit}
            />

            <SelectField
              label="Estado"
              name="estado"
              value={formData.estado}
              onChange={handleChange}
              options={[
                { value: "activo", label: "Activo" },
                { value: "inactivo", label: "Inactivo" }
              ]}
              required
              disabled={loading.submit}
            />

            <SelectField
              label="Categoría"
              name="Id_Categoria"  
              value={formData.Id_Categoria}
              onChange={handleChange}
              options={[
                { value: "", label: "Seleccione una categoría", disabled: true },
                ...categorias.map(cat => ({
                  value: cat.id,
                  label: cat.nombre
                }))
              ]}
              required
              disabled={loading.submit}
            />

            {/* Descripción ocupa ambas columnas */}
            <div className="md:col-span-2">
              <TextAreaField
                label="Descripción"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                required={false}
                disabled={loading.submit}
              />
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${loading.submit
                ? "bg-orange-700 cursor-not-allowed"
                : "bg-orange-600 hover:bg-orange-700"
                } text-white`}
              disabled={loading.submit}
            >
              <Save size={18} />
              Guardar
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors"
              disabled={loading.submit}
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

export default ProductoForm