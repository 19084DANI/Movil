import { Text, StyleSheet, View, TextInput, Alert, Image, ActivityIndicator, Pressable } from 'react-native';
import React, { useState } from 'react';

// Asegúrate de que las rutas sean correctas
import HomeScreen from './HomeScreen';
import IniciarSeScreen from './IniciarSeScreen';
import { Ionicons } from '@expo/vector-icons';
import AuthController from '../controllers/AuthController';

export default function RecuperarContrasena() {
    const [screen, setScreen] = useState('default');
    const [usuario, setUsuario] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [confirmarContrasena, setConfirmarContrasena] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    // Color elegido por psicología del color (Seguridad y Dinero)
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
                            setScreen('Iniciar sesion');
                        }
                    }
                ]
            );
        } else {
            Alert.alert("Error", result.error || "Error al actualizar la contraseña");
        }
    };

    // Lógica de navegación manual
    switch (screen) {
        case 'Iniciar sesion':
            return <IniciarSeScreen />;
        
        case 'HomeScreen': // Agregado para el botón de regreso
            return <HomeScreen />;

        default:
            return (
                <View style={styles.ImageBackground}>
                    
                    {/* Contenedor Superior con botón de regreso */}
                    <View style={styles.contSup}>
                        <Pressable 
                            style={[styles.btnBack, { backgroundColor: THEME_COLOR }]} 
                            onPress={() => setScreen('HomeScreen')}
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

                        {/* Corregido: 'tyle' a 'style' */}
                        <View style={styles.formContainer}> 
                            <Text style={styles.texto}>Usuario</Text>
                            <TextInput
                                style={styles.inputs}
                                placeholder="Usuario" // Corregido: 'stakeholder' a 'placeholder'
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
                            
                            {/* Nuevo Botón con Pressable */}
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
}

const styles = StyleSheet.create({
    separador: { marginTop: 60 }, // Ajustado un poco para dar espacio
    separador2: { marginTop: 10 },
    separador3: { marginTop: 20 },
    
    inputs: {
        width: 250, // Aumenté un poco el ancho para que se vea mejor
        borderColor: 'gray',
        borderWidth: 1, // Borde más sutil
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 15,
        backgroundColor: '#ffffff',
        marginBottom: 10,
        textAlign: 'center',
    },
    titulo: {
        color: '#000000',
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    formContainer: { // Estilos para el contenedor interno del formulario
        width: '100%',
        alignItems: 'center',
    },
    texto: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 5,
        alignSelf: 'center', // Centrar etiquetas
    },
    contSup: {
        backgroundColor: '#ffffff',
        height: '20%', // Aumentado para dar espacio al botón y logo
        width: '100%',
        justifyContent: 'flex-start',
        paddingTop: 50, // Para bajarlo de la barra de estado
        paddingLeft: 20,
    },
    ImageBackground: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    logo: {
        width: 120, // Logo un poco más pequeño para balancear
        height: 120,
        alignSelf: 'center',
        top: 80, // Posición absoluta ajustada
        borderRadius: 60,
        zIndex: 2, // Mayor zIndex para estar encima de todo
        borderColor: '#000',
        borderWidth: 1,
        position: 'absolute',
    },
    contInf: {
        backgroundColor: '#ebecdb',
        position: 'absolute',
        bottom: 0,
        width: '100%', // Ocupa todo el ancho pero con borde redondeado arriba
        height: '75%',
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        alignItems: 'center',
        paddingVertical: 20,
        zIndex: 0,
    },
    // --- NUEVOS ESTILOS PARA LOS BOTONES ---
    btnBack: {
        width: 45,
        height: 45,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5, // Sombra en Android
        shadowColor: '#000', // Sombra en iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    btnPrimary: {
        width: 250,
        paddingVertical: 15,
        borderRadius: 30,
        alignItems: 'center',
        marginTop: 10,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    btnText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 1,
    }
});