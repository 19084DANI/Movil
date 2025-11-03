import { Text, StyleSheet, View} from 'react-native'
import React, { Component, useState } from 'react'

import Transacciones from './TransaccionesScreen';
import PresupuestosScreen from './PresupuestosScreen';
import RecuperarContrasena from './RecuperarContrasena';


import { Button } from 'react-native'

export default function MenuScreen () {

  const [screen, setScreen]=useState('default');

  switch(screen){
    case 'presupuesto':
        return <PresupuestosScreen/>
    case 'transacciones':
        return <Transacciones/>
    case 'recuperarContrasena':
        return <RecuperarContrasena/>
    case 'menu':  
        default:
            return(
              <View>
                 <Button color="orange" onPress={()=>setScreen('presupuesto') } title='Presupuesto'/>
                  <Button color="orange" onPress={()=>setScreen('transacciones') } title='transacciones'/>
                  <Button color="orange" onPress={()=>setScreen('recuperarContrasena') } title='Recuperar Contraseña'/>
                </View>
            )
  }


}