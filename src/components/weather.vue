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
                //get C or D from toggle Switch
                //this.tempButton 
                //this.tempButton === C ? this.Unit = 'metric' : this.unit = 'imperial'
                //var URL = 'http://api.openweathermap.org/data/2.5/weather?id=6167863&APPID=84acadfd44883a87e5ca97bcf469cd0b&units='+this.Unit

                axios.get('http://api.openweathermap.org/data/2.5/weather?id=6167863&APPID=84acadfd44883a87e5ca97bcf469cd0b&units=metric') //URL
                .then(resp => {
                    this.currentTemperature = 
                    resp.data.main.temp + '°C'; // //this.tempButton === C ? 'C' : 'F'
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
        background-color: #bfd8ff;
        border-right: 0.5px solid black
    }
    #weatherContainer .row:nth-child(3){
        margin-left: 0px;
        margin-right: 0px;
        padding: 0 0 0 0;
        background-color:  #bfd8ff;
        border-right: 0.5px solid black;
    }
    #weatherContainer .row:first-child span{
        font-size: 14px;
        display: block;
        margin-left: auto;
        margin-right: auto;
    }
    #weatherContainer .row:last-child span {
        font-size: 12px;
        display: block;
        margin-left: auto;
        margin-right: auto;
    }
    img{
        display: block;
        margin: auto;
    }
</style>