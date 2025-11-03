import { Text, StyleSheet, View, ImageBackground, Image } from 'react-native'


export default function TransaccionesScreen() {

    return (
      <ImageBackground source={require('../assets/fondo1.jpg')} resizeMode='cover'
             style={styles.backgrounds} >

         <View style={styles.encabezado}>  
          <Image style={styles.menuhamburgesa} source={require('../assets/menu.png')}></Image>     
          <Image style={styles.logo} source={require('../assets/logo.jpg')}></Image>  

          </View>

        <View style={styles.elementos}>
          <Text style={styles.texto1}>$50.00</Text>
          <Text style={styles.texto1}>Fruteria Don Chuy</Text>
          <Text style={styles.texto1}>12/09/2025</Text>
        </View>
         <View style={styles.encabezado2}>
                    
        </View>
      </ImageBackground>
        
    )
  
}const styles = StyleSheet.create({

contenido: {
  padding:30,
  paddingBottom:40,
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
texto1:{
  fontSize:30,
  fontWeight:'bold',
  color:'#fff'
},

logo:{

width: 130,
height: 90,
borderRadius: 45,
borderColor: '#f4e45dff',
borderWidth:5
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
