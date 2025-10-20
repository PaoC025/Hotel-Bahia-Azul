import { createContext, useState } from 'react'

export const ReservationContext = createContext()

export function ReservationProvider({ children }) {
  const [reservas, setReservas] = useState([])

  const addReserva = (reserva) => setReservas([...reservas, reserva])

  return (
    <ReservationContext.Provider value={{ reservas, addReserva }}>
      {children}
    </ReservationContext.Provider>
  )
}
