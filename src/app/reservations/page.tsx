"use client";

import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function ReservationsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [creating, setCreating] = useState(false);

  const router = useRouter();

  // 🔐 esperar auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoadingUser(false);

      if (!u) router.push("/login");
    });

    return () => unsubscribe();
  }, [router]);

  const handleCreateReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const today = new Date().toISOString().split("T")[0];
    if (date < today) {
      alert("No puedes reservar en una fecha pasada");
      return;
    }

    try {
      setCreating(true);

      await addDoc(collection(db, "reservations"), {
        userId: user.uid,
        date,
        time,
        createdAt: Timestamp.now(),
      });

      // 🔥 navegación suave (mejor que push)
      router.replace("/dashboard");
    } catch (error) {
      console.error(error);
      alert("Error al crear reserva");
      setCreating(false);
    }
  };

  if (loadingUser)
    return <p className="text-center mt-10 text-gray-500">Cargando...</p>;

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
          disabled={creating}
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700 transition disabled:opacity-50"
        >
          {creating ? "Creando..." : "Reservar"}
        </button>
      </form>
    </div>
  );
}
