import Vue from "vue";
import vuetify from "../vuetify";
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
  VFabTransition
} from "vuetify/lib";

const initialTodos = JSON.parse(document.querySelector("#initial-todos").textContent);

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
    VFabTransition
  },
  data: () => ({
    drawer: false,
    group: null,
    todo: initialTodos,
  }),
});
