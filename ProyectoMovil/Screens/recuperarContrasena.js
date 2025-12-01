import { Text, StyleSheet, View, TextInput, Alert, Image, ActivityIndicator, Pressable } from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import AuthController from '../controllers/AuthController';

export default function RecuperarContrasena({ navigation }) {
    const [step, setStep] = useState(1); //codigo de verificacion
    const [email, setEmail] = useState('');
    const [codigo, setCodigo] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [confirmarContrasena, setConfirmarContrasena] = useState('');
    const [loading, setLoading] = useState(false);

    const THEME_COLOR = '#136F63'; 

    // solicitar el código
    const solicitarCodigo = async () => {
        setLoading(true);
        const result = await AuthController.requestPasswordReset(email);
        setLoading(false);
        
        if (result.success) {
            Alert.alert(
                "Código Enviado",
                result.message + '\n\nRevisa tu bandeja de entrada y la carpeta de spam.',
                [
                    {
                        text: "Aceptar",
                        onPress: () => {
                            setStep(2); 
                            // se muestra el código en la consola 
                            if (result.debugCode) {
                                console.log('CÓDIGO DE VERIFICACIÓN (DEV):', result.debugCode);
                                Alert.alert('DEBUG', `Código: ${result.debugCode}\n(Solo visible en desarrollo)`);
                            }
                        }
                    }
                ]
            );
        } else {
            Alert.alert("Error", result.error || "Error al enviar el código");
        }
    };

    // verificar código y cambiar contraseña
    const verificarYCambiar = async () => {
        setLoading(true);
        const result = await AuthController.resetPasswordWithCode(
            email, 
            codigo, 
            contrasena, 
            confirmarContrasena
        );
        setLoading(false);
        
        if (result.success) {
            Alert.alert(
                "Éxito",
                result.message || "Contraseña actualizada exitosamente",
                [
                    {
                        text: "Aceptar",
                        onPress: () => {
                            // limpiar formulario
                            setEmail('');
                            setCodigo('');
                            setContrasena('');
                            setConfirmarContrasena('');
                            setStep(1);
                            navigation.navigate('IniciarSeScreen');
                        }
                    }
                ]
            );
        } else {
            Alert.alert("Error", result.error || "Error al actualizar la contraseña");
        }
    };

    const volverAPaso1 = () => {
        setCodigo('');
        setContrasena('');
        setConfirmarContrasena('');
        setStep(1);
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
                        <Text style={styles.subtitulo}>
                            {step === 1 ? 'Paso 1: Solicitar código' : 'Paso 2: Verificar código'}
                        </Text>

                        <View style={styles.separador2}></View>

                        <View style={styles.formContainer}> 
                            {step === 1 ? (                            
                                <>
                                    <Text style={styles.texto}>Correo Electrónico</Text>
                                    <TextInput
                                        style={styles.inputs}
                                        placeholder="correo@ejemplo.com"
                                        onChangeText={setEmail}
                                        value={email}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
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
                                            onPress={solicitarCodigo}
                                        >
                                            <Text style={styles.btnText}>ENVIAR CÓDIGO</Text>
                                        </Pressable>
                                    )}
                                </>
                            ) : (
                                //verificar código y cambiar contraseña
                                <>
                                    <Text style={styles.texto}>Correo Electrónico</Text>
                                    <TextInput
                                        style={[styles.inputs, styles.inputDisabled]}
                                        value={email}
                                        editable={false}
                                    />

                                    <Text style={styles.texto}>Código de Verificación</Text>
                                    <TextInput
                                        style={styles.inputs}
                                        placeholder="000000"
                                        onChangeText={setCodigo}
                                        value={codigo}
                                        keyboardType="number-pad"
                                        maxLength={6}
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
                                        <>
                                            <Pressable 
                                                style={({pressed}) => [
                                                    styles.btnPrimary, 
                                                    { backgroundColor: THEME_COLOR, opacity: pressed ? 0.8 : 1 }
                                                ]}
                                                onPress={verificarYCambiar}
                                            >
                                                <Text style={styles.btnText}>CAMBIAR CONTRASEÑA</Text>
                                            </Pressable>

                                            <Pressable 
                                                style={({pressed}) => [
                                                    styles.btnSecondary, 
                                                    { opacity: pressed ? 0.8 : 1 }
                                                ]}
                                                onPress={volverAPaso1}
                                            >
                                                <Text style={styles.btnSecondaryText}>Volver a enviar código</Text>
                                            </Pressable>
                                        </>
                                    )}
                                </>
                            )}
                        </View>
                    </View>
                </View>
            );
}

const styles = StyleSheet.create({
    separador: { 
    marginTop: 60 
    },
    separador2: { 
    marginTop: 10 
    },
    separador3: { 
    marginTop: 20 
    },

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
    inputDisabled: {
        backgroundColor: '#f0f0f0',
        color: '#666',
    },
    titulo: {
        color: '#000000',
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    subtitulo: {
        color: '#666',
        fontSize: 14,
        marginTop: 5,
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
        width: 220,
        paddingVertical: 15,
        borderRadius: 17,
        alignItems: 'center',
        marginTop: 20,
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
    },
    btnSecondary: {
        marginTop: 15,
        paddingVertical: 10,
    },
    btnSecondaryText: {
        color: '#136F63',
        fontSize: 14,
        textDecorationLine: 'underline',
    }
});