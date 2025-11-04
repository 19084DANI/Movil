import { Text, StyleSheet, View, Image, ImageBackground } from 'react-native'


export default function BotonesScreen() {

    return (
    <ImageBackground source={require('../assets/fondo1.jpg')} resizeMode='cover'
             style={styles.backgrounds} >
    <View style={styles.encabezado}>  
         <Image style={styles.menuhamburgesa} source={require('../assets/menu.png')}></Image>     
         <Image style={styles.logo} source={require('../assets/logo.jpg')}></Image>  
    </View>

        <View style={styles.elementos}>
        <Text style={styles.titulo}>¡Hola de Nuevo!</Text>
        <View style={styles.saldo}>
        <Text style={styles.textosaldo}>Saldo Disponible: </Text>
        <Text style={styles.textsaldo2}>$2100.00 </Text>
        </View>
        </View>
    

    <View style={styles.encabezado2}>               
    </View>
    </ImageBackground>
    )
  
}

const styles = StyleSheet.create({
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
titulo:{
fontSize:24,
fontWeight:'bold',
marginBottom:20,
textAlign:'center',
},

menuhamburgesa:{

width: 35,
height: 35,
},

logo:{

width: 100,
height: 70,
borderRadius: 45,
borderColor: '#f4e45dff',
borderWidth:5
},

backgrounds: {
  flex: 1,
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  height: '100%',
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

elementos:{
 width: '80%',
 flexDirection: 'column',
    height: '70%',
    backgroundColor: '#E1F5C4',
    justifyContent: 'flex-start',
    //alignItems: 'center',
    marginVertical: 10,
    borderRadius: 10,
    padding:15,
},
saldo:{
    width: '60%',
    height: '15%',
    backgroundColor: '#ADD6BC',
    justifyContent: 'space-between',
    //alignItems: 'center',
    marginVertical: 10,
    borderRadius: 10,
    padding:15,
},

textosaldo:{
    fontSize:18,
    fontWeight:'bold',
    color:'#476c57ff',
},
textsaldo2:{
    fontSize:22,
    fontWeight:'bold',
    color:'#ffffffff',
},
})
