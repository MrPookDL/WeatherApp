<template>
  <ion-page>
    <Header></Header>
    <ion-content>
      <!-- Skeleton Liste -->
      <div v-if="isLoading">
        <ion-item v-for="n in 10" :key="n">
          <ion-skeleton-text animated style="width:80px; height:80px;"></ion-skeleton-text>
          <ion-skeleton-text animated style="width:70%; height:18px; margin-left:16px;"></ion-skeleton-text>
        </ion-item>
      </div>
      <!-- fin Skeleton Liste -->
      <div v-else>
        <RecycleScroller class="scroller" :items="listeMenu" :item-size="85" key-field="idMeal" >
          <template #default="{ item }">
            <ion-item :routerLink="'/detail/' + item.idMeal" :detail="false">
              <img :src="item.strMealThumb" style="width:80px;height:80px" />
              <ion-label> {{ item.strMeal }}</ion-label>
            </ion-item>
          </template>
        </RecycleScroller>
      </div>
    </ion-content>
  </ion-page>
</template>


  <script setup lang="ts">
  import Header from "../views/component/Header.vue";
  import { RecycleScroller } from 'vue3-virtual-scroller';

  import {
    IonPage,
    IonContent,
    IonItem,
    IonLabel
  } from "@ionic/vue";
  
  import { onIonViewDidEnter } from "@ionic/vue";
  import { ref,onMounted} from "vue";
  import { useRoute} from "vue-router";
  
  const route = useRoute();
  const listeMenu = ref<any[]>([]);
  const isLoading = ref(true);

  async function fetchMenuCateg() {
    const category = route.params.id;
    
    const url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`;
    const data = await (await fetch(url)).json();
    var mealDetail = data.meals;
    console.log("Accessing the arrayusing the forEach loop:");
    mealDetail.forEach(function (item: { strMeal: any }) {
      console.log(item);
    });
    listeMenu.value = data.meals;   
  }
  
  // Pour skeleton
  onMounted(() => {
    setTimeout(() => {
      isLoading.value = false;
    }, 700);
  });

  // Demarrage du components
  onIonViewDidEnter(() => {
    fetchMenuCateg();
  });
      
  </script>
  
  <style scoped>
  .scroller {
    height: 100%;
  }
  </style>