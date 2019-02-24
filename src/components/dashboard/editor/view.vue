<template>
  <section class="section">
    <div class="container">
      <form class="box" @submit="createCategory">
        <p class="title is-6">Nouvelle catégorie</p>
        <b-field>
          <b-input required v-model="category.name" placeholder="Nom"></b-input>
        </b-field>
        <input class="button is-fullwidth" type="submit" value="Ajouter">
      </form>

      <div class="notification has-text-justified">
        <p>Les catégories et les questions seront affichées selon l'ordre dans le tableau suivant.</p>
        <p class="is-size-7">
          <strong>Appuyer sur son nom pour ouvrir un élément.</strong>
        </p>
      </div>

      <b-table
        :data="categories"
        ref="categories"
        :opened-detailed="defaultOpenedDetails"
        detailed
        detail-key="id"
        :show-detail-icon="true"
      >
        <template slot-scope="props">
          <b-table-column field="name" label="Catégories">
            <b-field v-if="props.row.editing">
              <b-input v-model="props.row.name" placeholder="Nom de la catégorie"></b-input>
            </b-field>
            <a v-else @click="toggle(props.row)">{{ props.row.name }}</a>
          </b-table-column>
        </template>

        <template slot="detail" slot-scope="props">
          <category
            :category="props.row"
            @destroy="destroyCategory(props.index)"
            @move="moveCategory(props.index, ...arguments)"
          />
        </template>
      </b-table>
    </div>
  </section>
</template>

<script>
import Category from "./category";

import services from "./services";

export default {
  name: "editor",

  components: { Category },

  data() {
    return {
      categories: [],

      category: {
        name: null
      },

      defaultOpenedDetails: []
    };
  },

  async mounted() {
    try {
      const form = await services.getForm();

      this.categories = form.map(category => {
        category.questions = category.questions.map(question => {
          question.answers = question.answers.map(answer => ({
            ...answer,
            editing: false
          }));

          return { ...question, editing: false };
        });

        return { ...category, editing: false };
      });
    } catch (error) {
      this.$snackbar.open({
        message: "Une erreur est survenue lors du chargement des données.",
        type: "is-danger"
      });
    }
  },

  methods: {
    toggle(row) {
      this.$refs.categories.toggleDetails(row);
    },

    async createCategory(event) {
      event.preventDefault();

      try {
        const category = await services.createCategory(this.category);

        this.categories.push({
          ...category,
          editing: false,
          questions: []
        });

        this.category.name = null;
      } catch (error) {
        let message =
          "Une erreur est survenue lors de la création de la catégorie.";

        if (error.response && error.response.data == "Validation error")
          message = "Cette catégorie existe déjà.";

        this.$snackbar.open({
          message,
          type: "is-danger"
        });
      }
    },

    async destroyCategory(index) {
      try {
        await services.destroyCategory({ index });

        this.categories.splice(index, 1);
      } catch (error) {
        this.$snackbar.open({
          message:
            "Une erreur est survenue lors de la suppression de la catégorie.",
          type: "is-danger"
        });
      }
    },

    async moveCategory(index, direction) {
      try {
        await services.moveCategory(index, direction);
        
        if (index || direction == "down") {
          this.categories.splice(
            index + (direction == "up" ? -1 : 1),
            0,
            this.categories.splice(index, 1)[0]
          );
        }
      } catch (error) {
        this.$snackbar.open({
          message:
            "Une erreur est survenue lors de cette action.",
          type: "is-danger"
        });
      }
    }
  }
};
</script>

<style lang="scss">
</style>
