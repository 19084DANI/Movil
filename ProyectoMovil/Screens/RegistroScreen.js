import {Text, StyleSheet, View, TextInput, Button, Image, Alert,Pressable} from 'react-native';
import { useContext, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
export default function RegistroScreen({ navigation }){
    const { signUp, isLoading } = useContext(AuthContext);
    const [nombre, setNombre] = useState('');
    const [correo, setCorreo] = useState('');
    const [telefono, setTelefono] = useState('');
    const [contrasena, setContrasena] = useState('');
    const THEME_COLOR = '#136F63'; 


    // Validaciones //
    
    const validarCorreo = (email) =>{
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);  
    };

    const crearCuenta = async () => {
        if (!nombre.trim() || !correo.trim() || !telefono.trim() || !contrasena.trim()){
            Alert.alert("Error", "Todos los campos son obligatorios, porfavor complete todos los campos.");
            return;
        }
        if (!validarCorreo(correo.trim())){
            Alert.alert("Error", "El correo ingresado no es valido, porfavor ingresa un correo valido.");
            return;
        }
        if (!/^\d+$/.test(telefono) || telefono.length < 10 ){
            Alert.alert("Error", "El telefono ingresado no es valido, porfavor ingresa un telefono valido.");
            return;
        }
        if (contrasena.length < 6){
            Alert.alert("Error", "La contraseña ingresada no es valida, porfavor ingrese una contraseña valida");
            return;
        }

        try {
            const result = await signUp(nombre, correo, telefono, contrasena);
            if (result.success) {
                Alert.alert("Éxito", `Cuenta creada para: ${nombre}\nCorreo: ${correo}`, [
                    {
                        text: "Aceptar",
                        onPress: () => {
                            // Navegar a la pantalla de inicio de sesión después del registro
                            navigation.navigate('IniciarSeScreen');
                        }
                    }
                ]);
            } else {
                Alert.alert("Error", result.message || "Error al crear la cuenta");
            }
        } catch (error) {
            Alert.alert("Error", "Error al crear la cuenta: " + error.message);
        }
    };

    return (
        <View style={{flex:1,
         backgroundColor:'#bab8acff',
         alignItems:'center',
         justifyContent:'center',
         }}>
         <View style={styles.encabezado}>  
            <Pressable 
            style={[styles.btnBack, { backgroundColor: THEME_COLOR }]} 
            onPress={() => navigation.goBack()}
            >
            <Ionicons name="arrow-back" size={24} color="white" />
            </Pressable>
            </View>

        <View style={styles.container}>
            <Image
               source={require('../assets/Logo.jpeg')}
               style={styles.logo}
            />
        <Text style={styles.titulo}>¡Regístrate!</Text>
        <Text style={styles.tituloDescrip}>¡Llena los campos Para Comezar!</Text>
         <Text style={styles.textoInputs}>Ingrese el Nombre</Text>
        <TextInput
           style={styles.input}
           placeholder='Nombre'
           value={nombre}
           onChangeText={setNombre}
        />
        <Text style={styles.textoInputs}>Ingrese Su Correo</Text>
       <TextInput
           style={styles.input}
           placeholder='Correo'
           value={correo}
           onChangeText={setCorreo}
           keyboardType='email-address'
        />
        <Text style={styles.textoInputs}>Ingrese Su Teléfono</Text>
         <TextInput
           style={styles.input}
           placeholder='Teléfono'
           value={telefono}
           onChangeText={setTelefono}
           keyboardType='phone-pad'
        />
        <Text style={styles.textoInputs}>Ingrese Su Contraseña</Text>
         <TextInput
           style={styles.input}
           placeholder='Contraseña'
           value={contrasena}
           onChangeText={setContrasena}
           secureTextEntry
        />

        <View style={{
         width: '100%', 
         marginTop:10,
         alignItems:'center',
         justifyContent:'center'         

        }}>
            <Pressable 
             style={styles.botones}
            title={isLoading ? 'Creando...' : 'Crear Cuenta'} 
             onPress={crearCuenta}
              disabled={isLoading}
            >
            <Text style={styles.textoBoton}>CREAR CUENTA</Text>
             </Pressable>         
         
        </View>

        <View style={{ 
         marginTop:-15,
         alignItems:'center',
         justifyContent:'center'         

            }}>
   

            <Pressable 
             style={styles.botonesIniciar}
            onPress={() => navigation.navigate('IniciarSeScreen')}
              disabled={isLoading}
            >
            <Text style={styles.textoBoton}>¿Ya tienes una cuenta? Inicia Sesión</Text>
             </Pressable>                         
        </View>
        </View>
        </View>
    );
}
const styles= StyleSheet.create({
    container:{
        width:'90%',
        height:'80%',
        borderWidth:3,
        borderColor:'#2a4f51ff',
        borderRadius:20,
        backgroundColor: '#ebecdb',
        alignItems: 'center',
        marginBottom:50,
        justifyContent: 'center',
        paddingHorizontal:20,
    },
    logo:{
        width: 140,
        height: 140,
        borderRadius: 80,
        borderWidth: 3,
        borderColor: '#072e2cff',
        overflow:'hidden',
        position:'absolute',
        top:-80,
    },
    titulo:{
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
        marginTop:80,
        color: '#001F3F',
    },
    tituloDescrip:{
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 40,
        color: '#001F3F',
    },
    input:{
        width: '95%',
        padding: 12,
        borderRadius: 20,
        marginBottom: 25,
        marginTop:5,
        borderWidth: 1,
        borderColor: '#001F3F',
        backgroundColor: '#FFFFFF',
        fontWeight:'650',
    },

    utransaccion:{
    justifyContent:'center',
    fontSize: 24,
    fontWeight: 'bold'

    },

encabezado:{
    justifyContent:'space-between',
    flexDirection: 'row',
    alignItems: "center",
    backgroundColor: '#2a4f51ff',
    marginBottom:25,
    padding: 40,
    width: '100%',
    height: '12%',


},
contPrincipral:{
    height:15,
    width:150,
    backgroundColor:'#ffffffff',
    borderRadius:15,
    borderColor:'#000',
    borderWidth:3,
},
textoInputs:{
    fontSize:16.5,
    fontWeight:'600',
    color:'#1c474aff',
},
    btnBack: {
        width: 45,
        height: 45,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        overflow:'hidden',
        position:'absolute',
        top:40,
        left:15,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    botones:{
        width:160,
        height:40,
        backgroundColor:'#23555fa0',
        borderRadius:15,
        alignItems:'center',
        justifyContent:'center',
        shadowColor:'#a9a9a9ff',
        marginBottom:50,
        shadowOffset:{
        height:4,
        width:0,
        }
    },
    botonesIniciar:{
        width:250,
        height:40,
        backgroundColor:'#23555fa0',
        borderRadius:15,
        alignItems:'center',
        justifyContent:'center',
        shadowColor:'#a9a9a9ff',
        marginBottom:50,
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

});