import { Text, StyleSheet, View, ImageBackground, ScrollView, Image } from 'react-native'
import Slider from '@react-native-community/slider';
import { useState } from 'react';
import { Button } from 'react-native';

export default function PresupuestosScreen() {
  const [preciot, setPrecio]=useState(0);
  const [alimentacion, setAlimentacion]=useState(0);
  const [transporte, setTransporte]=useState(0);
  const [entretenimiento, setEntretenimiento]=useState(0);
    return (
      
      <ImageBackground source={require('../assets/fondo1.jpg')} resizeMode='cover'
        style={styles.backgrounds} >
          <View style={styles.encabezado}>  
             <Image
              style={styles.menuhamburgesa}
              source={require('../assets/menu.png')}
             ></Image>     
             <Image
              style={styles.logo}
              source={require('../assets/logo.jpg')}
             ></Image>  
          </View>
          <View style={styles.contenido}>
      <ScrollView showsVerticalScrollIndicator={false}>

        <View style={styles.Titulo2}>
          <Text style={styles.Titulo}>         Mis {'\n'} Presupuestos{'\n'}</Text>
         
        </View>

        <View style={styles.elementos}>
          <View style={styles.textoslide}>
          <Text style={styles.texto1}>Presupuesto{'\n'}Total:</Text>
           
            <Text style={[{fontSize:30}, styles.precio]} >$: {Math.floor(preciot)}</Text>
             </View>
           <Slider style={[{width:300, height: 50}, styles.slider]} maximumValue={80000}
            minimumValue={0} color='#5030efff' onValueChange={(value)=>setPrecio(value)
             } thumbTintColor='#3700ffff' maximumTrackTintColor='#fff' minimumTrackTintColor='#3f1ae2ff'></Slider>
           

        </View>

         <View style={styles.elementos}>
           <View style={styles.textoslide}>
          <Text style={styles.texto1}>Alimentación</Text>
           
            <Text style={[{fontSize:30}, styles.precio]} >$: {Math.floor(alimentacion)}</Text>
             </View>
           <Slider style={[{width:300, height: 50}, styles.slider]} maximumValue={3500}
            minimumValue={2000} color='#5030efff' onValueChange={(value)=>setAlimentacion(value)
             } thumbTintColor='#3700ffff' maximumTrackTintColor='#fff' minimumTrackTintColor='#3f1ae2ff'></Slider>
           

        </View>

         <View style={styles.elementos}>
           <View style={styles.textoslide}>
          <Text style={styles.texto1}>Transporte</Text>
           
            <Text style={[{fontSize:30}, styles.precio]} >$: {Math.floor(transporte)}</Text>
             </View>
           <Slider style={[{width:300, height: 50}, styles.slider]} maximumValue={3200}
            minimumValue={3000} color='#5030efff' onValueChange={(value)=>setTransporte(value)
             } thumbTintColor='#000000ff' maximumTrackTintColor='#fff' minimumTrackTintColor='#751a1aff'></Slider>
           

        </View>
             
         <View style={styles.elementos}>
          <View style={styles.textoslide}>
          <Text style={styles.texto1}>Entretenimiento</Text>
           
            <Text style={[{fontSize:30}, styles.precio]} >$: {Math.floor(entretenimiento)}</Text>
             </View>
           <Slider style={[{width:300, height: 50}, styles.slider]} maximumValue={1500}
            minimumValue={900} color='#5030efff' onValueChange={(value)=>setEntretenimiento(value)
             } thumbTintColor='#3700ffff' maximumTrackTintColor='#fff' minimumTrackTintColor='#3f1ae2ff'></Slider>
           

        </View>
        <View style={{width:120}}>
          <Button color='#79B7B4' title='Actualizar'></Button>
        </View>

        <View style={{width:'100%', flexDirection:'row' ,justifyContent:'flex-end', padding:20}}>
          <Image
              style={styles.agregar}
              source={require('../assets/plus.png')}
             ></Image> 
        </View>
      </ScrollView>
        </View>
          <View style={styles.encabezado2}>
          
          </View>

      </ImageBackground>
      
    )
  
    
}
const styles = StyleSheet.create({
precio:{
  color:'#000',
  fontWeight:'bold'
},

contenido: {
  padding:30,
  paddingBottom:40,
},

textoslide:{
justifyContent:'space-between',
flexDirection:'row',
paddingHorizontal:10
},
texto1:{
  fontSize:27,
  fontWeight:'bold',
  color:'#fff'
},

slider:{
paddingHorizontal: 12,

},
backgrounds: {
  flex: 1,
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  height: '100%',
},
encabezado:{
  justifyContent:'space-between',
flexDirection: 'row',
alignItems: "center",
backgroundColor: '#E1F5C4',
padding: 10,
borderRadius:10,
marginBottom:0,
width: '100%',
height: '10%',

},
encabezado2:{
  
alignItems: "center",
backgroundColor: '#E1F5C4',
padding: 10,
borderRadius:10,
marginBottom:0,
width: '100%',
height: '10%',
},
menuhamburgesa:{

width: 35,
height: 35,
},
agregar:{

width: 45,
height: 45,
},


logo:{

width: 100,
height: 70,
borderRadius: 45,
borderColor: '#f4e45dff',
borderWidth:5
},

Titulo:{
justifyContent:'center',
fontSize: 30,
fontWeight: 'bold'

},
Titulo2:{
justifyContent:'center',
alignItems:'center',
fontSize: 20,
fontWeight: 'bold'

},

elementos:{
  
 width: 350,
    height: 150,
    backgroundColor: '#a5c3a7',
    justifyContent: 'space-between',
    //alignItems: 'center',
    marginVertical: 10,
    borderRadius: 10,
    padding:15,
},

})

