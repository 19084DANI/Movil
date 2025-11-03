import { Text, StyleSheet, View, ImageBackground, Image, Button } from 'react-native'
import { ScrollView } from 'react-native'


export default function TransaccionesScreen() {

    return (
      <ImageBackground source={require('../assets/fondo1.jpg')} resizeMode='cover'
             style={styles.backgrounds} >

         <View style={styles.encabezado}>  
          <Image style={styles.menuhamburgesa} source={require('../assets/menu.png')}></Image>     
          <Image style={styles.logo} source={require('../assets/logo.jpg')}></Image>  

          </View>
          <ScrollView 
          showsVerticalScrollIndicator={false}>
        <View style={styles.Titulo}>
                  <Text style={styles.texto2}>Transacciones</Text>
                 
                </View>
        <View style={styles.contenido}>
        <View style={styles.botones}>
       <View style={{width:120,  marginRight: 10} }  >
                <Button color='#79B7B4' title='Fecha'></Button>
       </View>

       <View style={{width:120,  marginRight: 10}}>
                <Button color='#79B7B4' title='Categoria'></Button>
       </View>
        </View>
        <View style={styles.elementos}>
          <Text style={styles.texto1}>$50.00</Text>
             <View style={styles.fecha}>
          <Text style={styles.texto1}>Fruteria {'\n'}Don Chuy</Text>
          <Text style={styles.texto1}>12/09/2025</Text>
              </View>
        </View>
        <View style={styles.elementos}>
          <Text style={styles.texto1}>$220.00</Text>
             <View style={styles.fecha}>
          <Text style={styles.texto1}>Uber X</Text>
          <Text style={styles.texto1}>18/09/2025</Text>
              </View>
        </View>

        <View style={styles.elementos}>
          <Text style={styles.texto1}>$180.00</Text>
             <View style={styles.fecha}>
          <Text style={styles.texto1}>Cinepolis</Text>
          <Text style={styles.texto1}>24/09/2025</Text>
              </View>
        </View>
        <View style={styles.elementos}>
          <Text style={styles.texto1}>$5000.00</Text>
             <View style={styles.fecha}>
          <Text style={styles.texto1}>Colegiatura</Text>
          <Text style={styles.texto1}>24/09/2025</Text>
              </View>
        </View>
        <View style={styles.elementos}>
          <Text style={styles.texto1}>$50.00</Text>
             <View style={styles.fecha}>
          <Text style={styles.texto1}>Cuidado con el Perro</Text>
          <Text style={styles.texto1}>2/10/2025</Text>
              </View>
        </View>
        <View style={{width:'100%', flexDirection:'row' ,justifyContent:'flex-end', padding:20}}>
                  <Image
                      style={styles.agregar}
                      source={require('../assets/plus.png')}
                     ></Image> 
                </View>
        </View>
        </ScrollView>
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

texto2:{
  fontSize:40,
  fontWeight:'bold',
  color:'#070707ff'
},

logo:{

width: 100,
height: 70,
borderRadius: 45,
borderColor: '#f4e45dff',
borderWidth:5
},
elementos:{
 width: 350,
    height: 150,
    backgroundColor: '#a5c3a7',
    justifyContent: 'space-between',
    //alignItems: 'center',
    marginVertical: 10,
    borderRadius: 10,
    padding:15,
},

Titulo:{
justifyContent:'center',
alignItems:'center',
fontSize: 20,
fontWeight: 'bold',
marginVertical: 10,
width:'100%'
},

fecha:{
  flexDirection:'row',
  justifyContent:'space-between'
},

botones:{
  flexDirection:'row',
 
},
agregar:{

width: 45,
height: 45,
},
})
