import { BarCodeScanningResult, CameraType } from "expo-camera";
import Camera from "expo-camera/build/Camera";
import { useEffect, useState } from "react";
import { Platform } from "react-native";
import { Button } from "react-native";
import { View, StyleSheet, TouchableOpacity, Text, Dimensions } from "react-native";
import Toast from "react-native-root-toast";
import * as WebBrowser from 'expo-web-browser';

enum PermissionText{
  GRANTED = 'Call this function successfully',
  NOT_GRANTED = 'Permission not granted'
}

export default function CameraDemo(){
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [codeScanned, setCodeScanned] = useState(false);
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

  const onBarCodeScanned = async (scanResult:BarCodeScanningResult) => {
    console.log(scanResult, '扫码结果');
    // WebBrowser.openBrowserAsync('https://m.baidu.com/?from=1020786r')
    const list = await WebBrowser.getCustomTabsSupportingBrowsersAsync()
    console.log('支持的浏览器', list)
    WebBrowser.openBrowserAsync('https://m.baidu.com/', {browserPackage: list.browserPackages[1]});
    setCodeScanned(true);
  }

  return (
    <View style={styles.container}>
      <Camera type={type} 
        style={[{width: cameraWidth, height: cameraHeight}, styles.camera]} 
        ratio={ratio} 
        ref={(ref)=>ref&&setCamera(ref)} 
        onCameraReady={prepare4Camera} 
        onBarCodeScanned={codeScanned? undefined : onBarCodeScanned}
        >
        <View style={styles.cameraZone}>
          <View style={styles.transparentZone} />
        </View>
      </Camera>
      <View style={styles.buttonArea}>
        <Button title="重新扫码" onPress={()=>{setCodeScanned(false)}} />
        <Button title="翻转摄像头" onPress={toggleCameraType} />
      </View>
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
      color: 'green',
    },
    camera: {
    },
    cameraZone: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.2)'
    },
    transparentZone: {
      margin: 'auto',
      backgroundColor: 'rgba(256,256,256,0.1)',
      width: 120,
      height: 120
    },
    buttonArea: {
      marginTop: 20,
      width: 250,
      flexDirection: "row",
      justifyContent: 'space-around'
    }
  }
)