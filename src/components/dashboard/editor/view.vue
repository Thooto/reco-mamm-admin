<template>
  <section class="section">
    <div class="container">
      <form class="box" @submit="addCategory">
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
          <b-table-column field="id" label="Catégorie" width="10" numeric>{{ props.row.id }}</b-table-column>
          <b-table-column field="name" label="Nom">
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
import Axios from "axios";

import Category from "./category";

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
      const { data } = await Axios.get(this.$store.state.url + "/form");

      this.categories = data.form.map(category => {
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
    destroyCategory(index) {
      this.categories.splice(index, 1);
    },

    toggle(row) {
      this.$refs.categories.toggleDetails(row);
    },

    moveCategory(index, direction) {
      if (index || direction == "down") {
        this.categories.splice(
          index + (direction == "up" ? -1 : 1),
          0,
          this.categories.splice(index, 1)[0]
        );
      }
    },

    addCategory(event) {
      event.preventDefault();

      const id =
        Math.max(...this.categories.map(question => question.id), 0) + 1;

      if (this.categories.length)
        this.categories[this.categories.length - 1].nextId = id;

      this.categories.push({
        ...this.category,
        id,
        editing: false,
        nextId: null,
        questions: []
      });

      this.category.name = null;
    }
  }
};
</script>

<style lang="scss">
</style>
