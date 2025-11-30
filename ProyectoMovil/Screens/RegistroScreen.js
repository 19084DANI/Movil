import {Text, StyleSheet, View, TextInput, Button, Image, Alert} from 'react-native';
import { useContext, useState } from 'react';
import { AuthContext } from '../data/AuthContext';

export default function RegistroScreen({ navigation }){
    const { signUp, isLoading } = useContext(AuthContext);
    const [nombre, setNombre] = useState('');
    const [correo, setCorreo] = useState('');
    const [telefono, setTelefono] = useState('');
    const [contrasena, setContrasena] = useState('');

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
        <View style={{flex:1, backgroundColor:'#F5E6D3'}}>
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
          <Button title={isLoading ? 'Creando...' : 'Crear Cuenta'} color='#000000' onPress={crearCuenta} disabled={isLoading} />
        </View>

        <View style={{ marginTop: 15 }}>
            <Button title='¿Ya tienes una cuenta? Inicia Sesión' color='#000000' onPress={() => navigation.navigate('IniciarSeScreen')} />
        </View>
        </View>
        </View>
    );
}
const styles= StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#F5E6D3',
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
        borderColor: '#001F3F'
    },
    titulo:{
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#001F3F',
    },
    input:{
        width: '100%',
        padding: 10,
        borderRadius: 20,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#001F3F',
        backgroundColor: '#FFFFFF'
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
backgroundColor: '#001F3F',
padding: 10,
borderRadius:10,
marginBottom:0,
width: '100%',
height: '10%',

},

});