import {Text, StyleSheet, View, TextInput, Button, Image, Alert} from 'react-native';
import { useActionState, useState } from 'react';

import IniciarSeScreen from './IniciarSeScreen';
export default function RegistroScreen(){
    const [screen, setScreen]=useState('default');
    const [nombre, setNombre] = useState('');
    const [correo, setCorreo] = useState('');
    const [telefono, setTelefono] = useState('');
    const [contrasena, setContrasena] = useState('');

    // Validaciones //
    
    const validarCorreo = (email) =>{
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);  
    };

    const crearCuenta = () => {
        if (!nombre.trim() || !correo.trim() || !telefono.trim() || !contrasena.trim()){
            Alert.alert("Error", "Todos los campos son obligatorios, porfavor complete todos los campos.");
            alert("ERROR, Todos los campos son obligatorios.");
            return;
        }
        if (!validarCorreo(correo.trim())){
            Alert.alert("Error", "El correo ingresado no es valido, porfavor ingresa un correo valido.");
            alert("ERROR, Ingresa un correo valido");
            return;
        }
        if (!/^\d+$/.test(telefono) || telefono.length < 10 ){
            Alert.alert("Error", "El telefono ingresado no es valido, porfavor ingresa un telefono valido.");
            alert("ERROR, Ingresa un telefono valido.");
            return;
        }
        if (contrasena.length < 6){
            Alert.alert("Error", "La contraseña ingresada no es valida, porfavor ingrese una contraseña valida");
            alert("ERROR, Ingresa una contraseña valida.");
            return;
        }
        Alert.alert("Cuenta creada", `Nombre: ${nombre}\nCorreo: ${correo}`);
        alert("Registro Exitoso! \nCuenta creada"+
            "\n Datos ingresados: " +
            `Nombre: ${nombre}\nCorreo: ${correo}\n`
            

        );
        
        
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
          <Button title='Crear Cuenta' color='#5F9EA0' onPress={crearCuenta} />
        </View>

        <View style={{ marginTop: 15 }}>
            <Button title='¿Ya tienes una cuenta? Inicia Sesión' color='#2E9B57' onPress={irIniciarSesion} />
        </View>
        </View>
    );
    }
}
const styles= StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#F0E68C',
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
        borderColor: '#FFD700'
    },
    titulo:{
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#2E8B57',
    },
    input:{
        width: '100%',
        padding: 10,
        borderRadius: 20,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#A9A9A9',
        backgroundColor: '#E0F2C6'
    },

});