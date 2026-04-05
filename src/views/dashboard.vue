<script setup>
import { ref, onMounted } from "vue";
import { auth, db } from "../firebase"; // Zorg dat 'db' geëxporteerd is uit je firebase config
import { collection, getDocs } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useRouter } from "vue-router";

const router = useRouter();
const reservations = ref([]); // Hier slaan we de data op

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

onMounted(() => {
  fetchReservations();
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

const handleLogout = async () => {
  try {
    await signOut(auth);
    router.push("/login");
  } catch (error) {
    console.error("Fout bij uitloggen:", error);
  }
};
</script>

<template>
  <main>
    <section>
      <label class="label" for="">Dashboard</label>
      <h2 class="h2-font">Dashboard</h2>
      <p>
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sed mollitia
        ea, magnam voluptatum omnis modi officia dicta magni recusandae
        consequuntur nihil delectus error, facilis soluta amet. Nulla inventore
        quos asperiores.
      </p>
      <h3>Agenda</h3>
      <form action="">
        <fieldset>
          <legend>Informatie</legend>
          <label for="image">Foto</label>
          <input type="file" id="image" />
          <label for="band">Band</label>
          <input placeholder="Artquake band" type="text" name="" id="band" />
          <label for="place">Address</label>
          <input placeholder="Heerhugowaard" type="text" name="" id="place" />
          <label for="date">Datum</label>
          <input type="date" name="" id="date" />
          <label for="start_time">Start tijd</label>
          <input type="time" name="" id="" />
          <label for="end_time">Eind tijd</label>
          <input type="time" name="" id="end_time" />
          <label for="">Type</label>
          <select name="" id="">
            <option value="">Open entree</option>
            <option value="">Gesloten entree</option>
          </select>
          <button class="btn" type="submit">Voeg het item toe</button>
        </fieldset>
      </form>
      <h3>Reservaties</h3>

      <table v-if="reservations.length > 0">
        <thead>
          <tr>
            <th scope="col">Naam</th>
            <th scope="col">Studio</th>
            <th scope="col">Start tijd</th>
            <th scope="col">Eind tijd</th>
            <th scope="col">Datum</th>
            <th scope="col">Gemaakt op</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="res in reservations" :key="res.id">
            <td data-label="Naam">{{ res.name }}</td>
            <td data-label="Studio">{{ res.studio }}</td>
            <td data-label="Start tijd">{{ res.startTime }}</td>
            <td data-label="Eind tijd">{{ res.endTime }}</td>
            <td data-label="Datum">{{ res.date }}</td>
            <td data-label="Gemaakt op">{{ formatDate(res.createdAt) }}</td>
          </tr>
        </tbody>
      </table>
      <p v-else>Er zijn momenteel geen reservaties gevonden.</p>
    </section>
  </main>
</template>

<style scoped>
select {
  margin-bottom: 1rem;
}

table {
  border-radius: var(--br);
  border-collapse: collapse;
  margin: 0;
  padding: 0;
  width: 100%;
  table-layout: fixed;
}

table tr {
}

table th,
table td {
  padding: 0.625em;
  border: 1px solid var(--c-grey);
  text-align: center;
}

table th {
  letter-spacing: 0.1em;
}

@media screen and (max-width: 600px) {
  table thead {
    clip: rect(0 0 0 0);
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    width: 1px;
  }

  table tr {
    display: block;
    margin-bottom: 2rem;
    width: 100%;
    max-width: 19rem;
  }

  table td {
    display: block;
    text-align: right;
  }

  table td::before {
    content: attr(data-label);
    float: left;
    font-weight: bold;
  }
}
</style>
