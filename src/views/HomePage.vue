<template>
  <ion-page>
    <Header></Header>
    <ion-content class="background" no-scroll padding>
      <div class="ion-text-center milieu ion-margin">
        <ion-label>{{ defaultTime }}</ion-label>
      </div>
      <ion-list>
        <ion-item>
          <ion-select label="Ville" placeholder="Choisir un lieu" @ionChange="handleChange($event)"
            @ionCancel="handleCancel()" @ionDismiss="handleDismiss()">
            <ion-select-option value="montreal">Montréal</ion-select-option>
            <ion-select-option value="laval">Laval</ion-select-option>
            <ion-select-option value="quebec">Québec</ion-select-option>
            <ion-select-option value="liveLocation">Position actuelle</ion-select-option>
          </ion-select>
        </ion-item>
      </ion-list>
      <div class="ion-text-center milieu ion-margin">
        <ion-label class="centering">
          {{ defaultLocation }}
        </ion-label>
      </div>
      <div class="ion-text-center milieu ion-margin">
        <ion-label class="centering">
          {{ defaultemperature }}
        </ion-label>
      </div>
      <ion-item lines="none" class="ion-text-center milieu">
        <ion-img :src="defaultImage" class="img"></ion-img>
      </ion-item>
      <div class="ion-text-center milieu ion-margin">
        <ion-label>
          {{ defaultDescription }}
        </ion-label>
      </div>
    </ion-content>
    <Footer></Footer>
  </ion-page>
</template>
  
<script setup lang="ts">
import {
  IonContent, 
  IonPage, 
  IonItem, 
  IonSelectOption, 
  loadingController, 
  IonLabel, 
  IonList, 
  IonSelect, 
  IonImg
} from
  '@ionic/vue';

import Header from "../component/Header.vue"
import Footer from "../component/Footer.vue"
import { Geolocation } from '@capacitor/geolocation';
import { onIonViewDidEnter } from "@ionic/vue";
import { reactive, ref } from 'vue';



//les déclarations des 'ref'
const defaultLocation = ref("");
const defaultTime = ref("");
const defaultemperature = ref("");
const defaultImage = ref("");
const defaultDescription = ref("");
const urlGeolocation = ref("");
const urlByDefault = ref("");
const realtemperature = ref("");

//Information de la position actuelle de l'utilisateur
urlGeolocation.value = ``;
const currentCoords = reactive({
  "latitude": 0,
  "longitude": 0
})

//Les variables pour concatoner
var realTime = '';
var location = 'dataHolder';
var realImage = '';
var realDescription = '';
var newCity = '';


//Au moment qu'il rentre sur la page récuperer la location et l'état
onIonViewDidEnter(async () => {
  await defaultData()
  try {
    await getCurrentPosition();
  } catch (error) {
    console.error("Erreur :", error);
  }
});



//La géolocalisation de l'utilisateur
async function getCurrentPosition() {
  const coordinates = await
    Geolocation.getCurrentPosition();
  console.log('Current', coordinates);
  currentCoords.latitude = coordinates.coords.latitude;
  currentCoords.longitude = coordinates.coords.longitude;
  console.log(currentCoords.latitude, currentCoords.longitude);
  let posActu = `https://api.openweathermap.org/data/2.5/weather?lat=${currentCoords.latitude}&lon=${currentCoords.longitude}&appid=cc635071277d5e926a255704fccac26e&units=metric&lang=fr`;
  urlGeolocation.value = posActu;
  console.log(urlGeolocation);
}

//Appel des informations de l'API weatherMAP
async function getWeatherAPI() {
  const loading = await loadingController
    .create({
      message: 'Attendre SVP...',
    });
  await loading.present();
  //Le this.urlByDefault est vide au départ, il reste un variable dynamique
  await fetch(urlByDefault.value)
    .then(reponse => {
      if (reponse.status === 404) {
        throw new Error('Resource not found (404)');
      }
      if (!reponse.ok) {
        throw new Error('Network response was not ok');
      }
      return reponse.json();
    })
    .then(data => {
      if (!data.name || !data.main || !data.weather || !data.dt || typeof data.main.temp === 'undefined' || !data.weather[0].description || !data.weather[0].icon) {
        throw new Error('Missing data fields');
      }

      console.log(data);
      location = data.name;
      realtemperature.value = data.main.temp + "°C";
      realDescription = data.weather[0].description;

      //Lorsque c'est 04n , ou d'autre objet qui n'est pas dans le fichier me lance une erreure...
      /* L'ancienne méthode :  realImage = 'assets/image/'+ data.weather[0].icon + '.svg' 
      de cette façon je jouais avec les svg localement mais ça ne marche pas à 100%  */
      //API CALL directe des icons
      let liveMeteoIcon = data.weather[0].icon;

      realImage = `https://openweathermap.org/img/wn/${liveMeteoIcon}@2x.png`;
      //Conversion de la date
      let dataTime = data.dt * 1000;
      let date = new Date(dataTime);
      console.log(date)
      let options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        year: 'numeric',
        day: 'numeric',
        month: 'long',
        timeZone: 'America/New_York'
      };
      realTime = Intl.DateTimeFormat('fr-FR', options).format(date);

      //Vérification des données au console
      console.log(realTime);
      console.log(location);
      console.log(realImage);
      console.log(realtemperature);
      console.log(realDescription);
      loading.dismiss();
    }).catch(error => {
      if (error.message === 'Resource not found (404)') {
        console.log('The requested resource was not found:', error.message);
      } else {
        console.log('There was a problem with the fetch operation:', error.message);
      }
      //Mettre l'image par défaut
      defaultImage.value = 'assets/image/notFound.png';
    });
}




//Fonction dynamique selon le choix de l'utilisateur (L'index ion-list et l'event listener)
async function handleChange(ev: CustomEvent) {
  console.log('ionChange fired with value: ' + ev.detail.value);
  if (ev.detail.value === 'liveLocation') {
    urlByDefault.value = urlGeolocation.value;
    await getWeatherAPI();
    dataTransferVariables();
  }
  else if (ev.detail.value === 'montreal') {
    dataHandlerFromListener('montreal');
  }
  else if (ev.detail.value === 'quebec') {
    dataHandlerFromListener('quebec');
  }
  else if (ev.detail.value === 'laval') {
    dataHandlerFromListener('laval');
  }
}

async function handleCancel() {
  console.log('ionCancel fired');
}

async function handleDismiss() {
  console.log('ionDismiss fired');
}


//Concatenation des données pour être à jour
function dataTransferVariables() {
  defaultLocation.value = location;
  defaultemperature.value = realtemperature.value;
  defaultTime.value = realTime;
  defaultDescription.value = realDescription;
  defaultImage.value = realImage;
}


//Les données par défaut 
async function defaultData() {
defaultLocation.value = 'Nom de l\'endroit';
realtemperature.value = '';
urlByDefault.value = ``;
defaultTime.value = 'Choisir une position';
defaultImage.value = "assets/image/notFound.png";
defaultDescription.value = 'En attente des prévisions météo';
}

//Modulation des fonctions
async function dataHandlerFromListener(cityName: string) {
  newCity = cityName;
  let newApi = `https://api.openweathermap.org/data/2.5/weather?q=${newCity}&appid=cc635071277d5e926a255704fccac26e&units=metric&lang=fr`;
  urlByDefault.value = newApi;
  await getWeatherAPI();
  dataTransferVariables();
}
</script>
  
<style scoped>
.img {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 25%;
  min-width: 225px;
}

ion-item {
  --ion-item-background: transparent;
}

ion-title {
  font-weight: bold;
}


ion-list {
  --ion-item-background: transparent;
}

ion-label {
  font-size: large;
  color: black;
  font-size: larger;

}

ion-select {
  color: black;
  font-weight: normal;
  font-size: larger;
}


ion-content {
  --background: url(../../assets/image/background-morning.jpeg) 0 0/100% 100% no-repeat fixed;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}
</style>