<template>
  <nav class="navbar" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <a class="navbar-item" href="https://reco-mamm.herokuapp.com">
        <strong>Voir le site</strong>
      </a>
      
      <a class="navbar-burger burger" :class="activeClass" @click="toggle">
        <span></span>
        <span></span>
        <span></span>
      </a>
    </div>

    <div class="navbar-menu" :class="activeClass">
      <div class="navbar-start">
        <router-link class="navbar-item" to="/">Formulaire</router-link>
        <router-link class="navbar-item" to="/profils">Profils &amp; résultats</router-link>
        <router-link class="navbar-item" to="/visualisation">Data visualization</router-link>
      </div>

      <div class="navbar-end">
        <div class="navbar-item">
          <div class="buttons">
            <router-link class="button" to="/deconnexion">Déconnexion</router-link>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: "navbar",

  data() {
    return {
      isActive: false
    };
  },

  methods: {
    toggle() {
      this.isActive = !this.isActive;
    }
  },

  computed: {
    activeClass() {
      return this.isActive ? "is-active" : "";
    }
  }
};
</script>
