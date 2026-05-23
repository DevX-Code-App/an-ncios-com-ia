import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../contexts/AuthContext';
import { generateAds } from '../services/aiService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GeneratedAd } from '../types';

export const CreateAdScreen = ({ navigation }: any) => {
  const { subscription, decrementCredits } = useAuth();
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const canGenerate = () => {
    const isPro = subscription?.planTier === 'pro';
    const hasCredits = (subscription?.aiCreditsRemaining || 0) > 0;
    return isPro || hasCredits;
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleGenerate = async () => {
    if (!productName || !price || !description) {
      Alert.alert('Atenção', 'Preencha todos os campos obrigatórios');
      return;
    }

    if (!canGenerate()) {
      Alert.alert(
        'Créditos esgotados',
        'Você não tem mais créditos disponíveis. Faça upgrade para o plano Pro e tenha créditos ilimitados!',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Ver Planos', onPress: () => navigation.navigate('Plans') }
        ]
      );
      return;
    }

    setLoading(true);

    try {
      const priceNum = parseFloat(price.replace(',', '.'));

      const generatedAd = await generateAds({
        productName,
        price: priceNum,
        description,
        imageUrl: imageUri || undefined
      });

      const newAd: GeneratedAd = {
        id: Date.now().toString(),
        productId: Date.now().toString(),
        ...generatedAd,
        createdAt: new Date()
      };

      // Salvar anúncio
      const stored = await AsyncStorage.getItem('@anuncialocal:ads');
      const ads = stored ? JSON.parse(stored) : [];
      ads.unshift(newAd);
      await AsyncStorage.setItem('@anuncialocal:ads', JSON.stringify(ads));

      // Decrementar créditos se não for Pro
      if (subscription?.planTier !== 'pro') {
        await decrementCredits();
      }

      navigation.navigate('Result', { ad: newAd });
    } catch (error) {
      Alert.alert('Erro', 'Falha ao gerar anúncio. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#f8fafc" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Criar Anúncio</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Image Picker */}
        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.imagePreview} />
          ) : (
            <View style={styles.imagePickerPlaceholder}>
              <Ionicons name="image-outline" size={48} color="#94a3b8" />
              <Text style={styles.imagePickerText}>Adicionar imagem do produto</Text>
              <Text style={styles.imagePickerSubtext}>(Opcional)</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Product Name */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nome do Produto *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Tênis Esportivo Premium"
            placeholderTextColor="#64748b"
            value={productName}
            onChangeText={setProductName}
          />
        </View>

        {/* Price */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Preço *</Text>
          <View style={styles.priceInputContainer}>
            <Text style={styles.pricePrefix}>R$</Text>
            <TextInput
              style={styles.priceInput}
              placeholder="0,00"
              placeholderTextColor="#64748b"
              value={price}
              onChangeText={setPrice}
              keyboardType="decimal-pad"
            />
          </View>
        </View>

        {/* Description */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Descrição / Benefícios *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Descreva os principais benefícios e características do produto..."
            placeholderTextColor="#64748b"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
          />
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={20} color="#38bdf8" />
          <Text style={styles.infoText}>
            A IA vai gerar anúncios otimizados para Facebook, Instagram e roteiro para vídeo!
          </Text>
        </View>

        {/* Generate Button */}
        <TouchableOpacity
          style={[styles.generateButton, (!canGenerate() || loading) && styles.generateButtonDisabled]}
          onPress={handleGenerate}
          disabled={!canGenerate() || loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="sparkles" size={20} color="#fff" />
              <Text style={styles.generateButtonText}>Gerar Anúncios com IA</Text>
            </>
          )}
        </TouchableOpacity>

        {!canGenerate() && (
          <TouchableOpacity
            style={styles.upgradeLink}
            onPress={() => navigation.navigate('Plans')}
          >
            <Text style={styles.upgradeLinkText}>
              Sem créditos? Upgrade para Pro →
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b0f19',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    paddingTop: 60,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f8fafc',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingTop: 0,
  },
  imagePicker: {
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  imagePickerPlaceholder: {
    flex: 1,
    backgroundColor: '#111827',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#374151',
    borderStyle: 'dashed',
    borderRadius: 16,
  },
  imagePickerText: {
    color: '#94a3b8',
    fontSize: 16,
    marginTop: 12,
  },
  imagePickerSubtext: {
    color: '#64748b',
    fontSize: 12,
    marginTop: 4,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#f8fafc',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#111827',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#f8fafc',
    borderWidth: 1,
    borderColor: '#374151',
  },
  textArea: {
    height: 120,
    paddingTop: 16,
  },
  priceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111827',
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#374151',
  },
  pricePrefix: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#a78bfa',
    marginRight: 8,
  },
  priceInput: {
    flex: 1,
    height: 52,
    fontSize: 16,
    color: '#f8fafc',
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111827',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    gap: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#38bdf8',
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#94a3b8',
    lineHeight: 20,
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#a78bfa',
    borderRadius: 12,
    height: 56,
    gap: 8,
  },
  generateButtonDisabled: {
    opacity: 0.5,
  },
  generateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  upgradeLink: {
    marginTop: 16,
    alignItems: 'center',
  },
  upgradeLinkText: {
    color: '#38bdf8',
    fontSize: 14,
    fontWeight: '600',
  },
});
