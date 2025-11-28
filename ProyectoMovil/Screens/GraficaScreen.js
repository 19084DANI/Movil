import React, { useState } from 'react';
import { Text, StyleSheet, View, Image, ImageBackground, ScrollView,TouchableOpacity,} from 'react-native';
import HomeScreen from './HomeScreen';
import { Ionicons } from  '@expo/vector-icons';

export default function GraficaScreen() {
	const [screen, setScreen] = useState('default');

	if (screen === 'home') return <HomeScreen />;

	
	const alimentacion = 6000;
	const transporte = 3200;
	const entretenimiento = 1500;

	const total = alimentacion + transporte + entretenimiento || 1;

	function renderBar(label, value, color) {
		const percent = Math.max(3, Math.round((value / total) * 100));
		return (
			<View style={styles.row} key={label}>
				<Text style={styles.label}>{label}</Text>
				<View style={styles.barContainer}>
					<View style={[styles.bar, { width: `${percent}%`, backgroundColor: color }]} />
				</View>
				<Text style={styles.value}>${Math.floor(value)}</Text>
			</View>
		);
	}

	return (
		<ImageBackground source={require('../assets/fondo1.jpg')} resizeMode="cover" style={styles.backgrounds}>
			<View style={styles.encabezado}>
				<View style={{ flexDirection: 'row', width: 90 }}>
					<Image style={[styles.menuhamburgesa, { marginRight: 10 }]} source={require('../assets/menu.png')} />
				</View>
				<TouchableOpacity onPress={() => setScreen('home')}>
					<Image style={styles.logo} source={require('../assets/logo.jpg')} />
				</TouchableOpacity>
			</View>

			<ScrollView contentContainerStyle={styles.Container}>
				<View style={styles.elementos}>
					<Text style={styles.titulo}>Gráficas</Text>
					<Text style={styles.subtitle}>Gastos recientes del cliente</Text>

					<View style={styles.chart}>
						{renderBar('Alimentación', alimentacion, '#03051fff')}
						{renderBar('Transporte', transporte, '#064f86ff')}
						{renderBar('Entretenimiento', entretenimiento, '#c97e2dff')}
					</View>

					<Text style={styles.total}>Total: ${Math.floor(total)}</Text>
				</View>
			</ScrollView>

			<Image style={styles.ayuda} source={require('../assets/help.png')} />
		</ImageBackground>
	);
}

const styles = StyleSheet.create({
	backgrounds: {
		flex: 1,
		justifyContent: 'space-between',
		alignItems: 'center',
		width: '100%',
		height: '100%',
	},
	encabezado: {
		justifyContent: 'space-between',
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#EEF5DB',
		padding: 10,
		borderRadius: 10,
		marginBottom: 0,
		width: '100%',
		height: '10%',
	},
	Container: {
		alignItems: 'center',
		paddingBottom: 40,
	},
	elementos: {
		width: '90%',
		flexDirection: 'column',
		minHeight: 300,
		backgroundColor: '#EEF5DB',
		justifyContent: 'flex-start',
		marginVertical: 10,
		borderRadius: 10,
		padding: 15,
	},
	titulo: {
		fontSize: 24,
		fontWeight: 'bold',
		marginBottom: 8,
		textAlign: 'center',
		color: '#2ecc71',
	},
	subtitle: {
		fontSize: 14,
		color: '#333',
		marginBottom: 12,
		textAlign: 'center',
	},
	chart: {
		width: '100%',
		backgroundColor: 'transparent',
		padding: 6,
		borderRadius: 8,
	},
	row: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 10,
	},
	label: {
		width: 110,
		fontWeight: 'bold',
	},
	barContainer: {
		flex: 1,
		height: 28,
		backgroundColor: '#e6e6e6',
		borderRadius: 14,
		overflow: 'hidden',
		marginHorizontal: 8,
	},
	bar: {
		height: '100%',
	},
	value: {
		width: 80,
		textAlign: 'right',
		fontWeight: 'bold',
	},
	total: {
		marginTop: 12,
		fontWeight: 'bold',
		fontSize: 16,
		textAlign: 'center',
	},
	menuhamburgesa: {
		width: 35,
		height: 35,
	},
	logo: {
		width: 100,
		height: 70,
		borderRadius: 45,
		borderColor: '#b7ba9bff',
		borderWidth: 5,
	},
	ayuda: {
		position: 'absolute',
		bottom: 25,
		right: 25,
		width: 40,
		height: 40,
		borderRadius: 20,
	},
});

