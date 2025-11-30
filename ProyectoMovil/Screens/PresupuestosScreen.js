import {View, Text, StyleSheet, ScrollView, TouchableOpacity, ImageBackground, Alert} from "react-native";
import React, { useEffect, useState } from "react";
import HomeScreen from "./HomeScreen";
import NuevoPresupuestoScreen from "./NuevoPresupuestoScreen";
import { Ionicons } from "@expo/vector-icons";
import PresupuestoController from "../controllers/PresupuestoController";

export default function PresupuestosScreen() {
  const [screen, setScreen] = useState("default");
  const [presupuestos, setPresupuestos] = useState([]);
  const [presupuestoGeneral, setPresupuestoGeneral] = useState(15000);
  const [totalUsado, setTotalUsado] = useState(0);

  // Cargar información al iniciar
  const cargarPresupuestos = async () => {
    const lista = await PresupuestoController.obtenerPresupuestos();
    setPresupuestos(lista);

    // Calcular total usado
    const total = lista.reduce((acc, p) => acc + parseFloat(p.monto), 0);
    setTotalUsado(total);
  };
     useEffect(() => {
    cargarPresupuestos();
    PresupuestoController.addListener(cargarPresupuestos);

    return () => {
      PresupuestoController.removeListener(cargarPresupuestos);
    };
  }, []);

  if (screen === "home") return <HomeScreen />;
  if (screen === "nuevo") return <NuevoPresupuestoScreen />;

   return (
    <ImageBackground
      source={require("../assets/fondo1.jpg")}
      resizeMode="cover"
      style={styles.background}
    >
      {/* ENCABEZADO */}
      <View style={styles.encabezado}>
        <TouchableOpacity onPress={() => setScreen("home")}>
          <Text style={styles.tituloHeader}>PRESUPUESTOS</Text>
        </TouchableOpacity>
      </View>

      {/* CONTENIDO */}
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.cardGeneral}>
          <Text style={styles.titulo}>Presupuesto General</Text>

          <Text style={styles.texto}>
            Límite:{" "}
            <Text style={styles.dinero}>${presupuestoGeneral.toLocaleString()}</Text>
          </Text>

          <Text style={styles.texto}>
            Usado:{" "}
            <Text
              style={[
                styles.dinero,
                totalUsado > presupuestoGeneral && { color: "red" }
              ]}
            >
              ${totalUsado.toLocaleString()}
            </Text>
          </Text>

          <Text style={styles.texto}>
            Disponible:{" "}
            <Text
              style={[
                styles.dinero,
                presupuestoGeneral - totalUsado < 0 && { color: "red" }
              ]}
            >
              ${(presupuestoGeneral - totalUsado).toLocaleString()}
            </Text>
          </Text>

          {/* ALERTA SI SE PASA */}
          {totalUsado > presupuestoGeneral && (
            <Text style={styles.alerta}>
              ⚠ Se superó el presupuesto general
            </Text>
          )}
        </View>

        {/* LISTA DE PRESUPUESTOS */}
        <View style={styles.listaContainer}>
          <Text style={styles.tituloSecundario}>Categorías</Text>

          {presupuestos.map((p) => (
            <View key={p.id} style={styles.item}>
              <View>
                <Text style={styles.nombreItem}>{p.nombre_categoria}</Text>
                <Text style={styles.montoItem}>${p.monto}</Text>
              </View>

              <TouchableOpacity
                onPress={() => {
                  Alert.alert(
                    "Eliminar",
                    `¿Eliminar presupuesto de "${p.nombre_categoria}"?`,
                    [
                      { text: "Cancelar", style: "cancel" },
                      {
                        text: "Eliminar",
                        style: "destructive",
                        onPress: async () => {
                          await PresupuestoController.eliminarPresupuesto(p.id);
                          cargarPresupuestos();
                        }
                      }
                    ]
                  );
                }}
              >
                <Ionicons name="trash" size={26} color="red" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* BOTÓN AGREGAR */}
      <TouchableOpacity
        style={styles.botonAgregar}
        onPress={() => setScreen("nuevo")}
      >
        <Ionicons name="add-circle" size={70} color="#4da6ff" />
      </TouchableOpacity>
    </ImageBackground>
  );
}