import Vue from "vue";
import vuetify from "../vuetify";
import axios from "axios";
import {
  VAppBar,
  VAppBarNavIcon,
  VToolbarTitle,
  VSpacer,
  VIcon,
  VMenu,
  VList,
  VListItem,
  VListItemTitle,
  VBtn,
  VRow,
  VApp,
  VMain,
  VContainer,
  VCard,
  VSubheader,
  VDivider,
  VListItemAvatar,
  VListItemContent,
  VListItemSubtitle,
  VListItemAction,
  VCardText,
  VFabTransition,
  VDialog,
  VCardTitle,
  VCardActions,
} from "vuetify/lib";

// get initial data from django
const csrftoken = document.querySelector("[name=csrfmiddlewaretoken]").value;
const initialTodos = JSON.parse(
  document.querySelector("#initial-todos").textContent
);

// setup ajax for call
const ajax = axios.create({
  baseURL: "http://127.0.0.1:8000",
  timeout: 1000,
  headers: { "X-CSRFToken": csrftoken, "X-Requested-With": "XMLHttpRequest" },
});

new Vue({
  vuetify,
  delimiters: ["[[", "]]"],
  el: "#app",
  components: {
    VAppBar,
    VAppBarNavIcon,
    VToolbarTitle,
    VSpacer,
    VIcon,
    VMenu,
    VList,
    VListItem,
    VListItemTitle,
    VBtn,
    VRow,
    VApp,
    VMain,
    VContainer,
    VCard,
    VSubheader,
    VDivider,
    VListItemAvatar,
    VListItemContent,
    VListItemSubtitle,
    VListItemAction,
    VCardText,
    VFabTransition,
    VDialog,
    VCardTitle,
    VCardActions,
  },
  data: {
    drawer: false,
    group: null,
    todo: initialTodos,
    deleteDialog: true,
    addDialog: false,
    updateDialog: false,
  },
  methods: {
    formatDate: function(date) {
      return new Date(date).toLocaleString();
    },
    done: function(id) {
      const item = this.todo.find((item) => item.id === id);
      const reversedOpt = !item.done;

      var vm = this;
      ajax
        .put(`/todo/api/${id}/`, { task: item.task, done: reversedOpt })
        .then(function(response) {
          console.log(vm.todo);
          vm.todo = vm.todo.map((item) => {
            if (item.id === id) item.done = !item.done;
            return item;
          });
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    delete: function(id) {
      ajax
        .delete(`/todo/api/${id}/`)
        .then(function(response) {
          this.todo = todo.filter((item) => (item.id !== id ? true : false));
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    updateTask: function(id) {},
  },
});
