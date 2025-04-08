// src/pages/productos/api/ProductoService.js
import axios from "axios";

const VITE_API_URL = "http://localhost:3000/api";

// ✅ Obtener todos los productos
export const fetchProductos = async () => {
  try {
    const response = await axios.get(`${VITE_API_URL}/productos`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener productos:", error);
    throw error;
  }
};

// ✅ Obtener todas las categorías (para el formulario de productos)
export const fetchCategorias = async () => {
  try {
    const response = await axios.get(`${VITE_API_URL}/categoria`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener categorías:", error);
    throw error;
  }
};

// ✅ Crear producto
export const crearProducto = async (productoData) => {
  try {
    const response = await axios.post(`${VITE_API_URL}/productos`, productoData);
    return response.data;
  } catch (error) {
    console.error("Error al crear producto:", error);
    throw error;
  }
};

// ✅ Actualizar producto
export const actualizarProducto = async (id, productoData) => {
  try {
    const response = await axios.put(`${VITE_API_URL}/productos/${id}`, productoData);
    return response.data;
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    throw error;
  }
};

// ✅ Eliminar producto
export const deleteProducto = async (id) => {
  try {
    console.log(`Enviando solicitud DELETE a ${VITE_API_URL}/productos/${id}`);
    const response = await axios.delete(`${VITE_API_URL}/productos/${id}`);
    console.log("Respuesta recibida:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error completo:", error);
    if (error.response) {
      console.error("Datos de respuesta:", error.response.data);
      console.error("Estado:", error.response.status);
    }
    throw error;
  }
};