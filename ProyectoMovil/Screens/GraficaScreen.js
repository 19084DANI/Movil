import React, { useEffect, useState } from "react";
import {Text,StyleSheet,View,ScrollView,TouchableOpacity,ActivityIndicator, ImageBackground} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import TransaccionController from "../controllers/TransaccionController";
import PresupuestoController from "../controllers/PresupuestoController";

export default function GraficaScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [transacciones, setTransacciones] = useState([]);
  const [presupTotal, setPresupTotal] = useState(0);
  const [categoriaFiltro, setCategoriaFiltro] = useState("Todas");
  const [mesFiltro, setMesFiltro] = useState("Todos");
  const [menuCategoriaAbierto, setMenuCategoriaAbierto] = useState(false);
  const [menuMesAbierto, setMenuMesAbierto] = useState(false);

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

  // Separar transacciones en ingresos y egresos
  const ingresos = transacciones.filter(t => !t.es_gasto || t.es_gasto === 0 || t.es_gasto === false);
  const egresos = transacciones.filter(t => t.es_gasto === 1 || t.es_gasto === true);

  // Obtener todas las categorías únicas
  const todasLasCategorias = [...new Set(transacciones.map(t => t.categoria).filter(Boolean))];

  // Filtrar transacciones según filtros
  const transaccionesFiltradas = transacciones.filter(t => {
    if (categoriaFiltro !== "Todas" && t.categoria !== categoriaFiltro) return false;
    if (mesFiltro !== "Todos") {
      const fecha = parseDate(t.fecha);
      if (!fecha) return false;
      const mesKey = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, "0")}`;
      if (mesKey !== mesFiltro) return false;
    }
    return true;
  });

  const ingresosFiltrados = transaccionesFiltradas.filter(t => !t.es_gasto || t.es_gasto === 0 || t.es_gasto === false);
  const egresosFiltrados = transaccionesFiltradas.filter(t => t.es_gasto === 1 || t.es_gasto === true);

  // Agrupar por categoría
  const groupByCategoria = (items) => {
    const map = {};
    items.forEach((it) => {
      const cat = (it.categoria || "Sin categoría").trim();
      const monto = Number(it.monto) || 0;
      map[cat] = (map[cat] || 0) + monto;
    });
    return map;
  };

  // Agrupar por mes
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

  // Obtener todos los meses disponibles
  const todosLosMeses = Object.keys(sumarPorMes(transacciones)).sort().reverse();
  const mesesIngresos = sumarPorMes(ingresosFiltrados);
  const mesesEgresos = sumarPorMes(egresosFiltrados);

  // Datos para gráfica por categoría
  const ingresosPorCat = groupByCategoria(ingresosFiltrados);
  const egresosPorCat = groupByCategoria(egresosFiltrados);
  const todasCategoriasFiltradas = [...new Set([...Object.keys(ingresosPorCat), ...Object.keys(egresosPorCat)])];

  // Calcular máximos para escalar las barras
  const maxIngresosCat = Math.max(...Object.values(ingresosPorCat), 0);
  const maxEgresosCat = Math.max(...Object.values(egresosPorCat), 0);
  const maxCat = Math.max(maxIngresosCat, maxEgresosCat, 1);

  const maxIngresosMes = Math.max(...Object.values(mesesIngresos), 0);
  const maxEgresosMes = Math.max(...Object.values(mesesEgresos), 0);
  const maxMes = Math.max(maxIngresosMes, maxEgresosMes, 1);

  // Componente de barra vertical
  const BarChart = ({ ingresos, egresos, maxValue, label }) => {
    const alturaMax = 120;
    const alturaIngresos = maxValue > 0 ? (ingresos / maxValue) * alturaMax : 0;
    const alturaEgresos = maxValue > 0 ? (egresos / maxValue) * alturaMax : 0;

    return (
      <View style={styles.barChartContainer}>
        <View style={styles.barChart}>
          <View style={styles.barGroup}>
            <View style={styles.barWrapper}>
              <View style={[styles.barVertical, { height: Math.max(alturaIngresos, 2), backgroundColor: '#1a5f1a' }]} />
              <Text style={styles.barValue}>{ingresos > 0 ? `$${Math.round(ingresos)}` : ''}</Text>
            </View>
            <Text style={styles.barLabel}>Ingresos</Text>
          </View>
          <View style={styles.barGroup}>
            <View style={styles.barWrapper}>
              <View style={[styles.barVertical, { height: Math.max(alturaEgresos, 2), backgroundColor: '#001F3F' }]} />
              <Text style={styles.barValue}>{egresos > 0 ? `$${Math.round(egresos)}` : ''}</Text>
            </View>
            <Text style={styles.barLabel}>Gastos</Text>
          </View>
        </View>
        {label && <Text style={styles.chartLabel}>{label}</Text>}
      </View>
    );
  };

  // Gráfica de barras múltiples
  const MultiBarChart = ({ data, maxValue }) => {
    const alturaMax = 120;
    
    return (
      <View style={styles.multiBarChartContainer}>
        <View style={styles.multiBarChart}>
          {data.map((item, index) => {
            const alturaIngresos = maxValue > 0 ? (item.ingresos / maxValue) * alturaMax : 0;
            const alturaEgresos = maxValue > 0 ? (item.egresos / maxValue) * alturaMax : 0;
            
            return (
              <View key={index} style={styles.multiBarGroup}>
                <View style={styles.multiBarWrapper}>
                  <View style={[styles.barVertical, { height: Math.max(alturaIngresos, 2), backgroundColor: '#1a5f1a', marginRight: 4 }]} />
                  <View style={[styles.barVertical, { height: Math.max(alturaEgresos, 2), backgroundColor: '#001F3F' }]} />
                </View>
                <View style={styles.multiBarLabelContainer}>
                  <Text style={styles.multiBarLabel} numberOfLines={1} ellipsizeMode="tail">{item.label}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  // Ejes de la gráfica (siempre empieza desde 0)
  const ChartAxes = ({ maxValue }) => {
    const steps = 5;
    const stepValue = maxValue / steps;
    
    return (
      <View style={styles.axesContainer}>
        {Array.from({ length: steps + 1 }, (_, i) => {
          const value = Math.round(stepValue * (steps - i));
          // Asegurar que el último valor sea siempre 0
          const displayValue = i === steps ? 0 : value;
          return (
            <View key={i} style={styles.axisRow}>
              <Text style={styles.axisLabel}>{displayValue}</Text>
              <View style={styles.axisLine} />
            </View>
          );
        })}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={[styles.center, { flex: 1 }]}>
        <ActivityIndicator size="large" color="#79B7B4" />
      </View>
    );
  }

  // Preparar datos para gráfica por categoría
  const datosPorCategoria = todasCategoriasFiltradas.map(cat => {
    // Truncar nombres largos (máximo 10 caracteres)
    const labelTruncado = cat.length > 10 ? cat.substring(0, 10) + '...' : cat;
    return {
      label: labelTruncado,
      ingresos: ingresosPorCat[cat] || 0,
      egresos: egresosPorCat[cat] || 0
    };
  });

  // Preparar datos para gráfica por mes
  const datosPorMes = todosLosMeses.map(mes => {
    const [year, month] = mes.split('-');
    const mesesNombres = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return {
      label: `${mesesNombres[parseInt(month) - 1]} ${year}`,
      ingresos: mesesIngresos[mes] || 0,
      egresos: mesesEgresos[mes] || 0
    };
  });

  // Datos para tercera gráfica: ingresos vs gastos por cada categoría
  const datosComparacionCategoria = todasLasCategorias.map(cat => {
    const ing = ingresos.filter(t => t.categoria === cat).reduce((sum, t) => sum + (Number(t.monto) || 0), 0);
    const egr = egresos.filter(t => t.categoria === cat).reduce((sum, t) => sum + (Number(t.monto) || 0), 0);
    return {
      categoria: cat,
      ingresos: ing,
      egresos: egr
    };
  }).filter(item => item.ingresos > 0 || item.egresos > 0);

  const maxComparacion = Math.max(
    ...datosComparacionCategoria.map(d => Math.max(d.ingresos, d.egresos)),
    1
  );

  return (
    <ImageBackground
      source={require('../assets/fondo2.jpg')}
      resizeMode='cover'
      style={styles.backgrounds}>
      
      <ScrollView contentContainerStyle={styles.Container}>
        
        {/* Gráfica Por Categoría */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Por Categoría</Text>
            <TouchableOpacity 
              style={styles.filterButton}
              onPress={() => setMenuCategoriaAbierto(!menuCategoriaAbierto)}
            >
              <Text style={styles.filterText}>{categoriaFiltro} </Text>
              <Ionicons name={menuCategoriaAbierto ? "chevron-up" : "chevron-down"} size={16} color="#001F3F" />
            </TouchableOpacity>
          </View>
          
          {menuCategoriaAbierto && (
            <View style={styles.filterMenu}>
              <TouchableOpacity 
                style={styles.filterOption}
                onPress={() => {
                  setCategoriaFiltro("Todas");
                  setMenuCategoriaAbierto(false);
                }}
              >
                <Text style={styles.filterOptionText}>Todas</Text>
              </TouchableOpacity>
              {todasLasCategorias.map(cat => (
                <TouchableOpacity 
                  key={cat}
                  style={styles.filterOption}
                  onPress={() => {
                    setCategoriaFiltro(cat);
                    setMenuCategoriaAbierto(false);
                  }}
                >
                  <Text style={styles.filterOptionText}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <View style={styles.chartSpacer} />

          <View style={styles.chartWrapper}>
            <ChartAxes maxValue={maxCat} />
            <View style={styles.chartContent}>
              {categoriaFiltro === "Todas" ? (
                <MultiBarChart data={datosPorCategoria} maxValue={maxCat} />
              ) : (
                <BarChart 
                  ingresos={ingresosPorCat[categoriaFiltro] || 0} 
                  egresos={egresosPorCat[categoriaFiltro] || 0} 
                  maxValue={maxCat}
                />
              )}
            </View>
          </View>
        </View>

        {/* Gráfica Por Mes */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Por Mes</Text>
            <TouchableOpacity 
              style={styles.filterButton}
              onPress={() => setMenuMesAbierto(!menuMesAbierto)}
            >
              <Text style={styles.filterText}>{mesFiltro === "Todos" ? "Todos" : mesFiltro} </Text>
              <Ionicons name={menuMesAbierto ? "chevron-up" : "chevron-down"} size={16} color="#001F3F" />
            </TouchableOpacity>
          </View>
          
          {menuMesAbierto && (
            <View style={styles.filterMenu}>
              <TouchableOpacity 
                style={styles.filterOption}
                onPress={() => {
                  setMesFiltro("Todos");
                  setMenuMesAbierto(false);
                }}
              >
                <Text style={styles.filterOptionText}>Todos</Text>
              </TouchableOpacity>
              {todosLosMeses.map(mes => {
                const [year, month] = mes.split('-');
                const mesesNombres = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
                return (
                  <TouchableOpacity 
                    key={mes}
                    style={styles.filterOption}
                    onPress={() => {
                      setMesFiltro(mes);
                      setMenuMesAbierto(false);
                    }}
                  >
                    <Text style={styles.filterOptionText}>{mesesNombres[parseInt(month) - 1]} {year}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          <View style={styles.chartSpacer} />

          <View style={styles.chartWrapper}>
            <ChartAxes maxValue={maxMes} />
            <View style={styles.chartContent}>
              {mesFiltro === "Todos" ? (
                <MultiBarChart data={datosPorMes} maxValue={maxMes} />
              ) : (
                <BarChart 
                  ingresos={mesesIngresos[mesFiltro] || 0} 
                  egresos={mesesEgresos[mesFiltro] || 0} 
                  maxValue={maxMes}
                />
              )}
            </View>
          </View>
        </View>

        {/* Gráfica Ingresos vs Gastos por Categoría */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Ingresos vs Gastos por Categoría</Text>
          
          <View style={styles.chartSpacer} />
          
          <View style={styles.chartWrapper}>
            <ChartAxes maxValue={maxComparacion} />
            <View style={styles.chartContent}>
              <MultiBarChart 
                data={datosComparacionCategoria.map(d => ({
                  label: d.categoria.length > 8 ? d.categoria.substring(0, 8) + '...' : d.categoria,
                  ingresos: d.ingresos,
                  egresos: d.egresos
                }))} 
                maxValue={maxComparacion} 
              />
            </View>
          </View>
          
          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#1a5f1a' }]} />
              <Text style={styles.legendText}>Ingresos</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#001F3F' }]} />
              <Text style={styles.legendText}>Gastos</Text>
            </View>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgrounds: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  Container: {
    padding: 18,
    width: '100%',
    paddingBottom: 50,
    
  },
  card: {
    backgroundColor: '#F5E6D3',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#001F3F',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#001F3F',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8D9C8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1C6B5',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#001F3F',
  },
  filterMenu: {
    backgroundColor: '#F7EFE6',
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#D1C6B5',
    maxHeight: 150,
  },
  filterOption: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E8D9C8',
  },
  filterOptionText: {
    fontSize: 14,
    color: '#001F3F',
    fontWeight: '500',
  },
  chartSpacer: {
    height: 16,
  },
  chartWrapper: {
    flexDirection: 'row',
    height: 180,
    marginTop: 8,
    alignItems: 'flex-end',
  },
  axesContainer: {
    width: 40,
    marginRight: 8,
    justifyContent: 'space-between',
    paddingBottom: 0,
    alignItems: 'flex-end',
  },
  axisRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 24,
  },
  axisLabel: {
    fontSize: 10,
    color: '#001F3F',
    fontWeight: '600',
    width: 35,
    textAlign: 'right',
  },
  axisLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#D1C6B5',
    marginLeft: 4,
  },
  chartContent: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 0,
    alignItems: 'stretch',
  },
  barChartContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  barChart: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    height: 120,
    alignItems: 'flex-end',
    paddingBottom: 0,
  },
  barGroup: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
    height: 120,
  },
  barWrapper: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: 120,
    width: '100%',
  },
  barVertical: {
    width: 20,
    borderRadius: 3,
    marginBottom: 4,
    minHeight: 2,
  },
  barValue: {
    fontSize: 10,
    color: '#001F3F',
    fontWeight: '600',
    marginTop: 2,
  },
  barLabel: {
    fontSize: 11,
    color: '#001F3F',
    fontWeight: '600',
    marginTop: 4,
  },
  chartLabel: {
    fontSize: 12,
    color: '#001F3F',
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
  multiBarChartContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'stretch',
  },
  multiBarChart: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 120,
    paddingHorizontal: 4,
    paddingBottom: 0,
    minHeight: 120,
  },
  multiBarGroup: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
    height: 140,
  },
  multiBarWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 120,
    justifyContent: 'center',
    width: '100%',
  },
  multiBarLabelContainer: {
    height: 20,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
  multiBarLabel: {
    fontSize: 9,
    color: '#001F3F',
    fontWeight: '600',
    textAlign: 'center',
    width: '100%',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
    gap: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 4,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: '#001F3F',
    fontWeight: '600',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
