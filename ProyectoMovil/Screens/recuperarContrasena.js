import { Text, StyleSheet, View, TextInput, Alert, Button } from 'react-native'
import React, {useState} from 'react'

export default function recuperarContrasena() {
    const [usuario, setUsuario] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [confirmarContrasena, setConfirmarContrasena] = useState('');
    const [email, setEmail] = useState('');
    return (
      <View>
        <View>
            //header
        </View>

        <View> //formulario
            <View>
                <Text>Recuperar Contraseña</Text>
            </View>
            <View>
                <TextInput
                stakeholder="Usuario"
                onChangeText={setUsuario}
                value={usuario}
                />
                <TextInput
                stakeholder="Email"
                onChangeText={setEmail}
                value={email}
                />
                <TextInput
                stakeholder="Nueva contaseña"
                onChangeText={setContrasena}
                value={contrasena}
                secureTextEntry={true}
                />
                <TextInput
                stakeholder="Confirmar nueva contaseña"
                onChangeText={setConfirmarContrasena}
                value={confirmarContrasena}
                secureTextEntry={true}
                />
            </View>
            <View>
                <Button title="Enviar Código de Verificación"/>
            </View>
        </View>
      </View>
    )
}

const styles = StyleSheet.create({});