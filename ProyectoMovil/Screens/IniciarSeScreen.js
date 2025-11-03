import { Text, StyleSheet, View ,Image,TextInput,Alert,Button,TouchableOpacity} from 'react-native'
import {useState} from 'react'


export default function IniciarSeScreen (){
    const[usuario,setusuario]= useState('');
    const[keyword,setkeyword]= useState('');

    const mostrarAlerta= ()=>{
        if(usuario ===''|| keyword ===''){
            Alert.alert('Por favor complete todos los campos');
            alert('Por favor complete todos los campos');
          }else{
        Alert.alert(
          "Datos ingresados",
          `Nombre: ${usuario}\n
          Password: ${keyword}\n`
        )
          alert(
          "Datos ingresados",
          `Nombre: ${usuario}\n
          Password: ${keyword}\n`
        )
        
      } 
    }
    return (
      <View style={styles.ImageBackground}>
        <View style={styles.contSup}></View> 
          <Image 
          source={require('../assets/Logo.jpeg')}
          style={[styles.logo,{zIndex:1}]}
          resizeMode='cover'
          /> 
         <View style={styles.separador}></View>         
          <View style={[styles.titulo,{zIndex:1}]}>
           <Text style={styles.TextTitulo} >Bienvenid@</Text>              
        </View>  
         <View style={styles.separador2}></View>            
          <View style={[styles.titulo2,{zIndex:1}]}>
           <Text style={styles.TextUsarioTitulo} >Usario</Text>              
        </View>    
         <View style={styles.separador2}></View>     
          <View style={[styles.titulo3,{zIndex:1}]}>
           <Text style={styles.TextIngresarTitulo} >Ingrese su Usuario y Contraseña</Text>              
        </View>  
         <View style={styles.separador}></View>   

         <TextInput style={[styles.inputText,{zIndex:1}]}       
        placeholder='Ingresa tu Usuario'
        onChangeText={setusuario}
        value={usuario}        
        />            
         <View style={[styles.separador3,{zIndex:1}]}></View> 
         <View style={styles.separador2}></View>                      
          <TextInput style={[styles.inputText,{zIndex:1}]}       
        placeholder='Ingresa tu Contraseña'
        secureTextEntry={true}
        onChangeText={setkeyword}
        value={keyword}        
        /> 
         <View style={styles.separador2}></View>  
    

         <View style={[styles.separador3,{zIndex:1}]}></View> 

        <View style={styles.btnSuperpuesto}>              
          <View style={styles.btnFondo} />                   
          <TouchableOpacity
            style={styles.touchEncima}
            
          >
            <Text style={styles.btnText}>Recuperar Contraseña</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.btn}>
            <Button title='Iniciar Sesion'
             color='#446967ff'
             onPress={() => mostrarAlerta()}
             />  
        </View>  
        <View style={styles.contInf}></View>   
      </View>
    )
  
}

const styles = StyleSheet.create({
contPrincipal:{

},
  contSup:{ //cuadrito de arriba
    backgroundColor:'#E1F5C4',
    padding:'9%',
    borderRadius:0,
    justifyContent:'flex-start',
    zIndex:0,
  },
contInf: {
  backgroundColor: '#E1F5C4',
  position: 'absolute',
  bottom:20,
  width: '87%',       
  height: '83%',         
  borderRadius: 50,   
  alignSelf: 'center', 
  zIndex:0,
},
    ImageBackground:{
    flex:1,
    backgroundColor:'#EDE574'
},
  separador:{ //separador promedio
    marginTop:85,
},
  separador2:{ //separador promedio
    marginTop:15,
},
separador3: {
  borderBottomColor: 'black', // color de la línea
  borderBottomWidth: 2,       // grosor de la línea
  width: '80%',
  alignSelf: 'center',
  marginTop: 20,
},
  logo:{
    width:150,
    height:150,
    alignSelf:'center',
    marginVertical:-50,
    marginHorizontal:30,
    borderRadius:75,
    overflow:'hidden',
},
titulo:{
   // backgroundColor:'#fff',
    fontSize:50,
    fontStyle:'bold',
    textAlign:'center',
    alignItems:'center',

},
TextTitulo:{
    fontSize:30,
    fontWeight:'bold',
    color:'#517f7dff',
},
TextUsarioTitulo:{
    fontSize:25,
    fontWeight:'bold',
 color:'#517f7dff',
},
titulo2:{
    //backgroundColor:'#fff',
    fontSize:50,
    fontStyle:'bold',
    textAlign:'center',
    alignItems:'center',
},titulo3:{
   // backgroundColor:'#fff',
    fontSize:50,
    fontStyle:'bold',
    textAlign:'center',
    alignItems:'center',
},
TextIngresarTitulo:{
     fontSize:16,
    fontWeight:'bold',
    color:'#517f7dff',   
},
inputText:{
    backgroundColor:'#E1F5C4',
    height:40,
    borderRadius:10,
    padding:10,
    textAlign:'flex-start',
    alignSelf:'center',
    width: '80%',
},
btn:{
  width:200,
  marginVertical:5,
  height:60,
  justifyContent:'center',
  alignItems:'center',
  zIndex:1,
  alignSelf:'center'
},
btnText:{
  color:'#517f7dff',   
  fontSize:16,
  textDecorationLine:'underline', 
  fontWeight:'bold'
},
btnSuperpuesto: {
  position: 'relative',
  width: 200,
  height: 60,
  alignSelf: 'center',
  justifyContent: 'center',
  alignItems: 'center',
  marginVertical: 5,
},
btnFondo: {
  backgroundColor: '#ADD6BC',
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  borderRadius: 10,
},
touchEncima: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 10, 
},
btnText: {
  color: '#517f7dff',
  fontSize: 16,
  textDecorationLine: 'underline',
  fontWeight: 'bold',
},
})