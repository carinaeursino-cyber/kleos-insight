/**
 * KLEOS INSIGHT™ — Product Mapping Configuration
 * 
 * Mapeo de productos de proveedores de pago a protocolos KIP.
 * Este archivo centraliza la relación entre productos externos y protocolos internos.
 * 
 * Para agregar un nuevo protocolo:
 * 1. Crear el producto en Lemon Squeezy (u otro proveedor)
 * 2. Copiar el product_id
 * 3. Agregar la entrada en PRODUCT_MAPPING
 * 4. Agregar la entrada en PROTOCOL_METADATA
 */

/**
 * Mapeo de productos de Lemon Squeezy a protocolos KIP
 * Key: product_id de Lemon Squeezy
 * Value: Código del protocolo KIP
 */
const PRODUCT_MAPPING = {
    // KIP-001: Diagnóstico Estratégico
    "1168656": "KIP-001",
    
    // Futuros protocolos (descomentar cuando estén disponibles):
    // "xxx-product-id": "KIP-002",  // Posicionamiento
    // "yyy-product-id": "KIP-003",  // Oferta
    // "zzz-product-id": "KIP-004",  // Conversión
    // "aaa-product-id": "KIP-005",  // Operaciones
    // "bbb-product-id": "KIP-006",  // Liderazgo
};

/**
 * Metadatos de cada protocolo KIP
 * Información estática que no cambia entre usuarios
 */
const PROTOCOL_METADATA = {
    "KIP-001": {
        name: "Diagnóstico Estratégico",
        description: "Análisis completo de percepción y posicionamiento",
        version: "1.0",
        dimensions: [
            "Comprensión",
            "Autoridad",
            "Confianza",
            "Diferenciación",
            "Conversión"
        ]
    },
    
    // Futuros protocolos:
    // "KIP-002": {
    //     name: "Posicionamiento",
    //     description: "Análisis de posicionamiento en el mercado",
    //     version: "1.0",
    //     dimensions: [...]
    // },
};

/**
 * Obtiene el código del protocolo KIP a partir del product_id
 * @param {string} productId - ID del producto en Lemon Squeezy
 * @returns {string|null} - Código del protocolo KIP o null si no existe
 */
function getProtocolCode(productId) {
    return PRODUCT_MAPPING[productId] || null;
}

/**
 * Obtiene los metadatos de un protocolo KIP
 * @param {string} protocolCode - Código del protocolo (ej: "KIP-001")
 * @returns {object|null} - Metadatos del protocolo o null si no existe
 */
function getProtocolMetadata(protocolCode) {
    return PROTOCOL_METADATA[protocolCode] || null;
}

/**
 * Verifica si un product_id es válido
 * @param {string} productId - ID del producto en Lemon Squeezy
 * @returns {boolean}
 */
function isValidProduct(productId) {
    return productId in PRODUCT_MAPPING;
}

module.exports = {
    PRODUCT_MAPPING,
    PROTOCOL_METADATA,
    getProtocolCode,
    getProtocolMetadata,
    isValidProduct
};
