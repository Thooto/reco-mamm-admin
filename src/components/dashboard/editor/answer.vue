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
            <b-field grouped>
              <button class="button is-small is-outlined is-danger" @click="destroy">Supprimer</button>
              <b-select required size="is-small" placeholder="Code réponse" v-model="answer.code">
                <option
                  v-for="code in codes"
                  :value="code.number"
                  :key="code.number"
                >{{ code.value }}</option>
              </b-select>
            </b-field>
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
      <b-field>
        <b-input
          type="textarea"
          v-model="answer.explanation"
          placeholder="Explications supplémentaires"
        ></b-input>
      </b-field>
      <b-field>
        <b-input v-model="answer.nextId" placeholder="Question suivant cette réponse (ID)"></b-input>
      </b-field>
    </div>
    <div v-else>
      <p>{{answer.explanation}}</p>
      <span v-if="answer.nextId" class="tag is-info">
        <strong>Question suivant cette réponse : {{answer.nextId}}</strong>
      </span>
    </div>
  </section>
</template>

<script>
import services from "./services";

export default {
  name: "answer",

  props: ["answer"],

  data() {
    return {
      codes: [
        {
          value: "Vert",
          number: 0
        },
        {
          value: "Warning",
          number: 1
        },
        {
          value: "Rouge",
          number: 2
        }
      ]
    };
  },

  methods: {
    async edit() {
      try {
        if (this.$props.answer.editing) {
          await services.renameAnswer(this.$props.answer);
        }

        this.$props.answer.editing = !this.$props.answer.editing;
      } catch (error) {
        this.$snackbar.open({
          message: "Une erreur est survenue lors de l'édition du nom.",
          type: "is-danger"
        });
      }
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
