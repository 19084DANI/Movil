
import { StyleSheet, Text, View, Button, Image, ImageBackground } from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from  '@expo/vector-icons';

//import de iniciar sesion
import IniciarSeScreen from './IniciarSeScreen';
import RegistroScreen from './RegistroScreen';

export default function Login(){

  const [screen, setScreen]=useState('default');
  switch(screen){
     case 'IniciarSesion':
       return<IniciarSeScreen/>
     case 'Registro':
      return<RegistroScreen/>
    default:
  return (

      <View style={styles.ImageBackground}>
       <View style={styles.contSup}></View> 

        <View style={styles.contPrin}>
          <View style={styles.separador}></View>
          <Text style={styles.contTitulo}>!Bienvenido!</Text>


          <Image 
          source={require('../assets/Logo.jpeg')}
          style={styles.logo}
          resizeMode='cover'
          />
          
            <Text style={styles.Slogan}>Ahorra mas,vive mejor...</Text>
            
          <View style={styles.separador}></View>

          <View style={styles.contenedorBotones}>   
           <View style={styles.btn}>            
            <Button title='Iniciar Sesion' 
            color='#f0e7da3e' 
            onPress={()=> setScreen('IniciarSesion')}
            />

          </View>
    
            
          <View style={styles.btn}>
          <Button title='Registrarse'
           color='#f0e7da50'
           onPress={()=>setScreen('Registro')}
           />  
        </View>
      </View>
    </View>
                      
      <View style={styles.contInf}></View>
  </View>
    )      
  }
   
}

const styles = StyleSheet.create({
  ImageBackground:{
    flex:1,
   // backgroundColor:'#EDE574'
    backgroundColor:'#93A392'
  },
  //MARGENENES 
  contSup:{ //cuadrito de arriba
    backgroundColor:'#EEF5DB',
    padding:'9%',
    borderRadius:0,
    justifyContent:'flex-start',
  },
  contInf:{ //cuadrito de abajo
    backgroundColor:'#EEF5DB',
    padding:'9%',
    borderRadius:0,
    position:'absolute',
    bottom:0,
    width:'100%',
  },
  //SEPARADORES
  separador:{ //separador promedio
    marginTop:50,
  },
  separador2:{ 
    marginTop:25,
  },  
  //TEXTOS Y LETRAS
  contTitulo:{
    backgroundColor:'#93A392',
    color:'#3D4939',
    fontSize:30,
    fontWeight:'bold',
    textAlign:'center',
    marginBottom:20,
    padding:10,  
  },
  Slogan:{
    backgroundColor:'#93A392',
    color:'#3D4939',
    fontSize:17,
    fontWeight:'bold',
    textAlign:'center',
    alignItems:'center',
    marginTop:0,
    padding:0,
  },
  contenedorBotones:{
    marginTop:20,
    gap:10,
    alignItems:'center',

  },
  logo:{
    width:150,
    height:150,
    alignSelf:'center',
    marginVertical:20,
    marginHorizontal:30,
    borderRadius:75,
    overflow:'hidden',
  },
  btn:{
    width:200,
    marginVertical:5,
    height:60,
  }

})