import { Text, StyleSheet, View, TextInput, Alert, Button } from 'react-native'
import React, {useState} from 'react'

export default function recuperarContrasena() {
    const [usuario, setUsuario] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [confirmarContrasena, setConfirmarContrasena] = useState('');
    const [email, setEmail] = useState('');
    const mostrarAlerta = () => {
        if (usuario.trim() === ''){
            Alert.alert('Nombre no puede estar vacio');
            alert('Nombre no puede estar vacio');
        }else if (email.trim() === ''){
            Alert.alert('Email no puede estar vacio');
            alert('Email no puede estar vacio');
        }else if (!email.includes('@') || !email.includes('.')){
            Alert.alert('Email no es valido');
            alert('Email no es valido');
        }else if (contrasena.trim() === ''){
            Alert.alert('Contraseña no puede estar vacio');
            alert('Contraseña no puede estar vacio');
        }else if (confirmarContrasena.trim() === ''){
            Alert.alert('Las contraseñas no coinciden');
            alert('Las contraseñas no coinciden');
        }else if (contrasena !== confirmarContrasena){
            Alert.alert('Las contraseñas no coinciden');
            alert('Las contraseñas no coinciden');
        }else{
            Alert.alert('Contraseña cambiada con exito');
            alert('Contraseña cambiada con exito');
        }
    };
    return (
      <View style={styles.container}>
        <View>

        </View>

        <View style={styles.formContainer}>
            <View>
                <Text style={styles.titulo}>Recuperar Contraseña</Text>
            </View>
            <View>
                <Text style={styles.texto}>Usuario</Text>
                <TextInput
                style={styles.inputs}
                stakeholder="Usuario"
                onChangeText={setUsuario}
                value={usuario}
                />
                <Text style={styles.texto}>Email</Text>
                <TextInput
                style={styles.inputs}
                stakeholder="Email"
                onChangeText={setEmail}
                value={email}
                />
                <Text style={styles.texto}>Nueva Contraseña</Text>
                <TextInput
                style={styles.inputs}
                stakeholder="Nueva contaseña"
                onChangeText={setContrasena}
                value={contrasena}
                secureTextEntry={true}
                />
                <Text style={styles.texto}>Confirmar Nueva Contraseña</Text>
                <TextInput
                style={styles.inputs}
                stakeholder="Confirmar nueva contaseña"
                onChangeText={setConfirmarContrasena}
                value={confirmarContrasena}
                secureTextEntry={true}
                />
            </View>
            <View>
                <Button title="Iniciar Sesión" onPress={mostrarAlerta} style={styles.boton} color='#0b7a89ff'/>
            </View>
        </View>
      </View>
    )
}

const styles = StyleSheet.create({
    inputs:{
        width:'50%',
        borderColor:'gray',
        borderWidth:3,
        borderRadius:5,
        padding:5,
        backgroundColor:'#ffffff',
        marginBottom:10,
    },
    titulo:{
        color:'#000000ff',
        fontSize:20,
        fontWeight:'bold',
        marginBottom:20,
    },
    container:{
        backgroundColor:'#efe851ff',
        flex:1,
        alignItems:'center',
        justifyContent:'center',
    },
    formContainer:{
        width:'65%',
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#f4eb9eff',
        borderRadius:8,
    },
    texto:{
        fontSize:14,
        fontWeight:'bold',
    },
});