<template>
  <ion-app>
    <ion-split-pane content-id="main-content">
      <ion-menu content-id="main-content" type="overlay">
        <ion-content>
          <ion-list>
            <ion-list-header>Kelwin & Daren App</ion-list-header>
            <ion-menu-toggle :auto-hide="false">
              <ion-item :href="'/Accueil'">
                <ion-icon slot="start" :icon="home" :md="home"></ion-icon>
                <ion-label>Accueil</ion-label>
              </ion-item>
              <ion-item :href="'/liste/Chicken'">
                <ion-icon slot="start" :icon="egg" :md="egg"></ion-icon>
                <ion-label>Chicken</ion-label>
              </ion-item>
              <ion-item :href="'/liste/Seafood'">
                <ion-icon slot="start" :icon="fishSharp" :md="fishSharp"></ion-icon>
                <ion-label>Seafood</ion-label>
              </ion-item>
              <ion-item :href="'/liste/Dessert'">
                <ion-icon slot="start" :icon="cafe" :md="cafe"></ion-icon>
                <ion-label>Dessert</ion-label>
              </ion-item>
            </ion-menu-toggle>
          </ion-list>
        </ion-content>
      </ion-menu>
      <ion-router-outlet id="main-content"></ion-router-outlet>
    </ion-split-pane>
  </ion-app>
</template>
<script setup lang="ts">
import {
  IonApp, IonRouterOutlet, IonSplitPane, IonContent,
  IonList, IonListHeader, IonItem, IonLabel, IonMenu,
  IonMenuToggle, IonIcon
} from '@ionic/vue';
import {
  fishSharp, home,cafe,egg
} from 'ionicons/icons';

</script>