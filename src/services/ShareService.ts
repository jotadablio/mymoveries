import React from 'react';
import { Share, Platform, Alert } from 'react-native';
import { PermissionsAndroid } from 'react-native';
import RNFS from 'react-native-fs';
import RNHTMLtoPDF from 'react-native-html-to-pdf';

type Item = {
  id: string;
  name: string;
  favorite: boolean;
  watched: boolean;
};

// Função para solicitar permissão de escrita no Android
const requestExternalStoragePermission = async () => {
  try {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Permissão de Armazenamento',
          message: 'O aplicativo precisa de acesso ao armazenamento para salvar o PDF.',
          buttonNeutral: 'Pergunte-me depois',
          buttonNegative: 'Cancelar',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  } catch (err) {
    console.warn(err);
    return false;
  }
};

// Função para compartilhar a lista em formato texto
export const shareAsText = async (items: Item[], title: string) => {
  try {
    // Preparar o texto para compartilhamento
    let textContent = `${title}\n\n`;
    
    // Adicionar itens à lista
    items.forEach((item, index) => {
      const favoriteStatus = item.favorite ? '⭐ ' : '';
      const watchedStatus = item.watched ? '[✓] ' : '[ ] ';
      textContent += `${index + 1}. ${favoriteStatus}${watchedStatus}${item.name}\n`;
    });
    
    // Adicionar rodapé
    textContent += '\nCompartilhado via MyMoveries App';
    
    // Compartilhar o texto
    await Share.share({
      message: textContent,
      title: title,
    });
    
    return true;
  } catch (error) {
    console.error('Erro ao compartilhar como texto:', error);
    Alert.alert('Erro', 'Não foi possível compartilhar a lista como texto.');
    return false;
  }
};

// Função para compartilhar a lista em formato PDF
export const shareAsPDF = async (items: Item[], title: string) => {
  try {
    // Verificar permissões
    const hasPermission = await requestExternalStoragePermission();
    if (!hasPermission) {
      Alert.alert('Permissão Negada', 'É necessário conceder permissão para salvar o PDF.');
      return false;
    }
    
    // Preparar o conteúdo HTML para o PDF
    let htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>${title}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
              color: #333;
            }
            h1 {
              color: #000;
              text-align: center;
              margin-bottom: 30px;
            }
            .item {
              padding: 10px 0;
              border-bottom: 1px solid #eee;
            }
            .favorite {
              color: #FFD700;
            }
            .watched {
              color: #4CAF50;
            }
            .footer {
              margin-top: 30px;
              text-align: center;
              font-size: 12px;
              color: #999;
            }
          </style>
        </head>
        <body>
          <h1>${title}</h1>
    `;
    
    // Adicionar itens à lista
    items.forEach((item, index) => {
      const favoriteStatus = item.favorite ? '<span class="favorite">★</span> ' : '';
      const watchedStatus = item.watched ? '<span class="watched">✓</span> ' : '☐ ';
      htmlContent += `
        <div class="item">
          ${index + 1}. ${favoriteStatus}${watchedStatus}${item.name}
        </div>
      `;
    });
    
    // Adicionar rodapé
    htmlContent += `
          <div class="footer">
            Gerado por MyMoveries App em ${new Date().toLocaleDateString()}
          </div>
        </body>
      </html>
    `;
    
    // Gerar o PDF
    const options = {
      html: htmlContent,
      fileName: title.replace(/\s+/g, '_'),
      directory: 'Documents',
    };
    
    const file = await RNHTMLtoPDF.convert(options);
    
    if (file.filePath) {
      // Compartilhar o PDF
      await Share.share({
        title: `${title}.pdf`,
        url: Platform.OS === 'ios' ? file.filePath : `file://${file.filePath}`,
        message: Platform.OS === 'android' ? `${title} - Compartilhado via MyMoveries App` : '',
      });
      
      return true;
    } else {
      throw new Error('Falha ao gerar o PDF');
    }
  } catch (error) {
    console.error('Erro ao compartilhar como PDF:', error);
    Alert.alert('Erro', 'Não foi possível compartilhar a lista como PDF.');
    return false;
  }
};

// Função para mostrar opções de compartilhamento
export const showShareOptions = (items: Item[], title: string) => {
  Alert.alert(
    'Compartilhar Lista',
    'Escolha o formato para compartilhar',
    [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Texto',
        onPress: () => shareAsText(items, title),
      },
      {
        text: 'PDF',
        onPress: () => shareAsPDF(items, title),
      },
    ],
  );
};

export default {
  shareAsText,
  shareAsPDF,
  showShareOptions,
};
