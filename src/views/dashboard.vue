<script setup>
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "vue-router";

const router = useRouter();

const handleLogout = async () => {
  try {
    await signOut(auth);
    console.log("Succesvol uitgelogd");
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
    </section>
  </main>
</template>

<style scoped>
select {
  margin-bottom: 1rem;
}
</style>
