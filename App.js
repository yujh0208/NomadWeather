import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import { 
  StyleSheet, 
  Text,
  ScrollView, 
  View, 
  ActivityIndicator,
  Dimensions 
} from 'react-native';
import { Fontisto } from '@expo/vector-icons'; 

const {width:SCREEN_WIDTH} = Dimensions.get("window");

const API_KEY = "131e699ad2148e8e220434fa27172061"; 

const icons = {
  Clouds : "cloudy",
  Clear : "day-sunny",
  Rain : "rains",
  Atmosphere :"cloudy-gusts",
  Snow :"snow",
  Drizzle: "rain",
  Thunderstorm : "lihtning",
};

export default function App() {
  const[city, setCity] = useState("Loading...");
  const[days, setDays] = useState([]); //기상정보 저장할것 
  const [ok, setOk] = useState(true);
  const getWeather = async () => { //위치 제공 권한 받기
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setOk(false);
    }
    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({ accuracy: 5 });
    const location = await Location.reverseGeocodeAsync(
      { latitude, longitude },
      { useGoogleMaps: false }
    );
    setCity(location[0].city);
    const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`);
    const json = await response.json();
    setDays(json.daily); 
  };
  useEffect(()=> {
    getWeather();
  },[])
  return (
  <View style = {styles.container}>
      <View style = {styles.city}>
        <Fontisto name="earth" size={40} color="#FFA07A" />
        <Text>        </Text>
        <Text style ={styles.cityName}>Seoul</Text>
        <Text>        </Text>
        <Fontisto name="earth" size={40} color="#FFA07A" />
      </View> 
      <ScrollView
        pagingEnabled 
        horizontal 
        showsHorizontalScrollIndicator = {false}
        contentContainerStyle = {styles.weather}>
        {days.length === 0 ? ( // day 길이가 0이라면 아래 실행
           <View style={{...styles.day, alignItems: "center"}}>
             <ActivityIndicator
               color="#FFA07A"
               style={{ marginTop: 10 }}
               size="large"
             />
           </View>
         ) : ( //day 길이가 0이 아니라면 아래 실행(온도는 소수점아래 한자리까지만 나오게 포멧)
         days.map((day, index) => (
          <View key={index} style={styles.day}>
            <View
             style ={{
              flexDirection : "row", 
              alignItems : "center",
              width :"100%",
              justifyContent : "space-around",
          }}>
            <Text style={styles.temp}>  
              {parseFloat(day.temp.day).toFixed(1)} 
            </Text>
            <Fontisto 
              name={icons[day.weather[0].main]} 
              size={68} 
              color="#FFA07A"/>
            </View>
            
            <Text style={styles.description}>{day.weather[0].main}</Text>
            <Text style={styles.tinyText}>{day.weather[0].description}</Text>
          </View>
        ))
      )}
      </ScrollView>
  </View>
  );
};

const styles = StyleSheet.create({
  container:{
    flex : 1, 
    backgroundColor:"#FFFACD",
  },
  city :{
    flex : 1.2,
    justifyContent :"center",
    alignItems:"center",
    flexDirection : "row"
  },
  cityName:{
    fontSize:68,
    fontWeight: "500",
    color : "#FFA07A"
  },
  weather:{
 
  },
  day:{
    width : SCREEN_WIDTH,
    alignItems:"left",
    color : "#FFA07A",
  },
  temp:{
    marginLeft : 20,
    marginTop : 50,
    fontSize :140,
    color : "#FFA07A",
  },
  description:{
    marginLeft : 50,
    marginTop : -25,
    fontSize : 40,
    color : "#FFA07A",
  },
  tinyText : {
    marginLeft : 50,
    marginTop : -7,
    fontSize: 30,
    color : "#FFA07A",
  },
});

