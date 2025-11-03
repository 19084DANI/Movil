import {Text, StyleSheet, View, TextInput, Button, Image, Alert} from 'react-native';
import { useActionState, useState } from 'react';

export default function RegistroScreen(){
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
        Alert.alert("Cuenta creada", `Nombre: ${nombre}\nCorreo: ${correo}`);
    };


    
}