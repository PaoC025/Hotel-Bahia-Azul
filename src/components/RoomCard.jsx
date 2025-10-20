export default function RoomCard({ room }) {
  return (
    <div className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition">
      <img src={room.imagenes?.[0]} alt={room.nombre} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="font-semibold text-lg">{room.nombre}</h3>
        <p className="text-sm text-gray-600">{room.descripcion}</p>
        <div className="mt-3 flex justify-between items-center">
          <span className="font-bold text-blue-700">${room.precio} / noche</span>
          <button className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">Reservar</button>
        </div>
      </div>
    </div>
  )
}
