import { Text, StyleSheet, View, ImageBackground, ScrollView, Image } from 'react-native'


export default function PresupuestosScreen() {

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


})

