"use client"

import { useState, useEffect } from "react"
import {
  Clock,
  CheckCircle,
  XCircle,
  Utensils,
  Search,
  RefreshCw,
  Filter,
  ChevronLeft,
  ChevronRight,
  Eye,
  Edit,
  Trash2,
  ArrowUpDown,
} from "lucide-react"
import { fetchPedidos, deletePedido, togglePedidoEstado } from "../api/pedidoservice.js"
import CambiarEstadoModal from "../modals/CambiarEstadoModal.jsx"
import PedidoDetailModal from "../modals/PedidoDetailModal.jsx"

const PedidoList = ({ onEdit, onDelete, onRefresh }) => {
  const [pedidos, setPedidos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [isDeleting, setIsDeleting] = useState(false)
  const [pedidoToDelete, setPedidoToDelete] = useState(null)
  const [showDetail, setShowDetail] = useState(null)
  const [showEstadoModal, setShowEstadoModal] = useState(false)
  const [pedidoToChangeStatus, setPedidoToChangeStatus] = useState(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [viewMode, setViewMode] = useState("table") // "table" o "kanban"
  const [filterEstado, setFilterEstado] = useState("todos")
  const [sortField, setSortField] = useState("fecha_pedido")
  const [sortDirection, setSortDirection] = useState("desc")

  const itemsPerPage = 8

  useEffect(() => {
    loadPedidos()
  }, [])

  const loadPedidos = async () => {
    try {
      setLoading(true)
      const data = await fetchPedidos()
      setPedidos(data || [])
      setError(null)
    } catch (err) {
      setError("Error al cargar los pedidos: " + (err.message || "Error desconocido"))
      console.error("Error al cargar pedidos:", err)
      setPedidos([]) // Establecer un array vacío en caso de error
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteClick = (pedido) => {
    setPedidoToDelete(pedido)
    setIsDeleting(true)
  }

  const confirmDelete = async () => {
    try {
      await deletePedido(pedidoToDelete.id)
      onDelete() // Recargar la lista
      setIsDeleting(false)
      setPedidoToDelete(null)
    } catch (error) {
      console.error("Error al eliminar pedido:", error)
      setError("Error al eliminar: " + error.message)
    }
  }

  const handleChangeStatus = (pedido) => {
    setPedidoToChangeStatus(pedido)
    setShowEstadoModal(true)
  }

  const confirmChangeStatus = async (estado) => {
    try {
      setIsUpdating(true)
      await togglePedidoEstado(pedidoToChangeStatus.id, estado)
      onRefresh() // Recargar la lista
      setShowEstadoModal(false)
      setPedidoToChangeStatus(null)
    } catch (error) {
      console.error("Error al cambiar estado del pedido:", error)
      setError("Error al cambiar estado: " + error.message)
    } finally {
      setIsUpdating(false)
    }
  }

  // Función para ordenar pedidos
  const sortPedidos = (a, b) => {
    if (sortField === "fecha_pedido") {
      return sortDirection === "asc"
        ? new Date(a.fecha_pedido) - new Date(b.fecha_pedido)
        : new Date(b.fecha_pedido) - new Date(a.fecha_pedido)
    } else if (sortField === "total") {
      return sortDirection === "asc" ? a.total - b.total : b.total - a.total
    } else if (sortField === "cliente") {
      return sortDirection === "asc"
        ? a.cliente.nombreCompleto.localeCompare(b.cliente.nombreCompleto)
        : b.cliente.nombreCompleto.localeCompare(a.cliente.nombreCompleto)
    }
    return 0
  }

  // Filtrar y ordenar pedidos
  const filteredPedidos = pedidos
    .filter(
      (pedido) =>
        (filterEstado === "todos" || pedido.estado === filterEstado) &&
        (pedido.cliente.nombreCompleto.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pedido.producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pedido.id.toString().includes(searchTerm)),
    )
    .sort(sortPedidos)

  // Calcular páginas
  const totalPages = Math.ceil(filteredPedidos.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedPedidos = filteredPedidos.slice(startIndex, startIndex + itemsPerPage)

  // Agrupar pedidos por estado para vista Kanban
  const pedidosByEstado = {
    pendiente: filteredPedidos.filter((p) => p.estado === "pendiente"),
    preparacion: filteredPedidos.filter((p) => p.estado === "preparacion"),
    terminado: filteredPedidos.filter((p) => p.estado === "terminado"),
    cancelado: filteredPedidos.filter((p) => p.estado === "cancelado"),
  }

  // Componente para renderizar una fila de la tabla
  const PedidoRow = ({ pedido }) => {
    const estadoClasses = {
      pendiente: "bg-yellow-900 text-yellow-300 border-yellow-500",
      preparacion: "bg-blue-900 text-blue-300 border-blue-500",
      terminado: "bg-green-900 text-green-300 border-green-500",
      cancelado: "bg-red-900 text-red-300 border-red-500",
    }

    const estadoIcons = {
      pendiente: <Clock size={16} className="mr-1" />,
      preparacion: <Utensils size={16} className="mr-1" />,
      terminado: <CheckCircle size={16} className="mr-1" />,
      cancelado: <XCircle size={16} className="mr-1" />,
    }

    return (
      <tr className="hover:bg-gray-800 transition-colors">
        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">#{pedido.id}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{pedido.cliente.nombreCompleto}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{pedido.producto.nombre}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{pedido.cantidad}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">${pedido.total.toLocaleString("es-CO")}</td>
        <td className="px-6 py-4 whitespace-nowrap">
          <button
            onClick={() => handleChangeStatus(pedido)}
            disabled={isUpdating}
            className={`px-2 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full border ${estadoClasses[pedido.estado]} transition-colors`}
            title="Cambiar estado"
          >
            {estadoIcons[pedido.estado]}
            {pedido.estado.charAt(0).toUpperCase() + pedido.estado.slice(1)}
          </button>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
          {new Date(pedido.fecha_pedido).toLocaleString("es-CO", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
          <div className="flex space-x-2">
            <button
              onClick={() => setShowDetail(pedido)}
              className="text-blue-400 hover:text-blue-300 transition-colors"
              title="Ver detalles"
            >
              <Eye size={18} />
            </button>
            <button
              onClick={() => onEdit(pedido)}
              className="text-orange-500 hover:text-orange-400 transition-colors"
              title="Editar"
            >
              <Edit size={18} />
            </button>
            <button
              onClick={() => handleDeleteClick(pedido)}
              className="text-red-500 hover:text-red-400 transition-colors"
              title="Eliminar"
              disabled={pedido.estado === "terminado"}
            >
              <Trash2 size={18} className={pedido.estado === "terminado" ? "opacity-50 cursor-not-allowed" : ""} />
            </button>
          </div>
        </td>
      </tr>
    )
  }

  // Componente para tarjeta de pedido en vista Kanban
  const PedidoCard = ({ pedido }) => {
    const borderColors = {
      pendiente: "border-yellow-500",
      preparacion: "border-blue-500",
      terminado: "border-green-500",
      cancelado: "border-red-500",
    }

    return (
      <div
        className={`bg-gray-800 rounded-lg p-4 mb-3 border-r-2 ${borderColors[pedido.estado]} shadow-md hover:shadow-lg transition-all`}
      >
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-white font-medium">
            #{pedido.id} - {pedido.producto.nombre}
          </h3>
          <div className="flex space-x-1">
            <button
              onClick={() => setShowDetail(pedido)}
              className="text-blue-400 hover:text-blue-300 transition-colors p-1"
              title="Ver detalles"
            >
              <Eye size={16} />
            </button>
            <button
              onClick={() => onEdit(pedido)}
              className="text-orange-500 hover:text-orange-400 transition-colors p-1"
              title="Editar"
            >
              <Edit size={16} />
            </button>
          </div>
        </div>

        <div className="text-sm text-gray-300 mb-2">Cliente: {pedido.cliente.nombreCompleto}</div>

        <div className="flex justify-between text-sm mb-3">
          <span className="text-gray-400">Cantidad: {pedido.cantidad}</span>
          <span className="text-white font-medium">${pedido.total.toLocaleString("es-CO")}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-400">
            {new Date(pedido.fecha_pedido).toLocaleString("es-CO", {
              day: "2-digit",
              month: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
          <button
            onClick={() => handleChangeStatus(pedido)}
            className="text-xs text-orange-400 hover:text-orange-300 transition-colors"
          >
            Cambiar estado
          </button>
        </div>
      </div>
    )
  }

  // Componente para la barra de búsqueda y filtros
  const SearchBar = () => (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="flex items-center flex-grow bg-gray-900 border border-gray-700 rounded-lg p-2">
        <Search className="text-gray-400 ml-2" size={20} />
        <input
          type="text"
          placeholder="Buscar por cliente, producto o ID..."
          className="w-full bg-transparent border-none text-white focus:outline-none px-3 py-2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="flex gap-2">
        <div className="relative">
          <select
            value={filterEstado}
            onChange={(e) => setFilterEstado(e.target.value)}
            className="appearance-none bg-gray-800 border border-gray-700 text-white py-2 px-4 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="todos">Todos los estados</option>
            <option value="pendiente">Pendientes</option>
            <option value="preparacion">En preparación</option>
            <option value="terminado">Terminados</option>
            <option value="cancelado">Cancelados</option>
          </select>
          <Filter
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
            size={16}
          />
        </div>

        <button
          onClick={() => setViewMode(viewMode === "table" ? "kanban" : "table")}
          className="p-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors border border-gray-700"
          title={viewMode === "table" ? "Ver como Kanban" : "Ver como Tabla"}
        >
          {viewMode === "table" ? "Kanban" : "Tabla"}
        </button>

        <button
          onClick={onRefresh}
          className="p-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors border border-gray-700"
          title="Refrescar"
        >
          <RefreshCw size={20} />
        </button>
      </div>
    </div>
  )

  // Componente para la paginación
  const Pagination = () => {
    if (totalPages <= 1) return null

    return (
      <div className="flex justify-between items-center mt-4 text-white">
        <div>
          Mostrando {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredPedidos.length)} de{" "}
          {filteredPedidos.length} pedidos
        </div>
        <div className="flex space-x-2">
          <PaginationButton
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            icon={<ChevronLeft size={20} />}
          />

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 rounded-md ${
                currentPage === page
                  ? "bg-orange-600 text-white border border-orange-500"
                  : "text-white hover:bg-gray-800 border border-gray-700"
              }`}
            >
              {page}
            </button>
          ))}

          <PaginationButton
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            icon={<ChevronRight size={20} />}
          />
        </div>
      </div>
    )
  }

  // Botón de paginación reutilizable
  const PaginationButton = ({ onClick, disabled, icon }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`p-2 rounded-md ${
        disabled ? "text-gray-500 cursor-not-allowed" : "text-white hover:bg-gray-800 border border-gray-700"
      }`}
    >
      {icon}
    </button>
  )

  // Componente para encabezado de columna ordenable
  const SortableHeader = ({ field, label }) => (
    <th
      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:text-orange-400"
      onClick={() => {
        if (sortField === field) {
          setSortDirection(sortDirection === "asc" ? "desc" : "asc")
        } else {
          setSortField(field)
          setSortDirection("asc")
        }
      }}
    >
      <div className="flex items-center">
        {label}
        <ArrowUpDown size={14} className="ml-1" />
      </div>
    </th>
  )

  // Vista de tabla
  const TableView = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
        <thead className="bg-gray-900 text-orange-500 border-b border-orange-900">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">ID</th>
            <SortableHeader field="cliente" label="Cliente" />
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Producto</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Cant.</th>
            <SortableHeader field="total" label="Total" />
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Estado</th>
            <SortableHeader field="fecha_pedido" label="Fecha" />
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800">
          {paginatedPedidos.length > 0 ? (
            paginatedPedidos.map((pedido) => <PedidoRow key={pedido.id} pedido={pedido} />)
          ) : (
            <tr>
              <td colSpan="8" className="px-6 py-4 text-center text-gray-400">
                No se encontraron pedidos
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )

  // Vista de Kanban
  const KanbanView = () => {
    const columnStyle = "bg-gray-900 rounded-lg p-4 min-h-[400px] w-full md:w-64"
    const headerStyle = "text-lg font-bold mb-4 pb-2 border-b"

    return (
      <div className="flex flex-col md:flex-row gap-4 overflow-x-auto pb-4">
        <div className={columnStyle}>
          <h3 className={`${headerStyle} text-yellow-500 border-yellow-500`}>
            Pendientes ({pedidosByEstado.pendiente.length})
          </h3>
          <div className="space-y-3">
            {pedidosByEstado.pendiente.length > 0 ? (
              pedidosByEstado.pendiente.map((pedido) => <PedidoCard key={pedido.id} pedido={pedido} />)
            ) : (
              <p className="text-gray-500 text-center py-8">No hay pedidos pendientes</p>
            )}
          </div>
        </div>

        <div className={columnStyle}>
          <h3 className={`${headerStyle} text-blue-500 border-blue-500`}>
            En Preparación ({pedidosByEstado.preparacion.length})
          </h3>
          <div className="space-y-3">
            {pedidosByEstado.preparacion.length > 0 ? (
              pedidosByEstado.preparacion.map((pedido) => <PedidoCard key={pedido.id} pedido={pedido} />)
            ) : (
              <p className="text-gray-500 text-center py-8">No hay pedidos en preparación</p>
            )}
          </div>
        </div>

        <div className={columnStyle}>
          <h3 className={`${headerStyle} text-green-500 border-green-500`}>
            Terminados ({pedidosByEstado.terminado.length})
          </h3>
          <div className="space-y-3">
            {pedidosByEstado.terminado.length > 0 ? (
              pedidosByEstado.terminado.map((pedido) => <PedidoCard key={pedido.id} pedido={pedido} />)
            ) : (
              <p className="text-gray-500 text-center py-8">No hay pedidos terminados</p>
            )}
          </div>
        </div>

        <div className={columnStyle}>
          <h3 className={`${headerStyle} text-red-500 border-red-500`}>
            Cancelados ({pedidosByEstado.cancelado.length})
          </h3>
          <div className="space-y-3">
            {pedidosByEstado.cancelado.length > 0 ? (
              pedidosByEstado.cancelado.map((pedido) => <PedidoCard key={pedido.id} pedido={pedido} />)
            ) : (
              <p className="text-gray-500 text-center py-8">No hay pedidos cancelados</p>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-600"></div>
      </div>
    )
  }

  return (
    <div>
      <SearchBar />

      {error && (
        <div className="bg-red-900 text-white p-4 rounded-lg mb-6 animate-pulse border border-red-500">{error}</div>
      )}

      {viewMode === "table" ? <TableView /> : <KanbanView />}

      {viewMode === "table" && <Pagination />}

      {/* Modales */}
      {isDeleting && (
        <DeleteConfirmModal
          cliente={pedidoToDelete}
          onConfirm={confirmDelete}
          onCancel={() => {
            setIsDeleting(false)
            setPedidoToDelete(null)
          }}
          title="Confirmar eliminación de pedido"
          message={`¿Estás seguro de que deseas eliminar el pedido #${pedidoToDelete?.id}?`}
        />
      )}

      {showDetail && (
        <PedidoDetailModal
          pedido={showDetail}
          onClose={() => setShowDetail(null)}
          onEdit={() => {
            onEdit(showDetail)
            setShowDetail(null)
          }}
          onChangeStatus={() => {
            handleChangeStatus(showDetail)
            setShowDetail(null)
          }}
        />
      )}

      {showEstadoModal && (
        <CambiarEstadoModal
          pedido={pedidoToChangeStatus}
          onConfirm={confirmChangeStatus}
          onCancel={() => {
            setShowEstadoModal(false)
            setPedidoToChangeStatus(null)
          }}
        />
      )}
    </div>
  )
}

export default PedidoList

