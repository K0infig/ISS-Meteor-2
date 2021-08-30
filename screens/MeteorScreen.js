import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View , Alert, SafeAreaView, FlatList, ImageBackground, Image, Platform} from 'react-native';
import axios from "axios";

export default class MeteorScreen extends React.Component{

  constructor(props){
    super(props);
    this.state={
      meteor:{}
    }
  }

  getMeteors =()=>{

    axios.get("https://api.nasa.gov/neo/rest/v1/feed?api_key=8yimrXwcKIq4ggsqk7dJYbzmn6f6GYxhP51lQraa")
    .then(response =>{
        this.setState({meteor: response.data.near_earth_objects})
    })
    .catch(error =>{
        Alert.alert(error.message)
    })

  }
  keyExtractor =(item, index) => index.toString();

  renderItem =({item}) =>{
    var meteor = item;

    var bg_img, speed, size;

    if(meteor.threat_score<=30){
      bg_img = require("../assets/meteor_bg1.png");
      speed = require("../assets/meteor_speed1.gif");
      size = 100

    }
    else if(meteor.threat_score<=75){
      bg_img = require("../assets/meteor_bg2.png");
      speed = require("../assets/meteor_speed2.gif");
      size = 150
    }
    else{
      bg_img = require("../assets/meteor_bg3.png");
      speed = require("../assets/meteor_speed3.gif");
      size = 200
    }
    return(
      <View>
        <ImageBackground source={bg_img}  style={styles.bgImage}>
        <View style = {styles.gifContainer}> 
          <Image source={speed} style= {{width: size, height: size, alignSelf:"center"}}  />


          <View>
            <Text style={{marginTop:400, marginLeft:50, color:"white", fontWeight:"bold"}}>{item.name}</Text>

            <Text style={{marginTop:20, marginLeft:50, color:"white"}}>Closest to Earth:- {item.close_approach_data[0].close_approach_date_full}</Text>
            <Text style={{marginTop:5, marginLeft:50, color:"white"}}>Minimun Diameter (KM) :- {item.estimated_diameter.kilometers.estimated_diameter_min}</Text>
            <Text style={{marginTop:5, marginLeft:50, color:"white",}}>Maximun Diameter (KM) :- {item.estimated_diameter.kilometers.estimated_diameter_max}</Text>
            <Text style={{marginTop:5, marginLeft:50, color:"white"}}>Velocity (KM/H) :- {item.close_approach_data[0].relative_velocity.kilometers_per_hour}</Text>
            <Text style={{marginTop:5, marginLeft:50, color:"white"}}>Missing Earth by (KM) :- {item.close_approach_data[0].miss_distance.kilometers}</Text>
          </View>
        </View>
      </ImageBackground>
      </View>
    )

  }

  componentDidMount(){
    this.getMeteors();
  }
  render(){
    if (Object.keys(this.state.meteor).length === 0) {
      return (
          <View
              style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center"
              }}>
              <Text>Loading...</Text>
          </View>
      )
  }
  else{
    var meteor_array = Object.keys(this.state.meteor).map(meteor_date =>{
      return this.state.meteor[meteor_date]
    })

    let meteors =[].concat.apply([],meteor_array)

    meteors.forEach(function (element) {
      let diameter = (element.estimated_diameter.kilometers.estimated_diameter_min + element.estimated_diameter.kilometers.estimated_diameter_max) / 2
      let threatScore = (diameter / element.close_approach_data[0].miss_distance.kilometers) * 1000000000
      element.threat_score = threatScore;
  });

  meteors.sort(function(a,b){
    return b.threat_score -a.threat_score

  })

  meteors.slice(0,5);



    return(
      <View style = {styles.container}>
        <SafeAreaView style={styles.androidView}>
          <FlatList 
            data = {meteors} 
            renderItem ={this.renderItem}
            keyExtractor = {this.keyExtractor}
            horizontal={true}
          
          />
        </SafeAreaView>
              
      </View>

    )
  }

  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  gifContainer:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',

  },
  androidView:{
    marginTop: Platform.OS == "android"? StatusBar.currentHeight : 0
  },
  bgImage:{
    flex:1,
    resizeMode:'cover'
  },
});
