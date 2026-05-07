<script setup>
import { ref, onMounted } from "vue";
import { db, storage } from "../firebase";
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
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import StatusMessage from "../components/statusmessage.vue";
import LoadingOverlay from "../components/loadingoverlay.vue";
import { useStatus } from "../composables/useStatus.js";

const { status, showStatus } = useStatus();

const loading = ref(false);
const reservations = ref([]);
const agendaItems = ref([]);
const imageFile = ref(null);

const agendaForm = ref({
  band: "",
  place: "",
  date: "",
  startTime: "",
  endTime: "",
  type: "Open entree",
});

const handleImageChange = (e) => {
  imageFile.value = e.target.files[0] || null;
};

const fetchReservations = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "reservations"));
    reservations.value = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Fout bij ophalen van de reserveringen:", error);
  }
};

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

const addAgendaItem = async () => {
  loading.value = true;
  try {
    let imageUrl = "";
    if (imageFile.value) {
      const fileRef = storageRef(
        storage,
        `agenda-images/${Date.now()}-${imageFile.value.name}`
      );
      await uploadBytes(fileRef, imageFile.value);
      imageUrl = await getDownloadURL(fileRef);
    }

    await addDoc(collection(db, "agenda"), {
      ...agendaForm.value,
      imageUrl,
      createdAt: serverTimestamp(),
    });

    agendaForm.value = {
      band: "",
      place: "",
      date: "",
      startTime: "",
      endTime: "",
      type: "Open entree",
    };
    imageFile.value = null;

    showStatus("success", "Event succesvol toegevoegd!");
    fetchAgendaItems();
  } catch (error) {
    console.error("Fout bij toevoegen event:", error);
    showStatus("error", "Fout bij toevoegen event. Probeer opnieuw.");
  } finally {
    loading.value = false;
  }
};

const deleteAgendaItem = async (id) => {
  if (confirm("Weet je zeker dat je dit agenda-item wilt verwijderen?")) {
    try {
      await deleteDoc(doc(db, "agenda", id));
      agendaItems.value = agendaItems.value.filter((item) => item.id !== id);
      showStatus("success", "Agenda item verwijderd.");
    } catch (error) {
      console.error("Fout bij verwijderen:", error);
      showStatus("error", "Fout bij verwijderen. Probeer opnieuw.");
    }
  }
};

const deleteReservation = async (id) => {
  if (confirm("Weet je zeker dat je deze reservering wilt verwijderen?")) {
    try {
      await deleteDoc(doc(db, "reservations", id));
      reservations.value = reservations.value.filter((res) => res.id !== id);
      showStatus("success", "Reservering verwijderd.");
    } catch (error) {
      console.error("Fout bij verwijderen:", error);
      showStatus("error", "Fout bij verwijderen. Probeer opnieuw.");
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
    <StatusMessage
      :show="status.show"
      :type="status.type"
      :message="status.message"
    />

    <LoadingOverlay :show="loading" />

    <section>
      <span class="label">Dashboard</span>
      <h2 class="h2-font">Beheer</h2>

      <h3>Agenda Item Toevoegen</h3>
      <form @submit.prevent="addAgendaItem">
        <fieldset>
          <legend>Informatie</legend>

          <label for="image">Afbeelding</label>
          <input
            type="file"
            id="image"
            accept="image/*"
            @change="handleImageChange"
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
          <input
            @click="$event.target.showPicker()"
            v-model="agendaForm.date"
            type="date"
            id="date"
            required
          />

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

          <button class="btn" type="submit" :disabled="loading">
            {{ loading ? "Bezig..." : "Voeg het item toe" }}
          </button>
        </fieldset>
      </form>

      <h3>Bestaande Agenda Items</h3>
      <div v-if="agendaItems.length > 0">
        <div v-for="item in agendaItems" :key="item.id">
          <div data-label="Band">
            <strong>{{ item.band }}</strong>
          </div>
          <div data-label="Datum">{{ item.date }}</div>
          <div data-label="Acties">
            <button @click="deleteAgendaItem(item.id)" class="btn-delete">
              Verwijder
            </button>
          </div>
        </div>
      </div>
      <p v-else>Geen agenda items gevonden.</p>

      <h3>Reserveringen</h3>
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
      <p v-else>Geen reserveringen gevonden.</p>
    </section>
  </main>
</template>

<style scoped>
select {
  margin-bottom: 1rem;
}

@media (min-width: 900px) {
  section {
    max-width: 65rem;
  }
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
