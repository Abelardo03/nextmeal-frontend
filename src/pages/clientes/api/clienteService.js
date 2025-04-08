import axios from "axios"

const VITE_API_URL = "http://localhost:3000/api"

// ✅ Crear cliente (POST)
export const createCliente = async (clienteData) => {
  try {
    console.log("Enviando datos al servidor:", clienteData)
    const res = await axios.post(`${VITE_API_URL}/clientes`, clienteData)
    return res.data.data
  } catch (error) {
    if (error.response?.data?.errores) {
      console.error("Errores del backend:", error.response.data.errores)
      error.response.data.errores.forEach((err, index) => {
        console.error(`Error ${index + 1}:`, err)
      })
      const errorMessage = error.response.data.errores
        .map((err) => (typeof err === "string" ? err : err.mensaje || JSON.stringify(err)))
        .join(", ")
      error.message = errorMessage || error.message
    } else if (error.response?.data?.mensaje) {
      console.error("Mensaje de error del backend:", error.response.data.mensaje)
      error.message = error.response.data.mensaje
    } else {
      console.error("Error al crear cliente:", error.message)
    }
    throw error
  }
}

// ✅ Obtener todos los clientes (GET)
export const fetchClientes = async () => {
  try {
    const res = await axios.get(`${VITE_API_URL}/clientes`)
    return res.data
  } catch (error) {
    console.error("Error al obtener clientes", error)
    throw error
  }
}

// ✅ Obtener cliente por ID (GET)
export const fetchClienteById = async (id) => {
  try {
    const res = await axios.get(`${VITE_API_URL}/clientes/${id}`)
    return res.data.data
  } catch (error) {
    console.error("Error al obtener cliente por ID", error)
    if (error.response?.data?.mensaje) {
      error.message = error.response.data.mensaje
    }
    throw error
  }
}

// ✅ Actualizar cliente por ID (PUT)
export const updateCliente = async (id, clienteActualizado) => {
  try {
    const res = await axios.put(`${VITE_API_URL}/clientes/${id}`, clienteActualizado)
    console.log("Cliente actualizado:", res.data.data)
    return res.data.data
  } catch (error) {
    console.error("Error al actualizar cliente", error)
    if (error.response?.data?.mensaje) {
      error.message = error.response.data.mensaje
    }
    throw error
  }
}

// ✅ Eliminar cliente por ID (DELETE)
export const deleteCliente = async (id) => {
  try {
    console.log(`Eliminando cliente con ID: ${id}`)
    const res = await axios.delete(`${VITE_API_URL}/clientes/${id}`)
    console.log("Cliente eliminado:", res.data.message || res.data)
    return res.data
  } catch (error) {
    console.error("Error al eliminar cliente", error)
    if (error.response?.data?.mensaje) {
      error.message = error.response.data.mensaje
    }
    throw error
  }
}

// ✅ Cambiar estado del cliente (PATCH)
export const toggleClienteEstado = async (id, estadoActual) => {
  try {
    const nuevoEstado = estadoActual === "activo" ? "inactivo" : "activo"
    console.log(`Cambiando estado del cliente ${id} de ${estadoActual} a ${nuevoEstado}`)

    const res = await axios.patch(`${VITE_API_URL}/clientes/${id}/estado`, {
      estado: nuevoEstado,
    })

    console.log("Estado del cliente actualizado:", res.data.data)
    return res.data.data
  } catch (error) {
    console.error("Error al cambiar estado del cliente", error)
    if (error.response?.data?.mensaje) {
      error.message = error.response.data.mensaje
    }
    throw error
  }
}
