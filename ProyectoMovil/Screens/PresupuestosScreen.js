import { Text, StyleSheet, View, ImageBackground, ScrollView } from 'react-native'


export default function PresupuestosScreen() {

    return (
      
      <ImageBackground source={require('../assets/fondo1.jpg')} resizeMode='cover'
        style={styles.backgrounds} >
          <View style={styles.encabezado}>        
          </View>



          <View style={styles.encabezado2}>
          
          </View>

      </ImageBackground>
      
    )
  
    
}
const styles = StyleSheet.create({

backgrounds: {
  flex: 1,
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  height: '100%',
},
encabezado:{
  
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

})

