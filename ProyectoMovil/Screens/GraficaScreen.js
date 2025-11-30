import React, { useEffect, useState } from "react";
import {Text,StyleSheet,View,Image,ScrollView,TouchableOpacity,ActivityIndicator, ImageBackground} from "react-native";
import TransaccionController from "../controllers/TransaccionController";
import PresupuestoController from "../controllers/PresupuestoController";

export default function GraficaScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [transacciones, setTransacciones] = useState([]);
  const [presupTotal, setPresupTotal] = useState(0);

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        await TransaccionController.initialize?.(); 
        await PresupuestoController.init?.(); 

        const t = await TransaccionController.obtenerTransacciones();
        setTransacciones(Array.isArray(t) ? t : []);

        const pres = await PresupuestoController.obtenerTotalPresupuestos();
       
        const totalPres = pres?.data?.total ?? pres?.total ?? 0;
        setPresupTotal(Number(totalPres) || 0);
      } catch (error) {
        console.warn("Error cargando datos para gráficas:", error);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);


  const parseDate = (s) => {
   
    const d = new Date(s);
    if (isNaN(d.getTime())) {
      if (typeof s === "string" && s.includes("-")) {
        const parts = s.split("-");
        if (parts.length >= 3) {
          return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
        }
      }
      return null;
    }
    return d;
  };

  const sumarPorMes = (items) => {
    const map = {};
    items.forEach((it) => {
      const d = parseDate(it.fecha);
      if (!d) return;
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const monto = Number(it.monto) || 0;
      map[key] = (map[key] || 0) + monto;
    });
    return map;
  };

  const groupByCategoria = (items) => {
    const map = {};
    items.forEach((it) => {
      const cat = (it.categoria || "Sin categoría").trim();
      const monto = Number(it.monto) || 0;
      map[cat] = (map[cat] || 0) + monto;
    });
    return map;
  };

  const incomeCategoryKeywords = [
    "salario",
    "salarios",
    "venta",
    "ventas",
    "ingreso",
    "ingresos",
    "otros",
  ];
  const isIncomeCategory = (cat) => {
    if (!cat) return false;
    const c = cat.toString().toLowerCase();
    return incomeCategoryKeywords.some((k) => c.includes(k));
  };


  const meses = sumarPorMes(transacciones);
  const now = new Date();
  const keyActual = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const keyAnterior = `${prev.getFullYear()}-${String(prev.getMonth() + 1).padStart(2, "0")}`;

  const gastoMesActual = Number(meses[keyActual] || 0);
  const gastoMesAnterior = Number(meses[keyAnterior] || 0);

  const gastosPorCat = groupByCategoria(transacciones);

  const ingresosPorCat = {};
  const egresosPorCat = {};
  Object.keys(gastosPorCat).forEach((cat) => {
    const monto = gastosPorCat[cat] || 0;
    if (isIncomeCategory(cat)) {
      ingresosPorCat[cat] = monto;
    } else {
      egresosPorCat[cat] = monto;
    }
  });

  const totalGastosPorCat = Object.values(egresosPorCat).reduce((a, b) => a + b, 0) || 1;
  const totalIngresosPorCat = Object.values(ingresosPorCat).reduce((a, b) => a + b, 0) || 1;
  //barritas de la grafica
  function BarRow({ label, value, total, color }) {
    const pct = Math.max(3, Math.round((value / total) * 100));
    return (
	
      <View style={styles.row} key={label}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.barContainer}>
          <View style={[styles.bar, { width: `${pct}%`, backgroundColor: color }]} />
        </View>
        <Text style={styles.value}>${Math.round(value)}</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={[styles.center, { flex: 1 }]}>
        <ActivityIndicator size="large" color="#045C8C" />
      </View>
    );
  }

  return (
		<ImageBackground
			  source={require('../assets/fondo2.jpg')}
			  resizeMode='cover'
			  style={styles.backgrounds}>
		
    <ScrollView contentContainerStyle={styles.Container}>
    

      <View style={styles.card}>
        <Text style={styles.title}>Comparación presupuesto vs gastos (mes actual)</Text>

        <View style={{ marginTop: 8 }}>
          <BarRow
            label="Presupuesto"
            value={presupTotal}
            total={Math.max(presupTotal, gastoMesActual, 1)}
            color="#2A9D8F"
          />
          <BarRow
            label="Gasto actual"
            value={gastoMesActual}
            total={Math.max(presupTotal, gastoMesActual, 1)}
            color="#E63946"
          />
        </View>

        <Text style={styles.summary}>
          Presupuesto total: ${presupTotal.toFixed(2)} — Gasto actual: ${gastoMesActual.toFixed(2)}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Gastos por categoría (todo el historial)</Text>
        <View style={{ marginTop: 8 }}>
          {Object.keys(egresosPorCat).length === 0 ? (
            <Text style={styles.emptyText}>No hay gastos identificados.</Text>
          ) : (
            Object.entries(egresosPorCat)
              .sort((a, b) => b[1] - a[1])
              .map(([cat, monto]) => (
                <BarRow key={cat} label={cat} value={monto} total={totalGastosPorCat} color="#045C8C" />
              ))
          )}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Ingresos vs Egresos por categoría</Text>

        <Text style={styles.sectionLabel}>Ingresos </Text>
        {Object.keys(ingresosPorCat).length === 0 ? (
          <Text style={styles.emptyText}>No se encontraron ingresos por categoría.</Text>
        ) : (
          Object.entries(ingresosPorCat)
            .sort((a, b) => b[1] - a[1])
            .map(([cat, monto]) => (
              <BarRow key={"ing-" + cat} label={cat} value={monto} total={totalIngresosPorCat} color="#2A9D8F" />
            ))
        )}

        <Text style={[styles.sectionLabel, { marginTop: 12 }]}>Egresos</Text>
        {Object.keys(egresosPorCat).length === 0 ? (
          <Text style={styles.emptyText}>No se encontraron egresos.</Text>
        ) : (
          Object.entries(egresosPorCat)
            .sort((a, b) => b[1] - a[1])
            .map(([cat, monto]) => (
              <BarRow key={"egr-" + cat} label={cat} value={monto} total={totalGastosPorCat} color="#E76F51" />
            ))
        )}
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
	</ImageBackground>
  );
}

const styles = StyleSheet.create({
  Container: {
    padding: 18,
    width:'100%',
	height:'100%',
    paddingBottom: 50,
  },
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  logo: {
    width: 90,
    height: 60,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: "#001F3F",
  },
  card: {
    backgroundColor: "#001F3F",
    padding: 14,
    borderRadius: 12,
    marginBottom: 14,
  },
  title: {
    color: "#F5E6D3",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
  summary: {
    marginTop: 10,
    color: "#F5E6D3",
    fontWeight: "600",
    fontSize: 13,
    textAlign: "center",
  },
  sectionLabel: {
    color: "#F5E6D3",
    fontWeight: "700",
    marginTop: 6,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 6,
  },
  label: {
    width: 100,
    color: "#F5E6D3",
    fontWeight: "700",
  },
  barContainer: {
    flex: 1,
    height: 24,
    backgroundColor: "#E8D9C8",
    borderRadius: 12,
    overflow: "hidden",
    marginHorizontal: 10,
  },
  bar: {
    height: "100%",
  },
  value: {
    width: 80,
    textAlign: "right",
    color: "#F5E6D3",
    fontWeight: "700",
  },
  emptyText: {
    color: "#F5E6D3",
    fontStyle: "italic",
    marginTop: 6,
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
});
