import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native'
import { EnvironmentButton } from '../components/EnvironmentButton';
import { Header } from '../components/Header';
import { Load } from '../components/Load';
import { PlantCardPrimary } from '../components/PlantCardPrimary';
import { PlantProps } from '../libs/storage';
import { api } from '../services/api';
import colors from '../styles/colors';
import fonts from '../styles/fonts';

interface IPlantsEnviroment {
    key:string;
    title:string;
}

export const PlantSelect = () =>{
    const [environments, setEnvironments] = useState<IPlantsEnviroment[]>([])
    const [plants, setPlants] = useState<PlantProps[]>([])
    const [filteredPlants, setFilteredetPlants] = useState<PlantProps[]>([])
    const [environmentSelected, setEnvironmentSelected] = useState('all')
    const [loading,setLoading] = useState(true)
    
    const [page,setPage] = useState(1)
    const [loadingMore,setLoadingMore] = useState(false)
    const [loadedAll,setLoadedAll] = useState(false)

    const navigation = useNavigation();

    async function fetchPlants() {
        const { data } = await api.get<PlantProps[]>("plants",{
            params:{
                _sort:"title",
                _order:"asc",
                _page:page,
                _limit:8
            }
        });

        if(!data) return setLoading(true);

        if(page > 1){
            setPlants(oldValue => [...oldValue,...data])
            setFilteredetPlants(oldValue => [...oldValue,...data])
        }else{
            setPlants(data)
            setFilteredetPlants(data)
        }
        setLoadingMore(false)
        
        setTimeout(() => {
            setLoading(false)
        }, 500);
    }

    const handlePlantSelect = useCallback((plant:PlantProps) =>{
        navigation.navigate("PlantSave",{plant})
    },[])

    const handleEnviromentSelected = useCallback((environment:string) =>{
        setEnvironmentSelected(environment)

        if(environment === 'all') return setFilteredetPlants(plants);

        const filtered = plants.filter(plant => plant.environments.includes(environment))
        setFilteredetPlants(filtered)

    },[plants])

    const handleFetchMore = useCallback((distance:number) =>{
        if(distance < 1)return;

        setLoadingMore(true);
        setPage(oldValue => oldValue + 1)
        fetchPlants()
    },[fetchPlants])

    useEffect(() =>{
        async function fetchEnvironment() {
            const { data } = await api.get<IPlantsEnviroment[]>("plants_environments",{
                params:{
                    _sort:"title",
                    _order:"asc"
                }
            });
            setEnvironments([
                {key:'all',title:"Todos"},
                ...data
            ])
        }

        fetchEnvironment()

    },[])

    useEffect(() =>{
        fetchPlants()
    },[])

    if(loading) return <Load/>
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Header/>

                <Text style={styles.title}>Em qual ambiente</Text>
                <Text style={styles.subtitle}>você quer colocar sua planta?</Text>

            </View>
            <View>
                <FlatList 
                    data={environments}
                    keyExtractor={(item) => String(item.key)}
                    renderItem={({item}) => <EnvironmentButton key={item.key} title={item.title} active={environmentSelected === item.key} onPress={() => handleEnviromentSelected(item.key)}/>}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.environmentList}
                />
            </View>
            <View style={styles.plants}>
                <FlatList 
                    data={filteredPlants}
                    keyExtractor={(item) => String(item.id)}
                    renderItem={({item}) => <PlantCardPrimary data={item} onPress={() => handlePlantSelect(item)}/>}
                    showsVerticalScrollIndicator={false}
                    numColumns={2}
                    onEndReachedThreshold={0.10}
                    onEndReached={({distanceFromEnd}) => handleFetchMore(distanceFromEnd)}
                    ListFooterComponent={ loadingMore ? <ActivityIndicator color={colors.green}/> : <></>}
                />
            </View>
            
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor:colors.background
    },
    header:{
        paddingHorizontal:30
    },
    title:{
        fontSize:17,
        color:colors.heading,
        fontFamily:fonts.heading,
        lineHeight:20,
        marginTop:15
    },
    subtitle:{
        fontFamily:fonts.text,
        fontSize:17,
        lineHeight:20,
        color:colors.heading,
    },
    environmentList:{
        height: 40,
        justifyContent:"center",
        paddingBottom:5,
        marginLeft:32,
        marginVertical:32,
        paddingRight:64
    },
    plants:{
        flex:1,
        paddingHorizontal:32,
        justifyContent:"center",
    },
})