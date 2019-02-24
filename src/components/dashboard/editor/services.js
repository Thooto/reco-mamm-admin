import Axios from 'axios';

import store from '@/store';

export default {
  url: store.state.url,

  headers: {
    Authorization: "Bearer " + store.state.token
  },

  async getForm() {
    const { data } = await Axios.get(this.url + "/form");

    return data.form;
  },


  async createCategory(category) {
    const { data } = await Axios.post(this.url + '/admin/category', { category }, { headers: this.headers });

    return data.category;
  },

  async destroyCategory({ index }) {
    return await Axios.delete(this.url + `/admin/category/${index}`, { headers: this.headers });
  },

  async renameCategory(category) {
    return await Axios.patch(this.url + '/admin/category', { category, action: 'rename' }, { headers: this.headers });
  },

  async moveCategory(index, direction) {
    return await Axios.patch(this.url + '/admin/category', { index, direction, action: 'move' }, { headers: this.headers });
  },


  async createQuestion(question) {
    const { data } = await Axios.post(this.url + '/admin/question', { question }, { headers: this.headers });

    return data.question;
  },

  async destroyQuestion({ index, categoryId }) {
    return await Axios.delete(this.url + `/admin/category/${categoryId}/question/${index}`, { headers: this.headers });
  },

  async renameQuestion(question) {
    return await Axios.patch(this.url + '/admin/question', { question, action: 'rename' }, { headers: this.headers });
  },

  async moveQuestion(index, direction, categoryId) {
    return await Axios.patch(this.url + '/admin/question', { index, direction, categoryId, action: 'move' }, { headers: this.headers });
  },


  async createAnswer(answer) {
    const { data } = await Axios.post(this.url + '/admin/answer', { answer }, { headers: this.headers });

    return data.answer;
  },

  async destroyAnswer({ index, questionId }) {
    return await Axios.delete(this.url + `/admin/question/${questionId}/answer/${index}`, { headers: this.headers });
  },

  async renameAnswer(answer) {
    return await Axios.patch(this.url + '/admin/answer', { answer, action: 'rename' }, { headers: this.headers });
  },

  async moveAnswer(index, direction, questionId) {
    return await Axios.patch(this.url + '/admin/answer', { index, direction, questionId, action: 'move' }, { headers: this.headers });
  }
};
