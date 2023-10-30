<template>
  <ion-header :translucent="true">
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-menu-button color="Light"></ion-menu-button>
      </ion-buttons>
      <ion-title>{{ $route.params.id ? $route.params.id : $route.name }}</ion-title>

    </ion-toolbar>
  </ion-header>
</template>

<script setup lang="ts">
import { IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle } from '@ionic/vue';
</script>
<style scoped></style>