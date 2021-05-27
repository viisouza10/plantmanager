import React, { useCallback, useEffect } from 'react';
import {  StatusBar } from 'react-native';
import { useFonts, Jost_400Regular,Jost_600SemiBold } from '@expo-google-fonts/jost';
import AppLoading from 'expo-app-loading';
import Routes from './src/routes';
import * as Notifications from 'expo-notifications';
import { PlantProps } from './src/libs/storage';


const App = () =>{
  let [fontsLoaded] = useFonts({
    Jost_400Regular,
    Jost_600SemiBold,
  });
  
  const requestIosPermission =  useCallback(async () =>{
    await Notifications.requestPermissionsAsync({
      ios: {
        allowAlert: true,
        allowBadge: true,
        allowSound: true,
        allowAnnouncements: true,
      },
    }); 
  },[])

  useEffect(() =>{
    requestIosPermission();
    
    const subscription = Notifications.addNotificationReceivedListener(
      async notification =>{
        const data= notification.request.content.data.plant as PlantProps
    })

    return () => subscription.remove()
  },[])

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return(
    <>
      <StatusBar barStyle="dark-content" />
      <Routes/>
    </>
  )
}

export default App