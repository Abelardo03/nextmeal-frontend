import axios from "axios";

const VITE_API_URL = "http://localhost:3000/api";

//  Crear pedido (POST)
export const createPedido = async (pedidoData) => {
  try {
    const res = await axios.post(`${VITE_API_URL}/pedidos`, pedidoData); 
    return res.data.data;
  } catch (error) {
    if (error.response?.data?.errores) {
      console.error("Errores del backend:", error);
      error.response.data.errores.forEach((err, index) => {
        console.error(`Error ${index + 1}:`, err);
      });
      const errorMessage = error.response.data.errores
        .map((err) =>
          typeof err === "string" ? err : err.mensaje || JSON.stringify(err)
        )
        .join(", ");
      error.message = errorMessage || error.message;
    } else if (error.response.data?.mensaje) {
      console.error("Mensaje de error del backend:", error);
    } else {
      console.error("Error al crear pedido:", error.message);
    }
    throw error;
  }
};

//  Obtener todos los pedidos (GET)
export const fetchPedidos = async () => {
  try {
    const res = await axios.get(`${VITE_API_URL}/pedidos/pedido`);
    return res.data.data;
  } catch (error) {
    console.error("Error al obtener pedidos", error);
    throw error;
  }
};


//  Actualizar pedido por ID (PUT)
export const updatePedido = async (id, pedidoData) => {
  try {
    const res = await axios.put(`${VITE_API_URL}/pedidos/${id}`, pedidoData);
    return res.data.data;
  } catch (error) {
    console.error("Error al actualizar pedido", error);
  }
};

//  Eliminar pedido por ID (DELETE)
export const deletePedido = async (id) => {
  try {
    console.log(`Eliminando pedido con ID: ${id}`);
    const res = await axios.delete(`${VITE_API_URL}/pedidos/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error al eliminar pedido", error);
  }
};

//  Cambiar estado del pedido (PATCH)
export const togglePedidoEstado = async (id, nuevoEstado) => {
  try {
    const nuevoestado =
      nuevoEstado === "pendiente" ? "completado" : "pendiente";
    console.log(`${nuevoestado}`);

    const res = await axios.patch(`${VITE_API_URL}/pedidos/${id}/estado`, {
      estado: nuevoEstado,
    });
    return res.data.data;
  } catch (error) {
    console.error("Error al cambiar estado del pedido", error);
    if (error.response?.data?.mensaje) {
      error.message = error.response.data.mensaje;
    }
    throw error;
  }
};

//  Obtener todos los clientes (GET)
export const fetchClientes = async () => {
  try {
    const res = await axios.get(`${VITE_API_URL}/clientes`);
    return res.data.data;
  } catch (error) {
    console.error("Error al obtener clientes", error);
    throw error;
  }
};
export const fetchClientesPedidos = async () => {
  try {
    const res = await axios.get(`${VITE_API_URL}/clientes/clientesActivos`);
    return res.data;
  } catch (error) {
    console.error("Error al obtener clientes", error);
    throw error;
  }
};
 
//  Obtener todos los productos (GET)
export const fetchProductos = async () => {
  try {
    const res = await axios.get(`${VITE_API_URL}/productos`);
    return res.data.data;
  } catch (error) {
    console.error("Error al obtener productos", error);
    throw error;
  }
};
