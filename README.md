# Softtek Challenge - Star Wars API and Vehicle Management

Este proyecto es una solución a un reto propuesto por Softtek. Combina datos de la API de Star Wars (SWAPI) con un sistema personalizado de gestión de vehículos utilizando AWS DynamoDB.

## Descripción del Proyecto

La aplicación proporciona varias funcionalidades:

1. Obtener y traducir datos de personajes de Star Wars de inglés a español.
2. Crear, recuperar y listar vehículos en una base de datos DynamoDB.
3. Implementar paginación para las listas de vehículos.

## Requerimientos

- Node.js 20 o superior.
- Cuenta de AWS con acceso a DynamoDB.
- AWS CLI configurado con credenciales apropiadas.
- Variables de entorno configuradas (ver sección de **Configuration**).

## Estructura del proyecto

El proyecto sigue una arquitectura hexagonal (puertos y adaptadores), promoviendo la separación de responsabilidades y mantenibilidad. Aquí tienes una visión general de los principales directorios:

```
src/
- application/
  - ports/
    - input/
    - output/
  - service/
- domain/
  - entities/
  - value-objects/
- infrastructure/
  - repositories/
- presentation/
  - controllers/
```

- **application/**: Contiene casos de uso y definiciones de puertos.
- **domain/**: Define la lógica central de negocio, entidades y objetos de valor.
- **infrastructure/**: Implementa adaptadores y repositorios para servicios externos.
- **presentation/**: Maneja solicitudes y respuestas HTTP.

## Arquitectura Hexagonal

Este proyecto implementa la arquitectura hexagonal (también conocida como puertos y adaptadores). Este estilo arquitectónico busca crear componentes de la aplicación con acoplamiento débil que pueden conectarse fácilmente a su entorno mediante puertos y adaptadores.

### Componentes clave de la arquitectura hexagonal en este proyecto:

1. **application/ports/**: Define interfaces para los puertos de entrada y salida.
2. **application/service/**: Implementa los casos de uso, coordinando entre los puertos.
3. **infrastructure/repositories/**: Adaptadores para servicios externos (por ejemplo, DynamoDB, SWAPI).
4. **presentation/controllers/**: Adaptadores para manejar solicitudes HTTP.

### Beneficios:
- Fácil testeo y simulación de componentes.
- Flexibilidad para cambiar servicios externos sin afectar la lógica central del negocio.
- Clara separación de responsabilidades.

## Características Clave

### 1. Integración con SWAPI
- Obtiene datos de personajes de SWAPI.
- Traduce los datos de inglés a español.

### 2. Gestión de Vehículos
- Crear nuevos vehículos.
- Recuperar vehículos por ID.
- Listar vehículos con paginación.

### 3. Integración con AWS DynamoDB
- Almacena y recupera datos de vehículos.
- Implementa paginación eficiente utilizando el `LastEvaluatedKey` de DynamoDB.

## Configuración

Asegúrate de que las siguientes variables de entorno estén configuradas:

- `AWS_REGION`: Tu región de AWS.
- `VEHICLES_TABLE_NAME`: Nombre de la tabla DynamoDB para vehículos.

## API Endpoints

1. **GET** `/swapi/people`: Obtener y traducir datos de personajes de Star Wars.
2. **POST** `/vehicles`: Crear un nuevo vehículo.
3. **GET** `/vehicles`: Listar vehículos (con paginación).
4. **GET** `/vehicles/:id`: Obtener un vehículo específico por ID.

## Ejecución de la Aplicación

### Instala las dependencias:

```bash
npm install
```

### Iniciar la aplicación:
```bash
npm run start
```

La aplicación estará disponible en http://localhost:3000.

### Pruebas:
```bash
npm run test
```

### Despliegue
Esta aplicación está diseñada para ser desplegada como funciones Lambda de AWS. El archivo `main.ts` contiene las funciones de manejador de Lambda para cada endpoint.

### Mejoras Futuras
- Implementar caché para solicitudes a SWAPI.
- Añadir manejo de errores y registro más completo.
- Implementar autenticación y autorización.
- Crear una aplicación frontend para interactuar con la API.
