"use client"

import { Edit, ShoppingBag, Clock, RefreshCw } from "lucide-react"

const PedidoDetailModal = ({ pedido, onClose, onEdit, onChangeStatus }) => {
  // Función para formatear fecha
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("es-CO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Colores según estado
  const estadoColors = {
    pendiente: "text-yellow-400",
    preparacion: "text-blue-400",
    terminado: "text-green-400",
    cancelado: "text-red-400",
  }

  // Iconos según estado
  const estadoIcons = {
    pendiente: <Clock className="h-5 w-5 text-yellow-400" />,
    preparacion: <RefreshCw className="h-5 w-5 text-blue-400" />,
    terminado: <Clock className="h-5 w-5 text-green-400" />,
    cancelado: <Clock className="h-5 w-5 text-red-400" />,
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900 p-6 rounded-xl shadow-2xl w-[600px] border-r-2 border-orange-500 animate-fade-in">
        <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-4">
          <h3 className="text-xl font-bold text-white flex items-center">
            <ShoppingBag className="mr-2 text-orange-500" size={20} />
            Pedido #{pedido.id}
          </h3>
          <div
            className={`px-3 py-1 rounded-full flex items-center gap-1 ${estadoColors[pedido.estado].replace("text-", "bg-").replace("-400", "-900")} bg-opacity-30`}
          >
            {estadoIcons[pedido.estado]}
            <span className={`text-sm font-medium ${estadoColors[pedido.estado]}`}>
              {pedido.estado.charAt(0).toUpperCase() + pedido.estado.slice(1)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="space-y-4">
            <div>
              <p className="text-gray-400 text-sm">Cliente</p>
              <p className="text-white font-medium">{pedido.cliente.nombreCompleto}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Teléfono</p>
              <p className="text-white font-medium">{pedido.cliente.telefono}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Dirección de Envío</p>
              <p className="text-white font-medium">{pedido.direccion_envio}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Fecha del Pedido</p>
              <p className="text-white font-medium">{formatDate(pedido.fecha_pedido)}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 flex items-start">
              <img
                src={pedido.producto.imagen || "/placeholder.svg"}
                alt={pedido.producto.nombre}
                className="w-16 h-16 rounded-lg object-cover mr-3"
              />
              <div>
                <h4 className="text-white font-medium">{pedido.producto.nombre}</h4>
                <p className="text-gray-400 text-sm">{pedido.producto.categoria}</p>
                <div className="flex justify-between mt-1">
                  <span className="text-gray-400 text-sm">Precio unitario:</span>
                  <span className="text-white">${pedido.precio_unitario.toLocaleString("es-CO")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 text-sm">Cantidad:</span>
                  <span className="text-white">{pedido.cantidad}</span>
                </div>
              </div>
            </div>

            <div className="bg-orange-900 bg-opacity-30 p-4 rounded-lg border border-orange-700">
              <div className="flex justify-between items-center">
                <span className="text-orange-300 font-medium">Total del Pedido:</span>
                <span className="text-white font-bold text-xl">${pedido.total.toLocaleString("es-CO")}</span>
              </div>
            </div>

            <div>
              <p className="text-gray-400 text-sm">Última Actualización</p>
              <p className="text-white font-medium">{formatDate(pedido.updatedAt)}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onChangeStatus}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 border border-blue-500"
          >
            <RefreshCw size={16} />
            Cambiar Estado
          </button>
          <button
            onClick={onEdit}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2 border border-orange-500"
          >
            <Edit size={16} />
            Editar
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors border border-gray-700"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}

export default PedidoDetailModal

