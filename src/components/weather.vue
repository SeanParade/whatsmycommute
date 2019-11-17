<template>
    <div id="weatherRoot">
        <b-container id="weatherContainer" class="container-fluid">
            <b-row>
                <span>Current Weather
                    <toggle-button
                    class="toggle"
                    :value="true" 
                    color="#82C7EB"
                    :sync="false"
                    :disabled="false"
                    :labels="{checked: '°C', unchecked: '°F'}"
                    @change="getWeather"
                    />
                </span>
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
                iconCode: '',
                imgSrc: '',
                switchValue: '',
                Unit: 'metric',
                URL: ''
            }
        },
        mounted(){
            this.getWeather();
        },
        methods:{
            getWeather: function(event){
                event ? 
                    this.Unit = event.value ? 
                        'metric':
                        'imperial' 
                    : 
                    "";

                this.URL = 'http://api.openweathermap.org/data/2.5/weather?id=6167863&APPID=84acadfd44883a87e5ca97bcf469cd0b&units='+this.Unit

                axios.get(this.URL)
                .then(resp => {
                    this.currentTemperature = this.Unit === 'metric' ?
                        resp.data.main.temp + '°C':
                        resp.data.main.temp + '°F'
                    this.weatherDescription = resp.data.weather[0].description;
                    this.iconCode = resp.data.weather[0].icon;
                    this.imgSrc = 'http://openweathermap.org/img/wn/'+this.iconCode+'@2x.png'
                }).catch((error) => {
                    console.log(error.dresponse.data.message)
                })
            }
        }
    }
</script>

<style>
    #weatherRoot{
        border: 0.5px solid black;
        border-style: groove;
    }
    #weatherContainer.container{
        border: 0.5px solid black;
        border-style: groove;
        padding: 0 0 0 0;
    }
    #weatherContainer .row:first-child{
        width: 100%;
        margin-left: 0;
        margin-right: 0;
        background-color: #bfd8ff;
    }
    #weatherContainer .row:nth-child(2){
        background-color: white;
        margin-left: 0px;
    }
    #weatherContainer .row:nth-child(3){
        margin-left: 0px;
        margin-right: 0px;
        padding: 10 0 0 0;
        background-color:  #bfd8ff;
    }
    #weatherContainer .row:first-child span{
        font-size: 14px;
        font-weight: bold;
        font-style: Courier;
        display: block;
        margin-left: auto;
        margin-right: auto;
    }
    .toggle {
        margin-top: 10px;
        margin-left: 20px
    }
    #weatherContainer .row:last-child span {
        font-size: 14px;
        font-weight: bold;
        font-style: Courier;
        display: block;
        margin-top: 10px;
        margin-bottom: 10px;
        margin-left: auto;
        margin-right: auto;
    }
    img{
        display: block;
        margin: auto;
    }
</style>