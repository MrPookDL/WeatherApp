<template>
  <ion-page>
    <Header v-if="showHeader"></Header>
    <ion-header :translucent="true">
      <ion-toolbar v-if="showBackButton">
        <ion-buttons slot="start">
          <ion-back-button :default-href="'/accueil'"></ion-back-button>
        </ion-buttons>
        <ion-label>
          <h1>Recette</h1>
        </ion-label>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">
      <!-- Skeleton texte -->
      <div v-if="isLoading" class="centered-content">
        <ion-list>
          <ion-skeleton-text
            animated
            style="width: 400px; height: 400px; margin-bottom: 20px"
          ></ion-skeleton-text>
          <ion-skeleton-text
            animated
            style="width: 60%; height: 28px; margin-bottom: 10px"
          ></ion-skeleton-text>
          <ion-skeleton-text
            animated
            style="width: 40%; height: 18px; margin-bottom: 5px"
          ></ion-skeleton-text>
          <ion-skeleton-text
            animated
            style="width: 40%; height: 18px; margin-bottom: 15px"
          ></ion-skeleton-text>
          <ion-skeleton-text
            animated
            style="width: 30%; height: 28px; margin-bottom: 10px"
          ></ion-skeleton-text>
          <div style="width: 80%">
            <ion-skeleton-text
              animated
              style="height: 18px; margin-bottom: 5px"
              v-for="n in 8"
              :key="n"
            ></ion-skeleton-text>
          </div>
        </ion-list>
      </div>
      <!-- Fin de Skeleton texte -->
      <div v-else class="centered-content">
        <img :src="image" alt="" class="imageCrop" />
        <h1>{{ titre }}</h1>
        <p>Origine: {{ origine }}</p>
        <p>Catégorie: {{ categorie }}</p>
        <h2>Ingrédients:</h2>
        <ul>
          <li v-for="ingredient in maListe" :key="ingredient.id">
            {{ ingredient.mesure }} {{ ingredient.nom }}
          </li>
        </ul>
        <h2>Instructions:</h2>
        <p id="instructions">{{ instruction }}</p>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import Header from "../views/component/Header.vue";

import { onIonViewDidEnter } from "@ionic/vue";
import { ref, reactive, onMounted } from "vue";

import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonLabel,
  IonSkeletonText,
  IonList,
} from "@ionic/vue";
import { useRoute } from "vue-router";

// Pour template
let maListe: Ingredients[] = reactive([]);
type Ingredients = {
  id: number;
  nom: string;
  mesure: string;
};
const route = useRoute();
const pageTitle = ref("");
const titre = ref("");
const origine = ref("");
const categorie = ref("");
const image = ref("");
const instruction = ref("");

// Pour affichage de route
const showHeader = ref(route.name === "Recette du jour");
const showBackButton = ref(route.name !== "Recette du jour");

// pour skeleton texte
const isLoading = ref(true);

// ********** Function ***********

// Function qui prend 2 Api pour modularité
async function fetchData(chemin: any) {
  const getUrl = () => {
    if (chemin === "pageAccueil") {
      return "https://www.themealdb.com/api/json/v1/1/random.php";
    } else if (chemin === "pageDetail") {
      return `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${route.params.idMeal}`;
    }
    console.log("ROUTE INCONNUE");
    return null;
  };

  const url = getUrl();

  if (!url) return;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error("Network response was not ok " + response.statusText);
      return;
    }
    const data = await response.json();
    const meal = data.meals[0];
    dataHandler(meal);
  } catch (error) {
    console.error("There has been a problem with your fetch operation:", error);
  }
}
// Function pour ne pour les Api
async function dataHandler(meal: any) {
  titre.value = meal.strMeal;
  origine.value = meal.strArea;
  categorie.value = meal.strCategory;
  image.value = meal.strMealThumb;
  instruction.value = meal.strInstructions;

  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const mesure = meal[`strMeasure${i}`];
    if (ingredient && ingredient.trim() !== "") {
      maListe.push({ id: i, nom: ingredient, mesure: mesure });
    }
  }
}

// pour le skeleton
onMounted(() => {
  setTimeout(() => {
    isLoading.value = false;
  }, 700);
});

// QUand la page demarre
onIonViewDidEnter(() => {
  console.log(route.name);
  var determiner = "";

  if (route.name === "Recette du jour") {
    pageTitle.value = "Recette du jour";
    determiner = "pageAccueil";
    fetchData(determiner);
  } else if (route.name === "detail") {
    pageTitle.value = "detail";
    determiner = "pageDetail";
    fetchData(determiner);
  }
});

</script>

<style scoped>
ion-content {
  --background: #fffdfe;
  --color: #0e0e0e;
}

ion-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  --background: #fffdfe;
  --color: #0e0e0e;
}

.imageCrop {
  max-width: 100%;
  margin-top: 25px;
  width: 400px !important;
  height: 400px !important;
}

#instructions {
  margin-bottom: 20px;
}
</style>