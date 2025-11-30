import { Text, StyleSheet, View ,Image,TextInput,Alert,Button,TouchableOpacity,Switch, ActivityIndicator, Pressable} from 'react-native'
import {useState} from 'react'
import { Ionicons } from '@expo/vector-icons';
import AuthController from '../controllers/AuthController';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function IniciarSeScreen ({ navigation }){
    const[usuario,setusuario]= useState('');
    const[keyword,setkeyword]= useState('');
    const[loading, setLoading] = useState(false);

    const mostrarAlerta= async ()=>{
        setLoading(true);
        
        const result = await AuthController.login(usuario, keyword);
        
        setLoading(false);

        if (result.success) {
          // Guardar datos del usuario en AsyncStorage
          if (result.user) {
            const userData = {
              id: result.user.id,
              nombre: result.user.nombre,
              correo: result.user.correo,
              telefono: result.user.telefono
            };
            await AsyncStorage.setItem('currentUser', JSON.stringify(userData));
            console.log('Usuario guardado en AsyncStorage:', userData);
          }
        Alert.alert("Éxito", result.message || "Inicio de sesión exitoso",[{text: "Aceptar",
            onPress: () => {                            
              setusuario('');
              setkeyword('');
              navigation.navigate('Menu');
             }
             }]);
        } else {
            Alert.alert("Error", result.error || "Error al iniciar sesión");
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
            <Text style={styles.TextUsarioTitulo} >Usuario</Text>              
          </View>    
          <View style={styles.separador2}></View>     
            <View style={[styles.titulo3,{zIndex:1}]}>
            <Text style={styles.TextIngresarTitulo} >Ingrese su Usuario y Contraseña</Text>              
          </View>  
          <View style={styles.separador}></View>   

          <TextInput style={[styles.inputText,{zIndex:1}]}       
          placeholder='Ingresa tu Correo'
          onChangeText={setusuario}
          value={usuario}
          keyboardType='email-address'
          autoCapitalize='none'
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
      

          <View style={[styles.separador5,{zIndex:1}]}></View> 

          <View style={styles.btn}>              
              <Pressable 
              onPress={() => navigation.navigate('RecuperarContrasena')}
              style={styles.botonOlvidar}              
              >
                <Text style={styles.textoOlvidar}>Olvide mi contraseña</Text>
              </Pressable>
                            
          </View>
          <View style={styles.separador4}></View>  
          <View style={styles.btn}>
                {loading ? (
                  <ActivityIndicator size="large" color="#23555fa0" />
                ) : (
                  <Pressable 
                   style={styles.botones}
                   onPress={mostrarAlerta}
                   >
                    <Text style={styles.textoBoton}>INICIAR SESIÓN</Text>
                   </Pressable>
                )}
          </View>
          <View style={styles.separador4}></View>  
          <View style={styles.btn}>
                <Pressable 
                 style={styles.botones}
                onPress={()=> navigation.navigate('RegistroScreen')}
                >
              <Text style={styles.textoBoton}>REGISTRARSE</Text>
             </Pressable> 
          </View>  
          <View style={styles.contInf}></View>   
        </View>
      );
}

const styles = StyleSheet.create({
contPrincipal:{

},
  contSup:{ //cuadrito de arriba
    backgroundColor:'#EEF5DB',
    padding:'9%',
    borderRadius:0,
    justifyContent:'flex-start',
    zIndex:0,
  },
contInf: {
  backgroundColor: '#EEF5DB',
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
    backgroundColor:'#93A392'
},
  separador:{ //separador promedio
    marginTop:85,
},
  separador2:{ //separador promedio
    marginTop:15,
},
separador3: {
  borderBottomColor: 'black', 
  borderBottomWidth: 2,      
  width: '80%',
  alignSelf: 'center',
  marginTop: 5,
}, 
separador5: {
  borderBottomColor: 'black', 
  borderBottomWidth: 2,      
  width: '80%',
  alignSelf: 'center',
  marginTop:-10,
}, 
 separador4:{ 
    marginTop:50,
},
  logo:{
    width:150,
    height:150,
    alignSelf:'center',
    marginVertical:-50,
    marginHorizontal:30,
    borderRadius:75,
    overflow:'hidden',
    borderColor:'#113c42ff',
    borderWidth:5,
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
    backgroundColor:'#dde2ce02',
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
botonOlvidar:{
  borderBottomColor:'#180f3fff',
  borderBottomWidth:1,
  marginBottom:15,
  marginTop:80,
},
textoOlvidar:{
  fontSize:15,
  fontWeight:'550',
  color:'#1a3e91ff',
  shadowColor:'#160d6fff',
  shadowOffset:{
    height:1,
    width:0,
  }
},
  botones:{
    width:160,
    height:40,
    backgroundColor:'#23555fa0',
    borderRadius:15,
    alignItems:'center',
    justifyContent:'center',
    shadowColor:'#a9a9a9ff',
    marginBottom:70,
    shadowOffset:{
      height:4,
      width:0,
    }
  },
  textoBoton:{
    fontSize:15,
    fontWeight:'550',
    color:'white',
  }
})