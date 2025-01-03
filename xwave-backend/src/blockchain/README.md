# XWave Blockchain

Bienvenido al repositorio de la blockchain para **XWave**, una plataforma de streaming basada en blockchain que utiliza **Proof of Stake (PoS)** para consenso.

## Descripción del Proyecto

**XWave** es una plataforma de streaming musical, de video y gaming que utiliza blockchain para gestionar **royalties**, **NFTs** y el **staking** de validadores.

Esta blockchain es implementada utilizando **Proof of Stake (PoS)**, lo que permite una selección eficiente de validadores basada en la cantidad de "stake" que poseen.

## Características

- **Proof of Stake (PoS)** como mecanismo de consenso.
- Gestión de **NFTs** para artistas.
- Distribución de **royalties** a los creadores de contenido.
- Sistema de **staking** para validadores.
- Manejo de **transacciones** de contenido digital en la plataforma.

## Estructura de la Blockchain

1. **Pallet de Staking**: Gestiona el staking de validadores, el cual se utiliza para seleccionar los validadores que minan bloques.
2. **Pallet de NFTs**: Permite la creación y gestión de NFTs para los artistas y su contenido digital.
3. **Pallet de Royalties**: Gestiona las regalías y su distribución a los creadores del contenido.
4. **Eventos**: La blockchain emite eventos cuando ocurren acciones importantes como el staking, la creación de NFTs y el procesamiento de regalías.

## Requisitos

- **Node.js** (v14.x o superior)
- **TypeScript**

## Instalación

1. Clona este repositorio.
   ```bash
   git clone https://github.com/tu-repositorio/xwave-blockchain.git
