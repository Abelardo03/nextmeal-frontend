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
      // Mostrar cada error en la consola para depuración
      error.response.data.errores.forEach((err, index) => {
        console.error(`Error ${index + 1}:`, err)
      })
      // Crear un mensaje de error más descriptivo
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
    console.log("Solicitando clientes al servidor...")
    const res = await axios.get(`${VITE_API_URL}/clientes`)
    console.log("Respuesta completa del servidor:", res)

    // Verificar la estructura de la respuesta
    if (res.data && res.data.data) {
      console.log("Clientes obtenidos:", res.data.data)
      return res.data.data
    } else {
      console.warn("Estructura de respuesta inesperada:", res.data)
      // Intentar encontrar los datos en la respuesta
      if (Array.isArray(res.data)) {
        return res.data
      }
      return []
    }
  } catch (error) {
    console.error("Error al obtener clientes:", error)
    if (error.response) {
      console.error("Detalles del error:", error.response.data)
    }
    throw error
  }
}

// export const fetchClientes = async () => {
//   try {
//     const res = await axios.get(`${VITE_API_URL}/clientes`)
//     console.log("Clientes obtenidos desde service:", res.data.data)
//     return res.data
//   } catch (error) {
//     console.error("Error al obtener clientes", error)
//     throw error
//   }
// }

// ✅ Actualizar cliente por ID (PUT)
export const updateCliente = async (id, clienteData) => {
  try {
    const res = await axios.put(`${VITE_API_URL}/clientes/${id}`, clienteData)
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
    console.log("Respuesta completa al eliminar:", res)
    return res.data
  } catch (error) {
    console.error("Error al eliminar cliente:", error)
    if (error.response) {
      console.error("Detalles del error:", error.response.data)
      if (error.response.data.mensaje) {
        error.message = error.response.data.mensaje
      }
    }
    throw error
  }
}

// ✅ Cambiar estado del cliente (PUT)
export const toggleClienteEstado = async (id, estado) => {
  try {
    const nuevoEstado = estado === "activo" ? "inactivo" : "activo"
    console.log(`Cambiando estado del cliente ${id} de ${estado} a ${nuevoEstado}`)

    const res = await axios.patch(`${VITE_API_URL}/clientes/${id}/estado`, {
      estado: nuevoEstado,
    })

    console.log("Respuesta completa al cambiar estado:", res)

    if (res.data && res.data.data) {
      return res.data.data
    } else if (res.data) {
      return res.data
    }

    return { id, estado: nuevoEstado }
  } catch (error) {
    console.error("Error al cambiar estado del cliente:", error)
    if (error.response) {
      console.error("Detalles del error:", error.response.data)
      if (error.response.data.mensaje) {
        error.message = error.response.data.mensaje
      }
    }
    throw error
  }
}

