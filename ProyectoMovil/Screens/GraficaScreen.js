import React from 'react';
import { Text, StyleSheet, View, Image, ScrollView, TouchableOpacity,} from 'react-native';
import { Ionicons } from  '@expo/vector-icons';

export default function GraficaScreen({ navigation }) {

	
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
		<View style={styles.backgrounds}>
			<View style={styles.encabezado}>
				<View style={{ flexDirection: 'row', width: 90 }}>
					<Image style={[styles.menuhamburgesa, { marginRight: 10 }]} source={require('../assets/menu.png')} />
				</View>
				<TouchableOpacity onPress={() => navigation?.navigate && navigation.navigate('Menu')}>
					<Image style={styles.logo} source={require('../assets/logo.jpg')} />
				</TouchableOpacity>
			</View>

			<ScrollView contentContainerStyle={styles.Container}>
				<View style={styles.elementos}>
					<Text style={styles.titulo}>Gráficas</Text>
					<Text style={styles.subtitle}>Gastos recientes del cliente</Text>

					<View style={styles.chart}>
						{renderBar('Alimentación', alimentacion, '#023047')}
						{renderBar('Transporte', transporte, '#045C8C')}
						{renderBar('Entretenimiento', entretenimiento, '#013243')}
					</View>

					<Text style={styles.total}>Total: ${Math.floor(total)}</Text>
				</View>
			</ScrollView>

			<Image style={styles.ayuda} source={require('../assets/help.png')} />
		</View>
	);
}

const styles = StyleSheet.create({
	backgrounds: {
		flex: 1,
		justifyContent: 'space-between',
		alignItems: 'center',
		width: '100%',
		height: '100%',
		backgroundColor: '#F5E6D3',
	},
	encabezado: {
		justifyContent: 'space-between',
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: 'transparent',
		paddingHorizontal: 14,
		paddingVertical: 12,
		width: '100%',
	},
	Container: {
		alignItems: 'center',
		paddingBottom: 40,
	},
	elementos: {
		width: '90%',
		flexDirection: 'column',
		minHeight: 300,
		backgroundColor: '#001F3F',
		justifyContent: 'flex-start',
		marginVertical: 10,
		borderRadius: 10,
		padding: 18,
	},
	titulo: {
		fontSize: 24,
		fontWeight: 'bold',
		marginBottom: 8,
		textAlign: 'center',
		color: '#F5E6D3',
	},
	subtitle: {
		fontSize: 14,
		color: '#F5E6D3',
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
		fontWeight: '700',
		color: '#F5E6D3',
	},
	barContainer: {
		flex: 1,
		height: 28,
		backgroundColor: '#E8D9C8',
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
		fontWeight: '700',
		color: '#F5E6D3',
	},
	total: {
		marginTop: 12,
		fontWeight: '700',
		fontSize: 16,
		textAlign: 'center',
		color: '#001F3F',
	},
	menuhamburgesa: {
		width: 35,
		height: 35,
	},
	logo: {
		width: 100,
		height: 70,
		borderRadius: 45,
		borderColor: '#F5E6D3',
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

