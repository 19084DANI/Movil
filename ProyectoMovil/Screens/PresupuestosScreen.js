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
      <ScrollView>

        <View>
          <Text style={styles.Titulo}>Mis Presupuestos</Text>
        </View>

        <View style={styles.elementos}>
          <Text style={styles.texto1}>Presupuesto Total</Text>
        </View>

         <View style={styles.elementos}>
          <Text style={styles.texto1}>Alimentación</Text>
        </View>

         <View style={styles.elementos}>
          <Text style={styles.texto1}>Transporte</Text>
        </View>

         <View style={styles.elementos}>
          <Text style={styles.texto1}>Entretenimiento</Text>
        </View>

      </ScrollView>
        
          <View style={styles.encabezado2}>
          
          </View>

      </ImageBackground>
      
    )
  
    
}
const styles = StyleSheet.create({
texto1:{

  fontWeight:'bold',
  color:'#fff'
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

logo:{

width: 130,
height: 90,
borderRadius: 45,
borderColor: '#f4e45dff',
borderWidth:5
},

Titulo:{
justifyContent:'center',
fontSize: 20,
fontWeight: 'bold'

},

elementos:{
  
 width: 850,
    height: 150,
    backgroundColor: '#a5c3a7',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    borderRadius: 10,
},

})

