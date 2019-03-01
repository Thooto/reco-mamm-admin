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

          <div v-if="category.editing">
            <button class="button is-small is-outlined is-danger" @click="destroy">Supprimer</button>
          </div>
        </div>
      </div>

      <div class="level-right">
        <div class="buttons">
          <button class="button is-small is-outlined" @click="add">Ajouter une question</button>
          <button class="button is-small is-outlined is-info" @click="move('down')">Descendre</button>
          <button class="button is-small is-outlined is-info" @click="move('up')">Monter</button>
        </div>
      </div>
    </div>

    <div class="box" v-if="adding">
      <form @submit="createQuestion">
        <b-field grouped group-multiline>
          <b-input
            required
            expanded
            size="is-small"
            placeholder="Nom de la question"
            v-model="question.name"
          ></b-input>
          <div class="control">
            <input type="submit" class="button is-small is-outlined is-success" value="Valider">
          </div>
          <div class="control">
            <button class="button is-small is-outlined" @click="cancel">Fermer</button>
          </div>
        </b-field>
      </form>
    </div>

    <div class="box" v-show="questions.length">
      <b-table
        :data="questions"
        ref="questions"
        :opened-detailed="defaultOpenedDetails"
        detailed
        detail-key="id"
        :show-detail-icon="true"
      >
        <template slot-scope="props">
          <b-table-column field="id" label="ID" width="10" numeric>{{ props.row.id }}</b-table-column>
          <b-table-column field="name" label="Question">
            <b-field v-if="props.row.editing">
              <b-input v-model="props.row.name" placeholder="Intitulé de la question"></b-input>
            </b-field>
            <a v-else @click="toggle(props.row)">{{ props.row.name }}</a>
          </b-table-column>
        </template>

        <template slot="detail" slot-scope="props">
          <question
            :question="props.row"
            @destroy="destroyQuestion(props.index)"
            @move="moveQuestion(props.index, ...arguments)"
          />
        </template>
      </b-table>
    </div>
  </section>
</template>

<script>
import Question from "./question";
import services from "./services";

export default {
  name: "category",

  components: { Question },

  props: ["category"],

  data() {
    return {
      questions: this.$props.category.questions,
      adding: false,

      question: {
        name: null
      },

      defaultOpenedDetails: []
    };
  },

  methods: {
    async edit() {
      try {
        if (this.$props.category.editing) {
          await services.renameCategory(this.$props.category);
        }

        this.$props.category.editing = !this.$props.category.editing;
      } catch (error) {
        this.$snackbar.open({
          message: "Une erreur est survenue lors de l'édition du nom.",
          type: "is-danger"
        });
      }
    },

    toggle(row) {
      this.$refs.questions.toggleDetails(row);
    },

    destroy() {
      const choice = confirm(
        "Supprimer la catégorie ? Cette action est irréversible."
      );
      if (choice) {
        this.$emit("destroy");
      }
    },

    async destroyQuestion(index) {
      try {
        await services.destroyQuestion({ index, categoryId: this.$props.category.id });

        this.questions.splice(index, 1);
      } catch (error) {
        this.$snackbar.open({
          message:
            "Une erreur est survenue lors de la suppression de la catégorie.",
          type: "is-danger"
        });
      }
    },

    move(direction) {
      this.$emit("move", direction);
    },

    async moveQuestion(index, direction) {
      try {
        await services.moveQuestion(index, direction, this.$props.category.id);
        
        if (index || direction == "down") {
          this.questions.splice(
            index + (direction == "up" ? -1 : 1),
            0,
            this.questions.splice(index, 1)[0]
          );
        }
      } catch (error) {
        this.$snackbar.open({
          message:
            "Une erreur est survenue lors de cette action.",
          type: "is-danger"
        });
      }
    },

    add() {
      this.adding = true;
    },

    async createQuestion(event) {
      event.preventDefault();

      try {
        const question = await services.createQuestion({
          ...this.question,
          categoryId: this.$props.category.id
        });

        this.questions.push({
          ...question,
          editing: false,
          answers: []
        });

        this.question.name = null;
      } catch (error) {
        let message =
          "Une erreur est survenue lors de la création de la question.";

        if (error.response && error.response.data == "Validation error")
          message = "Cette question existe déjà.";

        this.$snackbar.open({
          message,
          type: "is-danger"
        });
      }
    },

    cancel(event) {
      event.preventDefault();
      this.adding = false;
    }
  },

  computed: {
    editMessage() {
      return this.$props.category.editing ? "Valider" : "Modifier";
    },

    editClass() {
      return this.$props.category.editing ? "is-success" : "";
    }
  }
};
</script>

<style lang="scss">
</style>
