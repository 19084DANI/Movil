import { Text, StyleSheet, View} from 'react-native'
import React, { Component, useState } from 'react'

import Transacciones from './TransaccionesScreen';
import PresupuestosScreen from './PresupuestosScreen';
import RecuperarContrasena from './RecuperarContrasena';
import LoginScreen from './LoginScreen'
import IniciarSeScreen from './IniciarSeScreen';
import RegistroScreen from './RegistroScreen';
import Home from './HomeScreen';


import { Button } from 'react-native'

export default function MenuScreen () {

  const [screen, setScreen]=useState('default');

  switch(screen){
    case 'presupuesto':
        return <PresupuestosScreen/>
    case 'transacciones':
        return <Transacciones/>
    case 'RecuperarContrasena':
        return <RecuperarContrasena/>
    case 'Login':
        return<LoginScreen/>
    case 'IniciarSesion':
      return<IniciarSeScreen/>
    case 'registro':
      return<RegistroScreen/>
    case 'home':
      return<Home/>
    
    case 'menu':  
        default:
            return(
              <View>
                 <Button color="orange" onPress={()=>setScreen('presupuesto') } title='Presupuesto'/>
                  <Button color="orange" onPress={()=>setScreen('transacciones') } title='transacciones'/>
                  <Button color="orange" onPress={()=>setScreen('RecuperarContrasena') } title='Recuperar Contraseña'/>
                  <Button color ='orange' onPress={()=> setScreen('Login')} title= 'Login'/>
                  <Button color ='orange' onPress={()=> setScreen('IniciarSesion')} title='IniciarSesion'/>
                  <Button color ='orange' onPress={()=> setScreen('registro')} title='Registro'/>
                  <Button color ='orange' onPress={()=> setScreen('home')} title='Home'/>
                </View>
            )
  }


}