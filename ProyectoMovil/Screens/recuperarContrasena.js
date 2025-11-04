import { Text, StyleSheet, View, TextInput, Alert, Button, Image } from 'react-native'
import React, {useState} from 'react'

import HomeScreen from './HomeScreen';
export default function RecuperarContrasena() {
    const [screen, setScreen]=useState('default');
    const [usuario, setUsuario] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [confirmarContrasena, setConfirmarContrasena] = useState('');
    const [email, setEmail] = useState('');
    const mostrarAlerta = () => {
        if (usuario === '' && email === '' && contrasena === '' && confirmarContrasena === ''){
            Alert.alert('Todos los campos estan vacios');
            alert('Todos los campos estan vacios');
        }else if (usuario.trim() === ''){
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
            setScreen('Iniciar sesion');
        }
    };
    switch(screen){
         
         case 'Iniciar sesion':
          return<HomeScreen/>
        default:
    return (

      <View  style={styles.ImageBackground}>
       <View style={styles.contSup}></View>   
           <Image 
          source={require('../assets/Logo.jpeg')}
          style={[styles.logo,{zIndex:1}]}
          resizeMode='cover'
          />      

        <View style={styles.header}>

        </View>


        <View style={styles.contInf}>
             <View style={styles.separador}></View>         
                <Text style={styles.titulo}>Recuperar Contraseña</Text>

               <View style={styles.separador2}></View>  

            <View tyle={styles.form}>
                <Text style={styles.texto}>Usuario</Text>
                <TextInput
                style={styles.inputs}
                stakeholder="Usuario"
                onChangeText={setUsuario}
                value={usuario}
                />

 
              <View style={styles.separador2}></View>  
                <Text style={styles.texto}>Email</Text>
                <TextInput
                style={styles.inputs}
                stakeholder="Email"
                onChangeText={setEmail}
                value={email}
                />

              <View style={styles.separador2}></View>                
                <Text style={styles.texto}>Nueva Contraseña</Text>
                <TextInput
                style={styles.inputs}
                stakeholder="Nueva contaseña"
                onChangeText={setContrasena}
                value={contrasena}
                secureTextEntry={true}
                />

              <View style={styles.separador2}></View>                 
                <Text style={styles.texto}>Confirmar Nueva Contraseña</Text>
                <TextInput
                style={styles.inputs}
                stakeholder="Confirmar nueva contaseña"
                onChangeText={setConfirmarContrasena}
                value={confirmarContrasena}
                secureTextEntry={true}
                />

                <View style={styles.botonContainer}></View>   
             <View style={styles.separador3}></View>                  
                <Button title="Iniciar Sesión" onPress={mostrarAlerta} color='#0b7a89ff'/>                            
                </View>
             <View>               
        </View>
    </View>         
</View>
    )
    }
}

const styles = StyleSheet.create({
   separador:{ //separador promedio
    marginTop:90,
},   
  separador2:{ //separador promedio
    marginTop:15,
},
   separador3:{ //separador promedio
    marginTop:50,
}, 
    inputs:{
    width:200,            
    borderColor:'gray',
    borderWidth:2,           
    borderRadius:20,
    paddingVertical:8,
    paddingHorizontal:15,
    backgroundColor:'#ffffff',
    marginBottom:15,
    textAlign:'center',   
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
        width:'80%',
        height:'75%',
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#c2fc87ff',
        borderRadius:20,
    },
    texto:{
        fontSize:14,
        fontWeight:'bold',
    },
    header:{
      // backgroundColor:'#c2fc87ff',
        width:'100%',
        height:'10%',
        alignItems:'center',
        justifyContent:'center',
        borderRadius:30,
        marginBottom:15,
    },
    contSup:{ //cuadrito de arriba
    backgroundColor:'#E1F5C4',
    padding:'9%',
    borderRadius:0,
    justifyContent:'flex-start',
  },
    ImageBackground:{
    flex:1,
    backgroundColor:'#EDE574'
  },
    logo:{
    width:150,
    height:150,
    alignSelf:'center',
    marginVertical:20,
    marginHorizontal:30,
    borderRadius:75,
    overflow:'hidden',
    zIndex:1,
    position:'absolute',
  },
contInf: {
  backgroundColor: '#E1F5C4',
  position: 'absolute',
  bottom:20,
  width: '87%',       
  height: '83%',         
  borderRadius: 50,   
  alignSelf: 'center', 
  alignItems:'center',
  paddingVertical:20,
  zIndex:0,
},
    
});