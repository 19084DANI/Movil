import {Text, StyleSheet, View, TextInput, Button, Image, Alert, ActivityIndicator} from 'react-native';
import { useState } from 'react';

import IniciarSeScreen from './IniciarSeScreen';
import { Ionicons } from  '@expo/vector-icons';
import AuthController from '../controllers/AuthController';

export default function RegistroScreen(){
    const [screen, setScreen]=useState('default');
    const [nombre, setNombre] = useState('');
    const [correo, setCorreo] = useState('');
    const [telefono, setTelefono] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [loading, setLoading] = useState(false);

    const crearCuenta = async () => {
        setLoading(true);
        
        const result = await AuthController.register({
            nombre,
            correo,
            telefono,
            contrasena
        });

        setLoading(false);

        if (result.success) {
            Alert.alert(
                "Éxito",
                result.message || "Cuenta creada exitosamente",
                [
                    {
                        text: "Aceptar",
                        onPress: () => {
                            // Limpiar campos
                            setNombre('');
                            setCorreo('');
                            setTelefono('');
                            setContrasena('');
                            // Ir a iniciar sesión
                            setScreen('Iniciar sesion');
                        }
                    }
                ]
            );
        } else {
            Alert.alert("Error", result.error || "Error al crear la cuenta");
        }
    };

    const irIniciarSesion = () =>{
        Alert.alert("Inicia Sesión");
        setScreen('Iniciar sesion');
    };
    switch(screen){
        case 'Iniciar sesion':
            return<IniciarSeScreen/>
        default:
    return (
        <View style={{flex:1, backgroundColor:'#F0E68C'}}>
         <View style={styles.encabezado}>  
            </View>
        <View style={styles.container}>
            <Image
               source={require('../assets/Logo.jpeg')}
               style={styles.logo}
            />
        <Text style={styles.titulo}>¡Regístrate!</Text>

        <TextInput
           style={styles.input}
           placeholder='Nombre'
           value={nombre}
           onChangeText={setNombre}
        />
       <TextInput
           style={styles.input}
           placeholder='Correo'
           value={correo}
           onChangeText={setCorreo}
           keyboardType='email-address'
        />
         <TextInput
           style={styles.input}
           placeholder='Teléfono'
           value={telefono}
           onChangeText={setTelefono}
           keyboardType='phone-pad'
        />
         <TextInput
           style={styles.input}
           placeholder='Contraseña'
           value={contrasena}
           onChangeText={setContrasena}
           secureTextEntry
        />

        <View style={{width: '100%', marginTop:10}}>
          {loading ? (
            <ActivityIndicator size="large" color="#5b8486ff" />
          ) : (
            <Button title='Crear Cuenta' color='#5b8486ff' onPress={crearCuenta} />
          )}
        </View>

        <View style={{ marginTop: 15 }}>
            <Button title='¿Ya tienes una cuenta? Inicia Sesión' color='#456953ff' onPress={irIniciarSesion} />
        </View>
        </View>
        </View>
    );
    }
}
const styles= StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#93A392',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal:20,
    },
    logo:{
        width: 80,
        height: 80,
        borderRadius: 40,
        marginBottom:20,
        borderWidth: 2,
        borderColor: '#EEF5DB'
    },
    titulo:{
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#3D4939',
    },
    input:{
        width: '100%',
        padding: 10,
        borderRadius: 20,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#A9A9A9',
        backgroundColor: '#EEF5DB'
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
borderColor: '#EEF5DB',
borderWidth:5
},
    encabezado:{
justifyContent:'space-between',
flexDirection: 'row',
alignItems: "center",
backgroundColor: '#EEF5DB',
padding: 10,
borderRadius:10,
marginBottom:0,
width: '100%',
height: '10%',

},

});