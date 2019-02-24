<template>
  <section class="hero is-fullheight">
    <div class="hero-body">
      <div class="container">
        <div class="columns">
          <div class="column is-4 is-offset-4">
            <form class="box" @submit="login">
              <p class="title is-5 has-text-primary">Connexion administrateur</p>
              <b-field label="E-mail" :message="emailMessage" :type="emailType">
                <b-input required type="email" v-model="email"></b-input>
              </b-field>
              <b-field label="Mot de passe" :message="passwordMessage" :type="passwordType">
                <b-input required type="password" v-model="password" password-reveal></b-input>
              </b-field>
              <input class="button is-fullwidth" type="submit" value="Se connecter">
            </form>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Axios from "axios";

export default {
  name: "login",

  data() {
    return {
      email: null,
      password: null,
      emailType: null,
      emailMessage: null,
      passwordType: null,
      passwordMessage: null
    };
  },

  methods: {
    login(event) {
      event.preventDefault();

      Axios.post(this.$store.state.url + "/login", {
        email: this.email,
        password: this.password
      })
        .then(({ data }) => {
          this.$store.dispatch("login", data.token);
          this.$router.push("/");
        })
        .catch(error => {
          if (error.response.data == "Admin not found") {
            this.emailMessage = "Cet administrateur n'existe pas.";
            this.emailType = "is-danger";
          }

          if (error.response.data == "Wrong password") {
            this.passwordMessage = "Ce mot de passe est incorrect.";
            this.passwordType = "is-danger";
          }
        });
    }
  },

  watch: {
    email() {
      this.emailMessage = null;
      this.emailType = null;
    },

    password() {
      this.passwordMessage = null;
      this.passwordType = null;
    }
  }
};
</script>

<style lang="scss">
</style>
