import { defineStore } from "pinia";

export const useNavStore = defineStore("nav", {
  state: () => ({
    show: false,
  })
});