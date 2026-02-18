"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  deleteDoc,
  doc,
  orderBy,
} from "firebase/firestore";
import { onAuthStateChanged, User, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

interface Reservation {
  id: string;
  date: string;
  time: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let unsubscribeSnapshot: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (u) => {
      if (!u) {
        router.push("/login");
        return;
      }

      setUser(u);

      const q = query(
        collection(db, "reservations"),
        where("userId", "==", u.uid),
        orderBy("date"),
        orderBy("time")
      );

      unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
        const data: Reservation[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Reservation, "id">),
        }));

        setReservations(data);
        setLoading(false);
      });
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeSnapshot) unsubscribeSnapshot();
    };
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("¿Seguro que quieres cancelar esta reserva?");
    if (!confirmDelete) return;

    // eliminación optimista
    setReservations((prev) => prev.filter((r) => r.id !== id));

    try {
      await deleteDoc(doc(db, "reservations", id));
    } catch (error) {
      console.error(error);
      alert("Error al cancelar la reserva");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Cargando reservas...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto bg-white shadow-sm rounded-2xl p-6">
        <h1 className="text-2xl font-semibold mb-2">Dashboard</h1>

        {user && (
          <p className="text-gray-500 mb-4">
            Bienvenido, <span className="font-medium">{user.email}</span>
          </p>
        )}

        <button
          onClick={handleLogout}
          className="mb-6 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          Cerrar sesión
        </button>

        <h2 className="text-lg font-semibold mb-4">Tus reservas</h2>

        {reservations.length === 0 ? (
          <p className="text-gray-500">No tienes reservas aún</p>
        ) : (
          <ul className="space-y-3">
            {reservations.map((r) => (
              <li
                key={r.id}
                className="flex items-center justify-between border rounded-xl p-4"
              >
                <div>
                  <p className="font-medium">{r.date}</p>
                  <p className="text-sm text-gray-500">{r.time}</p>
                </div>

                <button
                  onClick={() => handleDelete(r.id)}
                  className="px-3 py-1.5 text-sm rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
                >
                  Cancelar
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
