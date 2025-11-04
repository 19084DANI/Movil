import { Text, StyleSheet, View, Image, ImageBackground, ScrollView } from 'react-native'


export default function BotonesScreen() {

    return (
    <ImageBackground source={require('../assets/fondo1.jpg')} resizeMode='cover'
             style={styles.backgrounds} >
    <View style={styles.encabezado}>  
         <Image style={styles.menuhamburgesa} source={require('../assets/menu.png')}></Image>     
         <Image style={styles.logo} source={require('../assets/logo.jpg')}></Image>  
    </View>
        <ScrollView contentContainerStyle={styles.Container} >
        <View style={styles.elementos}>
        <Text style={styles.titulo}>¡Hola de Nuevo!</Text>
        <View style={styles.saldo}>
        <Text style={styles.textosaldo}>Saldo Disponible: </Text>
        <Text style={styles.textsaldo2}>$2100.00 </Text>
        </View>
        <View  style={styles.cuadros}>
        <View style={styles.elementos2}>
        <Text style={styles.textoi}>Ingresos:</Text>
        <Text style={styles.num}>$8000.00 </Text>
        </View>
        <View style={styles.elementos22}>
        <Text style={styles.textoi}>Gastos:</Text>
        <Text  style={styles.num}>$5900.00 </Text>
        </View>
         <View style={styles.elementos2}>
        <Text style={styles.textot}>Transaccion</Text>   
        </View>
        </View>
        <View>
        <Text style={styles.utransaccion}>Ultimas Transacciones</Text>
        
            <View style={styles.elementostransacciones}>
                <Text style={styles.textotransacciones}>$180.00</Text>
                <View style={styles.fecha}>
                <Text style={styles.textotransacciones}>Cinepolis</Text>
                <Text style={styles.textotransacciones}>24/09/2025</Text>
                </View>
            </View>
             <View style={styles.elementostransacciones}>
                <Text style={styles.textotransacciones}>$220.00</Text>
                <View style={styles.fecha}>
                <Text style={styles.textotransacciones}>Uber X</Text>
                <Text style={styles.textotransacciones}>15/04/2025</Text>
                </View>
            </View>
            <View style={styles.elementostransacciones}>
                <Text style={styles.textotransacciones}>$220.00</Text>
                <View style={styles.fecha}>
                <Text style={styles.textotransacciones}>Ferreteria</Text>
                <Text style={styles.textotransacciones}>29/01/2025</Text>
                </View>
            </View>
          
        </View>

        </View>
    </ScrollView>

   
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
Container:{
  alignItems: 'center',
  paddingBottom: 40, 
},
cuadros:{
    width:'100%',
    flexDirection:'row',
    marginRight:10,
    justifyContent:'space-between',
},
textotransacciones:{
  fontSize:25,
  fontWeight:'bold',
  color:'#fff'
},
fecha:{
    flexDirection:'row',
    justifyContent:'space-between',
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
utransaccion:{
justifyContent:'center',
fontSize: 24,
fontWeight: 'bold'

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
 width: '90%',
 flexDirection: 'column',
    height: 750,
    backgroundColor: '#E1F5C4',
    justifyContent: 'flex-start',
    marginVertical: 10,
    borderRadius: 10,
    padding:15,
},
elementos2:{
 width: '30%',
 flexDirection: 'column',
    height: '80%',
    backgroundColor: '#ADD6BC',
    justifyContent: 'flex-start',
    marginVertical: 10,
    borderRadius: 10,
    padding:15,
},
elementos22:{
 width: '30%',
 flexDirection: 'column',
    height: '80%',
    backgroundColor: '#F9D423',
    justifyContent: 'flex-start',
    marginVertical: 10,
    borderRadius: 10,
    padding:15,
},
saldo:{
    width: '60%',
    height: 100,
    backgroundColor: '#ADD6BC',
    justifyContent: 'space-between',
    marginVertical: 10,
    borderRadius: 10,
    padding:15,
},

textosaldo:{
    fontSize:18,
    fontWeight:'bold',
    color:'#476c57ff',
},

textoi:{
    fontSize:15,
    fontWeight:'bold',
    color:'#000000ff',
},

textot:{
    fontSize:12,
    fontWeight:'bold',
    color:'#000000ff',
},

num:{
    fontSize:15,
    fontWeight:'bold',
    color:'#ffffffff',
},
textsaldo2:{
    fontSize:22,
    fontWeight:'bold',
    color:'#ffffffff',
},
elementostransacciones:{
 width: '100%',
    height: 100,
    backgroundColor: '#ADD6BC',
    justifyContent: 'space-between',
    marginVertical: 10,
    borderRadius: 20,
    padding:15,
},
})
