const userTab=document.querySelector('[data-yourWeather]');
const searchTab=document.querySelector('[data-searchWeather]');
const userContainer=document.querySelector('.weather-container');
const grantAccessContainer=document.querySelector('.grant-location-container');
const searchForm=document.querySelector('[data-searchForm]');
const loadingScreen=document.querySelector('.loading-container');
const userInfoContainer=document.querySelector('.user-info-container')

let oldTab=userTab;
const key="d40fbade12040db97bc2eb8ca839cf4b";
oldTab.classList.add("current-tab");
 

getfromSessionStorage();
function switchTab(newTab){
    if(newTab!=oldTab){
        oldTab.classList.remove('current-tab');
        oldTab=newTab;
        oldTab.classList.add('current-tab');
    }
    if(!searchForm.classList.contains('active')){
        userInfoContainer.classList.remove('active');
        grantAccessContainer.classList.remove('active');
        searchForm.classList.add('active');
    }
    else{
        searchTab.classList.remove('active');
        userInfoContainer.classList.remove('active');
        getfromSessionStorage()
    }
}
userTab.addEventListener('click',()=>{
    switchTab(userTab);
})
searchTab.addEventListener('click',()=>{
    switchTab(searchTab);
})

//check for coordinate present or not
function getfromSessionStorage(){
    const localCoordinates=sessionStorage.getItem('user-coordinates');
    if(!localCoordinates){
        grantAccessContainer.classList.add('active');
    }
    else{
        const coordinates=JSON.parse(localCoordinates);
        fetchWeatherInfo(coordinates);
    }
}

async function fetchWeatherInfo(coordinates){
    const {lat,lon}=coordinates;
    grantAccessContainer.classList.remove('active');

    loadingScreen.classList.add('active');

    try{
        const res=await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${key}`);
        const data=await res.json();
        loadingScreen.classList.remove('active');
        userInfoContainer.classList.add('active');

        renderWeatherInfo(data);
    }catch(err){
        loadingScreen.classList.remove('active');
    }
}

function renderWeatherInfo(data){
    //fetch the element

    const cityName=document.querySelector('[data-cityName]');
    const  countryIcon=document.querySelector('[data-countryIcon]');
    const desc=document.querySelector('[data-weatherDesc]');
    const weatherIcon=document.querySelector('[data-weatherIcon]');
    const temp=document.querySelector('[data-temp]');
    const windspeed=document.querySelector('[data-windspeed]');
    const humidity=document.querySelector('[data-humidity]');
    const cloudiness=document.querySelector('[data-cloudiness]');
    cityName.innerText=data?.name;
    countryIcon.src=`https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`;
    desc.innerText=data?.weather?.[0]?.description;
    weatherIcon.src=`https://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`;
    temp.innerText=`${data?.main?.temp} °C`;
    windspeed.innerText=`${data?.wind?.speed} m/s`;
    humidity.innerText=`${data?.main?.humidity}%`;
    cloudiness.innerText=`${data?.clouds?.all}%`;
}
    

const grantAcces=document.querySelector('[data-grantAccess]');
grantAcces.addEventListener('click',()=>{
    getLocation();
})

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        //show alert no geolocation support 
    }
}

function showPosition(position){
        const coordinate={
            lat:position.coords.latitude,
            lon:position.coords.longitude
        };
        sessionStorage.setItem("user-coordinates",JSON.stringify(coordinate));
        fetchWeatherInfo(coordinate);       
}

const searchInput=document.querySelector('[data-searchInput]');
searchForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    let cityName=searchInput.value;
    if(cityName==""){
        return;
    }
    else{
        // console.log(cityName);
        fetchUserWeatherInfo(cityName);

    }

});
async function fetchUserWeatherInfo(cityName){
    try{
        loadingScreen.classList.add('active');
        userInfoContainer.classList.remove('active');
        grantAccessContainer.classList.remove('active');
        const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${key}`);
        const data = await response.json();
        loadingScreen.classList.remove('active');
        userInfoContainer.classList.add('active');
        renderWeatherInfo(data);
        // console.log("heere");
    }catch(e){

    }
}