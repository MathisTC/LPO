<template>
  <div @click="copyText" class="icon" id="icon">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
      <path fill="currentColor"
        d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7a5 5 0 0 0-5 5a5 5 0 0 0 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1M8 13h8v-2H8zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1c0 1.71-1.39 3.1-3.1 3.1h-4V17h4a5 5 0 0 0 5-5a5 5 0 0 0-5-5" />
    </svg>
    <div v-if="displayText">(Copié)</div>
  </div>
  <div class="texte">Pour insérer un lien, copiez puis remplacez le lien et son alias par leurs valeurs</div>
</template>

<script>
export default {
  data() {
    return {
      displayText: false
    }
  },
  methods: {
    copyText() {
      const textToCopy = '[[lien|alias]]';

      // Crée un élément temporaire (input) pour y placer le texte à copier
      const tempInput = document.createElement('input');
      tempInput.value = textToCopy;
      document.body.appendChild(tempInput);

      // Sélectionne le texte dans l'élément temporaire
      tempInput.select();
      tempInput.setSelectionRange(0, 99999); // Pour les navigateurs mobiles
      // Copie le texte dans le presse-papiers
      document.execCommand('copy');

      // Supprime l'élément temporaire
      document.body.removeChild(tempInput);
      // Vous pouvez également afficher un message ou effectuer d'autres actions après la copie.
      console.log('Texte copié dans le presse-papiers :', textToCopy);
      this.displayText = true
    },
  },
  watch: {
    displayText: function (newVal) {
      if (newVal) {
        setTimeout(() => {
          this.displayText = false;
        }, 10000);
      }
    },
  }
};
</script>

<style scoped>
.icon {
  align-items: center;
  display: flex;
  width: fit-content;
  height: fit-content;
  cursor: pointer;
}

.icon div {
  color: blue;
  font-size: small;
}

.texte {
  color: green;
  font-size: smaller;
}
</style>