<script setup>
import Slider from "../components/slider.vue";
const sliderImages = ["1.avif", "2.avif", "3.avif", "4.avif", "5.avif"];
</script>

<template>
  <main>
    <section>
      <label class="label" for="">Activiteiten</label>
      <h2 class="h2-font"><em>Ontdek</em> wat er te beleven valt</h2>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tempora iste,
        eligendi, facilis vel consequuntur, numquam non similique culpa fugit
        suscipit dolores corrupti atque quam sequi debitis voluptate quae nobis
        praesentium.
      </p>
      <h3 class="h3-font">Talent Night</h3>
      <p>
        Talent Night is dé uitgaansavond voor en door jongeren! Bomvol met jong,
        aanstormend talent. Voor liefhebbers van live-muziek, dansen en feesten!
      </p>
      <Slider :images="sliderImages" folder="talentnight" />
      <h3 class="h3-font">Jamsessies</h3>
      <p>
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quasi vero
        necessitatibus voluptates delectus asperiores dolore accusantium rerum
        adipisci in enim veritatis consequuntur dignissimos officiis id neque,
        quibusdam cupiditate quis! Eum.
      </p>
      <h3 class="h3-font">Streekmarkt Broekerveiling</h3>
      <p>
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quasi vero
        necessitatibus voluptates delectus asperiores dolore accusantium rerum
        adipisci in enim veritatis consequuntur dignissimos officiis id neque,
        quibusdam cupiditate quis! Eum.
      </p>
      <h3 class="h3-font">Exposities</h3>
      <p>
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quasi vero
        necessitatibus voluptates delectus asperiores dolore accusantium rerum
        adipisci in enim veritatis consequuntur dignissimos officiis id neque,
        quibusdam cupiditate quis! Eum.
      </p>
      <h3 class="h3-font">Fotoshoots</h3>
      <p>
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quasi vero
        necessitatibus voluptates delectus asperiores dolore accusantium rerum
        adipisci in enim veritatis consequuntur dignissimos officiis id neque,
        quibusdam cupiditate quis! Eum.
      </p>
      <h3 class="h3-font">Workshops en Masterclasses</h3>
      <p>
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quasi vero
        necessitatibus voluptates delectus asperiores dolore accusantium rerum
        adipisci in enim veritatis consequuntur dignissimos officiis id neque,
        quibusdam cupiditate quis! Eum.
      </p>
      <h3 class="h3-font">Coaching</h3>
      <p>
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quasi vero
        necessitatibus voluptates delectus asperiores dolore accusantium rerum
        adipisci in enim veritatis consequuntur dignissimos officiis id neque,
        quibusdam cupiditate quis! Eum.
      </p>
      <h3 class="h3-font">In opdracht</h3>
      <p>
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quasi vero
        necessitatibus voluptates delectus asperiores dolore accusantium rerum
        adipisci in enim veritatis consequuntur dignissimos officiis id neque,
        quibusdam cupiditate quis! Eum.
      </p>
    </section>
  </main>
</template>
