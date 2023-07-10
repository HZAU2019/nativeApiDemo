
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as Location from 'expo-location';


export default function LocationDemo(){
  const [location, setLocation] = useState<Location.LocationObject>();
  const [errorMsg, setErrorMsg] = useState<string>('');

  useEffect(()=>{
    (async ()=>{
      let {status} = await Location.requestForegroundPermissionsAsync();
      if(status !== 'granted'){
        setErrorMsg('Permission to access location was denied')
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location)
    })
  })

  let text = 'Waiting..';
  if(errorMsg){
    text = errorMsg;
  }else if(location){
    text = JSON.stringify(location);
  }

  return(
    <View style={styles.container}>
      <Text style={{}}>{text}</Text>
    </View>
  )
}

const styles = StyleSheet.create(
  {
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    }
  }
)