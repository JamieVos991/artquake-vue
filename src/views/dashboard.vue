<script setup>
import { ref, onMounted } from "vue";
import { auth, db } from "../firebase";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useRouter } from "vue-router";

const router = useRouter();

// State
const reservations = ref([]);
const agendaItems = ref([]); // Nieuwe lijst voor agenda items

// Formulier data voor nieuwe events
const agendaForm = ref({
  band: "",
  place: "",
  date: "",
  startTime: "",
  endTime: "",
  type: "Open entree",
  imageUrl: "",
});

// Ophalen van reservaties
const fetchReservations = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "reservations"));
    reservations.value = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Fout bij ophalen reservaties:", error);
  }
};

// Ophalen van agenda items
const fetchAgendaItems = async () => {
  try {
    const q = query(collection(db, "agenda"), orderBy("date", "asc"));
    const querySnapshot = await getDocs(q);
    agendaItems.value = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Fout bij ophalen agenda:", error);
  }
};

// Agenda item toevoegen
const addAgendaItem = async () => {
  try {
    await addDoc(collection(db, "agenda"), {
      ...agendaForm.value,
      createdAt: serverTimestamp(),
    });

    // Reset formulier
    agendaForm.value = {
      band: "",
      place: "",
      date: "",
      startTime: "",
      endTime: "",
      type: "Open entree",
      imageUrl: "",
    };

    alert("Event succesvol toegevoegd!");
    fetchAgendaItems(); // Ververs de lijst direct
  } catch (error) {
    console.error("Fout bij toevoegen event:", error);
  }
};

// Agenda item verwijderen
const deleteAgendaItem = async (id) => {
  if (confirm("Weet je zeker dat je dit agenda-item wilt verwijderen?")) {
    try {
      await deleteDoc(doc(db, "agenda", id));
      agendaItems.value = agendaItems.value.filter((item) => item.id !== id);
      alert("Agenda item verwijderd.");
    } catch (error) {
      console.error("Fout bij verwijderen:", error);
    }
  }
};

// Reservatie verwijderen
const deleteReservation = async (id) => {
  if (confirm("Weet je zeker dat je deze reservatie wilt verwijderen?")) {
    try {
      await deleteDoc(doc(db, "reservations", id));
      reservations.value = reservations.value.filter((res) => res.id !== id);
      alert("Reservatie verwijderd.");
    } catch (error) {
      console.error("Fout bij verwijderen:", error);
    }
  }
};

onMounted(() => {
  fetchReservations();
  fetchAgendaItems();
});

const formatDate = (timestamp) => {
  if (!timestamp) return "Onbekend";
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleString("nl-NL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
</script>

<template>
  <main>
    <section>
      <label class="label">Dashboard</label>
      <h2 class="h2-font">Beheer</h2>

      <h3>Agenda Item Toevoegen</h3>
      <form @submit.prevent="addAgendaItem">
        <fieldset>
          <legend>Informatie</legend>

          <label for="image">Afbeelding URL</label>
          <input
            v-model="agendaForm.imageUrl"
            type="text"
            id="image"
            placeholder="https://link-naar-foto.png"
          />

          <label for="band">Band</label>
          <input
            v-model="agendaForm.band"
            placeholder="Artquake band"
            type="text"
            id="band"
            required
          />

          <label for="place">Locatie</label>
          <input
            v-model="agendaForm.place"
            placeholder="Heerhugowaard"
            type="text"
            id="place"
            required
          />

          <label for="date">Datum</label>
          <input v-model="agendaForm.date" type="date" id="date" required />

          <label for="start_time">Start tijd</label>
          <input v-model="agendaForm.startTime" type="time" required />

          <label for="end_time">Eind tijd</label>
          <input
            v-model="agendaForm.endTime"
            type="time"
            id="end_time"
            required
          />

          <label>Type</label>
          <select v-model="agendaForm.type">
            <option value="Open entree">Open entree</option>
            <option value="Gesloten entree">Gesloten entree</option>
          </select>

          <button class="btn" type="submit">Voeg het item toe</button>
        </fieldset>
      </form>

      <h3>Bestaande Agenda Items</h3>
      <table v-if="agendaItems.length > 0">
        <thead>
          <tr>
            <th>Band</th>
            <th>Datum</th>
            <th>Acties</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in agendaItems" :key="item.id">
            <td data-label="Band">
              <strong>{{ item.band }}</strong>
            </td>
            <td data-label="Datum">{{ item.date }}</td>
            <td data-label="Acties">
              <button @click="deleteAgendaItem(item.id)" class="btn-delete">
                Verwijder
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-else>Geen agenda items gevonden.</p>

      <h3>Reservaties</h3>
      <table v-if="reservations.length > 0">
        <thead>
          <tr>
            <th>Naam</th>
            <th>Studio</th>
            <th>Tijd</th>
            <th>Datum</th>
            <th>Acties</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="res in reservations" :key="res.id">
            <td data-label="Naam">{{ res.name }}</td>
            <td data-label="Studio">{{ res.studio }}</td>
            <td data-label="Tijd">{{ res.startTime }} - {{ res.endTime }}</td>
            <td data-label="Datum">{{ res.date }}</td>
            <td data-label="Acties">
              <button @click="deleteReservation(res.id)" class="btn-delete">
                Verwijder
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-else>Geen reservaties gevonden.</p>
    </section>
  </main>
</template>

<style scoped>
select {
  margin-bottom: 1rem;
}

hr {
  margin: 3rem 0;
  border: 0;
  border-top: 1px solid var(--c-grey);
}

table {
  border-radius: var(--br);
  border-collapse: collapse;
  width: 100%;
  margin-bottom: 2rem;
}

table th,
table td {
  padding: 0.8em;
  border: 1px solid var(--c-grey);
  text-align: left;
}

.btn-delete {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 6px 10px;
  border-radius: 4px;
  cursor: pointer;
}

.btn-delete:hover {
  background-color: #c0392b;
}

@media screen and (max-width: 600px) {
  table thead {
    display: none;
  }
  table tr {
    display: block;
    margin-bottom: 1rem;
    border: 1px solid var(--c-grey);
  }
  table td {
    display: block;
    text-align: right;
    position: relative;
    padding-left: 50%;
  }
  table td::before {
    content: attr(data-label);
    position: absolute;
    left: 10px;
    font-weight: bold;
    text-align: left;
  }
}
</style>
