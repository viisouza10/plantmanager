import React, { useEffect } from 'react';
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

  useEffect(() =>{
    // const subscription = Notifications.addNotificationReceivedListener(
    //   async notification =>{
    //     const data= notification.request.content.data.plant as PlantProps
    //     console.log(data)
    // })

    // return () => subscription.remove()

    async function notifications(){
      const data = await Notifications.getAllScheduledNotificationsAsync();
      console.log({data})
    }
    notifications()
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