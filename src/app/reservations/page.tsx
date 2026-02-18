"use client";

import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  Timestamp,
} from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";

export default function ReservationsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  // ✅ Esperar a que Firebase cargue el usuario
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });

    return () => unsubscribe();
  }, []);

  const handleCreateReservation = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert("Debes iniciar sesión");
      return;
    }

    try {
      await addDoc(collection(db, "reservations"), {
        userId: user.uid,
        date,
        time,
        createdAt: Timestamp.now(),
      });

      alert("Reserva creada 🎉");
      setDate("");
      setTime("");
    } catch (error) {
      console.error(error);
      alert("Error al crear reserva");
    }
  };

  if (user === null) return <p>Cargando...</p>;

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-4">Crear reserva</h1>

      <form onSubmit={handleCreateReservation} className="space-y-4">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="border rounded px-3 py-2 w-full"
        />

        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
          className="border rounded px-3 py-2 w-full"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Reservar
        </button>
      </form>
    </div>
  );
}
