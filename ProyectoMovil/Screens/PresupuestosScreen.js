import { Text, StyleSheet, View, ImageBackground, ScrollView, Image } from 'react-native'
import Slider from '@react-native-community/slider';
import { useState } from 'react';
import { Button } from 'react-native-web';

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
      <ScrollView>

        <View style={styles.Titulo2}>
          <Text style={styles.Titulo}>Mis Presupuestos</Text>
         
        </View>

        <View style={styles.elementos}>
          <View style={styles.textoslide}>
          <Text style={styles.texto1}>Presupuesto Total</Text>
           
            <Text style={[{fontSize:30}, styles.precio]} >$: {Math.floor(preciot)}</Text>
             </View>
           <Slider style={[{width:600, height: 50}, styles.slider]} maximumValue={80000}
            minimumValue={0} color='#5030efff' onValueChange={(value)=>setPrecio(value)
             } thumbTintColor='#3700ffff'></Slider>
           

        </View>

         <View style={styles.elementos}>
           <View style={styles.textoslide}>
          <Text style={styles.texto1}>Alimentación</Text>
           
            <Text style={[{fontSize:30}, styles.precio]} >$: {Math.floor(alimentacion)}</Text>
             </View>
           <Slider style={[{width:600, height: 50}, styles.slider]} maximumValue={80000}
            minimumValue={0} color='#5030efff' onValueChange={(value)=>setAlimentacion(value)
             } thumbTintColor='#3700ffff'></Slider>
           

        </View>

         <View style={styles.elementos}>
           <View style={styles.textoslide}>
          <Text style={styles.texto1}>Transporte</Text>
           
            <Text style={[{fontSize:30}, styles.precio]} >$: {Math.floor(transporte)}</Text>
             </View>
           <Slider style={[{width:600, height: 50}, styles.slider]} maximumValue={80000}
            minimumValue={0} color='#5030efff' onValueChange={(value)=>setTransporte(value)
             } thumbTintColor='#3700ffff'></Slider>
           

        </View>

         <View style={styles.elementos}>
          <View style={styles.textoslide}>
          <Text style={styles.texto1}>Entretenimiento</Text>
           
            <Text style={[{fontSize:30}, styles.precio]} >$: {Math.floor(entretenimiento)}</Text>
             </View>
           <Slider style={[{width:600, height: 50}, styles.slider]} maximumValue={80000}
            minimumValue={0} color='#5030efff' onValueChange={(value)=>setEntretenimiento(value)
             } thumbTintColor='#3700ffff'></Slider>
           

        </View>
        <View style={{width:120}}>
          <Button color='#79B7B4' title='Actualizar Presupuesto'></Button>
        </View>
      </ScrollView>
        
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

textoslide:{
justifyContent:'space-between',
flexDirection:'row',
paddingHorizontal:30
},
texto1:{
  fontSize:30,
  fontWeight:'bold',
  color:'#fff'
},

slider:{
paddingHorizontal: 120,

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

logo:{

width: 130,
height: 90,
borderRadius: 45,
borderColor: '#f4e45dff',
borderWidth:5
},

Titulo:{
justifyContent:'center',
fontSize: 20,
fontWeight: 'bold'

},
Titulo2:{
justifyContent:'center',
alignItems:'center',
fontSize: 20,
fontWeight: 'bold'

},

elementos:{
  
 width: 850,
    height: 150,
    backgroundColor: '#a5c3a7',
    justifyContent: 'space-between',
    //alignItems: 'center',
    marginVertical: 10,
    borderRadius: 10,
    padding:15,
},

})

