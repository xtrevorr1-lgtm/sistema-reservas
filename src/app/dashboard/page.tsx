"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
} from "firebase/firestore";
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
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        router.push("/login");
        return;
      }

      setUser(u);

      const q = query(
        collection(db, "reservations"),
        where("userId", "==", u.uid),
        orderBy("createdAt", "desc")
      );

      const snapshot = await getDocs(q);

      const data: Reservation[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Reservation, "id">),
      }));

      setReservations(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) return <p className="text-center mt-10">Cargando...</p>;

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-4">Mis reservas</h1>

      {reservations.length === 0 ? (
        <p>No tienes reservas aún</p>
      ) : (
        <ul className="space-y-3">
          {reservations.map((res) => (
            <li
              key={res.id}
              className="border rounded-lg p-3 flex justify-between"
            >
              <span>{res.date}</span>
              <span>{res.time}</span>
            </li>
          ))}
        </ul>
      )}

      <button
        onClick={() => router.push("/reservations")}
        className="mt-6 bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700"
      >
        Nueva reserva
      </button>
    </div>
  );
}
