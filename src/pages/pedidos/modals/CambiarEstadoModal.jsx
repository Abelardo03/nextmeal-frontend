"use client"

import { useState } from "react"
import { Clock, Utensils, CheckCircle, XCircle } from "lucide-react"

const CambiarEstadoModal = ({ pedido, onConfirm, onCancel }) => {
  const [selectedEstado, setSelectedEstado] = useState(pedido.estado)

  const estados = [
    {
      value: "pendiente",
      label: "Pendiente",
      icon: <Clock className="h-5 w-5" />,
      color: "bg-yellow-900 border-yellow-500 text-yellow-300",
      description: "El pedido está registrado pero aún no se ha comenzado a preparar.",
    },
    {
      value: "preparacion",
      label: "En Preparación",
      icon: <Utensils className="h-5 w-5" />,
      color: "bg-blue-900 border-blue-500 text-blue-300",
      description: "El pedido está siendo preparado en cocina.",
    },
    {
      value: "terminado",
      label: "Terminado",
      icon: <CheckCircle className="h-5 w-5" />,
      color: "bg-green-900 border-green-500 text-green-300",
      description: "El pedido ha sido entregado al cliente.",
    },
    {
      value: "cancelado",
      label: "Cancelado",
      icon: <XCircle className="h-5 w-5" />,
      color: "bg-red-900 border-red-500 text-red-300",
      description: "El pedido ha sido cancelado.",
    },
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900 p-6 rounded-xl shadow-2xl w-[500px] border-r-2 border-orange-500 animate-fade-in">
        <h3 className="text-xl font-bold text-white mb-4 border-b border-gray-700 pb-2">
          Cambiar Estado del Pedido #{pedido.id}
        </h3>

        <p className="text-gray-300 mb-4">
          Selecciona el nuevo estado para el pedido de{" "}
          <span className="font-semibold text-white">{pedido.cliente.nombreCompleto}</span>
        </p>

        <div className="grid grid-cols-1 gap-3 mb-6">
          {estados.map((estado) => (
            <button
              key={estado.value}
              onClick={() => setSelectedEstado(estado.value)}
              className={`p-4 rounded-lg border flex items-start transition-all ${
                selectedEstado === estado.value
                  ? `${estado.color} ring-2 ring-offset-2 ring-offset-gray-900 ring-orange-500`
                  : "bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-750"
              }`}
            >
              <div className="mr-3 mt-1">{estado.icon}</div>
              <div className="text-left">
                <h4 className="font-medium">{estado.label}</h4>
                <p className="text-sm opacity-80">{estado.description}</p>
              </div>
            </button>
          ))}
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors border border-gray-700"
          >
            Cancelar
          </button>
          <button
            onClick={() => onConfirm(selectedEstado)}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors border border-orange-500"
          >
            Confirmar Cambio
          </button>
        </div>
      </div>
    </div>
  )
}

export default CambiarEstadoModal

