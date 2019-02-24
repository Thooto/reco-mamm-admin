<template>
  <section>
    <div class="level is-marginless">
      <div class="level-left">
        <div class="buttons">
          <button
            class="button is-small is-outlined"
            :class="editClass"
            @click="edit"
          >{{editMessage}}</button>

          <div v-if="answer.editing">
            <button class="button is-small is-outlined is-danger" @click="destroy">Supprimer</button>
          </div>
        </div>
      </div>

      <div class="level-right">
        <div class="buttons">
          <button class="button is-small is-outlined is-info" @click="move('down')">Descendre</button>
          <button class="button is-small is-outlined is-info" @click="move('up')">Monter</button>
        </div>
      </div>
    </div>

    <div v-if="answer.editing">
      <b-field v-if="answer.editing">
        <b-input type="textarea" v-model="answer.explanation" placeholder="Explications supplémentaires"></b-input>
      </b-field>
      <b-field>
        <b-input v-model="answer.nextId" placeholder="Question suivant cette réponse (numéro)"></b-input>
      </b-field>
    </div>
    <div v-else>
      <p>{{answer.explanation}}</p>
      <p><strong>Question suivant cette réponse :</strong> {{answer.nextId}}</p>
    </div>
  </section>
</template>

<script>
export default {
  name: "answer",

  props: ["answer"],

  data() {
    return {};
  },

  methods: {
    edit() {
      this.$props.answer.editing = !this.$props.answer.editing;
    },

    destroy() {
      const choice = confirm(
        "Supprimer la réponse ? Cette action est irréversible."
      );
      if (choice) {
        this.$emit("destroy");
      }
    },

    move(direction) {
      this.$emit("move", direction);
    },

    validate(event) {
      event.preventDefault();
    },

    cancel(event) {
      event.preventDefault();
      this.adding = false;
    }
  },

  computed: {
    editMessage() {
      return this.$props.answer.editing ? "Valider" : "Modifier";
    },

    editClass() {
      return this.$props.answer.editing ? "is-success" : "";
    }
  }
};
</script>

<style lang="scss">
</style>
