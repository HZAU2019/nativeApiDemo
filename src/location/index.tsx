
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';


export default function LocationDemo(){
  const region = {
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const [location, setLocation] = useState<Location.LocationObject>();
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [state, setState] = useState({region})
  const [map, setMap] = useState<MapView>();


  useEffect(()=>{
    (async ()=>{
      let {status} = await Location.requestForegroundPermissionsAsync();
      console.log('状态', status)
      if(status !== 'granted'){
        setErrorMsg('Permission to access location was denied')
        return;
      }
        let addressInfo = await Location.reverseGeocodeAsync({longitude: 121.6058264,latitude: 31.1873357})
        let location = await Location.getCurrentPositionAsync({accuracy: 1});
        console.log( addressInfo,'准备定位', location);
        const address = await map?.addressForCoordinate({longitude: 121.6058264, latitude: 31.1873357})
        setLocation(location)
    })();
  }, [])

  let text = 'Waiting..';
  if(errorMsg){
    text = errorMsg;
  }else if(location){
    text = JSON.stringify(location);
  }

  return(
    <View style={styles.container}>
      <MapView           
        style={styles.map}
        ref={(ref)=>ref&&setMap(ref)}
        >        
        <Marker
          coordinate={location?.coords? {latitude: 31.185113894810286, longitude: 121.61002409901754}: {latitude: 0, longitude: 0}}
          title='当前'
         />
      </MapView>
      <Text style={styles.text}>{text}</Text>
    </View>
  )
}

const styles = StyleSheet.create(
  {
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    map: {
      height: 300,
      width: '100%',
    },
    text: {
      marginTop: 30,
      paddingLeft: 20,
      paddingRight: 20
    }
  
  }
)