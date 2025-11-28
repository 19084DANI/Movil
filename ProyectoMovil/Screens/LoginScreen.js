
import { StyleSheet, Text, View, Button, Image, ImageBackground,Pressable } from 'react-native';
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


          <Pressable 
          style={styles.botones}
          onPress={()=> setScreen('IniciarSesion')}
          >
          <Text style={styles.textoBoton}>INICIAR SESION</Text>
          </Pressable>

           <Pressable 
          style={styles.botones}
          onPress={()=>setScreen('Registro')}
          >
          <Text style={styles.textoBoton}>REGISTRARSE</Text>
          </Pressable> 

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
    borderColor:'#172b41ff',
    borderWidth:5,
    
  },
  btn:{
    width:200,
    marginVertical:5,
    height:60,
  },
  botones:{
    width:200,
    height:40,
    backgroundColor:'#23555fa0',
    borderRadius:15,
    alignItems:'center',
    justifyContent:'center',
    shadowColor:'#777',
    marginBottom:30,
    shadowOffset:{
      height:3,
      width:0,
    }
  },
  textoBoton:{
    fontSize:15,
    fontWeight:'550',
    color:'white',
  }

})