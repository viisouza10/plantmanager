import { useNavigation } from '@react-navigation/core';
import React, { useCallback, useState } from 'react';
import { Alert, Keyboard, KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native';

import { Button } from '../components/Button';
import colors from '../styles/colors';
import fonts from '../styles/fonts';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { ConfirmationParams } from './Confirmation';

export const UserIdentification = ()=>{
    const [isFocused,setIsFocused] = useState(false);
    const [isFilled,setIsFilled] = useState(false);
    const [name,setName] = useState<string>();
    const navigation = useNavigation();

    const handleSubmit = useCallback(async () =>{
        if(!name) return Alert.alert("Me diz como podemos te chamar? 🥲");
        try {
            await AsyncStorage.setItem("@plantmanager:user",name);
            navigation.navigate("Confirmation",{
                title:"Prontinho",
                subtitle:"Agora vamos começar a cuidas das suas plantinhas com muito cuidado.",
                buttonTitle:"Começar",
                nextScreen:"PlantSelect",
                icon:"smile",
            } as ConfirmationParams)
        } catch (error) {
            Alert.alert("Não foi possível salvar o seu nome 🥲")
        }

    },[navigation,name])

    const handleInputBlur = useCallback(()=>{
        setIsFocused(false)
        setIsFilled(!!name)
    },[name])

    const handleInputFocus = useCallback(()=>{
        setIsFocused(true)
    },[])

    const handleInputChange = useCallback((value:string)=>{
        setIsFilled(!!value)
        setName(value)
    },[])


    return (
        <SafeAreaView style={style.container}>
            <KeyboardAvoidingView style={style.container} behavior={Platform.OS === 'ios' ? 'padding' : "height"}> 
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={style.content}>
                        <View style={style.form}>
                            <View style={style.header}>
                                <Text style={style.emoji}>
                                    {isFilled?'😁': '😃'}
                                </Text>
                                <Text style={style.title}>
                                    Como podemos {"\n"} 
                                    chamar você?
                                </Text>
                            </View>

                            <TextInput
                                style={[
                                    style.input,
                                    (isFocused || isFilled ) && {
                                        borderColor:colors.green
                                    }
                                ]}
                                placeholder="Digite um nome"
                                onBlur={handleInputBlur}
                                onFocus={handleInputFocus}
                                onChangeText={handleInputChange}
                            />

                            <View style={style.footer} >
                                <Button title="Confirmar" onPress={handleSubmit}/>
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

const style = StyleSheet.create({
    container:{
        flex:1,
        width: '100%',
        alignItems: 'center',
        justifyContent:'space-around'
    },
    content:{
        flex:1,
        width: '100%',
    },
    form:{
        flex:1,
        justifyContent:"center",
        paddingHorizontal: 54,
        alignItems: "center",
        width: "100%"
    },
    header:{
        alignItems: "center",
    },
    input:{
        borderBottomWidth:1,
        borderColor:colors.gray,
        color:colors.heading,
        width: "100%",
        fontSize:18,
        marginTop:50,
        padding: 10,
        textAlign:"center"
    },
    emoji:{
        fontSize:44
    },
    title:{
        fontSize:24,
        lineHeight:32,
        textAlign:'center',
        color:colors.heading,
        fontFamily:fonts.heading,
        marginTop:20
    },
    footer:{
        width: "100%",
        marginTop:40,
        paddingHorizontal:20
    }
})