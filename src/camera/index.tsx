import { CameraType } from "expo-camera";
import Camera from "expo-camera/build/Camera";
import { useEffect, useState } from "react";
import { Platform } from "react-native";
import { View, StyleSheet, TouchableOpacity, Text, Dimensions } from "react-native";
import Toast from "react-native-root-toast";

enum PermissionText{
  GRANTED = 'Call this function successfully',
  NOT_GRANTED = 'Permission not granted'
}

export default function CameraDemo(){
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [ratio, setRatio] = useState('4:3');
  const cameraWidth = 300;
  const [cameraHeight, setCameraHeight] = useState(225);
  const {height, width} = Dimensions.get('window');
  const screenRatio = height / width;
  const [isRatioSet, setIsRatioSet] = useState(false);
  const [camera, setCamera] = useState<Camera>();
  const supposeWidth = width*0.8;
  const desireRatio = 4/3;
  

  async function requestCameraPermission(){
    const response = await requestPermission();
    if(response.granted){
      Toast.show(PermissionText.GRANTED, {duration: Toast.durations.SHORT})
    }else{
      Toast.show(PermissionText.NOT_GRANTED, {duration: Toast.durations.SHORT})
    }
  }

  useEffect(()=>{
    requestCameraPermission();
  }, [])

  function toggleCameraType(){
    setType(current => current === CameraType.back ? CameraType.front : CameraType.back)
  }

  const prepare4Camera = async () => {
    if(!isRatioSet){
      if(Platform.OS === 'android'){
        const ratios = await camera?.getSupportedRatiosAsync();
        console.log(ratios, '比例')
        let closedRatio = null;
        let minDistance = null;
        let closedRatioNum = null;
        if(ratios){
          for(const ratio of ratios){
            const parts = ratio.split(':');
            const realRatio = parseInt(parts[0])/parseInt(parts[1]);
            const distance = Math.abs(realRatio - desireRatio);
            if(closedRatio === null){
              closedRatio = ratio;
              closedRatioNum = realRatio;
              minDistance = distance
            }else{
              if(minDistance as number > distance){
                minDistance = distance;
                closedRatio = ratio;
                closedRatioNum = realRatio
              }
            }
          }
        }
        setCameraHeight(cameraWidth*(closedRatioNum as number));
        setRatio(closedRatio as string);
        console.log(closedRatio, '比例结果')
      }
      setIsRatioSet(true);
    }
  }

  return (
    <View style={styles.container}>
      <Camera type={type} style={{width: cameraWidth, height: cameraHeight}} ratio={ratio} ref={(ref)=>ref&&setCamera(ref)} onCameraReady={prepare4Camera} >
        <View>
          <TouchableOpacity onPress={toggleCameraType}>
            <Text style={styles.text}>Toggle Camera</Text>
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  )

}

const styles = StyleSheet.create(
  {
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center'
    },
    text: {
      fontSize: 15,
      color: 'green'
    }
  }
)