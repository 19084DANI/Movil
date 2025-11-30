import { Text, StyleSheet, View, TextInput, Alert, Image, ActivityIndicator, Pressable } from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import AuthController from '../controllers/AuthController';

export default function RecuperarContrasena({ navigation }) {
    const [usuario, setUsuario] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [confirmarContrasena, setConfirmarContrasena] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const THEME_COLOR = '#136F63'; 

    const mostrarAlerta = async () => {
        setLoading(true);
        const result = await AuthController.recoverPassword(email, contrasena, confirmarContrasena);
        setLoading(false);
        if (result.success) {
            Alert.alert(
                "Éxito",
                result.message || "Contraseña actualizada exitosamente",
                [
                    {
                        text: "Aceptar",
                        onPress: () => {
                            setUsuario('');
                            setEmail('');
                            setContrasena('');
                            setConfirmarContrasena('');
                            navigation.navigate('IniciarSeScreen');
                        }
                    }
                ]
            );
        } else {
            Alert.alert("Error", result.error || "Error al actualizar la contraseña");
        }
    };

    return (
                <View style={styles.ImageBackground}>
                    
                    <View style={styles.contSup}>
                        <Pressable 
                            style={[styles.btnBack, { backgroundColor: THEME_COLOR }]} 
                            onPress={() => navigation.goBack()}
                        >
                            <Ionicons name="arrow-back" size={24} color="white" />
                        </Pressable>
                    </View>

                    <Image
                        source={require('../assets/Logo.jpeg')}
                        style={[styles.logo, { zIndex: 1 }]}
                        resizeMode='cover'
                    />

                    <View style={styles.contInf}>
                        <View style={styles.separador}></View>
                        <Text style={styles.titulo}>Recuperar Contraseña</Text>

                        <View style={styles.separador2}></View>

                        <View style={styles.formContainer}> 
                            <Text style={styles.texto}>Usuario</Text>
                            <TextInput
                                style={styles.inputs}
                                placeholder="Usuario"
                                onChangeText={setUsuario}
                                value={usuario}
                            />

                            <Text style={styles.texto}>Email</Text>
                            <TextInput
                                style={styles.inputs}
                                placeholder="Email"
                                onChangeText={setEmail}
                                value={email}
                            />

                            <Text style={styles.texto}>Nueva Contraseña</Text>
                            <TextInput
                                style={styles.inputs}
                                placeholder="Nueva contraseña"
                                onChangeText={setContrasena}
                                value={contrasena}
                                secureTextEntry={true}
                            />

                            <Text style={styles.texto}>Confirmar Nueva Contraseña</Text>
                            <TextInput
                                style={styles.inputs}
                                placeholder="Confirmar contraseña"
                                onChangeText={setConfirmarContrasena}
                                value={confirmarContrasena}
                                secureTextEntry={true}
                            />

                            <View style={styles.separador3}></View>
                            
                            {loading ? (
                                <ActivityIndicator size="large" color={THEME_COLOR} />
                            ) : (
                                <Pressable 
                                    style={({pressed}) => [
                                        styles.btnPrimary, 
                                        { backgroundColor: THEME_COLOR, opacity: pressed ? 0.8 : 1 }
                                    ]}
                                    onPress={mostrarAlerta}
                                >
                                    <Text style={styles.btnText}>CAMBIAR CONTRASEÑA</Text>
                                </Pressable>
                            )}
                        </View>
                    </View>
                </View>
            );
}

const styles = StyleSheet.create({
    separador: { marginTop: 60 },
    separador2: { marginTop: 10 },
    separador3: { marginTop: 20 },
    
    inputs: {
        width: 250,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 15,
        backgroundColor: '#ffffffff',
        marginBottom: 25,
        textAlign: 'center',
    },
    titulo: {
        color: '#000000',
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    formContainer: {
        width: '100%',
        alignItems: 'center',
    },
    texto: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 5,
        alignSelf: 'center',
    },
    contSup: {
        backgroundColor: '#2a4f51ff',
        height: 100,
        width: '100%',
        justifyContent: 'flex-start',
        paddingTop: 50,
        paddingLeft: 20,
    },
    ImageBackground: {
        flex: 1,
        backgroundColor: '#bab8acff',
    },
    logo: {
        width: 120,
        height: 120,
        alignSelf: 'center',
        top: 80,
        borderRadius: 60,
        zIndex: 1,
        borderColor: '#07303cff',
        borderWidth: 3,
        position: 'absolute',
    },
    contInf: {
        backgroundColor: '#ebecdb',
        position: 'absolute',
        bottom: 50,
        borderRadius:50,
        width: '90%',
        height: '75%',
        marginLeft:20,
        borderWidth:3,
        borderColor:'#1d3540ff',
        alignItems: 'center',
        paddingVertical: 20,
        zIndex: 0,
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
    btnPrimary: {
        width: 200,
        paddingVertical: 15,
        borderRadius: 17,
        alignItems: 'center',
        marginTop: 50,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    btnText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
        letterSpacing:.5,
    }
});