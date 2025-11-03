import { Text, StyleSheet, View, ImageBackground, Image } from 'react-native'


export default function TransaccionesScreen() {

    return (
      <ImageBackground source={require('../assets/fondo1.jpg')} resizeMode='cover'
             style={styles.backgrounds} >

         <View style={styles.encabezado}>  
          <Image style={styles.menuhamburgesa} source={require('../assets/menu.png')}></Image>     
          <Image style={styles.logo} source={require('../assets/logo.jpg')}></Image>  

          </View>
      </ImageBackground>
        
    )
  
}