<script setup>
import Slider from "../components/slider.vue";
const sliderImages = ["1.avif", "2.avif", "3.avif", "4.avif", "5.avif"];
</script>

<template>
  <main>
    <section>
      <span class="label">Activiteiten</span>
      <h2 class="h2-font"><em>Ontdek</em> wat er te beleven valt</h2>
      <span class="line"></span>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tempora iste,
        eligendi, facilis vel consequuntur, numquam non similique culpa fugit
        suscipit dolores corrupti atque quam sequi debitis voluptate quae nobis
        praesentium.
      </p>
      <article class="full-width">
        <h3 class="h3-font">Talent Night</h3>
        <p>
          Talent Night is dé uitgaansavond voor en door jongeren! Bomvol met jong,
          aanstormend talent. Voor liefhebbers van live-muziek, dansen en feesten!
        </p>
        <Slider :images="sliderImages" folder="talentnight" />
      </article>
      <article>
        <h3 class="h3-font">Jamsessies</h3>
        <p>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quasi vero
          necessitatibus voluptates delectus asperiores dolore accusantium rerum
          adipisci in enim veritatis consequuntur dignissimos officiis id neque,
          quibusdam cupiditate quis! Eum.
        </p>
      </article>
      <article>
        <h3 class="h3-font">Streekmarkt Broekerveiling</h3>
        <p>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quasi vero
          necessitatibus voluptates delectus asperiores dolore accusantium rerum
          adipisci in enim veritatis consequuntur dignissimos officiis id neque,
          quibusdam cupiditate quis! Eum.
        </p>
      </article>
      <article>
        <h3 class="h3-font">Exposities</h3>
        <p>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quasi vero
          necessitatibus voluptates delectus asperiores dolore accusantium rerum
          adipisci in enim veritatis consequuntur dignissimos officiis id neque,
          quibusdam cupiditate quis! Eum.
        </p>
      </article>
      <article>
        <h3 class="h3-font">Fotoshoots</h3>
        <p>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quasi vero
          necessitatibus voluptates delectus asperiores dolore accusantium rerum
          adipisci in enim veritatis consequuntur dignissimos officiis id neque,
          quibusdam cupiditate quis! Eum.
        </p>
      </article>
      <article>
        <h3 class="h3-font">Workshops en Masterclasses</h3>
        <p>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quasi vero
          necessitatibus voluptates delectus asperiores dolore accusantium rerum
          adipisci in enim veritatis consequuntur dignissimos officiis id neque,
          quibusdam cupiditate quis! Eum.
        </p>
      </article>
      <article>
        <h3 class="h3-font">Coaching</h3>
        <p>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quasi vero
          necessitatibus voluptates delectus asperiores dolore accusantium rerum
          adipisci in enim veritatis consequuntur dignissimos officiis id neque,
          quibusdam cupiditate quis! Eum.
        </p>
      </article>
      <article>
        <h3 class="h3-font">In opdracht</h3>
        <p>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quasi vero
          necessitatibus voluptates delectus asperiores dolore accusantium rerum
          adipisci in enim veritatis consequuntur dignissimos officiis id neque,
          quibusdam cupiditate quis! Eum.
        </p>
      </article>
    </section>
  </main>
</template>

<style scoped>
article {
  display: grid;
  gap: 0.8rem;
}

@media (min-width: 900px) {
  section {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 4rem;
    align-items: start;

    .label,
    h2,
    .line,
    > p:first-of-type,
    .full-width {
      grid-column: 1 / -1;
    }
  }
}
</style>
