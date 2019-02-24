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

          <div v-if="question.editing">
            <button class="button is-small is-outlined is-danger" @click="destroy">Supprimer</button>
          </div>
        </div>
      </div>

      <div class="level-right">
        <div class="buttons">
          <button class="button is-small is-outlined" @click="add">Ajouter une réponse</button>
          <button class="button is-small is-outlined is-info" @click="move('down')">Descendre</button>
          <button class="button is-small is-outlined is-info" @click="move('up')">Monter</button>
        </div>
      </div>
    </div>

    <div class="box" v-if="adding">
      <form @submit="validate">
        <b-field>
          <b-input required expanded size="is-small" placeholder="Réponse" v-model="answer.name"></b-input>
        </b-field>
        <b-field>
          <b-input
            size="is-small"
            placeholder="Explications"
            v-model="answer.explanation"
            type="textarea"
          ></b-input>
        </b-field>
        <b-field>
          <div class="control">
            <input type="submit" class="button is-small is-outlined is-success" value="Valider">
          </div>
          <div class="control">
            <button class="button is-small is-outlined" @click="cancel">Fermer</button>
          </div>
        </b-field>
      </form>
    </div>

    <div class="box" v-show="answers.length">
      <b-table
        :data="answers"
        ref="answers"
        :opened-detailed="defaultOpenedDetails"
        detailed
        detail-key="id"
        :show-detail-icon="true"
      >
        <template slot-scope="props">
          <b-table-column field="id" label="Réponse" width="10" numeric>{{ props.row.id }}</b-table-column>
          <b-table-column field="name" label="Nom">
            <b-field v-if="props.row.editing">
              <b-input v-model="props.row.name" placeholder="Intitulé de la réponse"></b-input>
            </b-field>
            <a v-else @click="toggle(props.row)">{{ props.row.name }}</a>
          </b-table-column>
        </template>

        <template slot="detail" slot-scope="props">
          <answer
            :answer="props.row"
            @destroy="destroyAnswer(props.index)"
            @move="moveAnswer(props.index, ...arguments)"
          />
        </template>
      </b-table>
    </div>
  </section>
</template>

<script>
import Answer from "./answer";

export default {
  name: "question",

  components: { Answer },

  props: ["question"],

  data() {
    return {
      answers: this.$props.question.answers,
      adding: false,

      answer: {
        name: null,
        explanation: null
      },

      defaultOpenedDetails: []
    };
  },

  methods: {
    edit() {
      this.$props.question.editing = !this.$props.question.editing;
    },

    toggle(row) {
      this.$refs.answers.toggleDetails(row);
    },

    destroy() {
      const choice = confirm(
        "Supprimer la question ? Cette action est irréversible."
      );
      if (choice) {
        this.$emit("destroy");
      }
    },

    destroyAnswer(index) {
      this.answers.splice(index, 1);
    },

    move(direction) {
      this.$emit("move", direction);
    },

    moveAnswer(index, direction) {
      if (index || direction == "down") {
        this.answers.splice(
          index + (direction == "up" ? -1 : 1),
          0,
          this.answers.splice(index, 1)[0]
        );
      }
    },

    add() {
      this.adding = true;
    },

    validate(event) {
      event.preventDefault();

      const id = Math.max(...this.answers.map(answer => answer.id), 0) + 1;

      this.answers.push({
        ...this.answer,
        id,
        editing: false,
        nextId: null
      });

      this.answer.name = null;
      this.answer.explanation = null;
    },

    cancel(event) {
      event.preventDefault();
      this.adding = false;
    }
  },

  computed: {
    editMessage() {
      return this.$props.question.editing ? "Valider" : "Modifier";
    },

    editClass() {
      return this.$props.question.editing ? "is-success" : "";
    }
  }
};
</script>

<style lang="scss">
</style>
