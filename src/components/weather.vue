<template>
    <div id="weatherRoot">
        <b-container id="weatherContainer" class="container-fluid">
            <b-row>
                <span>Current Weather</span>
            </b-row>
            <b-row>
                <img :src="imgSrc">
            </b-row>
            <b-row>
                <b-col sm="4"><span>{{currentTemperature}}</span></b-col>
                <b-col sm="8"><span>{{weatherDescription}}</span></b-col>
            </b-row>
        </b-container>
    </div>
</template>
<script>
    const axios = require('axios').default;
    export default {
        name: 'Weather',
        data(){
            return {
                //See API for Weather @ https://openweathermap.org/weather-conditions
                currentTemperature: [],
                weatherDescription: '',
                weather: '',
                iconCode: '',
                imgSrc: ''
            }
        },
        mounted(){
            this.getWeather();
        },
        methods:{
            getWeather: function(){
                axios.get('http://api.openweathermap.org/data/2.5/weather?id=6167863&APPID=84acadfd44883a87e5ca97bcf469cd0b&units=metric')
                .then(resp => {
                    this.currentTemperature = resp.data.main.temp + '°C';
                    this.weatherDescription = resp.data.weather[0].description;
                    this.weather = resp.data.weather[0].main;
                    this.iconCode = resp.data.weather[0].icon;
                    this.imgSrc = 'http://openweathermap.org/img/wn/'+this.iconCode+'@2x.png'
                })
            },
        }
    }
</script>

<style>
    #weatherRoot{
        border: 0.5px solid black;
        border-style: groove;
    }
    #weatherContainer.container{
        padding: 0 0 0 0;
    }
    #weatherContainer .row:first-child{
        width: 100%;
        margin-left: 0;
        margin-right: 0;
        border-bottom: 1px solid blue;
    }
    #weatherContainer .row span{
        width: 100%;
        display: inline-block;
        padding: 2px 4px 2px 4px;
    }


    img{
        display: block;
        margin-left: auto;
        margin-right: auto;
    }
</style>