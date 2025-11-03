import { StyleSheet, Text, View } from 'react-native'
import { Button, ImageBackground,Image } from 'react-native-web'

export default function login(){
    return (

      <View style={styles.ImageBackground}>
       <View style={styles.contSup}></View> 

        <View style={styles.contPrin}>
          <View style={styles.separador}></View>
          <Text style={styles.contTitulo}>!Bienvenido!</Text>

          <Image 
          source={require('../assets/Logo.jpeg')}
          style={styles.logo}
          resizeMode='cover'
          />
          
            <Text style={styles.Slogan}>Ahorra mas,vive mejor...</Text>
            
          <View style={styles.separador}></View>

          <View style={styles.contenedorBotones}>   
           <View style={styles.btn}>            
            <Button title='Iniciar Sesion' color='#ADD6BC'/>
          </View>
    
            
          <View style={styles.btn}>
          <Button title='Registrarse' color='#ADD6BC'/>  
        </View>
      </View>
    </View>
                      
      <View style={styles.contInf}></View>
  </View>
    )
}

const styles = StyleSheet.create({
  ImageBackground:{
    flex:1,
    backgroundColor:'#EDE574'
  },
  //MARGENENES 
  contSup:{ //cuadrito de arriba
    backgroundColor:'#E1F5C4',
    padding:'9%',
    borderRadius:0,
    justifyContent:'flex-start',
  },
  contInf:{ //cuadrito de abajo
    backgroundColor:'#E1F5C4',
    padding:'9%',
    borderRadius:0,
    position:'absolute',
    bottom:0,
    width:'100%',
  },
  //SEPARADORES
  separador:{ //separador promedio
    marginTop:50,
  },
  separador2:{ 
    marginTop:25,
  },  
  //TEXTOS Y LETRAS
  contTitulo:{
    backgroundColor:'#EDE574',
    color:'#517f7dff',
    fontSize:30,
    fontWeight:'bold',
    textAlign:'center',
    marginBottom:20,
    padding:10,  
  },
  Slogan:{
    backgroundColor:'#EDE574',
    color:'#517f7cff',
    fontSize:17,
    fontWeight:'bold',
    textAlign:'center',
    alignItems:'center',
    marginTop:0,
    padding:0,
  },
  contenedorBotones:{
    marginTop:20,
    gap:10,
    alignItems:'center',

  },
  logo:{
    width:150,
    height:150,
    alignSelf:'center',
    marginVertical:20,
    marginHorizontal:30,
    borderRadius:75,
    overflow:'hidden',
  },
  btn:{
    width:200,
    marginVertical:5,
    height:60,
  }

})