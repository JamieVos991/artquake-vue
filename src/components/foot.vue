<script setup>
import "../assets/stylesheets/footer.css";
</script>

<template>
  <footer>
    <img src="../assets/pictures/artquake-logo.avif" alt="Logo van Artquake" />
    <p>
      Waar jongeren samen kunst creëren, elkaar inspireren, van elkaar leren en
      zichzelf zo verder kunnen ontwikkelen.
    </p>

    <address>
      <a href="mailto:info@art-quake.com">info@art-quake.com</a>
      <a href="https://api.whatsapp.com/send?phone=31640129447"
        >+31 6 40129447</a
      >
      <p>Sara de Bronovoland 7, Heerhugowaard</p>
    </address>
    <nav aria-label="Sociale media">
      <ul>
        <li>
          <a aria-label="Artquaks Instagram" href="https://www.instagram.com/artquake.westfriesland/">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M12 7C9.23858 7 7 9.23858 7 12C7 14.7614 9.23858 17 12 17C14.7614 17 17 14.7614 17 12C17 9.23858 14.7614 7 12 7ZM9 12C9 13.6569 10.3431 15 12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12Z" fill="currentColor"/>
              <path d="M18 5C17.4477 5 17 5.44772 17 6C17 6.55228 17.4477 7 18 7C18.5523 7 19 6.55228 19 6C19 5.44772 18.5523 5 18 5Z" fill="currentColor"/>
              <path fill-rule="evenodd" clip-rule="evenodd" d="M5 1C2.79086 1 1 2.79086 1 5V19C1 21.2091 2.79086 23 5 23H19C21.2091 23 23 21.2091 23 19V5C23 2.79086 21.2091 1 19 1H5ZM19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z" fill="currentColor"/>
            </svg>
          </a>
        </li>
        <li>
          <a aria-label="Artquaks Youtube" href="https://www.youtube.com/channel/UCOcpcYV4ybeHuJND7ZhQURQ">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M5 7H19C19.5523 7 20 7.44771 20 8V16C20 16.5523 19.5523 17 19 17H5C4.44772 17 4 16.5523 4 16V8C4 7.44772 4.44772 7 5 7ZM2 8C2 6.34315 3.34315 5 5 5H19C20.6569 5 22 6.34315 22 8V16C22 17.6569 20.6569 19 19 19H5C3.34315 19 2 17.6569 2 16V8ZM10 9L14 12L10 15V9Z" fill="currentColor"/>
            </svg>
          </a>
        </li>
        <li>
          <a aria-label="Artquaks Tiktok" href="https://www.tiktok.com/@artquake_westfriesland">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 1 1-5-5v2a3 3 0 1 0 3 3z"/>
            </svg>
          </a>
        </li>
        <li>
          <a aria-label="Artquaks Facebook" href="https://www.facebook.com/artquake.westfriesland/">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.19795 21.5H13.198V13.4901H16.8021L17.198 9.50977H13.198V7.5C13.198 6.94772 13.6457 6.5 14.198 6.5H17.198V2.5H14.198C11.4365 2.5 9.19795 4.73858 9.19795 7.5V9.50977H7.19795L6.80206 13.4901H9.19795V21.5Z" fill="currentColor"/>
            </svg>
          </a>
        </li>
      </ul>
    </nav>

    <img src="../assets/pictures/artquake-gebouw.avif" alt="" />

    <nav aria-label="Juridisch">
      <router-link to="/privacypolicy">Privacybeleid</router-link>
      <router-link to="/termsandconditions">Algemene voorwaarden</router-link>
    </nav>
  </footer>
</template>
